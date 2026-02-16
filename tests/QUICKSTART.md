# 🚀 Guia Rápido de Uso - Cenários de Teste

## ⚡ Quick Start

### 1. Ver estrutura de um cenário
```bash
node tests/runScenario.js tests/scenarios/realistic/small-condo.scenario.js
```

### 2. Executar todos os cenários de uma categoria
```bash
node tests/runScenarios.js realistic
node tests/runScenarios.js edge-cases
node tests/runScenarios.js compensation
```

### 3. Executar TODOS os cenários
```bash
node tests/runScenarios.js
```

---

## 📚 Cenários Disponíveis

### 🎯 BASELINE (Linha Base)
```bash
tests/scenarios/baseline/perfect-equality.scenario.js
```
- 30 unidades idênticas → 30 vagas idênticas
- Testa: Aleatoriedade pura, justiça sem diferenciação

### 🏢 REALISTIC (Realistas)
```bash
tests/scenarios/realistic/small-condo.scenario.js    # 30 unidades
tests/scenarios/realistic/large-condo.scenario.js    # 100 unidades
```
- Simulam condomínios reais
- Testa: Alocação básica, prioridades, distribuição

### 🔄 COMPENSATION (Compensação)
```bash
tests/scenarios/compensation/second-raffle.scenario.js
```
- Unidades com histórico ruim
- Testa: RN03, RN04, RN09 funcionando

### ⚠️ EDGE CASES (Casos Extremos)
```bash
tests/scenarios/edge-cases/scarcity.scenario.js              # 60 unidades, 40 vagas
tests/scenarios/edge-cases/all-critical.scenario.js          # Todas vagas ruins
tests/scenarios/edge-cases/all-defaulting.scenario.js        # Todos inadimplentes
tests/scenarios/edge-cases/no-priority-spaces.scenario.js    # Sem vagas PCD/idoso
```
- Situações limite
- Testa: Robustez, priorização sob pressão

### 🔁 SEQUENCE (Sequências)
```bash
tests/scenarios/sequence/multi-raffle.scenario.js
```
- 4 sorteios consecutivos
- Testa: Evolução da compensação

### 🚀 STRESS (Performance)
```bash
tests/scenarios/stress/large-scale.scenario.js
```
- 200 unidades, 220 vagas
- Testa: Escala, performance, memória

---

## 🔧 Comandos Comuns

### Executar suite rápida (3 cenários básicos)
```bash
# Edite runScenarios.js para usar TEST_SUITES.quick
node tests/runScenarios.js baseline realistic compensation
```

### Executar apenas edge cases
```bash
node tests/runScenarios.js edge-cases
```

### Ver detalhes de um cenário antes de executar
```bash
node tests/runScenario.js tests/scenarios/stress/large-scale.scenario.js
```

### Executar suite de certificação (todos)
```bash
node tests/runScenarios.js
```

---

## 📊 Interpretando Resultados

### Métricas Principais

| Métrica | Ótimo | Bom | Aceitável |
|---------|-------|-----|-----------|
| **Fairness Index** | ≥ 0.95 | ≥ 0.85 | ≥ 0.75 |
| **Gini Coefficient** | ≤ 0.10 | ≤ 0.30 | ≤ 0.40 |
| **Allocation Rate** | 100% | ≥ 90% | ≥ 80% |
| **PCD Rate** | 100% | 100% | ≥ 95% |
| **Elderly Rate** | 100% | 100% | ≥ 95% |

### Símbolos de Status

- ✓ Verde: Passou em todas validações
- ✗ Vermelho: Falhou em alguma validação
- ⚠️ Amarelo: Aviso ou nota informativa

---

## 🎨 Estrutura de um Cenário

```javascript
export const scenario = {
  name: 'Nome do Cenário',
  description: 'O que testa',
  
  units: [
    // Array de unidades
  ],
  
  spaces: [
    // Array de vagas
  ],
  
  config: {
    seed: 'SEED-UNICA',
    weights: { /* pesos das regras */ }
  },
  
  expectedResults: {
    allocationRate: 0.90,
    minFairnessIndex: 0.85,
    // ... outras expectativas
  }
};
```

---

## 🆕 Criando Seu Próprio Cenário

### 1. Escolha a categoria
- `baseline/` - Casos fundamentais
- `realistic/` - Simulações reais
- `compensation/` - Testa compensação
- `edge-cases/` - Casos extremos
- `sequence/` - Múltiplos sorteios
- `stress/` - Performance

### 2. Copie um cenário similar
```bash
cp tests/scenarios/realistic/small-condo.scenario.js tests/scenarios/realistic/meu-condo.scenario.js
```

### 3. Edite os dados
- Modifique `units[]` conforme necessário
- Modifique `spaces[]` conforme necessário
- Ajuste `expectedResults`
- Altere `seed` para algo único

### 4. Documente
Adicione comentário no topo explicando:
- O que está sendo testado
- Por que é importante
- Expectativas esperadas

### 5. Execute
```bash
node tests/runScenario.js tests/scenarios/realistic/meu-condo.scenario.js
```

---

## 🔍 Troubleshooting

### "Nenhum cenário encontrado"
- Verifique se está na pasta correta
- Use caminho relativo ao projeto: `tests/scenarios/...`

### "Arquivo não encontrado"
- Use caminho completo ou relativo correto
- Exemplo: `tests/scenarios/realistic/small-condo.scenario.js`

### Resultados inesperados
- Verifique o `seed` (deve ser único e consistente)
- Confira `expectedResults` (podem estar muito restritivos)
- Rode com outro seed para ver variação

### Performance lenta
- Reduza número de unidades/vagas
- Use categoria menor primeiro
- Cenários stress são intencionalmente lentos

---

## 📖 Documentação Completa

- [README dos Cenários](./scenarios/README.md) - Detalhamento completo
- [README dos Testes](./README.md) - Framework completo
- [Análise de Regras](./BUSINESS_RULES_ANALYSIS.md) - Regras de negócio
- [Relatório Executivo](./EXECUTIVE_REPORT.md) - Certificação

---

## 🎯 Suites Recomendadas por Uso

### Desenvolvimento (rápida)
```bash
node tests/runScenarios.js baseline
```

### Pré-commit (média)
```bash
node tests/runScenarios.js realistic edge-cases
```

### CI/CD (completa)
```bash
node tests/runScenarios.js
```

### Certificação (tudo + docs)
```bash
npm test  # roda unit + simulation + scenarios
```

---

**Dica Final**: Comece com `small-condo` e `perfect-equality` para entender o sistema, depois avance para edge cases e stress tests.
