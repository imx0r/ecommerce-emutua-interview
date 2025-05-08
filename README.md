# eMutua Digital E-commerce

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/imx0r/ecommerce-emutua-interview/blob/master/README.en.md)

## Introdução

Esta é uma aplicação web para gerenciamento de produtos para a eMutua Digital. A aplicação utiliza Laravel no backend, com implementação do Laravel Sanctum para autenticação, OpenSearch para indexação de produtos para buscas avançadas e Redis para caching de dados otimizando o uso do banco de dados e tempo de resposta. No frontend foi utilizado Next.js com TailwindCSS, DaisyUI (plugin para o TailwindCSS) e SWR. Toda a aplicação está em containers com Docker.

## Documentação

### Instalação e configuração

Primeiramente, clone o repositório com:
```shell
git clone https://github.com/imx0r/ecommerce-emutua.git
```

Instale o [Docker](https://www.docker.com/products/docker-desktop/), caso ainda não tenha instalado localmente.

Vá até a pasta `api`, duplique o arquivo `.env.example` e renomeie para `.env`. Pronto, a infraestrutura da aplicação está pronta.

Abra o terminal/cmd na pasta onde clonou o repositório, para se certificar que é a pasta correta basta conferir se dentro dela possui o arquivo `docker-compose.yml`. Agora digite e dê enter:
```
docker-compose up --build -d
```

Aguarde para que todos os containers sejam compilados e estejam rodando, são 6 no total:

| Container    | Porta                              | Descrição                                                                                                                                        |
|--------------|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `nginx`      | `80` (interna), `8000` (externa)   | Instância do nginx atuando como webserver e balanceador de carga para a aplicação                                                                |
| `api`        | `9000` (interna, php-fpm)          | Aplicação Laravel, a api em sí.                                                                                                                  |
| `app`        | `3000`                             | Aplicação Next.js, frontend.                                                                                                                     |
| `mysql`      | `3308`                             | Instância do MySQL atuando como banco de dados principal.                                                                                        |
| `opensearch` | `9200` (interna), `9202` (externa) | Instância do OpenSearch para que possamos indexar os produtos e realizar buscas avançadas.                                                       |
| `redis`      | `6381` (interna)                   | Instância do Redis atuando como principal engine de cache, implementando caching das consultas do banco de dados, otimizando tempos de resposta. |

Após ter compilado e executado os containers, caso tenha baixado o Docker Desktop clique no container `api` e vá na aba `Exec`, caso tenha o Docker somente em terminal/CLI, execute o comando abaixo para abrir um terminal bash no container:

```shell
docker run -it ecommerce-api bash
```

E agora execute os comandos abaixo na ordem que está:

1. Execute as migrations para criar as tabelas no banco de dados MySQL
```shell
php artisan migrate
```

2. Crie as tabelas das entidades gerenciadas pelo Doctrine e gere os proxies
```shell
php artisan doctrine:schema:create
php artisan doctrine:generate:proxies
```

3. Popule as tabelas do banco de dados com dados iniciais para teste
```shell
php artisan db:seed
```

Após executar todos os comandos acima você já pode acessar a aplicação através do endereço `http://localhost:3000`. 

Apesar de não ter sido solicitado, implementei uma simples autenticação usando Laravel Sanctum, com isso já foram criados dois usuários padrões, um administrador e um usuário para demonstrar a autenticação da aplicação.

| Usuário | Senha      |
|---------|------------|
| `admin` | `p@ass`    |
| `user`  | `password` |

O usuário pode logar através do link `http://localhost:3000/login` e também pode se registrar em `http://localhost:3000/registrar`. A permissão padrão é de usuário(`1`), portanto caso queira um usuário administrador basta alterar na tabela `users` o campo `role` para `2`.

Pronto, a aplicação está configurada e rodando.

### Como faço para gerenciar produtos?

Para demonstrar a autenticação e também autorização somente usuários administradores podem gerenciar produtos (criar, editar e deletar). Portanto, primeiramente vá em `http://localhost:3000/login` e entre com usuário `admin` e senha `p@ass`, aguarde ser redirecionado e clique no menu "Administrar" e em seguida "Produtos".

Você irá para uma página com a listagem de produtos, cada produto possui um ícone de editar (lápis) e remover (lixeira). Temos também um botão "Criar Produto", ao clicar você poderá cadastrar um produto.

### Como posso testar a busca por produtos no OpenSearch?

Para testar, você terá que utilizar uma ferramenta que possa realizar requisições HTTP `GET`, por exemplo, Postman ou cURL.

Abra sua ferramenta de preferência, e faça uma requisição na seguinte url:
```
http://localhost:9202/products/_search
```

Caso esteja usando cURL, basta executar:
```shell
curl --location --max-time 300 --request GET 'http://localhost:9202/products/_search'
```

### Como posso testar as rotas no Postman?

Para testar as rotas da API basta ir na pasta `test` e importar a collection e environment no seu Postman.

## Tecnologias (Stack)

**Backend:**
* PHP 8.2
* Nginx 1.27.4
* Laravel 12
  * Laravel Sanctum
* Doctrine ORM
* MySQL 8.0
* OpenSearch v2
* Redis 7.4

**Frontend:**
* Next.js (React) 15.2
* TailwindCSS v4
* DaisyUI v5
* SWR v2

**CI/CD**
* Docker

## Implementação da solução

A escolha das tecnologias foram seguidas dos requisitos passados, apesar de eu pessoalmente já utilizar Laravel há muitos anos, assim como Next.js (React) e todas as tecnologias mencionadas. A tecnologia que possuo menos contato é o OpenSearch.

Na implementação eu optei também por explorar e abordar outros aspectos e tecnologias, como por exemplo, o uso do Redis para caching, implementação de autenticação com Laravel Sanctum, implementação de autorização por roles.

Primeiramente, a opção de integrar o Redis, primeira por ser uma engine de caching que utilizo bastante no meu dia a dia a bastante tempo, para otimização de recursos de banco de dados, aprimorar tempo de resposta, a excelente integração com Laravel e definição de responsabilidades para o OpenSearch e o próprio Redis.

OpenSearch e Redis ambos possuem mecanismos de cache, porém penso em manter a responsabilidade do OpenSearch para indexação dos produtos para buscas rápidas, definindo os recursos dele focados nisso, e o Redis para que possamos otimizar a aplicação, banco de dados, gerenciar filas e sessões. Em uma plataformas de e-commerce podemos ter milhares de usuários acessando ao mesmo tempo, e em uma única página de produto podemos ter também milhares de usuários, definindo a responsabilidade e recursos de cada ferramenta para uma determinada tarefa, OpenSearch para buscar produtos, listar produtos, e Redis para manter cache dos produtos, usuários, top lista de produtos em uma categoria, etc, pode salvar recursos e trazer uma melhor experiência ao usuário.

Sobre a autenticação e autorização, a implementação é essencial para demonstrar o domínio desses dois recursos essenciais para toda aplicação web de gestão.

## Considerações Finais

Foi divertido e proveitoso o desenvolvimento deste projeto, gosto muito de sempre praticar e criar, mesmo que sejam projetos pequenos gosto de me desafiar e ver se meus conhecimentos estão em dia, e claro é sempre um aprendizado enorme. Agradeço a oportunidade, até breve!
