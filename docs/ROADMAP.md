# 🚀 ROADMAP DE DESENVOLVIMENTO: IA PLANO DE NEGÓCIOS (MVP)
_Versão revisada e corrigida_

---

## 📌 Visão Geral do Produto

SPA (Single Page Application) que transforma a criação de um plano de negócios
em uma conversa de chat estilo WhatsApp. O sistema se adapta ao nível de
maturidade do empreendedor através de dois modos (Organizador e Provocador) e
entrega, ao final, um painel financeiro interativo editável em tempo real e a
exportação do plano em PDF.

---

## 🗺️ FASE 1: Roteiro de Conversa (Back-end / Prompt)

### Pergunta Zero (Tela Inicial — Fixo na Interface)
O usuário escolhe o modo ANTES do chat iniciar:
- **[Modo Organizador]:** Para quem já tem o modelo e quer estruturar/validar.
- **[Modo Provocador]:** Para quem tem apenas a ideia e quer diretrizes e opções.

O modo escolhido é armazenado em variável JS na memória e injetado no
system prompt via replace de [MODO_PLACEHOLDER] antes da primeira chamada à API.

---

### META 1: Definição do Negócio e Localização
- **P1:** Qual é o produto ou serviço principal que você deseja vender?
- **P2:** Em qual cidade e bairro/região você pretende abrir o negócio?

**Comportamento pós-P2:**
- Organizador → Valida, resume e avança.
- Provocador → Sugere UM diferencial competitivo estimado para o setor/cidade
  (com disclaimer de estimativa baseada em dados de treinamento).

---

### META 2: Cliente-Alvo e Mercado
- **P3:** O seu foco de vendas será para Pessoas Físicas (B2C) ou Empresas (B2B)?
- **P4:** Quem você imagina que seja o cliente ideal dentro desse grupo?

**Comportamento pós-P4:**
- Organizador → Registra o perfil e avança.
- Provocador → Sugere nicho menos saturado com base na região informada
  (estimativa de conhecimento de treinamento).

---

### META 3: Estrutura Operacional e Custos
- **P5:** Quanto você estima precisar investir inicialmente
  (reforma, equipamentos, estoque inicial)?
- **P6:** Quanto estima de custo fixo mensal
  (aluguel, contas, pró-labore)?

**Se usuário responder "Não sei":**
A IA sugere valores médios de referência baseados em seu conhecimento,
com aviso explícito: "Esses são valores aproximados baseados em dados de
treinamento. Confirma que podemos usar como ponto de partida?"

---

### META 4: Precificação e Margem
- **P7:** Qual será o preço médio de venda do seu produto/serviço principal?
- **P8:** Qual é o custo variável estimado para produzir ou adquirir
  cada unidade (matéria-prima, taxas, comissões)?

**Comportamento Provocador:**
Antes de perguntar, sugere faixa de preço média estimada para concorrentes locais
e pergunta se o usuário quer se posicionar acima, abaixo ou na média.

---

### META 5: Volume de Vendas ⚡ (NOVA — necessária para cálculo do Payback)
- **P9:** Quantas unidades (ou atendimentos/vendas) você estima realizar
  por mês no início da operação?

**Comportamento pós-P9:**
- Organizador → Registra e aciona fechamento.
- Provocador → Valida se o volume é realista para o setor/região.
  Se muito otimista: "Para este tipo de negócio em fase inicial, uma estimativa
  conservadora costuma ser entre X e Y unidades/mês. Quer ajustar?"

---

### Gatilho de Fechamento (após resposta da P9)
A IA encerra o fluxo e exibe:
> "Excelente! Conseguimos juntar todas as informações e estruturar a base
> do seu plano de negócios. Acabo de calcular a viabilidade do seu projeto!
> Clique no botão abaixo para abrir o seu Painel de Gestão Interativo
> e gerar o PDF final do seu plano."

---

