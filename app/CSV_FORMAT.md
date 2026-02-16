# 📁 Formato dos CSVs

## 1️⃣ CSV de Unidades (`unidades.csv`)

**Formato:** `id;apartamento;bloco;vagas_carro;vagas_moto;pcd;idoso;inadimplente;presente`

```csv
id;apartamento;bloco;vagas_carro;vagas_moto;pcd;idoso;inadimplente;presente
u-1;101A;B1;1;0;false;false;false;true
u-2;102B;B1;2;0;false;true;false;true
u-3;103C;B1;1;1;true;false;false;true
u-4;201A;B2;1;0;false;false;true;false
u-5;202B;B2;1;0;false;false;false;true
```

**Colunas:**
- `id`: Identificador único da unidade
- `apartamento`: Número do apartamento (ex: 101A)
- `bloco`: Torre/Bloco (ex: B1, B2)
- `vagas_carro`: Quantidade de vagas de carro (1, 2, 3...)
- `vagas_moto`: Quantidade de vagas de moto (0, 1, 2...)
- `pcd`: true/false (Pessoa com Deficiência - RN02)
- `idoso`: true/false (Idade ≥ 60 anos - RN02)
- `inadimplente`: true/false (Com débitos - RN08)
- `presente`: true/false (Presente na assembleia - RN14)

---

## 2️⃣ CSV de Vagas (`vagas.csv`)

**Formato:** `id;numero;tipo;cobertura;acesso;pcd;idoso;critica;perto_elevador;perto_entrada;bloco`

```csv
id;numero;tipo;cobertura;acesso;pcd;idoso;critica;perto_elevador;perto_entrada;bloco
s-1;001;P;COVERED;FREE;true;false;false;true;false;B1
s-2;002;M;COVERED;FREE;false;true;false;true;false;B1
s-3;003;G;UNCOVERED;LOCKED;false;false;true;false;true;B1
s-4;004;MOTO;COVERED;FREE;false;false;false;false;false;B1
s-5;101;P;COVERED;FREE;false;false;false;true;false;B2
```

**Colunas:**
- `id`: Identificador único da vaga
- `numero`: Número da vaga (001, 002, A25, etc)
- `tipo`: P (pequena), M (média), G (grande), MOTO
- `cobertura`: COVERED (coberta) ou UNCOVERED (descoberta)
- `acesso`: FREE (livre) ou LOCKED (precisa manobra)
- `pcd`: true/false (Vaga reservada PCD)
- `idoso`: true/false (Vaga reservada Idoso)
- `critica`: true/false (Vaga ruim - longe, difícil, estreita)
- `perto_elevador`: true/false
- `perto_entrada`: true/false
- `bloco`: Torre/Bloco da vaga

---

## 3️⃣ CSV de Alocação Atual (`alocacao_atual.csv`) ⭐ **NOVO!**

**Formato:** `unidade_id;vaga_id`

```csv
unidade_id;vaga_id
u-1;s-25
u-2;s-103
u-3;s-47
u-4;s-89
u-5;s-12
```

**Colunas:**
- `unidade_id`: ID da unidade (deve existir no CSV de unidades)
- `vaga_id`: ID da vaga atual desta unidade (deve existir no CSV de vagas)

### 🎯 **Quando usar este CSV?**

#### ✅ **Usar quando:**
- É o **segundo, terceiro, quarto... sorteio anual**
- Você quer aplicar as **regras de compensação**:
  - **RN03**: Compensar quem estava em vaga descoberta
  - **RN04**: Compensar quem estava em vaga com acesso bloqueado
  - **RN09**: Rodízio de vagas críticas

#### ❌ **NÃO usar quando:**
- É o **primeiro sorteio** (nenhuma unidade tem histórico)
- Você quer fazer um sorteio "limpo" sem compensação

### 📤 Como obter este CSV?

**Opção 1:** Carregar resultado do sorteio anterior
```javascript
// Após sorteio de 2025, salve as alocações
const allocations = result.assignments.map(a => 
  `${a.unitId};${a.spaceId}`
).join('\n');

// Use este arquivo no sorteio de 2026
```

