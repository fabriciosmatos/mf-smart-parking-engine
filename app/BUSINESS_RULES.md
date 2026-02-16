# 🎯 Regras de Negócio e Motor de Sorteio

## 📍 Localização das Regras de Negócio

### 🔥 Motor Principal (Algoritmo de Sorteio)

**Arquivo:** [`app/utils/raffleEngine.ts`](utils/raffleEngine.ts)

Este arquivo contém **TODA a lógica de sorteio e alocação de vagas**. É o coração do sistema.

---

## 🧠 Como Funciona o Sorteio?

### Fluxo Algorítmico

```
1. PREPARAÇÃO
   ↓
2. ALOCAÇÃO PRIORITÁRIA (PCD/Idoso)
   ↓
3. EMBARALHAMENTO DETERMINÍSTICO (Fisher-Yates)
   ↓
4. CÁLCULO DE SCORE POR REGRA
   ↓
5. SELEÇÃO DA MELHOR VAGA
   ↓
6. ESTATÍSTICAS E AUDITORIA
```

---

## 📋 Regras de Negócio Implementadas

### 🔴 **RN01: Consistência de Inventário**
**Localização:** Linhas 44-49
```typescript
if (tasks.length > spaces.length) {
  throw new Error(`Déficit de inventário`);
}
```
**O que faz:** Valida se há vagas suficientes para todas as demandas.

---

### 🟣 **RN02: Reserva Legal (Prioridade PCD/Idoso)**
**Localização:** Linhas 52-83
```typescript
const priorityTasks = tasks.filter(t => t.isPriority && t.type === 'CAR');
// Processa PRIMEIRO os beneficiários prioritários
for (const task of priorityTasks) {
  // Busca vaga específica PCD ou Idoso
  let idealSpace = availableSpaces.find(s => 
    s.type !== 'MOTO' && ((unit.isPCD && s.isPCD) || (unit.isElderly && s.isElderly))
  );
}
```
**O que faz:** Garante que PCD e Idosos recebam vagas adequadas ANTES do sorteio geral.

---

### 🟢 **RN03: Compensação de Cobertura**
**Localização:** Linhas 121-126
```typescript
if (unit.previousAssignment?.coverage === 'UNCOVERED') {
  const sat = space.coverage === 'COVERED';
  const pts = sat ? config.weights.coverageCompensation : 0;
  currentScore += pts;
}
```
**O que faz:** Se o morador estava em vaga descoberta, ganha pontos extras para vaga coberta.

---

### 🔵 **RN04: Compensação de Mobilidade**
**Localização:** Linhas 128-133
```typescript
if (unit.previousAssignment?.access === 'LOCKED') {
  const sat = space.access === 'FREE';
  const pts = sat ? config.weights.mobilityCompensation : 0;
  currentScore += pts;
}
```
**O que faz:** Se o morador estava em vaga "presa" (precisa manobra), ganha pontos para vaga livre.

---

### 🟠 **RN08: Penalidade por Inadimplência**
**Localização:** Linhas 157-160
```typescript
if (unit.isDefaulting) {
  currentScore -= config.weights.defaultingPenalty;
  rules.push({ name: 'RN08: Inadimplência', points: -config.weights.defaultingPenalty });
}
```
**O que faz:** Unidades inadimplentes perdem pontos, ficando com vagas remanescentes.

---

### 🟡 **RN09: Rodízio de Vagas Críticas**
**Localização:** Linhas 135-140
```typescript
if (unit.previousAssignment?.wasCritical) {
  const sat = !space.isCritical;
  const pts = sat ? config.weights.criticalRotation : 0;
  currentScore += pts;
}
```
**O que faz:** Impede que o mesmo morador fique em vaga ruim por dois ciclos consecutivos.

---

### 🟢 **RN10: Proximidade do Bloco**
**Localização:** Linhas 142-145
```typescript
const blockSat = unit.block === space.block;
const blockPts = blockSat ? config.weights.blockProximity : 0;
currentScore += blockPts;
```
**O que faz:** Prioriza vagas próximas à torre/bloco do morador.

---

### 🔵 **RN14: Ausência em Assembleia**
**Localização:** Linhas 161-164
```typescript
if (!unit.isPresentInAssembly) {
  currentScore -= config.weights.absencePenalty;
}
```
**O que faz:** Quem não participa da assembleia perde pontos.

---

### 🟣 **Proximidade ao Elevador**
**Localização:** Linhas 147-150
```typescript
if (space.isNearElevator) {
  currentScore += config.weights.elevatorProximity;
}
```
**O que faz:** Vagas próximas aos elevadores ganham pontos extras.