### ⚠️ Disclaimer de Estimativas (obrigatório no produto)
Todas as estimativas de preços de mercado, custos regionais e sugestões
de concorrentes são baseadas em dados de treinamento do modelo de IA e
devem ser usadas apenas como ponto de partida. Não substituem pesquisa
de mercado profissional.

---

## 📊 FASE 2: Painel de Gestão Interativo (Front-end)

Ao clicar no botão de fechamento, o chat é ocultado e o Dashboard é renderizado.

### Inputs Editáveis
Os campos são populados automaticamente via JSON de metadado extraído do chat:
- Investimento Inicial
- Custo Fixo Mensal
- Preço de Venda
- Custo Variável
- Volume Mensal Estimado

O usuário pode alterar qualquer valor diretamente — os cálculos atualizam
em tempo real via JavaScript puro (zero tokens gastos).

### As 4 Métricas de Ouro

```
Margem de Contribuição  = Preço de Venda − Custo Variável

Lucro Mensal Estimado   = (Margem de Contribuição × Volume Mensal)
                          − Custo Fixo Mensal

Ponto de Equilíbrio     = Custo Fixo Mensal ÷ Margem de Contribuição
(em unidades/mês)

Payback                 = Investimento Inicial ÷ Lucro Mensal Estimado
(em meses)
```

> ⚠️ Edge case: se Lucro Mensal ≤ 0, exibir mensagem
> "Negócio não atinge equilíbrio com esses números" em vez de Payback negativo.

### Exportação PDF
Botão que formata os dados do plano + métricas calculadas em PDF limpo.
Gerado client-side via JavaScript (sem custo de servidor).

---

## 🛠️ FASE 3: Arquitetura Técnica (MVP Econômico)

### Estrutura de Arquivos
```
PLANO DE NEGOCIO/
├── index.html          ← tela de seleção de modo + chat
├── css/
│   └── style.css
├── js/
│   ├── app.js          ← orquestra o fluxo geral e inicialização
│   ├── chat.js         ← renderização do chat + chamada à API
│   ├── parser.js       ← extrai JSON de metadado da resposta da IA
│   ├── painel.js       ← cálculos em tempo real + inputs editáveis
│   └── pdf.js          ← geração do PDF final
└── docs/               ← documentação do projeto
```

### Stack
- **Front-end:** HTML5, CSS3, JavaScript Vanilla (sem frameworks)
- **IA:** OpenRouter API (modelos free/low-cost no MVP)
- **Deploy:** Vercel (GitHub → deploy automático)
- **Persistência:** Sem banco de dados. Estado mantido em memória de sessão.

### Metadado JSON (contrato IA ↔ Frontend)
A IA inclui ao final de CADA resposta o bloco abaixo, interceptado e
removido pelo parser.js antes de exibir ao usuário:

```
---META_JSON---
{
  "meta_atual": <1|2|3|4|5>,
  "pergunta_atual": <1-9|"fechamento">,
  "status": <"em_andamento"|"concluido">,
  "dados": {
    "produto_servico": <string|null>,
    "cidade": <string|null>,
    "bairro_regiao": <string|null>,
    "tipo_cliente": <"B2C"|"B2B"|null>,
    "perfil_cliente_ideal": <string|null>,
    "investimento_inicial": <number|null>,
    "custo_fixo_mensal": <number|null>,
    "preco_venda": <number|null>,
    "custo_variavel": <number|null>,
    "volume_mensal_estimado": <number|null>
  }
}
---END_META---
```

### Otimização de Tokens
- System prompt injetado apenas na primeira chamada.
- Histórico completo de mensagens enviado a cada chamada (contexto necessário).
- Sem chamadas extras à API fora do fluxo de chat.

---

## 📈 FASE 4: Backlog Pós-MVP

- [ ] Sistema de login + persistência em banco de dados
- [ ] Edição retroativa de perguntas dentro do chat
- [ ] Módulo regulatório (alvarás, Simples Nacional, CNAE)
- [ ] Upgrade para modelo com web search real (pesquisa de mercado ao vivo)
- [ ] Histórico de planos salvos por usuário
