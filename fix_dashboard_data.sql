-- Script para corrigir visualização do dashboard
-- Execute este script no SQL Editor do Supabase

-- A data atual é 20/11/2025, então vamos criar plantões vagos para as próximas 48h (20-22 novembro)

-- 1. Criar plantões VAGOS (sem alocação completa) para as próximas 48h
-- Deletar algumas escalas para deixar vagas disponíveis
DELETE FROM escalas WHERE id IN (169, 174, 181);

-- 2. Inserir mais plantões para hoje e amanhã que ficarão vagos
INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas) VALUES
('2025-11-20', '19:00:00', '07:00:00', 1, 2, 1),  -- Plantão noturno hoje sem alocação
('2025-11-21', '13:00:00', '19:00:00', 2, 1, 2),  -- Plantão tarde amanhã sem alocação
('2025-11-22', '07:00:00', '13:00:00', 1, 3, 1);  -- Plantão manhã depois de amanhã

-- 3. Adicionar mais horas para profissionais ficarem sobrecarregados
-- Vamos adicionar mais plantões para Dr. Carlos Silva e Dra. Ana Santos
-- para garantir que ultrapassem 40h na semana

-- Inserir plantões adicionais para Dr. Carlos Silva (ID 111)
INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas) VALUES
('2025-11-22', '07:00:00', '19:00:00', 1, 1, 2),  -- 12h
('2025-11-23', '07:00:00', '19:00:00', 1, 1, 2);  -- 12h

-- Alocar esses plantões para Dr. Carlos Silva
INSERT INTO escalas (id_profissional, id_plantao, status)
SELECT 111, id, 'ativo'
FROM plantoes 
WHERE data IN ('2025-11-22', '2025-11-23') 
  AND hora_inicio = '07:00:00' 
  AND hora_fim = '19:00:00'
  AND id_funcao = 1
  AND id_local = 1
  AND NOT EXISTS (
    SELECT 1 FROM escalas WHERE id_plantao = plantoes.id
  );

-- Inserir plantões adicionais para Dra. Ana Santos (ID 112)
INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas) VALUES
('2025-11-21', '19:00:00', '07:00:00', 1, 1, 1),  -- 12h
('2025-11-22', '19:00:00', '07:00:00', 1, 1, 1),  -- 12h
('2025-11-23', '19:00:00', '07:00:00', 1, 1, 1);  -- 12h

-- Alocar esses plantões para Dra. Ana Santos
INSERT INTO escalas (id_profissional, id_plantao, status)
SELECT 112, id, 'ativo'
FROM plantoes 
WHERE data IN ('2025-11-21', '2025-11-22', '2025-11-23') 
  AND hora_inicio = '19:00:00' 
  AND hora_fim = '07:00:00'
  AND id_funcao = 1
  AND id_local = 1
  AND NOT EXISTS (
    SELECT 1 FROM escalas WHERE id_plantao = plantoes.id
  );

-- 4. Verificar se as funções RPC estão retornando dados
-- Execute estas queries manualmente para testar:

-- SELECT * FROM get_plantoes_vagos_48h();
-- SELECT * FROM get_profissionais_sobrecarregados();
-- SELECT * FROM get_substituicoes_pendentes();

-- 5. Se ainda não funcionar, pode ser necessário ajustar as funções RPC
-- Verifique se a função get_profissionais_sobrecarregados está usando a semana correta
-- A semana atual (17/11 a 23/11) deve conter os profissionais com mais de 40h
