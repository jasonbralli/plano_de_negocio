# IA Plano de Negócios

Aplicação web estática (HTML + CSS + JS vanilla) que ajuda o empreendedor a estruturar e validar uma ideia de negócio: conversa guiada por chat, painel financeiro interativo e exportação em PDF. Sem backend, sem build — é só abrir no navegador.

## Funcionalidades

- **Modo Organizador** — você já sabe o que quer; o app estrutura e valida a ideia.
- **Modo Provocador** — você tem só a ideia; o app guia com referências e opções.
- **Chat orquestrador** — coleta as respostas e monta o plano.
- **Painel de Gestão Interativo** — métricas de viabilidade calculadas na hora:
  - Margem de contribuição
  - Lucro mensal estimado
  - Ponto de equilíbrio (unidades/mês)
  - Payback (meses)
- **Exportação em PDF** do plano.

## Como usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/jasonbralli/plano_de_negocio.git
   ```
2. Abra o arquivo `index.html` no navegador (duplo clique basta).
3. Escolha o modo, responda ao chat e preencha o painel financeiro.

> Nenhuma dependência, nenhum servidor, nenhum dado sai do seu navegador.

## Estrutura

```
├── index.html   # 3 telas: seleção de modo, chat, painel financeiro
├── css/
│   └── style.css
├── js/
│   ├── app.js     # orquestração das telas
│   ├── chat.js    # lógica do chat guiado
│   ├── parser.js  # parser dos metadados do plano
│   ├── painel.js  # cálculos do painel financeiro
│   └── pdf.js     # geração do PDF
└── docs/
    ├── ROADMAP.md
    ├── System Prompt.txt
    ├── Fórmulas do Painel.txt
    └── ROADMAP_ORIGINAL.docx
```

## Fórmulas do painel

Detalhes em [`docs/Fórmulas do Painel.txt`](docs/Fórmulas%20do%20Painel.txt). Resumo:

- Margem de contribuição = preço − custo variável
- Lucro mensal = (margem × volume) − custo fixo
- Ponto de equilíbrio = custo fixo ÷ margem
- Payback = investimento inicial ÷ lucro mensal

## Roadmap

Ver [`docs/ROADMAP.md`](docs/ROADMAP.md).
