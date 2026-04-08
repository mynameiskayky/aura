# Design Foundations – Aura

## Objetivo

Transformar a referência visual enviada em fundação prática para o app do Aura, de forma que a implementação em `Expo SDK 55 + NativeWind` já nasça com identidade visual consistente.

Esta base deve governar:

- cores
- tipografia
- bordas e raios
- espaçamento
- densidade visual
- semântica dos tipos financeiros

---

## Leitura da Referência

A imagem define uma linguagem visual muito boa para o que queremos:

- fundo escuro com contraste alto;
- superfícies discretamente elevadas;
- acentos saturados e semânticos;
- densidade controlada;
- visual tátil e utilitário;
- tipografia forte e arredondada, sem parecer “fintech genérica”.

Isso conversa muito bem com o Aura.

O que devemos preservar:

1. escuro dominante;
2. contraste claro entre fundo e painel;
3. uso de cor como semântica, não decoração;
4. cards e superfícies com borda discreta;
5. tipografia pesada em títulos, métricas e tabs;
6. cantos arredondados amplos;
7. interface densa, mas legível.

---

## Princípios de UI

Os princípios da imagem devem virar regra:

1. clareza diária;
2. densidade controlada;
3. contraste alto;
4. feedback rápido;
5. semântica de cor consistente.

Tradução prática para o Aura:

1. o usuário precisa entender saldo, risco e categoria em menos de 2 segundos;
2. listas podem ser densas, mas nunca apertadas a ponto de parecer ruído;
3. vermelho, verde, laranja, rosa e roxo sempre significam a mesma coisa;
4. elementos ativos devem responder rápido com highlight, motion e haptic;
5. painéis e divisórias devem estruturar a leitura, não poluir a tela.

---

## Paleta Base

Extraída da referência:

- `Background`: `#1E1E1E`
- `Panel`: `#242424`
- `Accent`: `#FF6F2B`
- `Plan`: `#5CBF6B`
- `Consumed`: `#E86A00`
- `Reserve`: `#9BE30C`
- `Free Meal`: `#7B45F1`
- `Journal`: `#EC218B`
- `Amber Soft`: `#D7AA31`
- `Macro Blue`: `#4B9DFF`

---

## Mapeamento da Paleta para o Aura

Como o Aura tem outra semântica de produto, devemos reinterpretar as cores:

### Base

- `bg-app`: `#1E1E1E`
- `bg-panel`: `#242424`
- `bg-elevated`: `#2B2B2B`
- `border-subtle`: `rgba(255,255,255,0.08)`
- `border-strong`: `rgba(255,255,255,0.14)`
- `text-primary`: `#F5F5F5`
- `text-secondary`: `rgba(255,255,255,0.72)`
- `text-muted`: `rgba(255,255,255,0.42)`

### Semântica do produto

- `type-income`: `#5CBF6B`
- `type-fixed-expense`: `#E86A00`
- `type-daily`: `#EC218B`
- `type-saving`: `#9BE30C`
- `type-credit-card`: `#7B45F1`

### Estados auxiliares

- `accent-primary`: `#FF6F2B`
- `danger-balance`: `#8F1D22`
- `danger-balance-strong`: `#A32127`
- `warning-soft`: `#D7AA31`
- `info-soft`: `#4B9DFF`

---

## Regras de Uso de Cor

### Fundo e superfícies

- o fundo global deve permanecer no eixo `#1E1E1E`;
- cards e painéis usam `#242424` ou `#2B2B2B`;
- evitar gradientes exagerados na V1;
- vermelho deve aparecer apenas em risco, saldo negativo e alertas.

### Tipos financeiros

- `Entrada` usa verde médio;
- `Saída` usa laranja queimado;
- `Diário` usa rosa forte;
- `Economia` usa verde-limão;
- `Cartão` usa roxo.

### Interações

- item ativo na navegação: `accent-primary`;
- botão principal herda a cor do contexto quando fizer sentido;
- ícones desabilitados devem cair para cinza com opacidade reduzida.

---

## Tipografia

A referência usa `Avenir Next Rounded`.

Isso é ótimo conceitualmente, mas precisamos separar:

### Ideal visual

- fonte arredondada;
- títulos fortes;
- métricas com muito peso;
- labels pequenas em uppercase.

### Implementação prática no Expo

Temos três caminhos:

1. usar `Avenir Next Rounded` apenas no iOS e fallback no Android;
2. embutir uma fonte aproximada no projeto;
3. começar com fallback forte e trocar depois.

