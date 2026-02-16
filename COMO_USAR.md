# 📤 Como Usar o Sistema

## 🎯 Arquivos Necessários

### ✅ **Arquivo 1: Unidades** (OBRIGATÓRIO)

**Nome sugerido:** `unidades.csv`

**O que é:** Lista de todos os apartamentos/unidades do condomínio

**Baixe o exemplo:** [unidades_exemplo.csv](examples/unidades_exemplo.csv)

```csv
id;apartamento;bloco;vagas_carro;vagas_moto;pcd;idoso;inadimplente;presente
u-1;101A;B1;1;0;false;false;false;true
u-2;102B;B1;2;0;false;true;false;true
u-3;103C;B1;1;1;true;false;false;true
```

**Colunas explicadas:**
- `id`: Código único (ex: u-1, u-2, unid-101)
- `apartamento`: Número do apto (ex: 101A, 202B)
- `bloco`: Torre (ex: B1, Torre A, T2)
- `vagas_carro`: Quantas vagas de carro tem direito (1, 2, 3...)
- `vagas_moto`: Quantas vagas de moto tem direito (0, 1, 2...)
- `pcd`: Pessoa com deficiência? (true/false)
- `idoso`: Idade ≥ 60 anos? (true/false)
- `inadimplente`: Está devendo? (true/false)
- `presente`: Compareceu na assembleia? (true/false)

---

### ✅ **Arquivo 2: Vagas** (OBRIGATÓRIO)

**Nome sugerido:** `vagas.csv`

**O que é:** Lista de todas as vagas disponíveis no condomínio

**Baixe o exemplo:** [vagas_exemplo.csv](examples/vagas_exemplo.csv)

```csv
id;numero;tipo;cobertura;acesso;pcd;idoso;critica;perto_elevador;perto_entrada;bloco
s-1;001;P;COVERED;FREE;true;false;false;true;false;B1
s-2;002;M;COVERED;FREE;false;true;false;true;false;B1
s-3;003;G;UNCOVERED;LOCKED;false;false;true;false;true;B1
```

**Colunas explicadas:**
- `id`: Código único da vaga (ex: s-1, vaga-001)
- `numero`: Número pintado na vaga (ex: 001, A25, G-10)
- `tipo`: Tamanho
  - `P` = Pequena
  - `M` = Média
  - `G` = Grande
  - `MOTO` = Vaga de moto
- `cobertura`:
  - `COVERED` = Coberta
  - `UNCOVERED` = Descoberta
- `acesso`:
  - `FREE` = Acesso livre
  - `LOCKED` = Precisa manobra (outra vaga na frente)
- `pcd`: Reservada para PCD? (true/false)
- `idoso`: Reservada para idoso? (true/false)
- `critica`: Vaga ruim? (longe, estreita, difícil) (true/false)
- `perto_elevador`: Próxima ao elevador? (true/false)
- `perto_entrada`: Próxima à portaria? (true/false)
- `bloco`: Torre da vaga (ex: B1, Torre A)

---

### ⚠️ **Arquivo 3: Alocação Atual** (OPCIONAL)

**Nome sugerido:** `alocacao_atual.csv`

**Baixe o exemplo:** [alocacao_atual_exemplo.csv](examples/alocacao_atual_exemplo.csv)

```csv
unidade_id;vaga_id
u-1;s-25
u-2;s-103
u-3;s-47
```

**Quando usar?**

| Situação | Use este arquivo? |
|----------|-------------------|
| 🆕 **Primeiro sorteio do condomínio** | ❌ NÃO (deixe em branco) |
| 🔄 **Segundo, terceiro, quarto... sorteios** | ✅ SIM (carregue!) |
| 🎲 **Quer sorteio "limpo" sem considerar vagas anteriores** | ❌ NÃO |

**Por que usar?**

O sistema compensa moradores que estavam mal alocados:
- ✅ Estava em vaga **descoberta**? Ganha prioridade para vaga **coberta**
- ✅ Estava em vaga **com manobra**? Ganha prioridade para vaga **livre**
- ✅ Estava em vaga **ruim/crítica**? Ganha prioridade para vaga **boa**

**Como obter este arquivo?**

**Opção 1:** Após cada sorteio, o sistema gera o arquivo `1_Relatorio_Assignments.csv` no ZIP baixado. Use ele no ano seguinte!

**Opção 2:** Se você controla em planilha/banco de dados, exporte duas colunas:
- Coluna 1: ID da unidade
- Coluna 2: ID da vaga atual

---

## 🚀 Passo a Passo

### **Primeiro Sorteio do Condomínio**

```
1. Prepare: unidades.csv ✅
2. Prepare: vagas.csv ✅
3. Ignore: alocacao_atual.csv ❌

4. Abra o sistema
5. Clique em "📤 Unidades" → Carregue unidades.csv
6. Clique em "📤 Vagas" → Carregue vagas.csv
7. Deixe "Vagas Atuais" EM BRANCO
8. Clique em "Configurar Regras" →
9. Clique em "Iniciar Sorteio" →
10. Baixe o pacote ZIP
```

