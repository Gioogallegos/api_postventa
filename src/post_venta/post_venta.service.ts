import { Injectable } from '@nestjs/common';
import { ESLint } from 'eslint';
import { DatabaseAwsService } from 'src/shared/connections/aws-db.service';
import { Solicitud } from 'src/shared/interfaces/postventa_data.interface';


@Injectable()
export class PostVentaService {
  constructor(private readonly db: DatabaseAwsService) { }

  async create(data: Solicitud) {
    const sql = `
      INSERT INTO solicitud_postventa (   
        nombre,
        rut,
        telefono,
        email,
        mensaje,
        estado,
        canal_origen,
        fecha,
        ejecutivo_asignado
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *`;

    const params = [
      data.nombre,
      data.rut,
      data.telefono,
      data.email,
      data.mensaje,
      data.estado,
      data.canal_origen,
      new Date().toISOString(),
      data.ejecutivo_asignado || null, // Asigna null si no se proporciona
    ];

    const result = await this.db.call({ query: sql, params });
    return result.rows; // Devuelve el ID creado
  }

  async findAll(search?: string, estado?: string) {
    console.log('Search:', search);
    console.log('Estado:', estado);
    let sql = 'SELECT * FROM solicitud_postventa WHERE 1=1';
    const params: any[] = [];
    const searchFields = ['nombre', 'rut', 'email', 'telefono', 'mensaje', 'estado', 'canal_origen']; // Campos a buscar

    if (search) {
      const conditions = searchFields.map(field => `${field} LIKE $${params.length + 1}`).join(' OR ');
      sql += ` AND (${conditions})`;
      params.push(`%${search}%`);
    }

    if (estado) {
      sql += ' AND estado = $' + (params.length + 1);
      params.push(estado);
    }

    console.log('SQL:', sql);
    sql += ' ORDER BY id DESC';

    const result = await this.db.call({ query: sql, params });
    return result.rows;
  }



  async findOne(id: string): Promise<Solicitud | null> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new Error('El parámetro "id" debe ser un número válido.');
    }

    const sql = 'SELECT * FROM solicitud_postventa WHERE id = $1';
    const result = await this.db.call({ query: sql, params: [parsedId] });
    return result.rows[0] || null;
  }

  async update(id: string, data: Partial<Solicitud>) {
    const fields: string[] = []; // Tipo explícito
    const values: (string | number | Date)[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value); // Ahora acepta string, number o Date
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    values.push(parseInt(id));
    const sql = `UPDATE solicitud_postventa SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await this.db.call({ query: sql, params: values });
    return result.rows[0];
  }

  async remove(id: string) {
    const sql = 'DELETE FROM solicitud_postventa WHERE id = $1 RETURNING *';
    const result = await this.db.call({ query: sql, params: [parseInt(id)] });
    if (!result.rows[0]) {
      throw new Error('No se encontró la solicitud para eliminar');
    }
    return { message: 'Solicitud eliminada', deleted: result.rows[0] };
  }
  //comentario ejecutivo
  async createComment(id_solicitud: number, usuario: string, comment: string) {
    const sql = `INSERT INTO comentarios_solicitud_postventa (id_solicitud, comment, usuario) VALUES ($1, $2, $3) RETURNING id`;
    const result = await this.db.call({ query: sql, params: [id_solicitud, comment, usuario] });
    return result.rows[0];
  }



  async updateComment(id: string, comment: string, id_solicitud: number, usuario: string) {
    // usa id y id_solicitud para buscar comentario y actualiza comment y usuario
    const sql = `UPDATE comentarios_solicitud_postventa SET comment = $1, usuario = $2 WHERE id = $3 AND id_solicitud = $4 RETURNING *`;
    const result = await this.db.call({ query: sql, params: [comment, usuario, parseInt(id), id_solicitud] });
    if (!result.rows[0]) {
      throw new Error('No se encontró el comentario para actualizar');
    }
  }


  async findComments(id_solicitud: string) {
    const sql = `SELECT * FROM comentarios_solicitud_postventa WHERE id_solicitud = $1`;
    const result = await this.db.call({ query: sql, params: [parseInt(id_solicitud)] });
    return result.rows;
  }
}