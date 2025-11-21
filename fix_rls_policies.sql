-- Script para corrigir as funções RPC com os nomes corretos das colunas
-- Execute este script no SQL Editor do Supabase

-- =============================================
-- 1. FUNÇÃO: get_plantoes_vagos_48h
-- Retorna plantões que precisam de alocação nas próximas 48 horas
-- =============================================
DROP FUNCTION IF EXISTS get_plantoes_vagos_48h();

CREATE OR REPLACE FUNCTION get_plantoes_vagos_48h()
RETURNS TABLE (
  id uuid,
  "data" date,
  hora_inicio time,
  hora_fim time,
  id_funcao integer,
  id_local integer,
  vagas integer,
  vagas_ocupadas bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    p.id,
    p.data,
    p.hora_inicio,
    p.hora_fim,
    p.id_funcao,
    p.id_local,
    p.vagas,
    COALESCE(
      (SELECT COUNT(*) 
       FROM escalas e 
       WHERE e.id_plantao = p.id 
         AND e.status = 'ativo'
      ), 0
    ) AS vagas_ocupadas
  FROM plantoes p
  WHERE 
    -- Plantões nas próximas 48 horas (hoje e amanhã)
    p.data BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '2 days')
    -- Que ainda têm vagas disponíveis
    AND (
      SELECT COUNT(*) 
      FROM escalas e 
      WHERE e.id_plantao = p.id 
        AND e.status = 'ativo'
    ) < p.vagas
  ORDER BY p.data, p.hora_inicio;
$$;

-- =============================================
-- 2. FUNÇÃO: get_profissionais_sobrecarregados
-- Retorna profissionais com mais de 40h na semana atual
-- =============================================
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

-- =============================================
-- 3. FUNÇÃO: get_substituicoes_pendentes
-- Retorna substituições aguardando aprovação
-- =============================================
DROP FUNCTION IF EXISTS get_substituicoes_pendentes();

CREATE OR REPLACE FUNCTION get_substituicoes_pendentes()
RETURNS TABLE (
  id uuid,
  plantao_id uuid,
  profissional_solicitante_nome text,
  profissional_substituto_nome text,
  data_plantao date,
  hora_inicio time,
  hora_fim time,
  "status" text
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    s.id,
    s.id_plantao AS plantao_id,
    ps.nome AS profissional_solicitante_nome,
    psu.nome AS profissional_substituto_nome,
    p.data AS data_plantao,
    p.hora_inicio,
    p.hora_fim,
    s.status
  FROM substituicoes s
  INNER JOIN profissionais ps ON ps.id = s.id_profissional_solicitante
  INNER JOIN profissionais psu ON psu.id = s.id_profissional_substituto
  INNER JOIN plantoes p ON p.id = s.id_plantao
  WHERE s.status = 'pendente'
  ORDER BY p.data, p.hora_inicio;
$$;

-- =============================================
-- 4. Garantir permissões
-- =============================================
GRANT EXECUTE ON FUNCTION get_plantoes_vagos_48h TO authenticated;
GRANT EXECUTE ON FUNCTION get_profissionais_sobrecarregados TO authenticated;
GRANT EXECUTE ON FUNCTION get_substituicoes_pendentes TO authenticated;

-- =============================================
-- 5. Testar as funções
-- =============================================
-- Descomente para testar:
-- SELECT * FROM get_plantoes_vagos_48h();
-- SELECT * FROM get_profissionais_sobrecarregados();
-- SELECT * FROM get_substituicoes_pendentes();
