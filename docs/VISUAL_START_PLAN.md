# Plano de Start Visual – Aura

## Objetivo

Subir o projeto do Aura com foco em `visual first`, reproduzindo o máximo possível dos prints de referência antes de implementar o motor financeiro real.

Escopo desta fase:

- `Expo SDK 55`
- `React Native`
- `NativeWind`
- `Supabase` apenas preparado, sem depender dele para a UI
- telas com dados mockados
- navegação, layout, tokens visuais e componentes principais

Fora do escopo desta fase:

- regras matemáticas finais
- persistência real
- sincronização
- autenticação completa
- cálculos financeiros corretos

O objetivo aqui é ter um app navegável, convincente e muito próximo da referência.

---

## Resultado Esperado

Ao final desta fase, o projeto deve ter:

1. tab bar inferior igual à referência com FAB central;
2. tela `Saldos` visualmente funcional;
3. tela `Totais` visualmente funcional;
4. bottom sheet `Adicionar`;
5. formulário de lançamento com teclado numérico customizado;
6. tela `Tags`;
7. tela `Menu`;
8. tela `Horizonte de saldos`;
9. tema escuro, tipografia, cores e espaçamentos padronizados;
10. tudo alimentado por mocks locais.

---

## Estratégia

A ordem correta é:

1. infraestrutura do app;
2. design system;
3. navegação principal;
4. componentes reutilizáveis;
5. telas mockadas;
6. refinamento visual;
7. preparação para dados reais.

Não começar pela lógica financeira.

Se começar pelos cálculos agora, a UI vai atrasar e o visual perde consistência.

---

## Stack da Fase Visual

- `expo@55`
- `expo-router`
- `nativewind`
- `react-native-reanimated`
- `react-native-gesture-handler`
- `@gorhom/bottom-sheet`
- `zustand` apenas para estado de UI
- `lucide-react-native` ou ícones equivalentes
- `expo-blur` apenas se necessário
- `expo-haptics` para feedback do teclado/FAB
- `@shopify/flash-list` para listas visuais densas

Supabase nesta fase:

- configurar cliente e `.env`
- não bloquear a UI por backend
- deixar integração real para a fase seguinte

---

## Estrutura Recomendada

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    saldos.tsx
    totais.tsx
    tags.tsx
    menu.tsx
  add/
    index.tsx
  horizon/
    index.tsx

src/
  components/
    ui/
    navigation/
    finance/
    sheets/
    forms/
  theme/
    colors.ts
    spacing.ts
    typography.ts
    tokens.ts
  mocks/
    balances.ts
    totals.ts
    tags.ts
    menu.ts
    horizon.ts
  features/
    saldos/
    totais/
    tags/
    menu/
    add-transaction/
    horizon/
  lib/
    supabase.ts
  stores/
    ui-store.ts
