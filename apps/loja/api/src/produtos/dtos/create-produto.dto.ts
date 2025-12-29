export class CreateProdutoDto {
    nome: string;
    valor: number;
    quantidadeDisponivel: number;
    descricao?: string;
    caracteristicas: { nome: string; descricao: string }[];
    imagens: { url: string; descricao: string }[];
    categoria: string;
    dataCriacao: string;
    dataAtualizacao: string;
}
