/**
 * ========================================
 *  BIBLIOTECA DE CENÁRIOS DE TESTE
 *  Smart Parking Engine v2.5
 * ========================================
 * 
 * Esta pasta contém cenários de teste organizados por categoria.
 * Cada cenário testa aspectos específicos do sistema de sorteio.
 */

## 📁 Estrutura de Pastas

```
scenarios/
├── baseline/           # Cenários de linha base e validação
│   └── perfect-equality.scenario.js
├── realistic/          # Cenários de condomínios reais
│   ├── small-condo.scenario.js
│   └── large-condo.scenario.js
├── compensation/       # Cenários focados em compensação
│   └── second-raffle.scenario.js
├── edge-cases/        # Casos extremos e situações raras
│   ├── scarcity.scenario.js
│   ├── all-critical.scenario.js
│   ├── all-defaulting.scenario.js
│   └── no-priority-spaces.scenario.js
├── sequence/          # Múltiplos sorteios consecutivos
│   └── multi-raffle.scenario.js
└── stress/            # Testes de performance e escala
    └── large-scale.scenario.js
```

---

## 🎯 Categorias de Cenários

### 📊 **baseline/** - Linha Base
Cenários fundamentais que estabelecem a base de funcionamento correto.

- **perfect-equality.scenario.js**
  - 30 unidades idênticas, 30 vagas idênticas
  - Testa aleatoriedade pura e justiça sem diferenciação
  - Expectativa: Fairness > 0.95, Gini < 0.10

---

### 🏢 **realistic/** - Condomínios Realistas
Simulações de condomínios reais com distribuição típica de moradores.

- **small-condo.scenario.js**
  - 30 unidades, 35 vagas (excesso de 17%)
  - 2 PCDs, 4 idosos, 3 inadimplentes
  - Testa funcionamento básico completo
  - Expectativa: 100% alocação, Fairness > 0.85

- **large-condo.scenario.js**
  - 100 unidades, 110 vagas (excesso de 10%)
  - 5 PCDs, 15 idosos, 15 motos
  - Testa escalabilidade e distribuição entre blocos
  - Expectativa: 90%+ alocação, execução < 1s

---

### 🔄 **compensation/** - Compensação
Cenários que testam as regras de compensação (RN03, RN04, RN09).

- **second-raffle.scenario.js**
  - 20 unidades com histórico de sorteios ruins
  - Testa se sistema "lembra" e compensa injustiças
  - 10 descobertos, 8 trancados, 6 críticos
  - Expectativa: 70%+ taxa compensação

---

### ⚠️ **edge-cases/** - Casos Extremos
Situações raras, limites do sistema, validação de robustez.

- **scarcity.scenario.js**
  - 60 unidades, 40 vagas (déficit de 33%)
  - Testa priorização sob escassez severa
  - Expectativa: 100% PCD/idoso, <50% inadimplentes

- **all-critical.scenario.js**
  - 25 unidades, 30 vagas - TODAS críticas
  - Pior cenário possível (sem vagas boas)
  - Expectativa: Sistema não quebra, compensa no próximo

- **all-defaulting.scenario.js**
  - 30 unidades - TODAS inadimplentes
  - Testa penalidade uniforme
  - Expectativa: Fairness > 0.85 (igualdade entre penalizados)

- **no-priority-spaces.scenario.js**
  - 13 prioritários (5 PCD + 8 idosos)
  - ZERO vagas prioritárias disponíveis
  - Testa fallback para sorteio geral
  - Expectativa: Prioritários conseguem vagas no geral

---

### 🔁 **sequence/** - Sequências
Múltiplos sorteios consecutivos com histórico.

- **multi-raffle.scenario.js**
  - 4 sorteios consecutivos
  - Testa evolução da compensação ao longo do tempo
  - Expectativa: Fairness melhora a cada sorteio (0.80→0.95)

---

