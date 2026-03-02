# Configuração da Home

Arquivo principal da tela inicial:

- `public/home/home.json`

Modelo de referência:

- `public/home/modelo-home.json`

## Seções dinâmicas

- `hero`: título principal, badge e botões.
- `stats`: números rápidos.
- `about`: título, subtítulo e parágrafos.
- `featuredEditions`: itens do carousel de edições.
- `committee`: dados da comissão organizadora.
- `faq`: perguntas e respostas.
- `seo`: metatags específicas da rota `/`.

## Comissão organizadora

Cada pessoa em `committee.members` aceita:

- `name`
- `role`
- `photoUrl`
- `linkedin` (opcional)
- `lattes` (opcional)
- `github` (opcional)
- `instagram` (opcional)
- `site` (opcional)
- `email` (opcional)

As fotos podem ser links externos (não precisam estar no repositório).
