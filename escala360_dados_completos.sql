-- Script para popular o banco de dados com dados fictícios completos
-- Execução: Cole este script no SQL Editor do Supabase e execute

-- =============================================
-- LIMPEZA DE DADOS ANTIGOS
-- =============================================
DELETE FROM auditoria;
DELETE FROM substituicoes;
DELETE FROM escalas;
DELETE FROM plantoes;
DELETE FROM profissionais;

-- =============================================
-- INSERÇÃO DE PROFISSIONAIS
-- =============================================
INSERT INTO profissionais (id, nome, cargo, telefone, email, id_funcao, id_local) VALUES
-- Médicos
('prof-001', 'Dr. Carlos Silva', 'Médico', '(61) 98765-4321', 'carlos.silva@hospital.com', 1, 1),
('prof-002', 'Dra. Ana Santos', 'Médico', '(61) 98765-4322', 'ana.santos@hospital.com', 1, 1),
('prof-003', 'Dr. Pedro Lima', 'Médico', '(61) 98765-4323', 'pedro.lima@hospital.com', 1, 2),
('prof-004', 'Dra. Maria Costa', 'Médico', '(61) 98765-4324', 'maria.costa@hospital.com', 1, 2),
('prof-005', 'Dr. João Oliveira', 'Médico', '(61) 98765-4325', 'joao.oliveira@hospital.com', 1, 1),
('prof-006', 'Dra. Paula Ferreira', 'Médico', '(61) 98765-4326', 'paula.ferreira@hospital.com', 1, 3),

-- Enfermeiros
('prof-007', 'Enf. Lucas Almeida', 'Enfermeiro', '(61) 98765-4327', 'lucas.almeida@hospital.com', 2, 1),
('prof-008', 'Enf. Juliana Rocha', 'Enfermeiro', '(61) 98765-4328', 'juliana.rocha@hospital.com', 2, 1),
('prof-009', 'Enf. Roberto Souza', 'Enfermeiro', '(61) 98765-4329', 'roberto.souza@hospital.com', 2, 2),
('prof-010', 'Enf. Camila Dias', 'Enfermeiro', '(61) 98765-4330', 'camila.dias@hospital.com', 2, 2),
('prof-011', 'Enf. Fernando Martins', 'Enfermeiro', '(61) 98765-4331', 'fernando.martins@hospital.com', 2, 3),
('prof-012', 'Enf. Beatriz Cunha', 'Enfermeiro', '(61) 98765-4332', 'beatriz.cunha@hospital.com', 2, 1),
('prof-013', 'Enf. Ricardo Gomes', 'Enfermeiro', '(61) 98765-4333', 'ricardo.gomes@hospital.com', 2, 2),
('prof-014', 'Enf. Larissa Pinto', 'Enfermeiro', '(61) 98765-4334', 'larissa.pinto@hospital.com', 2, 3),

-- Técnicos de Enfermagem
('prof-015', 'Tec. André Barbosa', 'Técnico de Enfermagem', '(61) 98765-4335', 'andre.barbosa@hospital.com', 3, 1),
('prof-016', 'Tec. Mariana Castro', 'Técnico de Enfermagem', '(61) 98765-4336', 'mariana.castro@hospital.com', 3, 1),
('prof-017', 'Tec. Paulo Mendes', 'Técnico de Enfermagem', '(61) 98765-4337', 'paulo.mendes@hospital.com', 3, 2),
('prof-018', 'Tec. Carla Ribeiro', 'Técnico de Enfermagem', '(61) 98765-4338', 'carla.ribeiro@hospital.com', 3, 2),
('prof-019', 'Tec. Marcos Teixeira', 'Técnico de Enfermagem', '(61) 98765-4339', 'marcos.teixeira@hospital.com', 3, 3),
('prof-020', 'Tec. Fernanda Lopes', 'Técnico de Enfermagem', '(61) 98765-4340', 'fernanda.lopes@hospital.com', 3, 1);

-- =============================================
-- INSERÇÃO DE PLANTÕES (17/11/2025 até 07/12/2025)
-- =============================================

-- Semana 1: 17-23 Nov 2025
INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas) VALUES
-- 17/11/2025 (Segunda)
('2025-11-17', '07:00:00', '19:00:00', 1, 1, 2), -- Médico Emergência (2 vagas)
('2025-11-17', '07:00:00', '19:00:00', 2, 1, 3), -- Enfermeiro Emergência (3 vagas)
('2025-11-17', '19:00:00', '07:00:00', 1, 1, 1), -- Médico Emergência Noturno (1 vaga)
('2025-11-17', '19:00:00', '07:00:00', 2, 1, 2), -- Enfermeiro Emergência Noturno (2 vagas)
('2025-11-17', '07:00:00', '19:00:00', 1, 2, 2), -- Médico UTI (2 vagas)
('2025-11-17', '07:00:00', '19:00:00', 2, 2, 3), -- Enfermeiro UTI (3 vagas)
('2025-11-17', '07:00:00', '19:00:00', 3, 2, 4), -- Técnico UTI (4 vagas)

