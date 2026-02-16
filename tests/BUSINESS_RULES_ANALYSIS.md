# 📋 Análise Completa de Regras de Negócio

## Smart Parking Engine - Validação e Conformidade

Este documento detalha todas as regras de negócio implementadas, seus critérios de validação e como são testadas.

---

## 🎯 Regras de Validação e Inventário

### RN01: Consistência de Inventário

**Descrição**: Valida se há vagas suficientes para atender todas as demandas.

**Critérios**:
- Total de vagas CAR/SUV/TRUCK ≥ Total de demandas de carro
- Total de vagas MOTO ≥ Total de demandas de moto
- Não pode haver alocação se faltar inventário

**Testes**:
- ✅ Cenário com vagas suficientes
- ✅ Cenário com vagas insuficientes (deve falhar validação)
- ✅ Separação correta entre tipos de veículos

**Justiça**: Garante que o sistema não promete o impossível.

---

## 👥 Regras de Priorização

### RN02: Alocação Prioritária

**Descrição**: PCDs e Idosos têm prioridade absoluta antes do sorteio geral.

**Critérios**:
- Unidades PCD são alocadas PRIMEIRO em vagas PCD
- Unidades de Idosos são alocadas em vagas para idosos
- Alocação acontece ANTES do embaralhamento
- Vagas prioritárias são removidas do pool geral

**Testes**:
- ✅ PCDs recebem vagas PCD antes do sorteio
- ✅ Idosos recebem vagas adequadas
- ✅ Vagas prioritárias não entram no sorteio geral
- ✅ Unidades regulares NÃO podem pegar vagas prioritárias

**Justiça**: 
- **Taxa de Sucesso Esperada**: 95%+ dos prioritários devem ser atendidos
- **Impacto**: Garante acessibilidade e inclusão

---

## 🔄 Regras de Compensação

### RN03: Compensação de Cobertura

**Descrição**: Unidades que tinham vaga DESCOBERTA no ciclo anterior ganham bônus em vagas COBERTAS.

**Critérios**:
- Aplica-se APENAS se `previousAssignment.coverage === 'UNCOVERED'`
- Bônus de +30 pontos em vagas cobertas
- Não afeta unidades sem histórico ou com vagas cobertas antes

**Fórmula**:
```
if (previousCoverage === 'UNCOVERED' && currentSpace.coverage === 'COVERED') {
  score += 30
}
```

**Testes**:
- ✅ Unidade com descoberta anterior ganha +30 em coberta
- ✅ Unidade sem histórico não ganha bônus
- ✅ Unidade com coberta anterior não é compensada

**Justiça**:
- **Taxa de Compensação Esperada**: 70%+
- **Análise**: Em 10 sorteios consecutivos, nenhuma unidade deve ficar mais de 3 ciclos seguidos em vagas descobertas

---

### RN04: Compensação de Mobilidade

**Descrição**: Unidades que tinham vaga BLOQUEADA ganham bônus em vagas LIVRES.

**Critérios**:
- Aplica-se APENAS se `previousAssignment.access === 'LOCKED'`
- Bônus de +25 pontos em vagas com acesso livre
- Vagas bloqueadas são aquelas com outro carro na frente

**Fórmula**:
```
if (previousAccess === 'LOCKED' && currentSpace.access === 'FREE') {
  score += 25
}
```

**Testes**:
- ✅ Unidade com bloqueada anterior ganha +25 em livre
- ✅ Unidade com livre anterior não ganha bônus
- ✅ Compensação funciona independente de cobertura

**Justiça**:
- **Taxa de Compensação Esperada**: 75%+
- **Análise**: Sistema deve evitar que mesmas unidades fiquem sempre bloqueadas

---

### RN09: Rotação de Vagas Críticas

**Descrição**: Unidades que tinham vaga CRÍTICA (difícil manobra) ganham bônus em vagas NORMAIS.

**Critérios**:
- Aplica-se APENAS se `previousAssignment.wasCritical === true`
- Bônus de +30 pontos em vagas não-críticas
- Vagas críticas: espaços muito apertados ou com manobra difícil

