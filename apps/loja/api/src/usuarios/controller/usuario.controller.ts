import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioRepository } from '../repository/usuario.repository';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';

@Controller('/usuarios')
export class UsuarioController {
    constructor(private usuarioRepository: UsuarioRepository) {}

    @Post()
    createUser(@Body() dadosDoUsuario: CreateUsuarioDto): CreateUsuarioDto {
        this.usuarioRepository.salvar(dadosDoUsuario);
        return dadosDoUsuario;
    }

    @Get()
    listUser() {
        return this.usuarioRepository.listar();
    }
}
