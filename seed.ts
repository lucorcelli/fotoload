import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Usuários (com upsert pra evitar duplicação)
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

  // Categorias
  const categoria1 = await prisma.categoria.create({ data: { nome: 'Câmeras DSLR' } });
  const categoria2 = await prisma.categoria.create({ data: { nome: 'Lentes' } });

  // Produtos
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

  // Fotos
  await prisma.produto_foto.createMany({
    data: [
      { produto_id: produto1.id, url_foto: 'https://i.imgur.com/foto1.png' },
      { produto_id: produto2.id, url_foto: 'https://i.imgur.com/foto2.png' },
      { produto_id: produto3.id, url_foto: 'https://i.imgur.com/foto3.png' }
    ]
  });

  // Avaliações
  await prisma.produto_nota.createMany({
    data: [
      { produto_id: produto1.id, nota: 85, usuario_id: usuario2.id, origem: 'test', comentario: 'Imagem nítida!' },
      { produto_id: produto1.id, nota: 95, usuario_id: usuario1.id, origem: 'test', comentario: 'Muito boa qualidade' },
      { produto_id: produto2.id, nota: 80, usuario_id: usuario1.id, origem: 'test', comentario: 'Compacta e leve' },
      { produto_id: produto3.id, nota: 70, usuario_id: usuario2.id, origem: 'test', comentario: 'Boa, mas escurece em f/1.8' }
    ]
  });

  // Transações
  await prisma.transacao_credito.createMany({
    data: [
      { usuario_id: usuario1.id, valor: 50, tipo: 'credito', produto_id: produto1.id, descricao: 'Venda T7' },
      { usuario_id: usuario1.id, valor: 15, tipo: 'debito', produto_id: produto3.id, descricao: 'Compra Lente' }
    ]
  });

  console.log('🌱 Dados de seed inseridos com sucesso!');
}

main().finally(() => prisma.$disconnect());