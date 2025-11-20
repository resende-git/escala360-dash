-- Script para corrigir políticas RLS e permitir visualização dos dados
-- Execute este script no SQL Editor do Supabase

-- Habilitar RLS em todas as tabelas (se ainda não estiver habilitado)
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalas ENABLE ROW LEVEL SECURITY;
ALTER TABLE substituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Permitir leitura pública de profissionais" ON profissionais;
DROP POLICY IF EXISTS "Permitir leitura pública de plantões" ON plantoes;
DROP POLICY IF EXISTS "Permitir leitura pública de escalas" ON escalas;
DROP POLICY IF EXISTS "Permitir leitura pública de substituições" ON substituicoes;
DROP POLICY IF EXISTS "Permitir leitura pública de auditoria" ON auditoria;

-- Criar políticas de leitura pública para todas as tabelas
CREATE POLICY "Permitir leitura pública de profissionais"
ON profissionais FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir leitura pública de plantões"
ON plantoes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir leitura pública de escalas"
ON escalas FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir leitura pública de substituições"
ON substituicoes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Permitir leitura pública de auditoria"
ON auditoria FOR SELECT
TO authenticated
USING (true);

-- Políticas para INSERT, UPDATE, DELETE (para usuários autenticados)
-- Profissionais
DROP POLICY IF EXISTS "Permitir insert de profissionais" ON profissionais;
CREATE POLICY "Permitir insert de profissionais"
ON profissionais FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update de profissionais" ON profissionais;
CREATE POLICY "Permitir update de profissionais"
ON profissionais FOR UPDATE
TO authenticated
USING (true);

-- Plantões
DROP POLICY IF EXISTS "Permitir insert de plantões" ON plantoes;
CREATE POLICY "Permitir insert de plantões"
ON plantoes FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update de plantões" ON plantoes;
CREATE POLICY "Permitir update de plantões"
ON plantoes FOR UPDATE
TO authenticated
USING (true);

-- Escalas
DROP POLICY IF EXISTS "Permitir insert de escalas" ON escalas;
CREATE POLICY "Permitir insert de escalas"
ON escalas FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update de escalas" ON escalas;
CREATE POLICY "Permitir update de escalas"
ON escalas FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Permitir delete de escalas" ON escalas;
CREATE POLICY "Permitir delete de escalas"
ON escalas FOR DELETE
TO authenticated
USING (true);

-- Substituições
DROP POLICY IF EXISTS "Permitir insert de substituições" ON substituicoes;
CREATE POLICY "Permitir insert de substituições"
ON substituicoes FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir update de substituições" ON substituicoes;
CREATE POLICY "Permitir update de substituições"
ON substituicoes FOR UPDATE
TO authenticated
USING (true);

-- Auditoria
DROP POLICY IF EXISTS "Permitir insert de auditoria" ON auditoria;
CREATE POLICY "Permitir insert de auditoria"
ON auditoria FOR INSERT
TO authenticated
WITH CHECK (true);

-- Garantir que as funções RPC possam ser executadas
GRANT EXECUTE ON FUNCTION get_plantoes_vagos_48h TO authenticated;
GRANT EXECUTE ON FUNCTION get_substituicoes_pendentes TO authenticated;
GRANT EXECUTE ON FUNCTION get_profissionais_sobrecarregados TO authenticated;
GRANT EXECUTE ON FUNCTION get_detalhes_substituicoes_pendentes TO authenticated;
GRANT EXECUTE ON FUNCTION sugerir_profissionais_para_plantao TO authenticated;
GRANT EXECUTE ON FUNCTION aprovar_substituicao TO authenticated;
GRANT EXECUTE ON FUNCTION rejeitar_substituicao TO authenticated;