Recomendação:

- não bloquear a fase visual pela fonte exata;
- usar uma família arredondada próxima se necessário;
- manter a hierarquia tipográfica desde o início.

Se a fonte exata não for incorporada agora, a UI ainda deve seguir estas regras:

### Hierarquia

- `Hero`: `30–54 / 800`
- `Header`: `24–32 / 800`
- `Card title`: `18–22 / 800`
- `Body`: `15–16 / 500–700`
- `Overline`: `13–14 / 700 uppercase`
- `Tiny metrics`: `11–12 / 600`

### Aplicação no Aura

- mês e saldo hero: peso máximo;
- tabs e CTAs: semibold ou bold;
- listas e descrições: 15–16;
- labels superiores: overline pequena;
- números financeiros sempre com tracking estável e boa legibilidade.

---

## Espaçamento e Forma

Da referência:

- `Radius base`: `16`
- `Radius large`: `22–30`
- `Pill`: totalmente arredondado
- `Spacing`: `6, 10, 16, 20, 28`

Tradução prática:

### Raios

- `radius-sm`: `12`
- `radius-md`: `16`
- `radius-lg`: `24`
- `radius-xl`: `30`
- `radius-pill`: `999`

### Espaçamentos

- `space-1`: `6`
- `space-2`: `10`
- `space-3`: `16`
- `space-4`: `20`
- `space-5`: `28`

### Regras

- inputs e linhas de formulário: `radius-md`;
- bottom sheet: `radius-xl` no topo;
- botão principal: `radius-pill`;
- cards de análise: `radius-lg`;
- teclado numérico: cantos entre `16` e `20`.

---

## Componentes que Herdam Essas Foundations

## Header de mês

- fundo do app;
- tipografia pesada;
- setas discretas;
- ícones com contraste limpo.

## Tab bar

- fundo escuro;
- item ativo em `accent-primary`;
- FAB branco ou claro com contraste forte;
- labels pequenas e densas.

## Badge de tipo

- círculo sólido ou preenchido com cor semântica;
- variação desabilitada em cinza opaco;
- precisa funcionar em tamanho micro dentro da lista.

## Cards de Totais

- fundo `bg-panel`;
- borda sutil;
- título branco;
- valor destacado;
- subtítulo secundário.

## Bottom sheet

- fundo elevado;
- topo arredondado grande;
- sombra sutil;
- separadores discretos.

## Teclado numérico

- teclas grafite;
- texto branco;
- números grandes;
- labels secundárias minúsculas;
- botão de apagar com tratamento consistente.

---

## Tokens Propostos para Código

```ts
export const colors = {
  bgApp: '#1E1E1E',
  bgPanel: '#242424',
  bgElevated: '#2B2B2B',
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  textPrimary: '#F5F5F5',
  textSecondary: 'rgba(255,255,255,0.72)',
  textMuted: 'rgba(255,255,255,0.42)',

  accentPrimary: '#FF6F2B',
  typeIncome: '#5CBF6B',
  typeFixedExpense: '#E86A00',
  typeDaily: '#EC218B',
  typeSaving: '#9BE30C',
  typeCreditCard: '#7B45F1',

  dangerBalance: '#8F1D22',
  dangerBalanceStrong: '#A32127',
  warningSoft: '#D7AA31',
  infoSoft: '#4B9DFF',
}
```

```ts
export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
}
```

```ts
export const spacing = {
  1: 6,
  2: 10,
  3: 16,
  4: 20,
  5: 28,
}
```

---

## Decisão Visual para o Aura

O Aura deve usar essa referência como fundação, mas com estes ajustes:

1. manter o vermelho de saldo negativo mais dramático que na foundation;
2. preservar o laranja da navegação ativa dos prints;
3. usar o rosa apenas no tipo `Diário`;
4. manter o verde-limão da `Economia` bem vivo;
5. evitar azul como cor protagonista do produto.

Ou seja:

- a foundation ajuda a unificar o sistema visual;
- os prints continuam sendo a referência final de fidelidade.

---

## Regra de Implementação

Na fase visual, nada deve ser estilizado “na hora” sem obedecer a estas foundations.

Toda tela nova deve:

1. usar tokens centrais;
2. usar tipografia definida;
3. usar raios definidos;
4. respeitar semântica de cor;
5. evitar soluções visuais improvisadas.

Se fizermos isso desde o início, a UI cresce consistente e a reprodução dos prints fica muito mais fácil.