**Fórmula**:
```
if (previousWasCritical === true && currentSpace.isCritical === false) {
  score += 30
}
```

**Testes**:
- ✅ Unidade com crítica anterior prioriza não-crítica
- ✅ Sistema evita alocar mesma unidade em crítica novamente
- ✅ Rotação efetiva em múltiplos sorteios

**Justiça**:
- **Taxa de Rotação Esperada**: 80%+
- **Análise**: Ninguém deve ficar mais de 2 ciclos consecutivos em vagas críticas

---

## 📍 Regras de Proximidade

### RN10: Proximidade de Bloco

**Descrição**: Unidades ganham pontos por vagas no mesmo bloco do apartamento.

**Critérios**:
- Bônus de +15 pontos se `unit.block === space.block`
- Facilita acesso a pé ao apartamento
- Aplica-se a todas as unidades

**Fórmula**:
```
if (unit.block === space.block) {
  score += 15
}
```

**Testes**:
- ✅ Matching de blocos funciona
- ✅ Bônus aplicado corretamente
- ✅ Taxa de match bloco/vaga > 40% nas alocações

**Justiça**:
- **Taxa de Match Esperada**: 50%+ (considerando randomização)
- **Impacto**: Melhora conveniência sem criar vantagem injusta

---

### Proximidade de Elevador

**Descrição**: Vagas próximas ao elevador ganham pontos, especialmente para idosos.

**Critérios**:
- Bônus de +10 pontos se `space.isNearElevator === true`
- Beneficia principalmente idosos e PCDs
- Aplica-se a todas as unidades

**Fórmula**:
```
if (space.isNearElevator === true) {
  score += 10
}
```

**Testes**:
- ✅ Vagas próximas identificadas
- ✅ Idosos priorizados nessas vagas
- ✅ Distribuição não concentra apenas em um grupo

**Justiça**: Melhora acessibilidade geral

---

### Proximidade de Entrada

**Descrição**: Vagas próximas à entrada do estacionamento ganham pontos.

**Critérios**:
- Bônus de +8 pontos se `space.isNearEntrance === true`
- Facilita entrada/saída rápida
- Aplica-se a todas as unidades

**Fórmula**:
```
if (space.isNearEntrance === true) {
  score += 8
}
```

**Testes**:
- ✅ Vagas na entrada identificadas
- ✅ Bônus aplicado uniformemente

**Justiça**: Conveniência distribuída de forma justa

---

## ⚖️ Regras de Penalidade

### RN08: Penalidade por Inadimplência

**Descrição**: Unidades inadimplentes PERDEM pontos no sorteio.

**Critérios**:
- Penalidade de -20 pontos se `unit.isDefaulting === true`
- Incentiva regularização financeira
- Não impede participação, apenas reduz chances

**Fórmula**:
```
if (unit.isDefaulting === true) {
  score -= 20
}
```

**Testes**:
- ✅ Inadimplentes têm score menor que regulares
- ✅ Diferença estatisticamente significativa (>15 pontos)
- ✅ Inadimplentes ainda podem ganhar vagas boas (se outros fatores compensarem)

**Justiça**:
- **Impacto Esperado**: Score médio 15-25 pontos menor
- **Análise**: Não deve ser discriminatório, apenas desincentivo
- **Validação**: Inadimplentes devem ter ~60-70% das chances de regulares

---

### RN14: Penalidade por Ausência em Assembleia

**Descrição**: Unidades ausentes em assembleias PERDEM pontos.

**Critérios**:
- Penalidade de -10 pontos se `unit.isPresentInAssembly === false`
- Incentiva participação na gestão do condomínio
- Penalidade menor que inadimplência

**Fórmula**:
```
if (unit.isPresentInAssembly === false) {
  score -= 10
}
```

**Testes**:
- ✅ Ausentes têm score menor
- ✅ Presentes não sofrem penalidade
- ✅ Penalidades podem acumular (ausente + inadimplente = -30)