---

### 🟠 **Proximidade à Portaria**
**Localização:** Linhas 151-154
```typescript
if (space.isNearEntrance) {
  currentScore += config.weights.entranceProximity;
}
```
**O que faz:** Vagas próximas à entrada/saída ganham pontos extras.

---

## 🎲 Como o Sorteio Garante Justiça?

### 1. **Determinismo com Semente (Seed)**
```typescript
const rng = seedrandom(config.seed);
```
- Mesma seed = Mesmo resultado
- Auditável e reproduzível
- Evita manipulação

### 2. **Algoritmo Fisher-Yates**
**Localização:** Linhas 93-97
```typescript
const randomizedTasks = [...otherTasks];
for (let i = randomizedTasks.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1));
  [randomizedTasks[i], randomizedTasks[j]] = [randomizedTasks[j], randomizedTasks[i]];
}
```
**O que faz:** Embaralha a ordem de processamento de forma aleatória, mas determinística.

### 3. **Sistema de Pontuação (Score)**
**Localização:** Linhas 118-165
```typescript
for (const space of compatibleSpaces) {
  let currentScore = 0;
  let rules: RuleDetail[] = [];
  
  // Aplica TODAS as regras
  // Calcula pontuação total
  
  if (currentScore > maxScore) {
    maxScore = currentScore;
    bestSpace = space; // Seleciona a MELHOR vaga
  }
}
```

**Exemplo de Cálculo:**
```
Unidade 101A - Bloco B1
─────────────────────────
+ 80  pts (Compensação Cobertura) ✅
+ 60  pts (Compensação Mobilidade) ✅
+ 40  pts (Proximidade Bloco) ✅
+ 50  pts (Próximo Elevador) ✅
- 150 pts (Inadimplente) ❌
─────────────────────────
= 80 pts SCORE FINAL
```

---

## 🔧 Configuração de Pesos

### Onde estão os pesos padrão?

**Arquivo:** [`app/constants/weights.ts`](constants/weights.ts)

```typescript
export const DEFAULT_WEIGHTS = {
  coverageCompensation: 80,      // Compensação Cobertura
  mobilityCompensation: 60,      // Facilidade de Manobra
  blockProximity: 40,            // Proximidade Bloco
  elevatorProximity: 50,         // Acesso Elevador
  criticalRotation: 100,         // Rodízio Crítico
  entranceProximity: 30,         // Acesso Portaria
  defaultingPenalty: 150,        // Penalidade Inadimplência
  absencePenalty: 100            // Penalidade Ausência
};
```

**Como mudar:** Os usuários ajustam os sliders na interface (Step 2).

---

## 📊 Estatísticas Calculadas

### Onde são calculadas?

**Localização:** Linhas 196-220

```typescript
const stats: RaffleStats = {
  coverageSuccessRate: 0,      // % que saiu de vaga descoberta
  mobilitySuccessRate: 0,      // % que saiu de vaga presa
  blockMatchRate: 0,           // % que ficou no próprio bloco
  priorityAuditRate: 100,      // % de prioridades atendidas
  criticalRotationRate: 0,     // % que saiu de vaga crítica
  averageScore: 0,             // Média de pontos
  totalAssignments: 0          // Total de alocações
};
```

**Função de Cálculo:**
```typescript
const calcRate = (filterUnit, checkSuccess) => {
  const eligible = units.filter(filterUnit);
  const success = assignments.filter(a => {
    const u = units.find(unit => unit.id === a.unitId);
    const s = spaces.find(space => space.id === a.spaceId);
    return filterUnit(u) && checkSuccess(u, s);
  }).length;
  return (success / eligible.length) * 100;
};
```

---

## 🗂️ Arquivos Relacionados às Regras

### 1. **Types (Definições)**
**Arquivo:** [`app/types.ts`](types.ts)
Define as estruturas de dados:
- `Unit` (Unidade/Morador)
- `ParkingSpace` (Vaga)
- `RaffleConfig` (Configuração)
- `RaffleResult` (Resultado)
- `RuleDetail` (Regra aplicada)

### 2. **Configuração de Pesos**
**Arquivo:** [`app/constants/weights.ts`](constants/weights.ts)
- Traduções dos nomes
- Ícones das regras
- Descrições detalhadas
- Valores padrão

