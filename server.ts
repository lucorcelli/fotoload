import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🚀 Cadastrar usuário
app.post('/usuarios', async (req, res) => {
  try {
    const novo = await prisma.usuario.create({
      data: {
        nome: req.body.nome,
        email: req.body.email
      }
    });
    res.status(201).json(novo);
  } catch (e: any) {
    res.status(400).json({ erro: e.message });
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
  } catch (e: any) {
    res.status(500).json({ erro: e.message });
  }
});

// 📦 Criar produto
app.post('/produtos', async (req, res) => {
  try {
    const produto = await prisma.produto.create({
      data: {
        nome: req.body.nome,
        descricao: req.body.descricao,
        referencia_fabrica: req.body.referencia_fabrica,
        codigo_barras: req.body.codigo_barras,
        usuario_id: req.body.usuario_id,
        categoria_id: req.body.categoria_id
      }
    });
    res.status(201).json(produto);
  } catch (e: any) {
    res.status(400).json({ erro: e.message });
  }
});

// 🖼️ Adicionar foto
app.post('/produtos/:id/fotos', async (req, res) => {
  try {
    const foto = await prisma.produto_foto.create({
      data: {
        produto_id: Number(req.params.id),
        url_foto: req.body.url
      }
    });
    res.status(201).json(foto);
  } catch (e: any) {
    res.status(400).json({ erro: e.message });
  }
});

// 🧮 Buscar produtos por nota
app.get('/produtos', async (req, res) => {
  try {
    const minNota = Number(req.query.minNota) || 0;
    const produtos = await prisma.produto.findMany({
      where: { nota_atual: { gte: minNota } },
      include: {
        produto_foto: true,
        produto_campo_extra: true
      }
    });
    res.json(produtos);
  } catch (e: any) {
    res.status(400).json({ erro: e.message });
  }
});

// ⭐ Avaliar produto
app.post('/avaliar', async (req, res) => {
  try {
    await prisma.produto_nota.create({
      data: {
        produto_id: req.body.produto_id,
        nota: req.body.nota,
        usuario_id: req.body.usuario_id,
        origem: req.body.origem,
        comentario: req.body.comentario
      }
    });

    const notas = await prisma.produto_nota.findMany({
      where: { produto_id: req.body.produto_id }
    });

    const media = Math.round(
      notas.reduce((soma: number, n: { nota: number }) => soma + n.nota, 0) / notas.length
    );

    await prisma.produto.update({
      where: { id: req.body.produto_id },
      data: { nota_atual: media }
    });

    res.json({ nota_atualizada: media });
  } catch (e: any) {
    res.status(400).json({ erro: e.message });
  }
});

// 💰 Transação crédito/débito
app.post('/transacoes', async (req, res) => {
  try {
    const transacao = await prisma.transacao_credito.create({
      data: {
        usuario_id: req.body.usuario_id,
        valor: req.body.valor,
        tipo: req.body.tipo,
        produto_id: req.body.produto_id,
        descricao: req.body.descricao
      }
    });

    const campo = req.body.tipo === 'credito' ? 'saldo_creditos' : 'saldo_debitos';

    await prisma.usuario.update({
      where: { id: req.body.usuario_id },
      data: {
        [campo]: { increment: req.body.valor }
      }
    });

    res.json(transacao);
  } catch (e: any) {
    res.status(400).json({ erro: e.message });
  }
});

// 🧪 Rota de debug
app.get('/debug', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json({ status: 'ok', produtos });
  } catch (e: any) {
    res.status(500).json({ erro: e.message });
  }
});

// 🔊 Inicializa o servidor
app.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000');
});
