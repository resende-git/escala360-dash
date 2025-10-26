export interface Plantao {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: string;
}

export interface Profissional {
  id: string;
  nome: string;
  cargo: string;
}

export interface ProfissionalSobrecarga {
  nome: string;
  cargo: string;
  horas_na_semana: number;
}

export interface Escala {
  id: string;
  profissional_id: string;
  plantao_id: string;
  status: string;
  plantoes: Plantao;
  profissionais: Profissional;
}

export interface SubstituicaoDetalhe {
  id_substituicao: string;
  nome_solicitante: string;
  nome_substituto: string;
  data_plantao: string;
}
