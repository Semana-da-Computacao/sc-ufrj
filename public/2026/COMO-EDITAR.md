# Como Editar a Programação 2026 (sem React)

Arquivo principal: `public/2026/evento-2026.json`

## Regras rápidas

1. Edite apenas valores entre aspas, números e listas.
2. Mantenha vírgulas e chaves (`{}` / `[]`) como estão.
3. Para criar nova sala, adicione um objeto em `tracks`.
4. Para criar nova atividade, adicione um objeto em `sessions`.
5. Link de inscrição oficial fica em `links.even3`.
6. Caminhos de GIF/imagens ficam em `assets`.
7. O arquivo oficial da página é `evento-2026.json`.

## Campos principais

- `hero`: textos da dobra inicial da página.
- `eventInfo`: data, local, status e resumo.
- `assets`: GIF de fundo e imagens da Hero.
- `sponsors`: patrocinadores por nível (tipo 1/2/3) + parceiros.
- `storySections`: seções com imagem + texto sobre o evento.
- `days`: agenda por dia.
- `tracks`: salas/auditório de cada dia.
- `sessions`: atividades de cada sala.
- `trail`: trilha da atividade (com ícone no canto do card).
- `presenters`: palestrantes da atividade (1 ou mais pessoas).

## Nomes sugeridos de mídia

- `public/2026/bg-hero.gif`
- `public/2026/hero-right.png`
- `public/2026/zombie-left.png`
- `public/2026/zombie-right.png`
- `public/2026/sponsors/*.png` (logos de patrocinadores e parceiros)

Guia completo: `public/2026/README.md`.

## Estrutura mínima de uma atividade

```json
{
  "time": "09:00",
  "endTime": "10:00",
  "title": "Título",
  "speaker": "Palestrante",
  "type": "Palestra",
  "trail": {
    "key": "webdev",
    "label": "WebDev"
  },
  "description": "Resumo curto",
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
}
```

`trail.key` aceitas: `ciencia-dados`, `dados`, `webdev`, `backend`, `frontend`, `ia`, `seguranca`, `cloud`, `carreira`.

## Estrutura de seção com imagem

```json
{
  "id": "sobre-edicao",
  "kicker": "A edição 2026",
  "title": "Título da seção",
  "description": "Texto da seção.",
  "imageUrl": "https://site.com/imagem.jpg"
}
```

## Estrutura de patrocinadores

```json
{
  "title": "Patrocinadores e Parceiros",
  "subtitle": "Texto opcional",
  "tiers": [
    {
      "type": 1,
      "label": "Patrocinador Master",
      "description": "Descrição opcional",
      "brands": [
        {
          "name": "Empresa",
          "logoUrl": "https://site.com/logo.png",
          "website": "https://site.com"
        }
      ]
    },
    {
      "type": 2,
      "label": "Patrocinador Gold",
      "brands": []
    },
    {
      "type": 3,
      "label": "Patrocinador Silver",
      "brands": []
    }
  ],
  "partners": [
    {
      "name": "Parceiro",
      "logoUrl": "https://site.com/parceiro.png",
      "website": "https://site.com"
    }
  ]
}
```

`type` aceitos: `1`, `2`, `3`.
