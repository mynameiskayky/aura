# Saldos + Totais – Especificação Funcional

## Objetivo

Definir, com base na metodologia do produto, como tornar a tela `Saldos` realmente funcional e como a tela `Totais` deve sustentar isso com configuração de conta e leitura analítica correta.

Este documento não é sobre o visual.

É sobre:

- quais são as entradas obrigatórias do cálculo;
- quais números são configuráveis;
- quais números são derivados;
- como a linha do tempo diária deve ser construída;
- como `Totais` deve refletir a metodologia real.

---

## 1. Leitura da metodologia aplicada

Pelos documentos [PRD.md](/Users/mynameiskayky/Desktop/projects/aura/docs/PRD.md) e [METODOLOGIA.md](/Users/mynameiskayky/Desktop/projects/aura/docs/METODOLOGIA.md), o Aura não trabalha com “saldo histórico” puro.

O produto é uma máquina de projeção de fluxo de caixa futuro.

Os pilares funcionais relevantes são:

1. o saldo atual precisa ser exato;
2. o diário é uma cota fixa derivada de um valor mensal;
3. o cartão deve ser isolado;
4. a projeção acontece no tempo, dia a dia;
5. o resultado precisa gerar choque visual claro.

Conclusão:

- `Saldos` é a tela principal de projeção diária;
- `Totais` não é só dashboard, ele precisa expor os parâmetros que explicam a projeção;
- a configuração da conta influencia diretamente tudo.

---

## 2. O que precisa ser configurável

Se queremos que `Saldos` seja funcional de verdade, o sistema precisa de poucos inputs, mas eles precisam ser muito bem definidos.

## 2.1 Inputs obrigatórios da conta

### Saldo atual

Este é o valor real que o usuário tem hoje.

Exemplo:

- `R$ -19.389,54`

Sem isso, toda projeção fica falsa.

### Diário mensal planejado

Este é o orçamento variável do mês que o usuário aceita consumir para viver.

Exemplo:

- `R$ 1.600,00 por mês`

Daí nasce a cota diária.

### Cota diária derivada

Pela metodologia, ela vem do valor mensal dividido por `30`.

Exemplo:

- `R$ 1.600 / 30 = R$ 53,33`

Isto é importante:

- o usuário configura o valor mensal;
- o sistema calcula o diário;
- o diário não deve ser digitado manualmente como valor primário.

### Data âncora

O sistema precisa saber a data de referência da projeção:

- hoje;
- ou uma data manual de início.

### Horizonte de projeção

Quanto à frente o sistema deve calcular:

- mínimo: `6 meses`
- ideal: `12 meses`
- avançado: `24 meses`

## 2.2 Inputs financeiros adicionais

### Entradas recorrentes

- salário
- comissão
- vale
- renda extra previsível

### Saídas fixas recorrentes

- aluguel
- internet
- escola
- academia
- boletos

### Cartão

- faturas futuras
- parcelas
- compras parceladas já assumidas

### Economia

- aportes planejados
- reservas automáticas

### Gastos diários reais

- lançamentos feitos no dia a dia

---

## 3. O que NÃO é configurável

Alguns números não devem ser editáveis, porque são derivados.

## 3.1 Média de gasto diário

Isso não é configuração.

É métrica calculada.

Fórmula recomendada:

`total de gastos reais do tipo Diário no período / número de dias com gasto ou número de dias decorridos`

Aqui existem duas leituras úteis:

1. média real por dia decorrido do mês;
2. média real apenas dos dias em que houve gasto.

Para a V1, a melhor é:

- `média real por dia decorrido no mês`

porque ela conversa melhor com o orçamento diário.

## 3.2 Performance

Também é derivada.

## 3.3 Custo de vida

Também é derivado.

## 3.4 Saldo diário projetado

Também é derivado.

---

## 4. O que a tela Saldos precisa fazer de verdade

Hoje ela é visual.

Para ficar funcional, ela precisa ser alimentada por uma engine diária.

## 4.1 Responsabilidade da tela

Para cada dia do período exibido, `Saldos` precisa mostrar:

1. os eventos reais daquele dia;
2. o diário real ou projetado;
3. o saldo acumulado ao final do dia;
4. o nível de risco.

## 4.2 Estrutura de cálculo por dia

Para cada dia `D`, calcular:

`saldo_fechamento(D) = saldo_fechamento(D-1) + entradas_reais(D) - saidas_fixas(D) - diario_real_ou_projetado(D) - economia(D) - cartao(D)`

Onde:

