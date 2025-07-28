"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var usuario1, usuario2, categoria1, categoria2, produto1, produto2, produto3, produtos, _i, produtos_1, p, notas, media;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Inserindo usuários...');
                    return [4 /*yield*/, prisma.usuario.upsert({
                            where: { email: 'luciano@exemplo.com' },
                            update: {},
                            create: { nome: 'Luciano', email: 'luciano@exemplo.com' },
                        })];
                case 1:
                    usuario1 = _a.sent();
                    return [4 /*yield*/, prisma.usuario.upsert({
                            where: { email: 'marina@exemplo.com' },
                            update: {},
                            create: { nome: 'Marina', email: 'marina@exemplo.com' },
                        })];
                case 2:
                    usuario2 = _a.sent();
                    console.log('Inserindo categorias...');
                    return [4 /*yield*/, prisma.categoria.create({ data: { nome: 'Câmeras DSLR' } })];
                case 3:
                    categoria1 = _a.sent();
                    return [4 /*yield*/, prisma.categoria.create({ data: { nome: 'Lentes' } })];
                case 4:
                    categoria2 = _a.sent();
                    console.log('Inserindo produtos...');
                    return [4 /*yield*/, prisma.produto.create({
                            data: {
                                nome: 'Canon EOS Rebel T7',
                                descricao: 'Câmera DSLR com Wi-Fi e 24MP',
                                referencia_fabrica: 'REBELT7',
                                codigo_barras: '1111111111111',
                                usuario_id: usuario1.id,
                                categoria_id: categoria1.id,
                            },
                        })];
                case 5:
                    produto1 = _a.sent();
                    return [4 /*yield*/, prisma.produto.create({
                            data: {
                                nome: 'Nikon D3500',
                                descricao: 'Compacta e poderosa para iniciantes',
                                referencia_fabrica: 'D3500',
                                codigo_barras: '2222222222222',
                                usuario_id: usuario2.id,
                                categoria_id: categoria1.id,
                            },
                        })];
                case 6:
                    produto2 = _a.sent();
                    return [4 /*yield*/, prisma.produto.create({
                            data: {
                                nome: 'Lente 50mm f/1.8',
                                descricao: 'Ideal para retratos e baixa luz',
                                referencia_fabrica: 'LENTE50',
                                codigo_barras: '3333333333333',
                                usuario_id: usuario1.id,
                                categoria_id: categoria2.id,
                            },
                        })];
                case 7:
                    produto3 = _a.sent();
                    console.log('Inserindo notas...');
                    return [4 /*yield*/, prisma.produtoNota.createMany({
                            data: [
                                {
                                    produto_id: produto1.id,
                                    nota: 85,
                                    usuario_id: usuario2.id,
                                    origem: 'test',
                                    comentario: 'Imagem nítida!',
                                },
                                {
                                    produto_id: produto1.id,
                                    nota: 95,
                                    usuario_id: usuario1.id,
                                    origem: 'test',
                                    comentario: 'Muito boa qualidade',
                                },
                                {
                                    produto_id: produto2.id,
                                    nota: 80,
                                    usuario_id: usuario1.id,
                                    origem: 'test',
                                    comentario: 'Compacta e leve',
                                },
                                {
                                    produto_id: produto3.id,
                                    nota: 70,
                                    usuario_id: usuario2.id,
                                    origem: 'test',
                                    comentario: 'Boa, mas escurece em f/1.8',
                                },
                            ],
                        })];
                case 8:
                    _a.sent();
                    console.log('Inserindo transações...');
                    return [4 /*yield*/, prisma.transacaoCredito.createMany({
                            data: [
                                {
                                    usuario_id: usuario1.id,
                                    valor: 50,
                                    tipo: 'credito',
                                    produto_id: produto1.id,
                                    descricao: 'Venda T7',
                                },
                                {
                                    usuario_id: usuario1.id,
                                    valor: 15,
                                    tipo: 'debito',
                                    produto_id: produto3.id,
                                    descricao: 'Compra Lente',
                                },
                            ],
                        })];
                case 9:
                    _a.sent();
                    console.log('🌱 Dados de seed inseridos com sucesso!');
                    produtos = [produto1, produto2, produto3];
                    _i = 0, produtos_1 = produtos;
                    _a.label = 10;
                case 10:
                    if (!(_i < produtos_1.length)) return [3 /*break*/, 14];
                    p = produtos_1[_i];
                    return [4 /*yield*/, prisma.produtoNota.findMany({
                            where: { produto_id: p.id },
                        })];
                case 11:
                    notas = _a.sent();
                    media = Math.round(notas.reduce(function (soma, n) { var _a; return soma + ((_a = n.nota) !== null && _a !== void 0 ? _a : 0); }, 0) / notas.length);
                    return [4 /*yield*/, prisma.produto.update({
                            where: { id: p.id },
                            data: { nota_atual: media },
                        })];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 10];
                case 14: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () {
    prisma.$disconnect();
});
