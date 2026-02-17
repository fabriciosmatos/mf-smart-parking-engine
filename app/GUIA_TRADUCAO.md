# 🌐 Guia de Tradução - Smart Parking Engine v3.0

Este documento orienta a tradução completa do projeto para português, seguindo as melhores práticas.

## 📋 Status Atual

### ✅ Componentes Já Traduzidos

#### Layout 
- ✅ `BarraLateral.tsx` (Sidebar)
- ✅ `Cabecalho.tsx` (Header)
- ✅ `Layout.tsx` (atualizado para usar componentes PT)

#### UI
- ✅ `Botao.tsx` (Button)
- ✅ `CartaoKPI.tsx` (KPICard)
- ✅ `ZonaUploadArquivo.tsx` (FileUploadZone)
- ✅ `ControleDeslizantePeso.tsx` (WeightSlider)

#### Constants
- ✅ `passos.ts` (steps.ts)

### 🔄 Pendente de Tradução

#### Steps
- ⏳ `EtapaIngestãoDados.tsx` (DataIngestionStep.tsx)
- ⏳ `EtapaConfiguracaoPesos.tsx` (WeightsConfigStep.tsx)
- ⏳ `EtapaSimulacao.tsx` (SimulationStep.tsx)
- ⏳ `EtapaAuditoria.tsx` (AuditStep.tsx)
- ⏳ `CabecalhoAuditoria.tsx` (AuditHeader.tsx)
- ⏳ `TabelaResultados.tsx` (ResultsTable.tsx)
- ⏳ `LinhaTabela Resultado.tsx` (ResultTableRow.tsx)

#### Hooks
- ⏳ `useDadosCSV.ts` (useCSVData.ts)
- ⏳ `useConfiguracaoSorteio.ts` (useRaffleConfig.ts)
- ⏳ `useExecucaoSorteio.ts` (useRaffleExecution.ts)
- ⏳ `usePacoteAuditoria.ts` (useAuditPackage.ts)

#### Constants
- ⏳ `pesos.ts` (weights.ts - criar versão 100% PT)
- ⏳ `kpis.ts` (criar versão 100% PT)

#### App Principal
- ⏳ `App.tsx` (atualizar imports e usar componentes PT)

---

## 🗂️ Convenções de Nomenclatura

### Arquivos
- PascalCase para componentes: `BarraLateral.tsx`, `Botao.tsx`
- camelCase para hooks: `useDadosCSV.ts`
- camelCase para utils: `analisadorCSV.ts` (já está)
- camelCase para constants: `passos.ts`, `pesos.ts`

### Interfaces/Props
- Prefixo "Props": `PropsBarraLateral`, `PropsBotao`
- Nome descritivo em português: `PropsControleDeslizantePeso`

### Métodos/Funções
- Verbos em português: `aoClicar`, `aoMudar`, `aoFechar`
- Prefixos claros: `obter`, `definir`, `processar`, `validar`

### Variáveis
- camelCase descritivo: `passoAtivo`, `barraLateralAberta`
- Evitar abreviações: `descricao` ao invés de `desc`
- Arrays no plural: `passos`, `usuarios`, `vagas`

### Constantes
- UPPER_SNAKE_CASE ou PascalCase:
  - `PASSOS`, `PESOS_PADRAO`
  - Para objetos de configuração: PascalCase

---

##  🔄 Dicionário de Tradução

### Termos Gerais
```typescript
// Componentes
Button → Botao
Header → Cabecalho
Sidebar → BarraLateral
Layout → Layout (mantém)
Card → Cartao
Slider → ControleDeslizante / Deslizante
Table → Tabela
Row → Linha
Zone → Zona

// Props Comuns
props → props (mantém)
children → children (mantém em React)
className → className (mantém em React)
onClick → aoClicar
onChange → aoMudar
onClose → aoFechar
onOpen → aoAbrir
onMouseEnter → aoEntrarMouse
onMouseLeave → aoSairMouse
isOpen → aberto/aberta
isActive → ativo/ativa
isDisabled → desabilitado/desabilitada

// Estados
loading → carregando
error → erro
success → sucesso
pending → pendente
active → ativo
inactive → inativo

// Dados
data → dados
value → valor
label → rotulo
description → descricao
title → titulo
icon → icone
color → cor
key → chave
index → indice
```