**Justiça**:
- **Impacto Esperado**: Score médio 8-12 pontos menor
- **Análise**: Incentivo leve para participação

---

## 📊 Métricas de Fairness (Justiça)

### 1. Fairness Index (Jain's Fairness Index)

**Fórmula**:
```
FI = (Σx)² / (n × Σx²)
```

Onde `x` são os scores das alocações.

**Interpretação**:
- **1.0**: Perfeita igualdade (todos têm exatamente o mesmo score)
- **0.9-1.0**: Excelente - Sistema muito justo
- **0.85-0.9**: Ótimo - Aceitável
- **0.75-0.85**: Bom - Dentro do limite
- **<0.75**: Ruim - Precisa revisão

**Critério de Aceite**: FI > 0.85

---

### 2. Índice Gini (Desigualdade)

**Interpretação**:
- **0.0**: Perfeita igualdade
- **0.0-0.20**: Baixa desigualdade - Excelente
- **0.20-0.35**: Desigualdade aceitável - Bom
- **0.35-0.50**: Desigualdade moderada - Regular
- **>0.50**: Alta desigualdade - Ruim

**Critério de Aceite**: Gini < 0.35

---

### 3. Taxa de Compensação

**Fórmula**:
```
Taxa = (Unidades Compensadas / Unidades Elegíveis) × 100%
```

**Critério de Aceite**: 
- Cobertura: >70%
- Mobilidade: >70%
- Rotação Crítica: >75%

---

### 4. Taxa de Priorização

**Fórmula**:
```
Taxa = (Prioritários Atendidos / Total Prioritários) × 100%
```

**Critério de Aceite**: >95%

---

## 🧪 Cenários de Edge Cases

### 1. Mais Unidades que Vagas
- **Validação**: Sistema aloca até esgotar vagas
- **Critério**: Nenhum erro, algumas unidades ficam sem vaga

### 2. Todas Vagas Críticas
- **Validação**: Sistema distribui mesmo sem vagas ideais
- **Critério**: Compensação aplicada no próximo sorteio

### 3. Todos Inadimplentes
- **Validação**: Sistema aplica penalidade igualmente
- **Critério**: Todos têm chances reduzidas proporcionalmente

### 4. Sem Vagas Prioritárias
- **Validação**: Prioritários entram no sorteio geral
- **Critério**: Sistema não falha

### 5. Determinismo
- **Validação**: Mesma seed = mesmo resultado
- **Critério**: 100% de reprodutibilidade

---

## ✅ Critérios Gerais de Aceite

### Obrigatórios
1. ✅ 100% das regras implementadas corretamente
2. ✅ Fairness Index > 0.85
3. ✅ Gini Coefficient < 0.35
4. ✅ Taxa de compensação > 70%
5. ✅ Taxa de priorização > 95%
6. ✅ Determinismo 100%
7. ✅ Zero erros de validação

### Recomendados
8. ⭐ Fairness Index > 0.90 (Excelente)
9. ⭐ Taxa de compensação > 80%
10. ⭐ Documentação completa de auditoria

---

## 🔍 Como Interpretar os Resultados

### ✅ Sistema Aprovado
- Todos os testes unitários passam
- Fairness Index > 0.85
- Gini < 0.35
- Taxas de compensação > 70%

### ⚠️ Sistema Funcional (precisa melhorias)
- 80-95% dos testes passam
- Fairness Index entre 0.75-0.85
- Algumas regras não atingem meta

### ❌ Sistema Reprovado
- <80% dos testes passam
- Fairness Index < 0.75
- Múltiplas regras falhando

---

## 📚 Referências

- **Jain's Fairness Index**: R. Jain, D. Chiu, W. Hawe, "A Quantitative Measure of Fairness and Discrimination"
- **Gini Coefficient**: Medida estatística de desigualdade em distribuições
- **Fisher-Yates Shuffle**: Algoritmo de embaralhamento não-enviesado

---

**Última atualização**: Fevereiro 2026  
**Maintainers**: Smart Parking Engine Team
