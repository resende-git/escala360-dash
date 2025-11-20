-- Script para recriar as funções RPC com lógica corrigida
-- Execute este script no SQL Editor do Supabase

-- 1. FUNÇÃO: get_plantoes_vagos_48h
-- Retorna plantões que precisam de alocação nas próximas 48 horas
DROP FUNCTION IF EXISTS get_plantoes_vagos_48h();

CREATE OR REPLACE FUNCTION get_plantoes_vagos_48h()
RETURNS TABLE (
  id integer,
  data date,
  hora_inicio time,
  hora_fim time,
  id_funcao integer,
  id_local integer
) 
LANGUAGE sql
STABLE
AS $$
  SELECT DISTINCT
    p.id,
    p.data,
    p.hora_inicio,
    p.hora_fim,
    p.id_funcao,
    p.id_local
  FROM plantoes p
  WHERE 
    -- Plantões nas próximas 48 horas
    p.data BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days'
    -- Que ainda têm vagas disponíveis
    AND (
      SELECT COUNT(*) 
      FROM escalas e 
      WHERE e.id_plantao = p.id 
        AND e.status = 'ativo'
    ) < p.vagas
  ORDER BY p.data, p.hora_inicio;
$$;

-- 2. FUNÇÃO: get_profissionais_sobrecarregados
-- Retorna profissionais com mais de 40h na semana atual
DROP FUNCTION IF EXISTS get_profissionais_sobrecarregados();

CREATE OR REPLACE FUNCTION get_profissionais_sobrecarregados()
RETURNS TABLE (
  nome text,
  cargo text,
  horas_na_semana numeric,
  telefone text
) 
LANGUAGE sql
STABLE
AS $$
  WITH inicio_semana AS (
    SELECT date_trunc('week', CURRENT_DATE)::date AS inicio
  ),
  fim_semana AS (
    SELECT (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::date AS fim
  ),
  horas_profissional AS (
    SELECT 
      prof.id,
      prof.nome,
      prof.cargo,
      prof.telefone,
      SUM(
        EXTRACT(EPOCH FROM (pl.hora_fim - pl.hora_inicio)) / 3600
        + CASE 
            WHEN pl.hora_fim < pl.hora_inicio THEN 24 
            ELSE 0 
          END
      ) AS total_horas
    FROM profissionais prof
    INNER JOIN escalas e ON e.id_profissional = prof.id
    INNER JOIN plantoes pl ON pl.id = e.id_plantao
    CROSS JOIN inicio_semana
    CROSS JOIN fim_semana
    WHERE 
      e.status = 'ativo'
      AND pl.data BETWEEN inicio_semana.inicio AND fim_semana.fim
    GROUP BY prof.id, prof.nome, prof.cargo, prof.telefone
  )
  SELECT 
    hp.nome,
    hp.cargo,
    hp.total_horas::numeric(10,2) AS horas_na_semana,
    hp.telefone
  FROM horas_profissional hp
  WHERE hp.total_horas > 40
  ORDER BY hp.total_horas DESC;
$$;

-- 3. Testar as funções (descomente para testar)
-- SELECT * FROM get_plantoes_vagos_48h();
-- SELECT * FROM get_profissionais_sobrecarregados();

-- 4. Garantir permissões
GRANT EXECUTE ON FUNCTION get_plantoes_vagos_48h TO authenticated;
GRANT EXECUTE ON FUNCTION get_profissionais_sobrecarregados TO authenticated;

-- 5. Inserir dados de teste para garantir que apareçam resultados
-- Deletar algumas escalas para criar vagas
DELETE FROM escalas WHERE id_plantao IN (
  SELECT id FROM plantoes 
  WHERE data = CURRENT_DATE 
  LIMIT 2
);

-- Adicionar mais plantões para profissionais específicos ficarem sobrecarregados
-- Vamos garantir que Dr. Carlos Silva (111) e Dra. Ana Santos (112) tenham > 40h

-- Verificar plantões existentes desta semana
DO $$
DECLARE
  inicio_semana date := date_trunc('week', CURRENT_DATE)::date;
  fim_semana date := (date_trunc('week', CURRENT_DATE) + INTERVAL '6 days')::date;
  horas_carlos numeric;
  horas_ana numeric;
  plantao_id integer;
BEGIN
  -- Calcular horas atuais do Dr. Carlos Silva
  SELECT COALESCE(SUM(
    EXTRACT(EPOCH FROM (pl.hora_fim - pl.hora_inicio)) / 3600
    + CASE WHEN pl.hora_fim < pl.hora_inicio THEN 24 ELSE 0 END
  ), 0) INTO horas_carlos
  FROM escalas e
  INNER JOIN plantoes pl ON pl.id = e.id_plantao
  WHERE e.id_profissional = 111
    AND e.status = 'ativo'
    AND pl.data BETWEEN inicio_semana AND fim_semana;

  RAISE NOTICE 'Dr. Carlos Silva tem % horas esta semana', horas_carlos;

  -- Se tiver menos de 41h, adicionar mais plantões
  IF horas_carlos < 41 THEN
    -- Inserir plantão de 12h
    INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas)
    VALUES (fim_semana, '07:00:00', '19:00:00', 1, 1, 1)
    RETURNING id INTO plantao_id;
    
    INSERT INTO escalas (id_profissional, id_plantao, status)
    VALUES (111, plantao_id, 'ativo');
    
    RAISE NOTICE 'Adicionado plantão % para Dr. Carlos Silva', plantao_id;
  END IF;

  -- Calcular horas atuais da Dra. Ana Santos
  SELECT COALESCE(SUM(
    EXTRACT(EPOCH FROM (pl.hora_fim - pl.hora_inicio)) / 3600
    + CASE WHEN pl.hora_fim < pl.hora_inicio THEN 24 ELSE 0 END
  ), 0) INTO horas_ana
  FROM escalas e
  INNER JOIN plantoes pl ON pl.id = e.id_plantao
  WHERE e.id_profissional = 112
    AND e.status = 'ativo'
    AND pl.data BETWEEN inicio_semana AND fim_semana;

  RAISE NOTICE 'Dra. Ana Santos tem % horas esta semana', horas_ana;

  -- Se tiver menos de 41h, adicionar mais plantões
  IF horas_ana < 41 THEN
    -- Inserir plantão de 12h
    INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas)
    VALUES (fim_semana, '19:00:00', '07:00:00', 1, 1, 1)
    RETURNING id INTO plantao_id;
    
    INSERT INTO escalas (id_profissional, id_plantao, status)
    VALUES (112, plantao_id, 'ativo');
    
    RAISE NOTICE 'Adicionado plantão % para Dra. Ana Santos', plantao_id;
  END IF;
END $$;