### **Sorteios Seguintes (Ano 2, 3, 4...)**

```
1. Prepare: unidades.csv ✅
2. Prepare: vagas.csv ✅
3. Prepare: alocacao_atual.csv ✅
   ↪️ Use o arquivo "1_Relatorio_Assignments.csv" do sorteio anterior!

4. Abra o sistema
5. Carregue os 3 arquivos
6. Sistema avisa: "X alocações encontradas"
7. Continue normalmente
8. Sorteio considera histórico! ✨
```

---

## 📊 Exemplo Visual

### **Situação Real:**

#### Ano 2025 - Primeiro Sorteio
```
Resultado:
│
├─ Unidade 101A → Vaga 025 (descoberta 🌧️, trancada 🚗🚗)
├─ Unidade 102B → Vaga 103 (coberta ☂️, livre ✅)
└─ Unidade 103C → Vaga 047 (crítica ⚠️)
```

**Salva:** Arquivo `1_Relatorio_Assignments.csv` do ZIP baixado

#### Ano 2026 - Segundo Sorteio

**Carrega:**
- ✅ `unidades.csv`
- ✅ `vagas.csv`
- ✅ `alocacao_atual.csv` ← (arquivo do ano passado!)

**Sistema compensa:**
```
│
├─ Unidade 101A:
│  └─ Estava em vaga ruim (descoberta + trancada)
│  └─ Ganha +140 pontos extras!
│  └─ Maior chance de pegar vaga boa agora ✨
│
├─ Unidade 102B:
│  └─ Estava em vaga boa (coberta + livre)
│  └─ Pontuação normal
│
└─ Unidade 103C:
    └─ Estava em vaga crítica
    └─ Ganha +100 pontos extras!
    └─ Prioridade para vaga melhor ✨
```

**Resultado:** Sistema equilibra! Quem estava mal, melhora.

---

## ⚙️ Formato Técnico

**Separador:** `;` (ponto-e-vírgula)
**Codificação:** UTF-8
**Primeira linha:** Cabeçalho (obrigatório)
**Valores booleanos:** `true` ou `false` (minúsculas)

---

## ❓ Dúvidas Frequentes

### 1. "Posso usar vírgula ao invés de ponto-e-vírgula?"
❌ Não. O sistema espera `;`

Se seu Excel exporta com vírgula, use "Salvar Como" → Escolha "CSV (separado por ponto-e-vírgula)"

### 2. "Meu ID pode ter espaços ou acentos?"
⚠️ Evite! Use apenas:
- Letras (a-z, A-Z)
- Números (0-9)
- Hífen (-)
- Underscore (_)

✅ Exemplos bons: `u-1`, `unid_101`, `apt-101A`
❌ Exemplos ruins: `apto 101`, `unidade 1`, `101Â`

### 3. "Posso ter mais unidades que vagas?"
❌ Não! O sistema bloqueia e mostra erro.

**Fórmula:**
```
Total de Vagas ≥ Soma de (carros + motos) de todas unidades
```

### 4. "O que acontece se eu não carregar o arquivo 3?"
✅ Sistema funciona normalmente! Só não aplicará compensação de histórico.

### 5. "Como sei se funcionou?"
O sistema mostra:
- ✅ "50 UNIDADES" carregadas
- ✅ "65 VAGAS" carregadas
- ✅ "45 ALOCAÇÕES" carregadas (se você carregou o arquivo 3)

---

## 🎁 Arquivos de Exemplo Prontos

📁 **Pasta:** `examples/`

- 📄 `unidades_exemplo.csv` - 10 unidades de exemplo
- 📄 `vagas_exemplo.csv` - 12 vagas de exemplo
- 📄 `alocacao_atual_exemplo.csv` - 10 alocações de exemplo

**Baixe, edite com seus dados, e use!**

---

## 🆘 Precisa de Ajuda?

1. Use o botão **"Gerar Dados Aleatórios"** para ver exemplos funcionando
2. Baixe os arquivos de exemplo da pasta `examples/`
3. Consulte a documentação técnica completa em `CSV_FORMAT.md`

---

## ✅ Checklist Antes do Sorteio

- [ ] Arquivo `unidades.csv` preparado
- [ ] Arquivo `vagas.csv` preparado
- [ ] (Opcional) Arquivo `alocacao_atual.csv` preparado
- [ ] Total de vagas ≥ Total de demandas
- [ ] Todos os IDs são únicos
- [ ] Separador é `;` (ponto-e-vírgula)
- [ ] Assembleia aprovou os pesos das regras
- [ ] Síndico gerou a seed pública na frente de todos

**Pronto! Agora é só executar o sorteio.** 🎯
