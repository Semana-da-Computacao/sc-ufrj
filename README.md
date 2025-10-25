# Semana da Computação — UFRJ (site)

Este repositório contém o site da Semana da Computação da UFRJ (projeto front-end), desenvolvido com React + TypeScript e Vite. O objetivo do site é apresentar informações do evento (quem somos, números, patrocinadores, galeria de fotos) e oferecer páginas dedicadas às edições (por exemplo `/edicao-2025`), com programação e CTA para compra/registro de ingressos.

Este README explica como rodar o projeto localmente, como usar um fluxo de trabalho com Git Flow (criar feature e levar até `develop`) e descreve as bibliotecas importantes utilizadas.

## Requisitos

- Node.js 18 LTS ou superior (recomendo 18.x ou 20.x)
- npm (ou yarn/pnpm) — os exemplos abaixo usam npm
- Git

## Como rodar (desenvolvimento)

1. Instale dependências:

```powershell
npm install
```

2. Rode o servidor de desenvolvimento (Vite):

```powershell
npm run dev
```

3. Abra o navegador em http://localhost:5173 (o Vite mostrará a URL no terminal).

4. Para build de produção:

```powershell
npm run build
npm run preview
```

## Estrutura útil do projeto

- `src/` — código fonte React/TSX
  - `pages/` — páginas do site (ex.: `HomePage.tsx`, `edicao-2025/`)
  - `components/` — componentes reutilizáveis (UI)
- `public/` — arquivos estáticos (favicon, imagens, GIFs, vídeos)

Observação: a `Hero` da edição 2025 espera um GIF em `public/hero-2025.gif` (recomendado otimizar o GIF ou preferir WebP/MP4 para melhor performance).

## Bibliotecas importantes usadas

- react (v19) / react-dom — biblioteca base para UI.
- react-router-dom — roteamento (rotas: `/`, `/edicao-2025`, `/fotos`, `/parceiros`).
- vite — bundler / dev server rápido.
- typescript — tipagem estática.
- tailwindcss — utilitários CSS (o projeto usa classes Tailwind).
- @radix-ui/* — primitives acessíveis (dialog, dropdown, slot).
- lucide-react — ícones.
- clsx, class-variance-authority, tailwind-merge — utilitários para composição de classes.

Essas dependências estão listadas no `package.json` do projeto.

## Onde colocar o GIF do Hero (otimização)

- Coloque o arquivo em `public/hero-2025.gif`.
- Recomendações: reduzir o tamanho (preferível < 2MB), usar resolução adequada (ex.: 1920x1080) e considerar converter para WebP ou usar um MP4 curto para reduzir uso de banda.

## Git Flow — instalar e usar (Guia rápido)

Este projeto recomenda um fluxo de branches baseado em Git Flow (feature → develop → release → main). Abaixo explico como instalar o utilitário `git-flow` no Windows e a sequência de comandos para criar, trabalhar e finalizar uma feature.

### Inicializar git-flow no repositório

Abra o PowerShell na pasta do projeto:

```powershell
git flow init -d
```

O `-d` aceita as opções padrão (branch `main` como produção e `develop` como integração). Revise os nomes caso use outro padrão.

### Fluxo recomendado (exemplo para adicionar uma feature)

1) Crie a feature (ex: adicionar CTA no Hero):

```powershell
git flow feature start hero-cta
```

Isso criará uma branch local chamada `feature/hero-cta` baseada em `develop`.

2) Desenvolva localmente, adicione commits:

```powershell
# editar arquivos
git add .
git commit -m "feat(hero): adicionar CTA e background animado"
```

3) (Opcional e recomendado) Empurre a branch para o remoto para abrir PR/CI:

```powershell
git push -u origin feature/hero-cta
```

4) Quando a feature estiver pronta e revisada, finalize-a com git-flow (faz merge para `develop` e remove a branch local):

```powershell
git flow feature finish hero-cta
```

5) Empurre `develop` para o remoto:

```powershell
git push origin develop
```

Observações:
- `git flow feature finish` normalmente também cria um merge commit de `feature/xxx` em `develop` e remove a branch local; ele não apaga a branch remota automaticamente (se você tiver empurrado anteriormente, delete-a manualmente ou via UI do seu provedor após o merge).
- Em repositórios que usam Pull Requests, é comum criar a branch (`git flow feature start ...`), empurrar (`git push -u origin feature/...`) e abrir um PR para `develop`. Após aprovação e merge pelo PR, pode-se apagar a branch remota e atualizar `develop` local.

### Exemplo de fluxo alternativo (sem instalar git-flow)

```powershell
# criar branch a partir de develop
git checkout develop
git pull origin develop
git checkout -b feature/hero-cta

# desenvolver, commitar e empurrar para remoto
git add .
git commit -m "feat(hero): adicionar CTA"
git push -u origin feature/hero-cta

# abrir PR no GitHub/GitLab para merge em develop
```

Após merge do PR, atualize sua branch develop local:

```powershell
git checkout develop; git pull origin develop
```

## Boas práticas de commit e PR

- Use mensagens de commit no formato: `type(scope): descrição` (ex.: `feat(hero): adicionar CTA de ingressos`).
- Crie PRs pequenos e com descrição clara do que foi alterado.
- Marque reviewers e adicione screenshots quando relevante.

## Como adicionar uma nova feature (passo a passo rápido)

1. Atualize `develop` local: `git checkout develop; git pull origin develop`.
2. Crie a feature: `git flow feature start nome-da-feature` ou `git checkout -b feature/nome-da-feature`.
3. Implemente a feature, rode `npm run dev` localmente para testar.
4. Faça commits pequenos e descritivos.
5. Empurre a branch: `git push -u origin feature/nome-da-feature`.
6. Abra PR para `develop`. Depois de aprovado, faça merge.
7. Atualize `develop` local: `git checkout develop; git pull origin develop`.
