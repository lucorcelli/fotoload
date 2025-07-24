"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const categorias = await prisma.categoria.findMany();
    console.log(categorias);
}
main().finally(() => prisma.$disconnect());