### 3. **Hooks de Execução**
**Arquivo:** [`app/hooks/useRaffleExecution.ts`](hooks/useRaffleExecution.ts)
```typescript
export const useRaffleExecution = () => {
  const executeRaffle = async (units, spaces, config) => {
    const raffleResult = await runRaffle(units, spaces, config);
    // ↑ Chama o motor principal
  };
};
```

### 4. **Chamada no App**
**Arquivo:** [`app/App.tsx`](App.tsx) - Linha 27
```typescript
const handleStartRaffle = async () => {
  const raffleResult = await executeRaffle(units, spaces, config);
  // Resultado retorna com assignments, stats, log, etc.
};
```

---

## 🔍 Como Debugar/Entender o Sorteio?

### 1. **Log de Auditoria**
Cada sorteio gera um log detalhado:
```typescript
log.push(`[DECISÃO] Vaga #${bestSpace.number} selecionada com Score Final: ${maxScore}`);
log.push(`[REGRAS ATENDIDAS] ${satRules.join(', ')}`);
```

Disponível no arquivo `3_Log_Auditoria.txt` do ZIP.

### 2. **Relatório de Justificativa**
```json
{
  "unidade": "101A",
  "vaga": "45",
  "score": 230.5,
  "regras": [
    { "name": "RN03: Compensação Cobertura", "points": 80, "satisfied": true },
    { "name": "RN10: Proximidade Bloco", "points": 40, "satisfied": true }
  ]
}
```

Disponível no arquivo `2_Relatorio_Justificativa.json` do ZIP.

---

## 🎯 Fluxo Completo Visual

```
┌─────────────────────────────────────────────────┐
│  1. USUÁRIO CONFIGURA PESOS (Step 2)           │
│     constants/weights.ts                        │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  2. CLICA "INICIAR SORTEIO" (Step 3)           │
│     App.tsx → handleStartRaffle()               │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  3. EXECUTA HOOK                                │
│     hooks/useRaffleExecution.ts                 │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  4. MOTOR DE SORTEIO (⭐ AQUI!)                 │
│     utils/raffleEngine.ts                       │
│     ┌─────────────────────────────────────┐    │
│     │ • Valida inventário (RN01)          │    │
│     │ • Aloca prioridades (RN02)          │    │
│     │ • Embaralha fila (Fisher-Yates)     │    │
│     │ • Calcula scores (RN03-RN14)        │    │
│     │ • Seleciona melhores vagas          │    │
│     │ • Gera estatísticas                 │    │
│     └─────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  5. RETORNA RESULTADO                           │
│     RaffleResult { assignments, stats, log }    │
└─────────────────────┬───────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  6. EXIBE NA INTERFACE (Step 4)                │
│     components/steps/AuditStep.tsx              │
└─────────────────────────────────────────────────┘
```

---

## 💡 Resumo Rápido

| Item | Localização | Responsabilidade |
|------|-------------|------------------|
| **Motor Principal** | `utils/raffleEngine.ts` | Toda lógica de sorteio |
| **Tipos/Interfaces** | `types.ts` | Estruturas de dados |
| **Pesos Padrão** | `constants/weights.ts` | Configuração inicial |
| **Execução** | `hooks/useRaffleExecution.ts` | Chama o motor |
| **Interface** | `components/steps/` | UI dos 4 steps |
| **Orquestração** | `App.tsx` | Coordena tudo |

---

## 🎓 Para Modificar uma Regra

**Exemplo:** Mudar peso da compensação de cobertura de 80 para 100

### Opção 1: Interface (usuário final)
1. Abra a aplicação
2. Vá para Step 2
3. Ajuste o slider "Compensação de Cobertura"

### Opção 2: Código (desenvolvedor)
1. Edite [`app/constants/weights.ts`](constants/weights.ts)
2. Mude `coverageCompensation: 80` para `coverageCompensation: 100`
3. Reinicie o servidor

### Opção 3: Criar nova regra
1. Edite [`app/utils/raffleEngine.ts`](utils/raffleEngine.ts)
2. Adicione na seção de cálculo de score (linhas 118-165)
3. Adicione a tradução em [`constants/weights.ts`](constants/weights.ts)

---

## 🚀 Conclusão

**Todas as regras de negócio estão em um único lugar:**  
📍 **[`app/utils/raffleEngine.ts`](utils/raffleEngine.ts)**

Este arquivo contém:
- ✅ Validações (RN01)
- ✅ Prioridades legais (RN02)
- ✅ Sistema de pontuação (RN03-RN14)
- ✅ Cálculo de estatísticas
- ✅ Log de auditoria
- ✅ Algoritmo determinístico

**É o coração do Smart Parking Engine!** 🎯
