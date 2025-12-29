import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProdutoDto } from '../dtos/create-produto.dto';
import { ProdutoRepository } from '../repository/produto.repository';

@Controller('/produtos')
export class ProdutoController {
    constructor(private produtoRepository: ProdutoRepository) {}

    @Post()
    createProduct(@Body() dadosDoProduto: CreateProdutoDto): CreateProdutoDto {
        this.produtoRepository.salvar(dadosDoProduto);
        return dadosDoProduto;
    }

    @Get()
    listarProdutos() {
        return this.produtoRepository.listar();
    }
}
