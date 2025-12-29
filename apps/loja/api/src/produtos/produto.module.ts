import { Module } from '@nestjs/common';
import { ProdutoController } from './controller/produto.controller';
import { ProdutoRepository } from './repository/produto.repository';

@Module({
    controllers: [ProdutoController],
    providers: [ProdutoRepository],
})
export class ProdutoModule {}
