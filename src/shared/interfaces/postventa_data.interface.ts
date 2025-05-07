export type IEstadoSolicitud = 'RECIBIDA' | 'EN_REVISION' | 'PENDIENTE_CLIENTE' | 'PENDIENTE_INTERNA' | 'RESUELTA' | 'CERRADA';


export interface Solicitud {
  id : number;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  mensaje: string;
  estado: IEstadoSolicitud;
  canal_origen: string;
  ejecutivo_asignado?: string;
}

export interface comentarioEjecutivo {
  id_solicitud: number;
  solicitud_id: number;
  usuario: string;
  comentario: string;
  fecha: string;
}





