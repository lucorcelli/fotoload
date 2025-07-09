import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// 🚀 Rota para cadastrar usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email } = req.body;

  try {
    const usuario = await prisma.usuario.create({
      data: { nome, email }
    });
    res.status(201).json(usuario);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
});

// ✅ Rota para listar todos os usuários
app.get('/usuarios', async (req, res) => {
  const lista = await prisma.usuario.findMany();
  res.json(lista);
});

// Porta padrão no Codespaces
app.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000');
});
