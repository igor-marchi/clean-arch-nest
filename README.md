<h4 align="center">
  <img src=".github/nest.svg" />

  <p>DDD + NestJS - Fórum API</p>
</h4>

Aplicação para aprender os princípios do Domain Driven Design (DDD) e juntar tudo em um só projeto com NestJS. Além disso, dividindo a aplicação em camadas para facilitar o desenvolvimento e manter o código organizado.

Nessa aplicação será desenvolvido um Fórum onde o usuário pode acessar, enviar tópicos, criar perguntas, enviar respostas, selecionar a resposta como a resposta que respondeu seu tópico e deixar um comentário.

> ⚠️ Aplicação com finalidade de desenvolver minhas habilidades com NestJS + DDD

## ✨ Tecnologias relevantes

- [NestJS](https://docs.nestjs.com): Nest (NestJS) é uma estrutura para a construção de aplicativos Node.js do lado do servidor eficientes e escalonáveis.
- [Zod](https://zod.dev): Zod é uma biblioteca de validação de dados para TypeScript.
- [Passport](https://www.passportjs.org/): Passport é uma biblioteca de autenticação de usuários do lado do servidor.
- [Passport JWT](https://www.passportjs.org/packages/passport-jwt/): Uma estratégia do Passport para autenticação com um JSON Web Token, este módulo permite autenticar endpoints usando um token web JSON.
- [Prisma](https://www.prisma.io/): Prisma é uma biblioteca de persistência de banco de dados para Node.js
- [Cloudflare](https://www.cloudflare.com/): Cloudflare e uma plataforma de armazenamento de dados de rede.

## 🚀 Projeto

Nesse projeto estou usando a estrutura NestJS, que é uma estrutura para a construção de aplicativos Node.js do lado do servidor eficientes e escaláveis, para criar uma API de Fórum.

As aulas que estou assistindo para o desenvolvimento desse projeto abordam conceitos de Domain Driven Design (DDD), NestJS e até Clean Architecture. Logo separei outras leituras para as anotações das aulas:

- [📃 Anotações sobre NestJS](./.github/notes-about-nestjs.md)
- [📃 Anotações sobre DDD](./.github/notes-about-ddd.md)
- [📃 Anotações sobre arquitetura](./.github/notes-about-architecture.md)

## 🧑‍🏭 Executando a aplicação

Levando em conta que o projeto já foi clonado e está com todas as dependências instaladas usando seu principal gerenciador de pacotes:

```bash
$ npm install
```

Adicione as variáveis de ambiente copiando o arquivo `.env.example` e renomeando para `.env`:

```properties
# Database
DATABASE_URL="postgresql://postgres:docker@localhost:5432/nest-clean?schema=public"

# Auth
JWT_PRIVATE_KEY=""
JWT_PUBLIC_KEY=""

# Application
PORT=""

# Storage (AWS / Cloudflare)
AWS_BUCKET_NAME=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""

CLOUDFLARE_ACCOUNT_ID=""

# Redis
REDIS_HOST=""
REDIS_PORT=""
REDIS_DB=""
```

A estratégia de autenticação usada é JWT com algorítimo RSA-256. Logo você deve gerar as chaves pública e privada do algoritmo e convertê-las para Base64.

```bash
$ openssl genrsa -out private.pem 2048
$ openssl rsa -in private.pem -pubout -out public.pem

$ base64 private.pem
$ base64 public.pem
```

Além disso, usamos Cloudflare R2 para armazenamento de anexos de perguntas e respostas. O interessante é que ele usa a mesma API do AWS S3 o que facilita na questão de troca caso seja necessário. Dado isso, para realização dos testes de ponta a ponta (e2e) basta que o bucket seja criado na Cloudflare com lifecycle(tempo de vida) de 1 dia para que os anexos de testes não sejam acumulados.

Para fazer um override das variáveis de ambiente para testes use o arquivo `.env.test` substituindo o que precisar, exemplo:

```bash
# Override env variables during tests

AWS_BUCKET_NAME="ignite-nest-forum-ddd-test"
```

Usando o docker-compose inicie os serviços necessários para executar a aplicação com:

```bash
$ docker-compose up -d
```

Não esqueça de rodar as migrações:

```bash
$ npx prisma migrate dev
```

Após isso basta iniciar a aplicação (desenvolvimento):

```bash
$ npm run start:dev
```

## 🦉 Requisições

Para testar as requisições da aplicação estou usando a extensão do VSCode chamada [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) e com ela criei um arquivo chamado `client.http` na raiz do projeto onde estão listadas todas as rotas da aplicação.

## 🧪 Testes

Nesse projeto estou utilizando testes unitários e testes de ponta a ponta (e2e) e para executar basta rodar os comandos:

```bash
# Testes unitários
$ npm run test

# Testes de ponta a ponta
$ npm run test:e2e
```

## ☕ Contatos

Você vai me encontrar em qualquer uma das redes sociais abaixo:

<a href = "mailto: igor.marchi@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23EA4335?style=for-the-badge&logo=gmail&logoColor=white" target="_blank" margin-right="10px"></a>
<a href="https://www.linkedin.com/in/igor-marchi/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a>
