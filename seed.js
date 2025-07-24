"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Inserindo usuários...');
    const usuario1 = await prisma.usuario.upsert({
        where: { email: 'luciano@exemplo.com' },
        update: {},
        create: { nome: 'Luciano', email: 'luciano@exemplo.com' },
    });
    const usuario2 = await prisma.usuario.upsert({
        where: { email: 'marina@exemplo.com' },
        update: {},
        create: { nome: 'Marina', email: 'marina@exemplo.com' },
    });
    console.log('Inserindo categorias...');
    const categoria1 = await prisma.categoria.create({ data: { nome: 'Câmeras DSLR' } });
    const categoria2 = await prisma.categoria.create({ data: { nome: 'Lentes' } });
    console.log('Inserindo produtos...');
    const produto1 = await prisma.produto.create({
        data: {
            nome: 'Canon EOS Rebel T7',
            descricao: 'Câmera DSLR com Wi-Fi e 24MP',
            referencia_fabrica: 'REBELT7',
            codigo_barras: '1111111111111',
            usuario_id: usuario1.id,
            categoria_id: categoria1.id
        }
    });
    const produto2 = await prisma.produto.create({
        data: {
            nome: 'Nikon D3500',
            descricao: 'Compacta e poderosa para iniciantes',
            referencia_fabrica: 'D3500',
            codigo_barras: '2222222222222',
            usuario_id: usuario2.id,
            categoria_id: categoria1.id
        }
    });
    const produto3 = await prisma.produto.create({
        data: {
            nome: 'Lente 50mm f/1.8',
            descricao: 'Ideal para retratos e baixa luz',
            referencia_fabrica: 'LENTE50',
            codigo_barras: '3333333333333',
            usuario_id: usuario1.id,
            categoria_id: categoria2.id
        }
    });
    console.log('Inserindo notas...');
    await prisma.produtoNota.createMany({
        data: [
            { produto_id: produto1.id, nota: 85, usuario_id: usuario2.id, origem: 'test', comentario: 'Imagem nítida!' },
            { produto_id: produto1.id, nota: 95, usuario_id: usuario1.id, origem: 'test', comentario: 'Muito boa qualidade' },
            { produto_id: produto2.id, nota: 80, usuario_id: usuario1.id, origem: 'test', comentario: 'Compacta e leve' },
            { produto_id: produto3.id, nota: 70, usuario_id: usuario2.id, origem: 'test', comentario: 'Boa, mas escurece em f/1.8' }
        ]
    });
    console.log('Inserindo transações...');
    await prisma.transacaoCredito.createMany({
        data: [
            { usuario_id: usuario1.id, valor: 50, tipo: 'credito', produto_id: produto1.id, descricao: 'Venda T7' },
            { usuario_id: usuario1.id, valor: 15, tipo: 'debito', produto_id: produto3.id, descricao: 'Compra Lente' }
        ]
    });
    console.log('🌱 Dados de seed inseridos com sucesso!');
    const produtos = [produto1, produto2, produto3];
    for (const p of produtos) {
        const notas = await prisma.produtoNota.findMany({
            where: { produto_id: p.id }
        });
        const media = Math.round(notas.reduce((soma, n) => soma + (n.nota ?? 0), 0) / notas.length);
        await prisma.produto.update({
            where: { id: p.id },
            data: { nota_atual: media }
        });
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
