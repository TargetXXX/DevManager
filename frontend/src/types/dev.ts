export type Nivel = {
  id: number;
  nivel: string;
  devs_count?: number;
  created_at?: string;
  permissions?: string[];
};

export type Dev = {
  id: number;
  nome: string;
  idade?: number;
  sexo: "M" | "F";
  data_nascimento: string;
  hobby: string;
  avatar: string | File;
  nivel?: Nivel;
  nivel_id?: number;
  email: string;
  first_login?: boolean;
  permissions?: string[] | string;
};

export type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ApiResponse = {
  data: Dev[] | Nivel[];
  meta: Meta;
};

export type LoginResponse = {
  token: string;
  first_login: boolean;
  dev: any;
};

export type ApiError = {
  error: string;
};
