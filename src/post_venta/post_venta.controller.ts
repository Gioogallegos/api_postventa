import { Controller, Post, Body, Get, Param, Patch, Delete, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { PostVentaService } from './post_venta.service';
import { Solicitud } from 'src/shared/interfaces/postventa_data.interface';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { HasPermisoGuard, Permisos } from 'src/shared/guards/has-permiso.guard';
import { IsInternoGuard } from 'src/shared/guards/is-interno.guard';
import { AddValuesToLogs } from 'src/shared/guards/add-values-to-logs.guard';



@Controller('api/solicitudes')
@UseGuards(JwtGuard, AddValuesToLogs, IsInternoGuard)
export class SolicitudController {
  constructor(private readonly service: PostVentaService) { }

  @Post()
  @UseGuards(
    IsInternoGuard,
    HasPermisoGuard(Permisos.POSTVENTA)
  )
  async create(@Body() data: Solicitud) {
    const result = await this.service.create(data);
    return {
      message: 'Solicitud creada exitosamente',
      data: result
    };
  }



  @Get()
  @UseGuards(
    IsInternoGuard,
    HasPermisoGuard(Permisos.POSTVENTA)
  )
  findAll(@Query('search') search?: string, @Query('estado') estado?: string) {
    console.log('Search:', search);
    return this.service.findAll(search, estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El parámetro "id" debe ser un número válido.');
    }
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Solicitud>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('/comment')
  async createComment(@Body() data: { id_solicitud: number; usuario: string; comment: string }) {
    const result = await this.service.createComment(data.id_solicitud, data.usuario, data.comment);
    return {
      message: 'Comentario creado exitosamente',
      data: result
    };
  
    
  }

  @Get('/comment/:id')
  getComments(@Param('id') id: string) {
    return this.service.findComments(id);
  }

  @Patch('/comment')
  updateComment(@Param('id') id: string, @Body() data: { comment: string; id_solicitud: number; usuario: string }) {
    return this.service.updateComment(id, data.comment, data.id_solicitud, data.usuario);
  }


}
