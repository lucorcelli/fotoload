"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://fotoload.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express_1.default.json());
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
    }
    catch (e) {
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
        const notas = await prisma.produtoNota.groupBy({
            by: ['produto_id'],
            _avg: { nota: true },
            orderBy: { _avg: { nota: 'desc' } },
            take: 5
        });
        const destaques = await Promise.all(notas.map(async (nota) => {
            const produto = await prisma.produto.findUnique({
                where: { id: nota.produto_id },
                include: {
                    categoria: true,
                    fotos: { take: 1 }
                }
            });
            if (!produto)
                return null;
            return {
                id: produto.id,
                nome: produto.nome,
                categoria: produto.categoria?.nome ?? null,
                foto: produto.fotos[0] ? `/fotos/${produto.fotos[0].id}` : null,
                nota_media: Math.round(nota._avg.nota ?? 0)
            };
        }));
        res.json(destaques.filter(Boolean));
    }
    catch (e) {
        res.status(500).json({ erro: e.message });
    }
});
// 🖼️ Adicionar foto por URL
app.post('/produtos/:id/fotos/url', async (req, res) => {
    try {
        const { url } = req.body;
        const resposta = await axios_1.default.get(url, { responseType: 'arraybuffer' });
        await prisma.produtoFoto.create({
            data: {
                produto_id: Number(req.params.id),
                conteudo: Buffer.from(resposta.data),
                nome_arquivo: url.split('/').pop() ?? 'imagem.jpg',
                mime_type: resposta.headers['content-type'] ?? 'image/jpeg'
            }
        });
        res.status(201).json({ mensagem: 'Foto carregada da URL com sucesso!' });
    }
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
// 🖼️ Adicionar foto por upload
app.post('/produtos/:id/fotos/upload', upload.single('arquivo'), async (req, res) => {
    try {
        const { buffer, originalname, mimetype } = req.file;
        await prisma.produtoFoto.create({
            data: {
                produto_id: Number(req.params.id),
                conteudo: buffer,
                nome_arquivo: originalname,
                mime_type: mimetype
            }
        });
        res.status(201).json({ mensagem: 'Foto enviada com sucesso!' });
    }
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
// 🖼️ Visualizar foto
app.get('/fotos/:id', async (req, res) => {
    try {
        const foto = await prisma.produtoFoto.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!foto || !foto.conteudo) {
            return res.status(404).send('Imagem não encontrada');
        }
        res.setHeader('Content-Type', foto.mime_type ?? 'image/jpeg');
        res.send(foto.conteudo);
    }
    catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
// 🧮 Buscar produtos por nota
app.get('/produtos', async (req, res) => {
    try {
        const minNota = Number(req.query.minNota) || 0;
        const produtos = await prisma.produto.findMany({
            where: { nota_atual: { gte: minNota } },
            include: {
                fotos: true,
                campos_extras: true,
                categoria: true
            }
        });
        res.json(produtos);
    }
    catch (e) {
        res.status(400).json({ erro: e.message });
    }
});
// ⭐ Avaliar produto
app.post('/avaliar', async (req, res) => {
    try {
        await prisma.produtoNota.create({
            data: {
                produto_id: req.body.produto_id,
                nota: req.body.nota,
                usuario_id: req.body.usuario_id,
                origem: req.body.origem,
                comentario: req.body.comentario
            }
        });
        const notas = await prisma.produtoNota.findMany({
            where: { produto_id: req.body.produto_id }
        });
        const media = Math.round(notas.reduce((soma, n) => soma + (n.nota ?? 0), 0) / notas.length);
        await prisma.produto.update({
            where: { id: req.body.produto_id },
            data: { nota_atual: media }
        });
        res.json({ nota_atualizada: media });
    }
    catch (e) {
        res.status(400).json({ erro: e.message });
    }
});
// 💰 Transação crédito/débito
app.post('/transacoes', async (req, res) => {
    try {
        const transacao = await prisma.transacaoCredito.create({
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
    }
    catch (e) {
        res.status(400).json({ erro: e.message });
    }
});
// 🧪 Rota de debug
app.get('/debug', async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany({
            include: { fotos: true }
        });
        res.json({ status: 'ok', produtos });
    }
    catch (e) {
        res.status(500).json({ erro: e.message });
    }
});
// 🆕 Criar produto (sem fotos nesta etapa)
app.post('/produtos', async (req, res) => {
    try {
        const { nome, descricao, referencia_fabrica, codigo_barras, usuario_id, categoria_id } = req.body;
        if (!nome || !descricao || !usuario_id || !categoria_id) {
            return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
        }
        if (!referencia_fabrica && !codigo_barras) {
            return res.status(400).json({
                erro: 'É necessário informar referência de fábrica ou código de barras.'
            });
        }
        const novoProduto = await prisma.produto.create({
            data: {
                nome,
                descricao,
                referencia_fabrica,
                codigo_barras,
                nota_atual: 0,
                usuario: { connect: { id: usuario_id } },
                categoria: { connect: { id: categoria_id } }
            }
        });
        res.status(201).json(novoProduto);
    }
    catch (err) {
        console.error('Erro ao criar produto:', err);
        res.status(500).json({ erro: err.message });
    }
});
// 🔊 Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
