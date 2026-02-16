# Smart Parking Engine - Refatorado

Esta é a versão refatorada do SPE seguindo as melhores práticas de React.js.

## 🎯 Melhorias Implementadas

### 1. **Componentização**
- Componentes pequenos e focados em responsabilidade única
- Componentes de UI reutilizáveis (`Button`, `FileUploadZone`, `WeightSlider`, `KPICard`)
- Componentes de steps separados para cada etapa do fluxo
- Layout modularizado (`Sidebar`, `Header`, `Layout`)

### 2. **Custom Hooks**
- `useCSVData`: Gerencia upload e parsing de arquivos CSV
- `useRaffleConfig`: Gerencia configuração de pesos e seed
- `useRaffleExecution`: Controla execução do sorteio
- `useAuditPackage`: Gera pacote de auditoria em ZIP

### 3. **Separação de Responsabilidades**
- **Constants**: Configurações e traduções centralizadas
- **Utils**: Funções auxiliares e parsers
- **Types**: Tipos TypeScript reutilizados
- **Hooks**: Lógica de negócio extraída
- **Components**: UI pura e apresentacional

### 4. **Clean Code**
- Nomes semânticos e descritivos
- Funções pequenas e focadas
- Early returns para evitar aninhamento excessivo
- Desestruturação de objetos e arrays
- Remoção de comentários óbvios

### 5. **Manutenibilidade**
- Arquivos enxutos (< 200 linhas na maioria)
- Fácil localização de código
- Testabilidade melhorada
- Baixo acoplamento entre módulos

## 📁 Estrutura de Pastas

```
app/
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── steps/
│   │   ├── DataIngestionStep.tsx
│   │   ├── WeightsConfigStep.tsx
│   │   ├── SimulationStep.tsx
│   │   ├── AuditStep.tsx
│   │   ├── AuditHeader.tsx
│   │   ├── ResultsTable.tsx
│   │   └── ResultTableRow.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── FileUploadZone.tsx
│       ├── WeightSlider.tsx
│       └── KPICard.tsx
├── hooks/
│   ├── useCSVData.ts
│   ├── useRaffleConfig.ts
│   ├── useRaffleExecution.ts
│   └── useAuditPackage.ts
├── constants/
│   ├── steps.ts
│   ├── weights.ts
│   └── kpis.ts
├── utils/
│   ├── csvParser.ts
│   ├── ruleIcons.ts
│   ├── mockData.ts
│   └── raffleEngine.ts
├── App.tsx
├── index.tsx
├── types.ts
└── [arquivos de configuração]
```

## 🚀 Como Usar

```bash
cd app
npm install
npm run dev
```

## ✅ Alterações vs Código Original

- ✅ Mantém 100% das funcionalidades originais
- ✅ Design e CSS idênticos
- ✅ Regras de negócio preservadas
- ✅ Melhor organização e legibilidade
- ✅ Facilita manutenção e evolução
- ✅ Preparado para testes unitários