**Opção 2:** Exportar do banco de dados
```sql
SELECT unit_id, space_id 
FROM current_allocations 
WHERE active = true
ORDER BY unit_id;
```

**Opção 3:** Planilha manual
```
Se você mantém controle em Excel/Google Sheets,
exporte como CSV com essas duas colunas.
```

---

## 🔄 Fluxo Completo

### **Primeiro Sorteio (2025)**

```
1. Carrega: unidades.csv ✅
2. Carrega: vagas.csv ✅
3. Carrega: alocacao_atual.csv ❌ (deixa em branco!)
4. Executa sorteio
5. Baixa resultado (ZIP)
6. Salva "1_Relatorio_Assignments.csv" para usar em 2026
```

### **Segundo Sorteio (2026)**

```
1. Carrega: unidades.csv ✅
2. Carrega: vagas.csv ✅ (pode ter mudado!)
3. Carrega: alocacao_atual.csv ✅ (resultado de 2025)
   ↓
   Sistema enriquece automaticamente as unidades com:
   - Qual vaga tinham
   - Se era coberta/descoberta
   - Se era livre/trancada
   - Se era crítica
   ↓
4. Executa sorteio COM compensação
5. Regras RN03, RN04, RN09 funcionam!
```

---

## 📊 Exemplo Real

### **Ano 2025 - Primeiro Sorteio**

**Resultado:**
- Unidade u-1 (101A) → Vaga s-25 (descoberta, trancada)
- Unidade u-2 (102B) → Vaga s-103 (coberta, livre)
- Unidade u-3 (103C) → Vaga s-47 (crítica)

**Salva:** `alocacao_2025.csv`
```csv
unidade_id;vaga_id
u-1;s-25
u-2;s-103
u-3;s-47
```

### **Ano 2026 - Segundo Sorteio**

**Carrega:**
1. `unidades.csv` (mesmas unidades)
2. `vagas.csv` (mesmas vagas)
3. `alocacao_2025.csv` ← **AQUI!**

**Sistema processa:**
```
u-1 (101A):
  - Estava em s-25 (UNCOVERED, LOCKED)
  - Ganha: +80 pts (RN03) + +60 pts (RN04) = +140 pts
  - Prioridade para vagas cobertas e livres!

u-2 (102B):
  - Estava em s-103 (COVERED, FREE)
  - Não ganha compensação (já estava bem)

u-3 (103C):
  - Estava em s-47 (crítica)
  - Ganha: +100 pts (RN09)
  - Prioridade para vagas não-críticas!
```

**Resultado:** Sistema compensa quem estava mal! ✅

---

## 🛠️ Ferramentas

### Converter Excel para CSV
```
1. Abra no Excel/Google Sheets
2. Salvar Como → CSV (separado por ponto-e-vírgula)
3. OU use ";" como delimitador
```

### Validar CSV online
- https://csvlint.io/
- https://www.convertcsv.com/csv-viewer-editor.htm

### Gerar CSV de teste
Use o botão **"Gerar Dados Aleatórios"** na interface! ✨

---

## ⚠️ Erros Comuns

### 1. Unidade sem alocação no CSV
```
❌ u-10 não aparece em alocacao_atual.csv
✅ Sistema ignora e não aplica compensação para u-10
```

### 2. Vaga que não existe mais
```
❌ u-5 estava em s-999, mas s-999 não existe em vagas.csv
✅ Sistema avisa no console e ignora
```

### 3. Separador errado
```
❌ Usando vírgula: u-1,s-25
✅ Deve ser ponto-e-vírgula: u-1;s-25
```

### 4. IDs não batem
```
❌ unidades.csv tem "unidade-1"
❌ alocacao_atual.csv tem "u-1"
✅ IDs devem ser idênticos!
```

---

## 📝 Template Vazio

### `alocacao_atual.csv`
```csv
unidade_id;vaga_id
```

Copie e cole suas alocações abaixo do cabeçalho!
