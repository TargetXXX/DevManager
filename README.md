# DevManager

CRUD completo para gerenciamento de **Desenvolvedores** e **Níveis**, com autenticação, permissões por nível e interface totalmente interativa (filtros, busca e ordenação via querystring).

---

## 📌 Sumário

- Visão Geral
- Tecnologias
- Bibliotecas do Frontend
- Funcionalidades
- Pré-requisitos
- Rodando com Docker (Passo a Passo)
- Credenciais do Administrador (Seeder)
- Regras Importantes
- Notas de Segurança
- Licença

---

## 🔎 Visão Geral

O **DevManager** é um sistema web que permite administrar **desenvolvedores** e seus respectivos **níveis**, com:

- Autenticação e tokens de sessão
- Controle de permissões baseado no nível do desenvolvedor
- Interface moderna com recursos de produtividade (filtros, querystring, refresh de tabelas, modais, etc.)

---

## 🧱 Tecnologias

- **Backend:** Laravel (PHP)
- **Frontend:** React + TypeScript

---

## 📚 Bibliotecas do Frontend

- **Ant Design (Antd)**
- **SweetAlert**
- **Axios**

---

## ✅ Funcionalidades

### 👨‍💻 Desenvolvedores
- Listagem, edição, exclusão e criação de desenvolvedores (CRUD)
- Tabela totalmente interativa com pesquisas e filtros via querystring
- Sistema de refresh de tabela
- Ordenação de tabelas clicando no nome da coluna
- Avatares para desenvolvedores
- Crop de imagens para avatares
- Formatação de idade a partir da data de nascimento
- Edição de perfil via modal
- Modal para criação de desenvolvedor
- Modal para edição de desenvolvedor
- Confirmação de exclusão de desenvolvedor via SweetAlert
- Validação de campos
- Mensagens de feedback (Toast notification)

### 🧩 Níveis
- Listagem, edição, exclusão e criação de níveis (CRUD)
- Tabela totalmente interativa com pesquisas e filtros via querystring
- Sistema de refresh de tabela
- Ordenação de tabelas clicando no nome da coluna
- Modal para criação de nível
- Modal para edição de nível
- Impossibilidade de exclusão de níveis associados a algum desenvolvedor
- Contagem de devs associados a cada nível (via relacionamentos belongsTo e hasMany)
- Confirmação de exclusão de nível via SweetAlert
- Validação de campos
- Mensagens de feedback (Toast notification)

### 🔐 Autenticação, Permissões e Sessão
- Sistema de autenticação para acessar o sistema
- Todos os novos usuários criados têm a senha padrão **"admin123"**
- Sistema de forçar troca de senha caso seja o primeiro login de um novo desenvolvedor criado
- Sistema de permissões associadas ao nível do desenvolvedor para cada ação do CRUD (**Create, Read, Update, Delete**)
- Sistema de tokens e expiração da sessão caso logado em outra instância

### 🐳 Disponibilização
- Disponibilização via Docker

---

## 🧰 Pré-requisitos

Para rodar via Docker:

- **Docker**
- **Docker Compose**

---

## 🚀 Rodando com Docker (Passo a Passo)

### 1) Clone o projeto e acesse o diretório

```bash
git clone https://github.com/TargetXXX/DevManager.git
cd DevManager
docker-compose up -d --build
```
### 2) Suba para o docker

```bash
docker-compose up -d --build
```
### 3) No backend execute
```bash
docker-compose exec backend php artisan migrate:fresh
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan key:generate]
```

### ✅ O sistema possui um seeder automático criando um administrador do sistema.

### 👤 Credenciais do Administrador (Seeder)

- Email: admin@admin.com

- Senha: admin123

### 📎 Regras Importantes

- Níveis não podem ser excluídos se estiverem associados a algum desenvolvedor.

- Todo usuário novo começa com senha padrão admin123.

- No primeiro login, o sistema obriga a troca de senha.

### 🔒 Notas de Segurança

- Em ambiente de produção, altere:

- credenciais padrão

- variáveis de ambiente

- configurações de token e expiração

- Evite manter a senha padrão em ambientes públicos.