- `entradas_reais(D)` = soma de `K`
- `saidas_fixas(D)` = soma de `↗`
- `diario_real_ou_projetado(D)` = ver regra abaixo
- `economia(D)` = soma de `E`
- `cartao(D)` = soma de `C`

## 4.3 Regra do Diário

Essa é a regra mais importante do produto.

### Se houve gasto diário real no dia

Usar o valor real lançado em `D`.

Exemplo:

- o usuário gastou `R$ 31,90`
- a linha do dia mostra `D = R$ 31,90`

### Se NÃO houve gasto diário real no dia

O sistema injeta o valor do diário projetado.

Exemplo:

- diário configurado = `R$ 53,33`
- não houve gasto lançado
- a linha mostra `D = R$ 53,33 (projetado)`

### Observação crítica

O valor projetado não deve virar transação real.

Ele precisa ser marcado como:

- `isProjected = true`

Senão o sistema confunde previsão com fato.

## 4.4 Ordem de exibição das tipologias no dia

Sempre:

1. `K`
2. `↗`
3. `D`
4. `E`
5. `C`

Mesmo quando vazias.

## 4.5 Faixas de risco do saldo

A metodologia fala em verde, amarelo e vermelho.

Sugestão:

- `safe`: saldo > limite de alerta
- `warning`: saldo entre `0` e limite de alerta
- `danger`: saldo < 0

O limite de alerta pode ser:

- configurável na conta;
- ou calculado como 3 dias de diário.

Para a V1:

- usar um valor configurável simples.

---

## 5. O que Totais precisa fazer de verdade

`Totais` hoje está desenhada como dashboard.

Funcionalmente, ela precisa ter dois papéis:

1. explicar o mês atual;
2. expor e resumir as configurações que sustentam a projeção.

## 5.1 Separar em dois blocos

### Bloco A: Conta e parâmetros

Esse bloco mostra os inputs que governam a projeção.

Deve exibir:

1. saldo atual
2. diário mensal configurado
3. cota diária calculada
4. período de projeção
5. atalho para editar configuração

### Bloco B: Leitura analítica do mês

Esse bloco mostra:

1. performance
2. economizado
3. custo de vida
4. diário médio
5. movimentações do mês

## 5.2 O que deve ser editável em Totais

Minha recomendação:

- `Totais` pode exibir e dar atalho para editar;
- o formulário real de edição deve estar numa tela/modal própria de `Configuração da conta`.

Motivo:

- o dashboard não deve virar formulário gigante;
- a metodologia pede clareza, não mistura de leitura com edição extensa.

Então o melhor modelo é:

### Totais mostra

- “Saldo atual: R$ X”
- “Diário do mês: R$ Y”
- “Cota diária: R$ Z”
- botão `Editar conta`

### Tela/Sheet de Configuração da Conta permite editar

- saldo atual
- diário mensal
- limite de alerta
- horizonte

## 5.3 Média de gasto diário em Totais

Você citou especificamente:

- “como que é a minha média de gasto diário”

Isso deve existir como card próprio.

Mas com semântica correta:

### Diário médio

- valor real médio gasto em `D`
- comparado contra a cota diária alvo

Formato recomendado:

- `R$ 61,20 / R$ 53,33`

Subtexto:

- `Acima do diário`
- ou `Dentro do diário`

---

## 6. Proposta de domínio mínimo para implementar agora

Para tornar `Saldos` funcional sem overengineering, o mínimo necessário é:

## 6.1 AccountConfig

```ts
type AccountConfig = {
  currentBalanceCents: number;
  monthlyDailyBudgetCents: number;
  dailyBudgetCents: number;
  warningThresholdCents: number;
  projectionMonths: number;
  anchorDate: string;
};
```

## 6.2 FinancialEntry

```ts
type FinancialEntry = {
  id: string;
  type: 'income' | 'fixed_expense' | 'daily_expense' | 'saving' | 'credit_card';
  amountCents: number;
  effectiveDate: string;
  description?: string;
  isProjected?: boolean;
  recurrence?: RecurrenceRule | null;
};
```

## 6.3 DailyLedgerRow

```ts
type DailyLedgerRow = {
  date: string;
  day: number;
  types: [
    DayTypeAmount,
    DayTypeAmount,
    DayTypeAmount,
    DayTypeAmount,
    DayTypeAmount,
  ];
  openingBalanceCents: number;
  closingBalanceCents: number;
  riskLevel: 'safe' | 'warning' | 'danger';
};
```

## 6.4 MonthlyTotals