-- 18/11/2025 (Terça)
('2025-11-18', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-18', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-18', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-18', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-18', '07:00:00', '19:00:00', 1, 2, 2),
('2025-11-18', '07:00:00', '19:00:00', 2, 2, 3),

-- 19/11/2025 (Quarta) - DIA COM PLANTÃO CRÍTICO
('2025-11-19', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-19', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-19', '19:00:00', '07:00:00', 1, 1, 1), -- Este ficará vago (crítico)
('2025-11-19', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-19', '07:00:00', '19:00:00', 1, 3, 1), -- Este ficará vago (crítico)
('2025-11-19', '07:00:00', '19:00:00', 2, 3, 2),

-- 20/11/2025 (Quinta)
('2025-11-20', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-20', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-20', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-20', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-20', '07:00:00', '19:00:00', 1, 2, 2),
('2025-11-20', '07:00:00', '19:00:00', 2, 2, 3),

-- 21/11/2025 (Sexta)
('2025-11-21', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-21', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-21', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-21', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-21', '07:00:00', '19:00:00', 1, 2, 2),
('2025-11-21', '07:00:00', '19:00:00', 2, 2, 3),
('2025-11-21', '07:00:00', '19:00:00', 3, 2, 4),

-- 22-23/11/2025 (Fim de semana)
('2025-11-22', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-22', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-22', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-22', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-23', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-23', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-23', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-23', '19:00:00', '07:00:00', 2, 1, 2);

-- Semana 2: 24-30 Nov 2025
INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas) VALUES
-- 24/11/2025 (Segunda)
('2025-11-24', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-24', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-24', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-24', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-24', '07:00:00', '19:00:00', 1, 2, 2),
('2025-11-24', '07:00:00', '19:00:00', 2, 2, 3),
('2025-11-24', '07:00:00', '19:00:00', 3, 2, 4),

-- 25/11/2025 (Terça)
('2025-11-25', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-25', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-25', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-25', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-25', '07:00:00', '19:00:00', 1, 2, 2),
('2025-11-25', '07:00:00', '19:00:00', 2, 2, 3),

-- 26/11/2025 (Quarta) - DIA COM MAIS PLANTÕES CRÍTICOS
('2025-11-26', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-26', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-26', '19:00:00', '07:00:00', 1, 2, 1), -- Este ficará vago (crítico)
('2025-11-26', '19:00:00', '07:00:00', 2, 2, 2),
('2025-11-26', '07:00:00', '19:00:00', 1, 3, 1), -- Este ficará vago (crítico)
('2025-11-26', '07:00:00', '19:00:00', 2, 3, 2),

-- 27-30/11/2025
('2025-11-27', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-27', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-27', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-27', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-28', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-28', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-28', '19:00:00', '07:00:00', 1, 1, 1),
('2025-11-28', '19:00:00', '07:00:00', 2, 1, 2),
('2025-11-29', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-29', '07:00:00', '19:00:00', 2, 1, 3),
('2025-11-30', '07:00:00', '19:00:00', 1, 1, 2),
('2025-11-30', '07:00:00', '19:00:00', 2, 1, 3);

-- Semana 3: 01-07 Dez 2025
INSERT INTO plantoes (data, hora_inicio, hora_fim, id_funcao, id_local, vagas) VALUES
-- 01/12/2025 (Segunda)
('2025-12-01', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-01', '07:00:00', '19:00:00', 2, 1, 3),
('2025-12-01', '19:00:00', '07:00:00', 1, 1, 1),
('2025-12-01', '19:00:00', '07:00:00', 2, 1, 2),
('2025-12-01', '07:00:00', '19:00:00', 1, 2, 2),
('2025-12-01', '07:00:00', '19:00:00', 2, 2, 3),
('2025-12-01', '07:00:00', '19:00:00', 3, 2, 4),

-- 02/12/2025 (Terça)
('2025-12-02', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-02', '07:00:00', '19:00:00', 2, 1, 3),
('2025-12-02', '19:00:00', '07:00:00', 1, 1, 1),
('2025-12-02', '19:00:00', '07:00:00', 2, 1, 2),
('2025-12-02', '07:00:00', '19:00:00', 1, 2, 2),
('2025-12-02', '07:00:00', '19:00:00', 2, 2, 3),

-- 03/12/2025 (Quarta)
('2025-12-03', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-03', '07:00:00', '19:00:00', 2, 1, 3),
('2025-12-03', '19:00:00', '07:00:00', 1, 1, 1),
('2025-12-03', '19:00:00', '07:00:00', 2, 1, 2),
('2025-12-03', '07:00:00', '19:00:00', 1, 2, 2),
('2025-12-03', '07:00:00', '19:00:00', 2, 2, 3),

-- 04-07/12/2025
('2025-12-04', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-04', '07:00:00', '19:00:00', 2, 1, 3),
('2025-12-04', '19:00:00', '07:00:00', 1, 1, 1),
('2025-12-04', '19:00:00', '07:00:00', 2, 1, 2),
('2025-12-05', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-05', '07:00:00', '19:00:00', 2, 1, 3),
('2025-12-05', '19:00:00', '07:00:00', 1, 1, 1),
('2025-12-05', '19:00:00', '07:00:00', 2, 1, 2),
('2025-12-06', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-06', '07:00:00', '19:00:00', 2, 1, 3),
('2025-12-07', '07:00:00', '19:00:00', 1, 1, 2),
('2025-12-07', '07:00:00', '19:00:00', 2, 1, 3);

-- =============================================
-- INSERÇÃO DE ESCALAS (Alocações)
-- =============================================

-- Escalas para criar SOBRECARGA em alguns profissionais
-- Dr. Carlos Silva e Dra. Ana Santos ficarão sobrecarregados (mais de 40h)

-- Semana 17-23 Nov: Dr. Carlos com muitos plantões (12h cada = 60h na semana)
INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-001', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND hora_inicio = '07:00:00' AND id_funcao = 1 AND id_local = 1
LIMIT 5;

-- Semana 17-23 Nov: Dra. Ana Santos com muitos plantões noturnos (12h cada = 48h)
INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-002', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND hora_inicio = '19:00:00' AND id_funcao = 1 AND id_local = 1
LIMIT 4;

-- Semana 24-30 Nov: Dr. Carlos continua sobrecarregado
INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-001', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-24' AND '2025-11-30' 
AND hora_inicio = '07:00:00' AND id_funcao = 1 AND id_local = 1
LIMIT 4;

-- Escalas normais para outros profissionais
INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-003', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 1 AND id_local = 2
LIMIT 3;

INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-004', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 1 AND id_local = 2
LIMIT 2;

INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-005', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-24' AND '2025-11-30' 
AND id_funcao = 1 AND id_local = 1
LIMIT 3;

-- Enfermeiros
INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-007', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 2 AND id_local = 1
LIMIT 4;

INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-008', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 2 AND id_local = 1
LIMIT 3;

INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-009', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 2 AND id_local = 2
LIMIT 4;

INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-010', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-24' AND '2025-11-30' 
AND id_funcao = 2 AND id_local = 2
LIMIT 3;

-- Técnicos
INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-015', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 3
LIMIT 3;

INSERT INTO escalas (profissional_id, plantao_id, status)
SELECT 'prof-016', id, 'ativo' FROM plantoes 
WHERE data BETWEEN '2025-11-17' AND '2025-11-23' 
AND id_funcao = 3
LIMIT 2;

-- =============================================
-- INSERÇÃO DE SUBSTITUIÇÕES PENDENTES
-- =============================================

-- Obter IDs de plantões alocados para criar substituições
DO $$
DECLARE
    plantao_id_1 uuid;
    plantao_id_2 uuid;
    plantao_id_3 uuid;
    plantao_id_4 uuid;
BEGIN
    -- Pegar alguns plantões alocados
    SELECT plantao_id INTO plantao_id_1 FROM escalas WHERE profissional_id = 'prof-001' LIMIT 1 OFFSET 1;
    SELECT plantao_id INTO plantao_id_2 FROM escalas WHERE profissional_id = 'prof-002' LIMIT 1 OFFSET 1;
    SELECT plantao_id INTO plantao_id_3 FROM escalas WHERE profissional_id = 'prof-007' LIMIT 1 OFFSET 1;
    SELECT plantao_id INTO plantao_id_4 FROM escalas WHERE profissional_id = 'prof-008' LIMIT 1 OFFSET 1;
    
    -- Criar substituições pendentes
    INSERT INTO substituicoes (plantao_id, profissional_solicitante_id, profissional_substituto_id, status)
    VALUES
        (plantao_id_1, 'prof-001', 'prof-005', 'pendente'),
        (plantao_id_2, 'prof-002', 'prof-006', 'pendente'),
        (plantao_id_3, 'prof-007', 'prof-012', 'pendente'),
        (plantao_id_4, 'prof-008', 'prof-013', 'pendente');
END $$;

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================
SELECT 
    'Profissionais' as tabela, 
    COUNT(*) as total 
FROM profissionais
UNION ALL
SELECT 
    'Plantões' as tabela, 
    COUNT(*) as total 
FROM plantoes
UNION ALL
SELECT 
    'Escalas' as tabela, 
    COUNT(*) as total 
FROM escalas
UNION ALL
SELECT 
    'Substituições Pendentes' as tabela, 
    COUNT(*) as total 
FROM substituicoes
WHERE status = 'pendente'
UNION ALL
SELECT 
    'Plantões Críticos (vagos em 48h)' as tabela, 
    COUNT(*) as total 
FROM plantoes p
WHERE NOT EXISTS (
    SELECT 1 FROM escalas e WHERE e.plantao_id = p.id AND e.status = 'ativo'
)
AND p.data::timestamp + p.hora_inicio::time <= NOW() + INTERVAL '48 hours';
