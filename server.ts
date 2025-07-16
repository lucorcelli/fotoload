import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
app.use(cors());
const app = express();
const prisma = new PrismaClient();
app.use(express.static('public'));
app.use(express.json());

// 🚀 Rota para cadastrar usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;
  console.log('Requisição recebida:', req.body);

  try {
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email }
    });

    console.log('Usuário salvo com sucesso:', novoUsuario);
    res.status(201).json(novoUsuario);
  } catch (err: any) {
    console.error('Erro ao salvar usuário:', err.message);
    res.status(400).json({ erro: err.message });
  }
});

// ✅ Rota para listar todos os usuários
app.get('/usuarios', async (req, res) => {
  const lista = await prisma.usuario.findMany();
  res.json(lista);
});

app.get('/produtos/destaques', async (req, res) => {
  try {
    const notas = await prisma.produto_nota.groupBy({
      by: ['produto_id'],
      _avg: { nota: true },
      orderBy: { _avg: { nota: 'desc' } },
      take: 5
    });

    const destaques = await Promise.all(notas.map(async nota => {
      const produto = await prisma.produto.findUnique({
        where: { id: nota.produto_id },
        include: {
          categoria: true,
          produto_foto: { take: 1 }
        }
      });

      return {
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria?.nome ?? null,
        foto: produto.produto_foto[0]?.url_foto ?? null,
        nota_media: Math.round(nota._avg.nota ?? 0)
      };
    }));

    res.json(destaques);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
});

// Porta padrão no Codespaces
app.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000');
});
app.post('/produtos', async (req, res) => {
  const {
    nome,
    descricao,
    referencia_fabrica,
    codigo_barras,
    usuario_id,
    categoria_id
  } = req.body;

  try {
    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        referencia_fabrica,
        codigo_barras,
        usuario_id,
        categoria_id
      }
    });
    res.status(201).json(produto);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});
app.post('/produtos/:id/fotos', async (req, res) => {
  const { url } = req.body;
  const produto_id = Number(req.params.id);

  try {
    const foto = await prisma.produtoFoto.create({
      data: {
        produto_id,
        url
      }
    });
    res.status(201).json(foto);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});
app.get('/produtos', async (req, res) => {
  const minNota = Number(req.query.minNota) || 0;

  try {
    const produtos = await prisma.produto.findMany({
      where: {
        nota_atual: { gte: minNota }
      },
      include: {
        fotos: true,
        campos_extra: true
      }
    });
    res.json(produtos);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});
app.post('/avaliar', async (req, res) => {
  const { produto_id, nota, usuario_id, origem, comentario } = req.body;

  try {
    // Salvar avaliação
    await prisma.produtoNota.create({
      data: {
        produto_id,
        nota,
        usuario_id,
        origem,
        comentario
      }
    });

    // Recalcular média
    const todasNotas = await prisma.produtoNota.findMany({
      where: { produto_id }
    });

    const media = Math.round(
      todasNotas.reduce((sum, n) => sum + n.nota, 0) / todasNotas.length
    );

    // Atualiza nota no produto
    await prisma.produto.update({
      where: { id: produto_id },
      data: { nota_atual: media }
    });

    res.json({ nota_atualizada: media });
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});
app.post('/produtos/:id/fotos', async (req, res) => {
  const produto_id = Number(req.params.id);
  const { url } = req.body; // A URL da imagem que já foi enviada p/ storage

  try {
    const foto = await prisma.produtoFoto.create({
      data: {
        produto_id,
        url
      }
    });
    res.status(201).json(foto);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});
app.post('/transacoes', async (req, res) => {
  const { usuario_id, valor, tipo, produto_id, descricao } = req.body;

  try {
    const transacao = await prisma.transacaoCredito.create({
      data: {
        usuario_id,
        valor,
        tipo, // "credito" ou "debito"
        produto_id,
        descricao
      }
    });

    const campo = tipo === 'credito' ? 'saldo_creditos' : 'saldo_debitos';

    await prisma.usuario.update({
      where: { id: usuario_id },
      data: {
        [campo]: { increment: valor }
      }
    });

    res.json(transacao);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});
app.post('/avaliar', async (req, res) => {
  const { produto_id, nota, usuario_id, origem, comentario } = req.body;

  try {
    await prisma.produtoNota.create({
      data: {
        produto_id,
        nota,
        usuario_id,
        origem,
        comentario
      }
    });

    const notas = await prisma.produtoNota.findMany({
      where: { produto_id }
    });

    const media = Math.round(
      notas.reduce((soma, n) => soma + n.nota, 0) / notas.length
    );

    await prisma.produto.update({
      where: { id: produto_id },
      data: { nota_atual: media }
    });

    res.json({ nota_atualizada: media });
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});

app.get('/debug', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json({ status: 'ok', produtos });
  } catch (e: any) {
    res.status(500).json({ erro: e.message });
  }
});