```

---

## Fase 1 – Bootstrap do Projeto

### Passo 1. Criar o app Expo

Objetivo:

- começar com base limpa e tipada.

Checklist:

1. criar app com template TypeScript;
2. ativar Expo Router;
3. configurar aliases;
4. configurar estrutura inicial de pastas.

Entregável:

- app abre com roteamento funcionando.

### Passo 2. Instalar dependências visuais

Objetivo:

- instalar apenas o necessário para a fase visual.

Checklist:

1. NativeWind;
2. Reanimated;
3. Gesture Handler;
4. Bottom Sheet;
5. FlashList;
6. ícones;
7. Haptics;
8. Supabase client.

Entregável:

- projeto compilando sem warnings críticos.

### Passo 3. Configurar NativeWind

Objetivo:

- garantir styling previsível desde o início.

Checklist:

1. preset/configuração do NativeWind;
2. arquivo global de estilos;
3. tokens semânticos;
4. classes utilitárias mínimas.

Entregável:

- componentes conseguem usar classes com tema centralizado.

---

## Fase 2 – Design System Base

### Passo 4. Criar tokens do tema escuro

Objetivo:

- replicar a linguagem visual dos prints.

Tokens obrigatórios:

- fundo principal quase preto;
- superfície grafite;
- borda discreta;
- texto principal branco;
- texto secundário cinza;
- verde de entrada;
- laranja de saída;
- rosa do diário;
- verde-limão da economia;
- roxo do cartão;
- vermelho de saldo negativo;
- laranja ativo da tab bar.

Entregável:

- arquivo único com tokens reutilizáveis.

### Passo 5. Definir tipografia e escala

Objetivo:

- evitar aparência genérica.

Criar estilos para:

1. hero money;
2. título de tela;
3. subtítulo;
4. label pequena;
5. texto de célula;
6. texto de menu;
7. texto de botão.

Entregável:

- tipografia consistente entre telas.

### Passo 6. Criar componentes primitivos

Objetivo:

- impedir repetição visual nas telas.

Criar:

1. `Screen`
2. `HeaderBar`
3. `SectionTitle`
4. `Divider`
5. `IconBadge`
6. `AmountText`
7. `PrimaryButton`
8. `ListItemRow`
9. `SearchField`
10. `Pill`

Entregável:

- base visual pronta para montar qualquer tela do app.

---

## Fase 3 – Navegação Principal

### Passo 7. Construir tab bar customizada

Objetivo:

- reproduzir a barra inferior dos prints.

Características:

1. quatro abas visíveis;
2. botão central flutuante com `+`;
3. item ativo em laranja;
4. fundo escuro;
5. labels curtas;
6. sem aparência padrão do sistema.

Entregável:

- navegação principal muito próxima da referência.

### Passo 8. Configurar rotas

Rotas da fase:

1. `Saldos`
2. `Totais`
3. `Tags`
4. `Menu`
5. `Adicionar`
6. `Horizonte de saldos`

Entregável:

- todas as telas acessíveis e encadeadas corretamente.

---

## Fase 4 – Componentes Visuais do Domínio

### Passo 9. Criar badges dos tipos financeiros

Tipos:

1. Entrada
2. Saída
3. Diário
4. Economia
5. Gasto com cartão

Cada tipo deve ter:

- cor;
- ícone/letra;
- estado ativo;
- estado desabilitado;
- variação pequena e grande.

Entregável:

- sistema visual dos 5 tipos padronizado.

### Passo 10. Criar header de mês

Objetivo:

- replicar o cabeçalho dos prints.

Elementos:

1. botão calendário à esquerda;
2. navegação de mês com setas;
3. título central `Nov/26`, `Dez/26`;
4. botão grid à direita.

Entregável:

- cabeçalho reutilizável em `Saldos`, `Totais` e `Tags`.

### Passo 11. Criar teclado numérico customizado

Objetivo:

- copiar o visual do formulário de lançamento.

Elementos:

1. teclas grandes;
2. grid 1-9;
3. zero central;
4. backspace;
5. labels pequenas de letras;
6. espaçamento e cantos próximos ao print.

Entregável:

- componente isolado e reutilizável.

### Passo 12. Criar bottom sheet de adicionar

Objetivo:

- abrir a partir do FAB central.

Elementos:

1. título `Adicionar`;
2. botão de fechar;
3. lista com os 5 tipos;
4. subtítulos explicativos;
5. cantos arredondados;
6. fundo escuro elevado.

Entregável:

- sheet funcional com transição suave.

---

## Fase 5 – Montagem das Telas

### Passo 13. Tela `Saldos`

Objetivo:

- reproduzir a tela principal da referência.

Elementos:

1. header de mês;
2. barra de filtros superior;
3. coluna `Dia`;
4. coluna central de lançamentos;
5. coluna `Saldos`;
6. células vermelhas no saldo negativo;
7. linhas divisórias sutis;
8. dados mockados para vários dias.

Checklist de fidelidade:

1. contraste forte;
2. coluna vermelha dominante;
3. ícones cinzas para estados vazios;
4. valor de diário em rosa;
5. visual denso, sem parecer card moderno genérico.

Entregável:

- tela mais importante praticamente pronta do ponto de vista visual.

### Passo 14. Tela `Totais`

Objetivo:

- reproduzir o dashboard analítico dos prints.

Elementos:

1. header de mês;
2. título `Cálculos do mês`;
3. cards/list rows para `Performance`, `Economizado`, `Custo de vida`, `Diário médio`;
4. mini sequência de tipos coloridos;
5. seção `Movimentações do mês`.

Entregável:

- tela com boa leitura, sem lógica real ainda.

### Passo 15. Tela `Adicionar > formulário`

Objetivo:

- reproduzir o print do formulário com valor e teclado.

Elementos:

1. valor grande no topo;
2. botão fechar;
3. seletor do tipo;
4. linhas de `Descrição`, `Data`, `Não repete`, `Tags`;
5. botão verde largo;
6. teclado numérico customizado na base.

Entregável:

- fluxo visual completo do add.

### Passo 16. Tela `Tags`

Objetivo:

- reproduzir listagem de tags.

Elementos:

1. header de mês;
2. título `Tags`;
3. ações no topo;
4. campo de busca;
5. lista alfabética de tags;
6. quadrado colorido à esquerda;
7. valor à direita.

Entregável:

- tela visualmente próxima da referência.

### Passo 17. Tela `Menu`

Objetivo:

- reproduzir a tela de conta/configurações.

Elementos:

1. nome e e-mail;
2. pill `Assinatura ativa`;
3. lista de opções com ícones;
4. chevron à direita;
5. tab bar ativa em `Menu`.

Entregável:

- tela estável e elegante.

### Passo 18. Tela `Horizonte de saldos`

Objetivo:

- reproduzir a visualização macro.

Elementos:

1. header com voltar;
2. título `Horizonte de saldos`;
3. grade com meses em colunas;
4. dias na lateral;
5. células vermelhas;
6. valores abreviados tipo `-13.6K`.

Entregável:

- tela macro forte, mesmo com dados fake.

---

## Fase 6 – Dados Mockados

### Passo 19. Criar mocks específicos por tela

Objetivo:

- não misturar mocks soltos dentro dos componentes.

Criar arquivos:

1. `mocks/balances.ts`
2. `mocks/totals.ts`
3. `mocks/tags.ts`
4. `mocks/menu.ts`
5. `mocks/horizon.ts`

Regras:

1. nomes consistentes;
2. dados suficientes para scroll;
3. casos positivos e negativos;
4. valores realistas.

Entregável:

- telas podem evoluir sem depender de backend.

---

## Fase 7 – Refinamento Visual

### Passo 20. Ajustar microdetalhes

Objetivo:

- sair de “parecido” para “muito próximo”.

Revisar:

1. margens;
2. altura de linha;
3. alinhamentos;
4. pesos de fonte;
5. raios de borda;
6. espessura de divisórias;
7. tamanhos de ícones;
8. contraste do vermelho;
9. brilho do laranja ativo.

Entregável:

- app com aparência premium e específica.

### Passo 21. Adicionar motion mínima

Objetivo:

- melhorar sensação de qualidade sem exagero.

Aplicar:

1. abertura do FAB;
2. entrada do bottom sheet;
3. mudança de aba;
4. foco do teclado;
5. feedback tátil em ações principais.

Entregável:

- interface mais viva e nativa.

---

## Fase 8 – Preparação para Próxima Etapa

### Passo 22. Deixar pontos de integração prontos

Objetivo:

- não refazer a UI depois.

Preparar interfaces para:

1. dados reais da timeline;
2. engine de cálculo;
3. banco local;
4. Supabase;
5. auth;
6. settings reais.

Entregável:

- telas prontas para receber dados reais com mínimo retrabalho.

---

## Ordem Exata de Execução

Seguir nesta ordem:

1. bootstrap Expo 55
2. instalar libs
3. configurar NativeWind
4. criar tokens
5. criar primitives
6. criar tab bar custom
7. criar header de mês
8. criar badges dos tipos
9. criar keyboard numérico
10. criar bottom sheet
11. montar `Saldos`
12. montar `Totais`
13. montar `Adicionar`
14. montar `Tags`
15. montar `Menu`
16. montar `Horizonte`
17. conectar mocks
18. refinamento visual
19. preparar integração futura

Não inverter isso.

---

## Critérios de Pronto da Fase Visual

A fase está pronta quando:

1. o app abre direto nas tabs;
2. todas as telas dos prints existem;
3. a navegação entre elas funciona;
4. o FAB abre o fluxo de adicionar;
5. o teclado custom funciona visualmente;
6. o layout não parece template genérico de Expo;
7. o visual está consistente entre todas as telas;
8. os dados mockados sustentam demo e validação interna;
9. a base já aceita substituição por dados reais sem reescrita grande.

---

## O que vem depois

Quando esta fase terminar, a próxima deve ser:

1. schema local;
2. estado real de tela;
3. engine de projeção;
4. settings reais;
5. Supabase auth;
6. sync.

Primeiro provar a interface.
Depois conectar o cérebro do produto.
