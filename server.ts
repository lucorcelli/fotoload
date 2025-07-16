import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🚀 Rota para cadastrar usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;

  try {
    const novoUsuario = await prisma.usuario.create({ data: { nome, email } });
    res.status(201).json(novoUsuario);
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

// ✅ Listar usuários
app.get('/usuarios', async (req, res) => {
  const lista = await prisma.usuario.findMany();
  res.json(lista);
});

// 🌟 Produtos em destaque
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

      if (!produto) return null;

      return {
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria?.nome ?? null,
        foto: produto.produto_foto[0]?.url_foto ?? null,
        nota_media: Math.round(nota._avg.nota ?? 0)
      };
    }));

    res.json(destaques.filter(Boolean));
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
});

// 📦 Cadastrar produto
app.post('/produtos', async (req, res) => {
  const { nome, descricao, referencia_fabrica, codigo_barras, usuario_id, categoria_id } = req.body;

  try {
    const produto = await prisma.produto.create({
      data: { nome, descricao, referencia_fabrica, codigo_barras, usuario_id, categoria_id }
    });
    res.status(201).json(produto);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});

// 🖼️ Adicionar foto ao produto
app.post('/produtos/:id/fotos', async (req, res) => {
  const produto_id = Number(req.params.id);
  const { url } = req.body;

  try {
    const foto = await prisma.produto_foto.create({
      data: { produto_id, url_foto: url }
    });
    res.status(201).json(foto);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});

// 🧮 Listar produtos com nota mínima
app.get('/produtos', async (req, res) => {
  const minNota = Number(req.query.minNota) || 0;

  try {
    const produtos = await prisma.produto.findMany({
      where: { nota_atual: { gte: minNota } },
      include: { produto_foto: true, produto_campo_extra: true }
    });
    res.json(produtos);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});

// ⭐ Avaliação de produto
app.post('/avaliar', async (req, res) => {
  const { produto_id, nota, usuario_id, origem, comentario } = req.body;

  try {
    await prisma