### Termos do Domínio (Parking)
```typescript
// Modelos
Unit → Unidade
ParkingSpace → VagaEstacionamento
Assignment → Alocacao
RaffleResult → ResultadoSorteio
RaffleConfig → ConfiguracaoSorteio
AuditPackage → PacoteAuditoria

// Propriedades
blockProximity → proximidadeBloco
coverageCompensation → compensacaoCobertura
mobilityCompensation → compensacaoMobilidade
elevatorProximity → proximidadeElevador
entranceProximity → proximidadePortaria
criticalRotation → rodizioVagasCriticas
defaultingPenalty → penalidadeInadimplencia
absencePenalty → penalidadeAusenciaAssembleia

// Ações
executeRaffle → executarSorteio
generateAudit → gerarAuditoria
uploadFile → enviarArquivo
loadMock → carregarSimulado
validateData → validarDados
```

---

## 🛠️ Script de Renomeação (Windows)

Execute estes comandos no terminal PowerShell dentro da pasta `app`:

```powershell
# ATENÇÃO: Faça backup antes de executar!

# 1. Deletar arquivos antigos em inglês (após confirmar que novos funcionam)
Remove-Item components\Layout\Header.tsx
Remove-Item components\Layout\Sidebar.tsx

Remove-Item components\ui\Button.tsx
Remove-Item components\ui\KPICard.tsx
Remove-Item components\ui\FileUploadZone.tsx
Remove-Item components\ui\WeightSlider.tsx

# 2. Atualizar imports no projeto
# (Fazer manualmente ou com ferramenta de refactor do VS Code)
```

---

##  ✨ Próximos Passos

1. **Revisar Componentes Criados**
   - Testar `BarraLateral`, `Cabecalho`, `Layout`
   - Verificar imports e tipos

2. **Criar Componentes de Steps** 
   - Traduzir `DataIngestionStep` → `EtapaIngestãoDados`
   - Traduzir `WeightsConfigStep` → `EtapaConfiguracaoPesos`
   - Traduzir `SimulationStep` → `EtapaSimulacao`
   - Traduzir `AuditStep` → `EtapaAuditoria`

3. **Criar Hooks Traduzidos**
   - `useDadosCSV`
   - `useConfiguracaoSorteio`
   - `useExecucaoSorteio`
   - `usePacoteAuditoria`

4. **Atualizar App.tsx**
   - Importar componentes PT
   - Atualizar nomes de props
   - Traduzir variáveis internas

5. **Atualizar Constants Completo**
   - Remover compatibilidade com inglês
   - Usar apenas nomes PT

6. **Testar Compilação**
   ```bash
   npm run build
   ```

7. **Validar Funcionalidade**
   - Testar todos os fluxos
   - Verificar responsividade
   - Confirmar que não há erros

---

## 📝 Exemplo Completo de Tradução

### Antes (Button.tsx)
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, onClick, children }) => {
  // ...
}
```

### Depois (Botao.tsx)
```typescript
interface PropsBotao {
  variante?: 'primario' | 'secundario';
  aoClicar?: () => void;
}

export const Botao: React.FC<PropsBotao> = ({ variante, aoClicar, children }) => {
  // ...
}
```

---

## ⚠️ Avisos Importantes

1. **Mantenha Consistência**: Use sempre os mesmos termos para as mesmas coisas
2. **Teste Incremental**: Traduza um módulo por vez e teste
3. **Backup**: Sempre faça commit antes de grandes mudanças
4. **TypeScript**: Aproveite para fortalecer tipagem enquanto traduz
5. **Documentação**: Atualize comentários e READMEs

---

**Última Atualização**: 17/02/2026  
**Versão**: 3.0.0-pt
