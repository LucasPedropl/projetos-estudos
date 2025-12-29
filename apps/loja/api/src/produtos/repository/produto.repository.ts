import { Injectable } from '@nestjs/common';
import { Produto } from '../types/produto.type';

@Injectable()
export class ProdutoRepository {
    private produtos: Produto[] = [];

    salvar(produto: Produto) {
        this.produtos.push(produto);
    }

    listar() {
        return this.produtos;
    }
}