```ts
type MonthlyTotals = {
  incomeCents: number;
  fixedExpenseCents: number;
  dailyExpenseRealCents: number;
  dailyExpenseProjectedCents: number;
  savingCents: number;
  creditCardCents: number;
  performanceCents: number;
  economizedRatio: number;
  costOfLifeCents: number;
  averageDailySpendCents: number;
  dailyBudgetTargetCents: number;
};
```

---

## 7. Fluxo funcional recomendado

## 7.1 Primeiro uso

O usuário precisa preencher:

1. saldo atual
2. diário mensal
3. data de início

Depois disso, o app já consegue gerar `Saldos`.

## 7.2 Cadastro de movimentações

Cada lançamento afeta a projeção.

Fluxo:

1. usuário lança movimentação;
2. banco local salva;
3. engine recalcula o mês atual e os meses seguintes;
4. `Saldos`, `Totais` e `Horizonte` atualizam.

## 7.3 Configuração de conta

Se o usuário muda:

- saldo atual
- diário mensal
- limite de alerta

Então:

1. recalcular a linha do tempo a partir da data âncora;
2. invalidar snapshots mensais;
3. atualizar cards de `Totais`.

---

## 8. Fórmulas que precisam ser implementadas

## 8.1 Cota diária

`dailyBudgetCents = monthlyDailyBudgetCents / 30`

Arredondar em centavos.

## 8.2 Performance do mês

`performance = income - fixed_expense - daily_real - saving - credit_card - daily_projected_remaining`

## 8.3 Economizado

`economized = saving / income`

Se `income = 0`, resultado deve ser `0`.

## 8.4 Custo de vida

`costOfLife = fixed_expense + daily_real + credit_card + daily_projected_remaining`

## 8.5 Diário médio

Sugestão de V1:

`averageDailySpend = daily_real_total / daysElapsedInMonth`

## 8.6 Diário projetado restante do mês

`remainingProjected = remainingDaysWithoutRealDailySpend * dailyBudgetCents`

---

## 9. Gaps no código atual

Hoje existe um desalinhamento técnico que precisa ser corrigido antes de implementar a lógica:

## 9.1 Tipo da tela Saldos vs screen atual

Em [src/core/types/index.ts](/Users/mynameiskayky/Desktop/projects/aura/src/core/types/index.ts), `DailyBalanceRow` usa:

- `types`

Mas em [app/(tabs)/saldos.tsx](/Users/mynameiskayky/Desktop/projects/aura/app/(tabs)/saldos.tsx), a screen ainda tenta ler:

- `item.entries`

Isso precisa ser alinhado.

## 9.2 Totais ainda usa mock desacoplado da metodologia

Hoje [src/mocks/totals.ts](/Users/mynameiskayky/Desktop/projects/aura/src/mocks/totals.ts) é estático.

Precisa passar a ser derivado da mesma engine que alimenta `Saldos`.

## 9.3 Falta entidade de configuração de conta

Ainda não existe uma estrutura explícita para:

- saldo atual;
- diário mensal;
- cota diária;
- média diária;
- thresholds.

Isso precisa nascer agora.

---

## 10. Melhor forma de implementar

## Etapa 1 – Criar o domínio

Criar:

1. `AccountConfig`
2. `FinancialEntry`
3. `DailyLedgerRow`
4. `MonthlyTotals`

## Etapa 2 – Criar engine pura

Criar funções:

1. `computeDailyBudget`
2. `expandEntriesForRange`
3. `buildDailyLedger`
4. `buildMonthlyTotals`
5. `computeRiskLevel`

## Etapa 3 – Ligar Saldos

Substituir mock fixo por:

- config + entries -> ledger diário

## Etapa 4 – Ligar Totais

Substituir mock fixo por:

- config + ledger -> resumo mensal

## Etapa 5 – Criar Configuração da Conta

Criar tela ou modal com:

1. saldo atual
2. diário mensal
3. cota diária calculada
4. limite de alerta
5. horizonte

## Etapa 6 – Persistir localmente

SQLite depois que a lógica estiver correta.

---

## 11. Recomendação final

Para o Aura seguir corretamente a metodologia:

1. `Saldos` deve ser a verdade operacional do produto;
2. `Totais` deve mostrar análise + resumo dos parâmetros da conta;
3. `saldo atual` e `diário mensal` são inputs configuráveis;
4. `média de gasto diário` é output calculado, nunca input;
5. a mesma engine deve alimentar `Saldos`, `Totais` e `Horizonte`.

Se fizermos isso, o app para de ser uma coleção de telas visuais e passa a executar a metodologia real.
