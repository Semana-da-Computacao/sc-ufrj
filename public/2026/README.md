# Edição 2026 - Guia de Configuração

Esta pasta concentra tudo que a página `/2026` precisa para funcionar sem editar React.

## Arquivos principais

- `evento-2026.json`: configuração ativa usada pela página.
- `modelo-evento.json`: modelo base para copiar e preencher.
- `COMO-EDITAR.md`: instruções rápidas de edição.

## Mídias da Hero

Salve os arquivos dentro de `public/2026/` com os nomes abaixo:

1. `bg-hero.gif`: fundo animado da Hero (pode ser URL externa).
2. `hero-right.png`: imagem lateral da Hero.
3. `zombie-left.png`: zumbi lateral esquerdo (PNG com transparência).
4. `zombie-right.png`: zumbi lateral direito (PNG com transparência).

A página lê esses nomes via campo `assets` do JSON.

## Mídias de patrocinadores

Use logos em PNG dentro de `public/2026/sponsors/`.

Exemplo:

- `2026/sponsors/nvidia-mock.png`
- `2026/sponsors/google-cloud-mock.png`

## Campo `assets` no JSON

```json
"assets": {
  "heroFallbackGif": "2026/bg-hero.gif",
  "heroRightImage": "2026/hero-right.png",
  "zombieLeft": "2026/zombie-left.png",
  "zombieRight": "2026/zombie-right.png"
}
```

`heroFallbackGif` aceita caminho local e URL externa (`https`).

## Fluxo recomendado

1. Use `modelo-evento.json` como referência de estrutura.
2. Edite `evento-2026.json` com os dados finais.
3. Ajuste textos, links, programação (`days`) e mídias (`assets`).
4. Publique o site.

## Programação dinâmica

- Cada item em `days` cria uma aba de dia.
- Cada item em `tracks` cria uma coluna de ambiente (auditório/sala/lab).
- Cada item em `sessions` cria um card de atividade.
- Cada sessão pode ter `presenters` com foto e redes sociais opcionais.
- Cada sessão pode ter `trail` com ícone no canto do card para identificar a trilha.
- `storySections` cria seções visuais com imagem + texto sobre o evento.

Ou seja: aumentou o número de salas no JSON, a interface se adapta automaticamente.

## Patrocinadores e parceiros

A seção aparece logo após a Hero e é totalmente dinâmica via `sponsors`.

```json
"sponsors": {
  "title": "Patrocinadores e Parceiros",
  "subtitle": "Texto de apoio",
  "tiers": [
    {
      "type": 1,
      "label": "Patrocinador Master",
      "description": "Maior destaque",
      "brands": [
        {
          "name": "Empresa",
          "logoUrl": "https://site.com/logo.png",
          "website": "https://site.com"
        }
      ]
    }
  ],
  "partners": [
    {
      "name": "Instituição Parceira",
      "logoUrl": "https://site.com/parceiro.png",
      "website": "https://site.com"
    }
  ]
}
```

Regras:

- `type: 1` tem o maior destaque visual.
- `type: 2` tem destaque intermediário.
- `type: 3` tem destaque complementar.
- `partners` são exibidos todos no mesmo tamanho.

## Arquivo oficial

O arquivo usado pela página é:

- `public/2026/evento-2026.json`

## Palestrantes por sessão

Use este formato dentro de cada item em `sessions`:

```json
"presenters": [
  {
    "name": "Nome completo",
    "role": "Cargo/função",
    "photoUrl": "https://site.com/foto.jpg",
    "socials": {
      "lattes": "http://lattes.cnpq.br/0000000000000000",
      "linkedin": "https://www.linkedin.com/in/usuario/",
      "instagram": "https://www.instagram.com/usuario/",
      "email": "nome@dominio.com"
    }
  }
]
```

Todos os campos em `socials` são opcionais.  
`photoUrl` também é opcional e pode ser link externo (não precisa salvar a imagem no projeto).

## Trilhas com ícone no card

Use este formato em cada `session`:

```json
"trail": {
  "key": "webdev",
  "label": "WebDev"
}
```

Chaves disponíveis de ícone:

- `ciencia-dados`
- `dados`
- `webdev`
- `backend`
- `frontend`
- `ia`
- `seguranca`
- `cloud`
- `carreira`

## Seções visuais com imagem

Use este formato para criar blocos narrativos entre as seções da página:

```json
"storySections": [
  {
    "id": "sobre-edicao",
    "kicker": "A edição 2026",
    "title": "Título da seção",
    "description": "Texto da seção.",
    "imageUrl": "https://site.com/imagem.jpg"
  }
]
```

`imageUrl` pode ser caminho local (`2026/minha-imagem.png`) ou URL externa (`https`).
