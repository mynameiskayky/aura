# Product Requirements Document (PRD) – Aura: Previsibilidade Financeira

## 1. Visão Geral da Interface e UX
A interface do aplicativo adota um **Dark Mode nativo e de alto contraste**. Esta não é uma escolha puramente estética; o fundo escuro (tons de preto e cinza chumbo) serve para destacar violentamente as cores semânticas do método, especialmente o vermelho (caixa negativo) e o verde (caixa positivo). A carga cognitiva é reduzida ao extremo: não há gráficos de pizza complexos, apenas tipografia forte, listas e ícones semânticos.

---

## 2. Padrão Semântico de Lançamentos (Core Data Models)
Todo o sistema é regido por 5 entidades principais de transação, cada uma com um ícone, letra e cor estrita. Esta taxonomia deve ser espelhada na sua modelagem de dados no SwiftData:

*   🟢 **[ K ] Entrada (Verde):** Salários, comissões, vales. Soma no fluxo de caixa.
*   🟠 **[ ↗ ] Saída (Laranja):** Gastos fixos, boletos, aluguel. Subtrai do fluxo de caixa.
*   🔴 **[ D ] Diário (Rosa Escuro/Vermelho):** Gastos variáveis e compras do dia a dia.
*   🟢 **[ E ] Economia (Verde Claro):** Reservas e investimentos. Dinheiro que sai da conta corrente, mas não é um "gasto".
*   🟣 **[ C ] Gasto com Cartão (Roxo):** Compras parceladas ou total da fatura.

---

## 3. Arquitetura de Navegação (Bottom Navigation Bar)
O aplicativo possui uma navegação principal inferior em 5 abas:
1.  **Saldos (Ícone de Tabela):** A linha do tempo principal (visão diária).
2.  **Totais (Ícone de Calculadora):** O dashboard analítico e matemático do mês.
3.  **Botão Central FAB (+):** Gatilho universal para inserção de dados.
4.  **Tags (Ícone de Etiqueta):** Gerenciamento e agrupamento de categorias customizadas.
5.  **Menu (Ícone de Hambúrguer):** Configurações, perfil e setup do método.

---

## 4. Mapeamento das Telas e Funcionalidades

### Épico 1: A Linha do Tempo Diária (Aba "Saldos")
Esta é a tela principal de uso diário.
*   **Header:** Permite navegação entre os meses (ex: `< Dez/26 >`), ícone para voltar ao dia atual (calendário com dia 8) e um ícone de Grid para alternar para a visão macro.
*   **Listagem (Data Grid):**
    *   **Coluna Esquerda (Dia):** Numeração de 1 a 31.
    *   **Coluna Central (Lançamentos):** Exibe as tipologias (K, ↗, D, E, C). Ícones sem valor no dia ficam em estado desabilitado (cinza e opaco).
    *   **Injeção do Diário Projetado:** Se o usuário não gastou nada no dia, o sistema injeta automaticamente o valor da cota (ex: `[ D ] R$ 53,33`). Isso garante a projeção de "derretimento" do saldo.
    *   **Coluna Direita (Saldos):** O saldo acumulado daquele dia específico. Se for negativo, a célula inteira da coluna direita ganha um fundo vermelho sangue, gerando o choque visual de alerta.

### Épico 2: A Visão Macro (Grid "Horizonte de Saldos")
Acessada pelo ícone de Grid no header da tela de Saldos.
*   **Layout Bidirecional:** Uma matriz cruzando Dias (linhas) x Meses Futuros (colunas, ex: Jan/27, Fev/27).
*   **Abreviação de Valores:** Para caber na tela, saldos grandes são formatados (ex: `-13.6K` em vez de `-13.600,00`).
*   **UX:** Fornece a visão panorâmica de longo prazo (o verdadeiro "Chá Revelação"). Se a tela estiver toda vermelha, o usuário sabe que está caminhando para um abismo financeiro por vários meses seguidos.

### Épico 3: Motor Analítico (Aba "Totais")
O dashboard que resume a saúde do mês traduzindo a metodologia em fórmulas visíveis.
*   **Performance:** Indica o resultado líquido do mês ("Faltou dinheiro" ou "Sobrou").
    *   *Fórmula Exibida:* `[K] - [↗] - [D] - [E] - [C] - [D Tracejado]` (O "D Tracejado" representa a projeção futura não gasta).
*   **Economizado:** Percentual da renda que foi investido ("Nada guardado").
    *   *Fórmula Exibida:* `[E] / [K]`.
*   **Custo de Vida:** O peso das obrigações e hábitos ("Acima da renda" ou "Dentro da renda").
    *   *Fórmula Exibida:* `[↗] + [D] + [C] + [D Tracejado]`.
*   **Diário Médio:** O acompanhamento do limite variável.
    *   *Fórmula Exibida:* O valor real gasto vs. O teto diário projetado (ex: `R$ 0,00 / R$ 53,33`).
*   **Movimentações do Mês:** Uma lista sumarizada dos totais reais efetivados em cada uma das 5 tipologias para aquele mês específico.

### Épico 4: Motor de Input (Fricção Zero)
Acessado pelo FAB central `(+)`. Foco em velocidade para evitar a objeção de "dá trabalho anotar".
*   **Passo 1 (Menu Overlay):** Abre um Bottom Sheet limpo apresentando os 5 tipos de lançamento (Entrada, Saída, Diário, Economia, Cartão) com suas descrições.
*   **Passo 2 (Formulário Nativo):**
    *   **Teclado Customizado:** Não utiliza o teclado do iOS (decimal pad). Utiliza um teclado numérico construído na própria interface (botões grandes, escuros, apenas números e backspace).
    *   **Visor de Valor Máximo:** O valor (ex: `R$ 0,00`) fica fixo no topo com tamanho de fonte hero.
    *   **Seletores Inline:** Abaixo do valor, campos expansíveis para alterar o Tipo, Descrição, Data, Regras de Repetição ("Não repete", "Mensal", etc.) e Tags.
    *   **Botão de Ação:** Ocupa toda a largura, assumindo a cor da tipologia selecionada (ex: Verde para Entrada).

### Épico 5: Agrupamento Dinâmico (Aba "Tags")
Sistema de categorização secundária livre, que corre em paralelo com a tipologia fixa.
*   **Estrutura:** Lista alfabética de tags customizadas pelo usuário (ex: Almoço, Assinaturas, App Racho).
*   **Indicadores Visuais:** Cada tag possui um quadrado colorido customizável à esquerda.
*   **Consolidação:** A tela já exibe o somatório gasto em cada tag no mês selecionado (ex: Assinaturas: `R$ 671,54`).
*   **Funcionalidades:** Barra de busca para "Filtrar tags" no topo e botões rápidos para edição ou mesclagem.

### Épico 6: Setup e Configuração (Aba "Menu")
Tela padrão de listagem de configurações de conta.
*   **Perfil:** Nome e e-mail com tag de status da assinatura (ex: "Assinatura ativa").
*   **Core Config:** O link mais importante aqui é **"Previsão de diário"**. É através deste menu que o usuário define o valor fixo da sua cota (ex: R$ 1.600 no mês, divididos por 30 = R$ 53,33/dia) que alimentará todas as injeções automáticas nas telas de Saldos e Totais.