### 🚀 **stress/** - Performance
Testes de carga, escalabilidade e limites técnicos.

- **large-scale.scenario.js**
  - 200 unidades, 220 vagas
  - Mix realista em alta escala
  - Expectativa: Execução < 2s, Fairness > 0.85

---

## 📝 Formato de Cenário

Cada arquivo `.scenario.js` exporta um objeto com:

```javascript
export const scenario = {
  name: 'Nome do Cenário',
  description: 'Descrição breve',
  
  units: [
    // Array de unidades de teste
    { id, apartment, block, vehicles, isPCD, isElderly, ... }
  ],
  
  spaces: [
    // Array de vagas de teste
    { id, number, type, coverage, isPCD, isCritical, ... }
  ],
  
  config: {
    seed: 'SEED-UNICA',
    weights: { ... }
  },
  
  expectedResults: {
    allocationRate: 0.90,
    minFairness: 0.85,
    // ... outras expectativas
  }
};
```

---

## 🔧 Como Usar

### Executar cenário individual:
```bash
node tests/runScenario.js scenarios/realistic/small-condo.scenario.js
```

### Executar categoria inteira:
```bash
node tests/runScenarios.js realistic
```

### Executar TODOS os cenários:
```bash
node tests/runScenarios.js --all
```

### Comparar cenários:
```bash
node tests/compareScenarios.js
```

---

## ✅ Checklist de Validação

Todo cenário deve validar:

- ✅ Taxa de alocação (allocation rate)
- ✅ Fairness Index (≥ 0.85 target)
- ✅ Taxa PCD (100% se houver)
- ✅ Taxa Idoso (100% se houver)
- ✅ Sem erros/exceções
- ✅ Log de auditoria completo
- ✅ Scores corretos (sem NaN/undefined)
- ✅ Regras de negócio respeitadas

---

## 🎨 Convenções

### Nomenclatura de IDs:
- Unidades: `U001`, `U_PCD_001`, `U_ELD_001`, `U_DEF_001`
- Vagas: `S001`, `S_PCD_1`, `S_ELD_1`, `S_CRIT_001`

### Seeds:
- Formato: `TEST-{CATEGORY}-{YEAR}`
- Exemplo: `TEST-SCARCITY-2026`

### Blocos:
- Padrão: 'A', 'B', 'C' (3 blocos)
- Grande escala: 'A', 'B', 'C', 'D' (4 blocos)

---

## 📊 Métricas-Chave

| Métrica | Alvo | Crítico |
|---------|------|---------|
| Fairness Index | ≥ 0.85 | ≥ 0.75 |
| Gini Coefficient | ≤ 0.30 | ≤ 0.40 |
| Taxa PCD | 100% | 95% |
| Taxa Idoso | 100% | 95% |
| Taxa Compensação | ≥ 70% | ≥ 50% |
| Tempo Execução | < 1s | < 3s |

---

## 🔍 Análise de Resultados

Cada execução gera:

1. **Console Output**: Resultados visuais com cores
2. **Audit Log**: Histórico detalhado de decisões
3. **Statistics**: Métricas agregadas
4. **Comparison**: Comparação entre cenários

---

## 🆕 Criando Novos Cenários

1. Escolha a categoria apropriada
2. Copie um cenário similar
3. Modifique units/spaces conforme necessário
4. Ajuste expectedResults
5. Documente o que está sendo testado
6. Adicione seed único
7. Rode e valide

---

## 📚 Documentação Adicional

- [README Principal](../README.md) - Overview completo dos testes
- [Análise de Regras](../BUSINESS_RULES_ANALYSIS.md) - Detalhamento das regras
- [Relatório Executivo](../EXECUTIVE_REPORT.md) - Certificação do sistema
- [Resumo](../SUMMARY.md) - Quick reference

---

**Última Atualização**: Janeiro 2026  
**Versão**: Smart Parking Engine v2.5  
**Total de Cenários**: 11
