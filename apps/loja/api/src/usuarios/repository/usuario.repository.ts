import { Injectable } from '@nestjs/common';
import { Usuario } from '../types/usuario.type';

@Injectable()
export class UsuarioRepository {
    private usuarios: Usuario[] = [];

    salvar(usuario: Usuario) {
        this.usuarios.push(usuario);
    }

    listar() {
        return this.usuarios;
    }
}
