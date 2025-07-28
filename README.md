Marketplace de Dados & Fotos de Produtos

Objetivo

Plataforma para cadastro, avaliação e venda de fotos e dados de produtos. Usuários podem inserir informações detalhadas e ganhar créditos por vendas/downloads desses dados por clientes de marketplaces.

Funcionalidades (MVP)

Cadastro de usuários (clientes e vendedores)

Cadastro de produto (foto, descrição, referência de fábrica ou código de barras obrigatórios)

Upload de até 6 fotos por produto

Campos adicionais opcionais

Sistema de notas dinâmico (escala 1-100, influenciado por dados, avaliações e curtidas)

Marketplace com busca e filtros (nota, categoria, etc)

Download de produtos mediante créditos (saldo)

Créditos iniciais para novos clientes

Controle de créditos/débitos por vendas/downloads

Moderação automática, com possibilidade de revisão manual

Painel do usuário e painel administrativo

Exportação em massa (CSV/Excel)

Visualização, edição, exclusão e complementação de dados inseridos pelo usuário

Login obrigatório na página principal

Busca filtrada por produto, categoria, descrição, referência, código de barras

Sistema de pagamento e recebimento para usuários

Estrutura Básica de Dados

Produto

id

nome

descricao

referencia_fabrica (obrigatório se não houver código de barras)

codigo_barras (obrigatório se não houver referência de fábrica)

fotos (1 a 6)

tamanhos

termos_tecnicos

vantagens

usuario_id (quem cadastrou)

nota_atual

data_criacao

Nota do Produto

id

produto_id

nota (1-100)

origem (sistema/usuario/curtida/etc)

data_criacao

comentario

Usuário

id

nome

email

saldo_creditos

saldo_debitos

data_cadastro

Regras de Negócio

Só pode baixar produto se tiver saldo/créditos

Cada download gera crédito para quem cadastrou o produto

Notas dos produtos são dinâmicas e variam com o tempo e feedbacks dos clientes

Produtos obrigatoriamente precisam de foto e descrição, e pelo menos referência de fábrica ou código de barras

Notas têm peso maior para cadastros mais completos (fotos de boa qualidade e descrições detalhadas)

Passos para Implementação

Modelagem do banco de dados (ver arquivo .sql)

Implementação do backend (API para cadastro, busca, crédito, download, notas)

Implementação do frontend (baseado nos wireframes)

Lógica de cálculo e atualização de notas

Sistema de moderação automática/manual

Testes e validação Forçando novo deploy

Implementação do sistema de pagamento e recebimento

Planejamento por Módulos

🏠 index.html — Página Principal

✅ Já exibe produtos em destaque com nota e foto.

🔧 Faltam:

Campo de login/autenticação

Campo de busca com filtros (produto, categoria, código de barras, etc)

Componente visual para exibir os detalhes do produto

Mostrar nota com destaque para cadastros mais completos

📦 cadastro-produto.html

✅ Já cadastra produtos com campos básicos.

🔧 Faltam:

Validações de campos obrigatórios: foto e descrição

Campo exclusivo para referência de fábrica ou código de barras (um dos dois é obrigatório)

Confirmação de cadastro (mensagem de sucesso)

Relacionar com usuário logado

📸 cadastro-foto.html

✅ Já tem lógica para enviar até 6 fotos via formulário

🔧 Faltam:

Associar corretamente ao produto_id

Validação do tipo e tamanho da imagem

Mostrar preview das imagens antes do envio

Tela de confirmação após o upload

📊 avaliar.html

✅ Página para avaliação de produtos

🔧 Faltam:

Campo para nota (de 1 a 100)

Campo de comentário opcional

Envio vinculado ao produto_id e usuario_id

Atualização dinâmica da nota média

👤 admin.html / painel.html (talvez não estejam separados ainda)

🔧 Precisam incluir:

Visualizar produtos cadastrados

Editar, excluir ou complementar cadastro

Painel do usuário com:

Histórico de créditos/débitos

Histórico de produtos enviados

Avaliações recebidas

Painel admin:

Moderação de produtos

Aprovação manual quando necessário

📂 Outros arquivos que precisam integração

server.js / server.ts: Endpoints de produtos, fotos, notas, autenticação

seed.js / seed.ts: Popular categorias, usuários fictícios, produtos

test-categoria.js: Testes de integração com banco

menu.html: Já funcional, pode incluir links extras para painel/admin

package.json: Pode incluir scripts úteis como dev, seed, lint

.html (extra): se for genérico, talvez seja uma versão modelo ainda

README.md: aguardando estrutura final

Integrações e Hospedagem

Vercel

Deploy automático a partir do repositório GitHub

Configuração de ambiente para variáveis sensíveis

Suporte a SSR (Server-Side Rendering)

GitHub

