import { Module } from '@nestjs/common';
import { UsuarioController } from './controller/usuario.controller';
import { UsuarioRepository } from './repository/usuario.repository';

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioRepository],
})
export class UsuarioModule {}
