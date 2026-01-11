Crud de desenvolvedores e niveis

PASSO A PASSO PARA RODAR COM DOCKER

1 - Clone o projeto e acesse o diretorio

git clone https://github.com/TargetXXX/DevManager.git

cd DevManager

2 - Suba para o docker

docker-compose up -d --build

3 - No backend execute

docker-compose exec backend php artisan migrate:fresh
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan key:generate

O sistema possui um seeder automatico como administrador do sistema

email: admin@admin.com

senha: admin123

Tecnologias utilizadas:

Laravel (BACKEND)
React Typescript (FRONTEND)

Bibliotecas React:

Antd |
SweetAlert |
Axios

Funcionalidades:

Listagem, edição, exclusão e criação de desenvolvedores.

Listagem, edição, exclusão e criação de niveis.

Sistema de autenticação para acessar o sistema (Todos os novos usuarios criados têm a senha padrao "admin123").

Sistema de forçar troca de senha caso for o primeiro login de um novo desenvolvedor criado.

Sistema de permissoes associadas ao nivel do desenvolvedor para cada ação dentro do CRUD (Create, Read, Update, Delete).

Tabela de desenvolvedores totalmente interativa com pesquisas e filtros via querystring.

Tabela de niveis totalmente interativa com pesquisas e filtros via querystring.

Sistema de refresh de tabela de niveis e desenvolvedores.

Avatares para desenvolvedores.

Crop de imagens para avatares.

Impossibilidade de exclusão de niveis associados a algum desenvolvedor.

Contagem de devs associados a cada nivel (via belongsTo e hasMany).

Formatação de idade a partir da data de nascimento.

Edição de perfil via modal.

Sistema de tokens e expiração da sessao caso logado em outra instancia.

Confirmação de exclusão de desenvolvedor e nivel pelo sweetalert.

Modal para criação de desenvolvedor.

Modal para edição de desenvolvedor.

Ordenação de tabelas clicando no nome.

Validacao de campos.

Mensagens de feedback (Toast notification).

Disponibilização via docker.
