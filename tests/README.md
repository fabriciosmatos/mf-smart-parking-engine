# 🧪 Smart Parking Engine - Testes Automatizados

## 📁 Estrutura de Testes

```
tests/
├── unit/               # Testes unitários de regras individuais
├── integration/        # Testes de integração do fluxo completo
├── simulation/         # Simulações de fairness e estatísticas
├── fixtures/           # Dados de teste reutilizáveis
├── utils/              # Utilitários para testes
└── reports/            # Relatórios de execução
```

## 🎯 Objetivos dos Testes

### 1. Validação de Regras de Negócio
- **RN01**: Consistência de inventário
- **RN02**: Alocação prioritária (PCD, Idosos)
- **RN03**: Compensação de cobertura
- **RN04**: Compensação de mobilidade
- **RN08**: Penalidade por inadimplência
- **RN09**: Rotação de vagas críticas
- **RN10**: Proximidade de bloco
- **RN14**: Penalidade por ausência em assembleias
- **Proximidade**: Elevador e entrada

### 2. Testes de Fairness (Justiça)
- Distribuição equitativa de vagas boas/ruins
- Compensação efetiva em sorteios subsequentes
- Ausência de viés sistemático
- Análise estatística de múltiplas execuções

### 3. Testes de Edge Cases
- Mais unidades que vagas
- Todas vagas críticas
- Todas unidades inadimplentes
- Seed determinístico

## 🚀 Como Executar

```bash
# Executar todos os testes
npm run test

# Executar apenas testes unitários
npm run test:unit

# Executar simulações de fairness
npm run test:simulation

# Gerar relatório completo
npm run test:report
```

## 📊 Métricas Avaliadas

- **Taxa de Sucesso de Compensação**: % de unidades compensadas adequadamente
- **Distribuição de Scores**: Análise estatística (média, mediana, desvio padrão)
- **Fairness Index**: Medida de equidade na distribuição
- **Taxa de Cumprimento**: % de regras satisfeitas
- **Determinismo**: Reprodutibilidade com mesma seed

## ✅ Critérios de Aceite

- ✓ 100% das regras de negócio implementadas corretamente
- ✓ Fairness Index > 0.85 (escala 0-1)
- ✓ Taxa de compensação > 70%
- ✓ Determinismo 100% (mesma seed = mesmo resultado)
- ✓ Zero erros de validação