Controle de versão do código

Issues e Pull Requests para colaboração

GitHub Actions para CI/CD

Codespace

Ambiente de desenvolvimento remoto

Configuração prévia com dependências do projeto

Acesso direto ao repositório GitHub

Render

Hospedagem de backend e APIs

Suporte a serviços em background

Escalabilidade automática

Supabase (PostgreSQL)

Banco de dados relacional

Autenticação e permissões integradas

API REST gerada automaticamente

Exemplo de Seed

import { PrismaClient } from

const prisma = new PrismaClient();

async function main() {
  console.log('Inserindo usuários...');
  const usuario1 = await prisma.usuario.upsert({
    where: { email: 'luciano@exemplo.com' },
    update: {},
    create: {
      nome: 'Luciano',
      email: 'luciano@exemplo.com',
      saldo_creditos: 100
    }
  });

  const usuario2 = await prisma.usuario.upsert({
    where: { email: 'marina@exemplo.com' },
    update: {},
    create: {
      nome: 'Marina',
      email: 'marina@exemplo.com',
      saldo_creditos: 150
    }
  });

  console.log('Inserindo categorias...');
  const categoria1 = await prisma.categoria.create({ data: { nome: 'Câmeras DSLR' } });
  const categoria2 = await prisma.categoria.create({ data: { nome: 'Lentes' } });

  console.log('Inserindo produtos...');
  const produto1 = await prisma.produto.create({
    data: {
      nome: 'Canon EOS Rebel T7',
      descricao: 'Câmera DSLR com excelente custo-benefício.',
      referencia_fabrica: '12345',
      fotos: ['foto1.jpg', 'foto2.jpg'],
      usuario_id: usuario1.id
    }
  });

  const produto2 = await prisma.produto.create({
    data: {
      nome: 'Nikon D3500',
      descricao: 'Câmera DSLR compacta e fácil de usar.',
      codigo_barras: '67890',
      fotos: ['foto3.jpg', 'foto4.jpg'],
      usuario_id: usuario2.id
    }
  });

  const produto3 = await prisma.produto.create({
    data: {
      nome: 'Lente 50mm f/1.8',
      descricao: 'Lente versátil para retratos e fotografia geral.',
      referencia_fabrica: '54321',
      fotos: ['foto5.jpg', 'foto6.jpg'],
      usuario_id: usuario1.id
    }
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

Diagrama Textual do Banco

Tabelas

Usuário

Campo

Tipo

Descrição

id

UUID

Identificador único

nome

String

Nome do usuário

email

String

Email do usuário

saldo_creditos

Decimal

Créditos disponíveis

saldo_debitos

Decimal

Débitos acumulados

data_cadastro

Timestamp

Data de cadastro

Produto

Campo

Tipo

Descrição

id

UUID

Identificador único

nome

String

Nome do produto

descricao

Text

Descrição detalhada do produto

referencia_fabrica

String

Referência de fábrica (opcional)

codigo_barras

String

Código de barras (opcional)

fotos

Array

URLs das fotos do produto

usuario_id

UUID

ID do usuário que cadastrou

nota_atual

Integer

Nota média do produto

data_criacao

Timestamp

Data de criação do cadastro

Nota do Produto

Campo

Tipo

Descrição

id

UUID

Identificador único

produto_id

UUID

ID do produto avaliado

nota

Integer

Nota atribuída (1 a 100)

origem

String

Origem da nota (sistema/usuário)

comentario

Text

Comentário opcional

data_criacao

Timestamp

Data de criação da avaliação

Comandos Úteis

Scripts

Comando

Descrição

npm run dev

Inicia o servidor de desenvolvimento

npm run seed

Popula o banco com dados fictícios

npm run lint

Verifica e corrige problemas de lint

Prisma

Comando

Descrição

npx prisma generate

Gera os clientes Prisma a partir do schema

npx prisma migrate dev

Aplica migrações no banco de dados

npx prisma studio

Abre o Prisma Studio para gerenciar dados

Exemplos de Requisição

Endpoints

Criar Produto

POST /api/produtos
Content-Type: application/json

{
  "nome": "Canon EOS Rebel T7",
  "descricao": "Câmera DSLR com excelente custo-benefício.",
  "referencia_fabrica": "12345",
  "fotos": ["foto1.jpg", "foto2.jpg"],
  "usuario_id": "uuid-do-usuario"
}

Avaliar Produto

POST /api/produtos/:id/avaliar
Content-Type: application/json

{
  "nota": 95,
  "comentario": "Produto excelente!",
  "usuario_id": "uuid-do-usuario"
}

Buscar Produtos

GET /api/produtos
Content-Type: application/json

{
  "filtro": {
    "categoria": "Câmeras DSLR",
    "nota_minima": 80
  }
}
```
