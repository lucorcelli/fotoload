# Marketplace de Dados & Fotos de Produtos

## Objetivo

Plataforma para cadastro, avaliação e venda de fotos e dados de produtos. Usuários podem inserir informações detalhadas e ganhar créditos por vendas/downloads desses dados por clientes de marketplaces.

## Funcionalidades (MVP)

- Cadastro de usuários (clientes e vendedores)
- Cadastro de produto (foto, descrição, referência de fábrica ou código de barras obrigatórios)
- Upload de até 6 fotos por produto
- Campos adicionais opcionais
- Sistema de notas dinâmico (escala 1-100, influenciado por dados, avaliações e curtidas)
- Marketplace com busca e filtros (nota, categoria, etc)
- Download de produtos mediante créditos (saldo)
- Créditos iniciais para novos clientes
- Controle de créditos/débitos por vendas/downloads
- Moderação automática, com possibilidade de revisão manual
- Painel do usuário e painel administrativo
- Exportação em massa (CSV/Excel)

## Estrutura Básica de Dados

### Produto

- id
- nome
- descricao
- referencia_fabrica (obrigatório se não houver código de barras)
- codigo_barras (obrigatório se não houver referência de fábrica)
- fotos (1 a 6)
- tamanhos
- termos_tecnicos
- vantagens
- usuario_id (quem cadastrou)
- nota_atual
- data_criacao

### Nota do Produto

- id
- produto_id
- nota (1-100)
- origem (sistema/usuario/curtida/etc)
- data_criacao
- comentario

### Usuário

- id
- nome
- email
- saldo_creditos
- saldo_debitos
- data_cadastro

## Regras de Negócio

- Só pode baixar produto se tiver saldo/créditos
- Cada download gera crédito para quem cadastrou o produto
- Notas dos produtos são dinâmicas e variam com o tempo e feedbacks dos clientes
- Produtos obrigatoriamente precisam de foto e descrição, e pelo menos referência de fábrica **ou** código de barras

## Passos para Implementação

1. Modelagem do banco de dados (ver arquivo .sql)
2. Implementação do backend (API para cadastro, busca, crédito, download, notas)
3. Implementação do frontend (baseado nos wireframes)
4. Lógica de cálculo e atualização de notas
5. Sistema de moderação automática/manual
6. Testes e validação
Forçando novo deploy
