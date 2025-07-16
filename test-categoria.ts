import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categorias = await prisma.categoria.findMany();
  console.log(categorias);
}

main().finally(() => prisma.$disconnect());