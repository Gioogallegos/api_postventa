export interface UsuarioI {
  id: string | number;
  fechaUltimoLogin?: string;
  fechaUltimaModificacion?: string;
  esAdministrador?: boolean;
  esInterno?: boolean;
  esCliente?: boolean;
}

export interface UsuarioBdI {
  id: string;
  estado: string;
  tipo_usuario: string;
  fecha_ultimo_login: string;
  fecha_ultima_modificacion: string;
}

export interface UsuarioHerenciaBdI {
  id: string;
  rut?: string;
  email?: string;
  password?: string;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  tipo_usuario?: string;
  telefono?: string;
  cargo?: string;
  estado?: string;
  id_supervisor?: string | null;
  id_sucursal?: string;
  fecha_creacion?: string;
  fecha_ultimo_login?: string;
  fecha_ultima_modificacion?: string;
}

export interface BuscarUsuarioI {
  id?: number;
  rut?: string;
  email?: string;
}

export interface SucursalI {
  id: number;
}

export interface SupervisorI {
  id: number;
}

export interface PermisoI {
  servicio: string;
  metodo: string;
}
