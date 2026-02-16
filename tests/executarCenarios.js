#!/usr/bin/env node

/**
 * RUNNER DE CENÁRIOS DE TESTE
 * 
 * Executa múltiplos cenários e compara resultados.
 * 
 * Uso:
 * - node runScenarios.js                    # Executa todos
 * - node runScenarios.js realistic          # Executa categoria
 * - node runScenarios.js --compare          # Compara resultados
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar raffle engine
const raffleEnginePath = path.join(__dirname, '../app_old/utils/raffleEngine.ts');
let runRaffleAllocation;

// Como é TypeScript, vamos precisar de uma abordagem diferente
// Por enquanto, vamos criar um mock simples para demonstração
// Na prática, você rodaria via ts-node ou compilaria primeiro

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper de cores
const c = {
  title: (text) => `${colors.bright}${colors.cyan}${text}${colors.reset}`,
  pass: (text) => `${colors.green}${text}${colors.reset}`,
  fail: (text) => `${colors.red}${text}${colors.reset}`,
  warn: (text) => `${colors.yellow}${text}${colors.reset}`,
  info: (text) => `${colors.blue}${text}${colors.reset}`,
  metric: (text) => `${colors.magenta}${text}${colors.reset}`,
};

/**
 * Busca todos os arquivos de cenário em uma categoria
 */
function findScenarios(category = null) {
  const scenariosDir = path.join(__dirname, 'cenarios');
  const scenarios = [];
  
  function scanDir(dir, cat = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!category || entry.name === category) {
          scanDir(fullPath, entry.name);
        }
      } else if (entry.name.endsWith('.scenario.js')) {
        scenarios.push({
          path: fullPath,
          category: cat,
          name: entry.name.replace('.scenario.js', '')
        });
      }
    }
  }
  
  scanDir(scenariosDir);
  return scenarios;
}

/**
 * Carrega um cenário
 */
async function loadScenario(scenarioPath) {
  const module = await import(scenarioPath);
  return module.scenario || module.default;
}

/**
 * Calcula estatísticas de um resultado
 */
function calculateStats(result) {
  const allocated = result.allocations.filter(a => a.spaceId);
  const scores = allocated.map(a => a.score);
  
  // Média
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Mediana
  const sorted = [...scores].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  // Gini Coefficient
  const n = scores.length;
  let sumDiff = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sumDiff += Math.abs(scores[i] - scores[j]);
    }
  }
  const gini = sumDiff / (2 * n * n * mean);
  
  // Fairness Index (Jain)
  const sumScores = scores.reduce((a, b) => a + b, 0);
  const sumSquares = scores.reduce((a, b) => a + b * b, 0);
  const fairness = (sumScores * sumScores) / (n * sumSquares);
  
  return {
    allocationRate: allocated.length / result.allocations.length,
    mean,
    median,
    gini,
    fairness,
    totalAllocated: allocated.length,
    totalUnits: result.allocations.length
  };
}

/**
 * Valida resultado contra expectativas
 */
function validateResult(stats, expected) {
  const validations = [];
  
  if (expected.allocationRate) {
    const pass = stats.allocationRate >= expected.allocationRate - 0.05;
    validations.push({
      name: 'Allocation Rate',
      expected: expected.allocationRate,
      actual: stats.allocationRate,
      pass
    });
  }
  
  if (expected.minFairnessIndex) {
    const pass = stats.fairness >= expected.minFairnessIndex;
    validations.push({
      name: 'Fairness Index',
      expected: `≥ ${expected.minFairnessIndex}`,
      actual: stats.fairness,
      pass
    });
  }
  
  if (expected.maxGini) {
    const pass = stats.gini <= expected.maxGini;
    validations.push({
      name: 'Gini Coefficient',
      expected: `≤ ${expected.maxGini}`,
      actual: stats.gini,
      pass
    });
  }
  
  return validations;
}

/**
 * Executa um cenário
 */
async function runScenario(scenarioInfo) {
  console.log(`\n${c.title('═'.repeat(80))}`);
  console.log(c.title(`  ${scenarioInfo.category}/${scenarioInfo.name}`));
  console.log(c.title('═'.repeat(80)));
  
  try {
    // Carrega cenário
    const scenario = await loadScenario(scenarioInfo.path);
    console.log(c.info(`\n📋 ${scenario.name}`));
    console.log(`   ${scenario.description}`);
    
    // Mostra estatísticas do cenário
    console.log(c.info(`\n📊 Configuração:`));
    console.log(`   • Unidades: ${scenario.units.length}`);
    console.log(`   • Vagas: ${scenario.spaces.length}`);
    console.log(`   • Ratio: ${(scenario.spaces.length / scenario.units.length * 100).toFixed(1)}%`);
    
    // Conta categorias especiais
    const pcds = scenario.units.filter(u => u.isPCD).length;
    const elderly = scenario.units.filter(u => u.isElderly).length;
    const defaulting = scenario.units.filter(u => u.isDefaulting).length;
    
    if (pcds > 0) console.log(`   • PCDs: ${pcds}`);
    if (elderly > 0) console.log(`   • Idosos: ${elderly}`);
    if (defaulting > 0) console.log(`   • Inadimplentes: ${defaulting}`);
    
    // NOTA: Aqui você integraria com o motor de sorteio real
    // Por enquanto, vamos simular um resultado
    console.log(c.warn(`\n⚠️  Executando em modo SIMULAÇÃO (integração pendente)`));
    console.log(`   Para executar de verdade, integre com raffleEngine.ts`);
    
    // Mock de resultado (substitua com chamada real)
    const mockResult = {
      allocations: scenario.units.map((unit, i) => ({
        unitId: unit.id,
        spaceId: i < scenario.spaces.length ? scenario.spaces[i].id : null,
        score: 100 + Math.random() * 50
      }))
    };
    
    // Calcula estatísticas
    const stats = calculateStats(mockResult);
    
    console.log(c.metric(`\n📈 Resultados:`));
    console.log(`   • Taxa Alocação: ${(stats.allocationRate * 100).toFixed(1)}%`);
    console.log(`   • Fairness Index: ${stats.fairness.toFixed(4)}`);
    console.log(`   • Gini Coefficient: ${stats.gini.toFixed(4)}`);
    console.log(`   • Score Médio: ${stats.mean.toFixed(2)}`);
    console.log(`   • Score Mediano: ${stats.median.toFixed(2)}`);
    
    // Valida expectativas
    if (scenario.expectedResults) {
      const validations = validateResult(stats, scenario.expectedResults);
      
      console.log(c.info(`\n✓ Validações:`));
      const passed = validations.filter(v => v.pass).length;
      const total = validations.length;
      
      for (const v of validations) {
        const icon = v.pass ? '✓' : '✗';
        const color = v.pass ? c.pass : c.fail;
        const actualStr = typeof v.actual === 'number' ? v.actual.toFixed(4) : v.actual;
        console.log(color(`   ${icon} ${v.name}: ${actualStr} (esperado: ${v.expected})`));
      }
      
      const passRate = (passed / total * 100).toFixed(1);
      console.log(`\n   ${c.metric(`Validações: ${passed}/${total} (${passRate}%)`)}`);
      
      return {
        scenario: scenarioInfo,
        stats,
        validations,
        passed,
        total,
        success: passed === total
      };
    }
    
    return {
      scenario: scenarioInfo,
      stats,
      success: true
    };
    
  } catch (error) {
    console.log(c.fail(`\n✗ ERRO: ${error.message}`));
    console.log(error.stack);
    
    return {
      scenario: scenarioInfo,
      error: error.message,
      success: false
    };
  }
}

/**
 * Gera relatório comparativo
 */
function generateReport(results) {
  console.log(`\n\n${c.title('═'.repeat(80))}`);
  console.log(c.title('  RELATÓRIO COMPARATIVO'));
  console.log(c.title('═'.repeat(80)));
  
  // Agrupa por categoria
  const byCategory = {};
  for (const result of results) {
    const cat = result.scenario.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(result);
  }
  
  // Mostra por categoria
  for (const [category, catResults] of Object.entries(byCategory)) {
    console.log(c.info(`\n📁 ${category}/`));
    
    for (const result of catResults) {
      const icon = result.success ? c.pass('✓') : c.fail('✗');
      const name = result.scenario.name.padEnd(30);
      
      if (result.stats) {
        const alloc = `${(result.stats.allocationRate * 100).toFixed(0)}%`.padStart(5);
        const fair = result.stats.fairness.toFixed(3);
        const gini = result.stats.gini.toFixed(3);
        console.log(`   ${icon} ${name} │ Alloc: ${alloc} │ Fair: ${fair} │ Gini: ${gini}`);
      } else {
        console.log(`   ${icon} ${name} │ ${c.fail('ERRO')}`);
      }
    }
  }
  
  // Resumo geral
  const total = results.length;
  const passed = results.filter(r => r.success).length;
  const failed = total - passed;
  
  console.log(`\n${c.title('─'.repeat(80))}`);
  console.log(c.metric(`  Total de Cenários: ${total}`));
  console.log(c.pass(`  ✓ Passou: ${passed}`));
  if (failed > 0) {
    console.log(c.fail(`  ✗ Falhou: ${failed}`));
  }
  
  const successRate = (passed / total * 100).toFixed(1);
  console.log(c.metric(`\n  Taxa de Sucesso: ${successRate}%`));
  
  // Estatísticas agregadas
  const withStats = results.filter(r => r.stats);
  if (withStats.length > 0) {
    const avgFairness = withStats.reduce((sum, r) => sum + r.stats.fairness, 0) / withStats.length;
    const avgGini = withStats.reduce((sum, r) => sum + r.stats.gini, 0) / withStats.length;
    const avgAlloc = withStats.reduce((sum, r) => sum + r.stats.allocationRate, 0) / withStats.length;
    
    console.log(c.info(`\n  Médias Gerais:`));
    console.log(`    • Fairness Index: ${avgFairness.toFixed(4)}`);
    console.log(`    • Gini Coefficient: ${avgGini.toFixed(4)}`);
    console.log(`    • Allocation Rate: ${(avgAlloc * 100).toFixed(1)}%`);
  }
  
  console.log(c.title('\n' + '═'.repeat(80) + '\n'));
}

/**
 * Main
 */
async function main() {
  const args = process.argv.slice(2);
  const category = args.find(a => !a.startsWith('--'));
  const compare = args.includes('--compare');
  
  console.log(c.title('\n╔═══════════════════════════════════════════════════════════════╗'));
  console.log(c.title('║  RUNNER DE CENÁRIOS - Smart Parking Engine v2.5              ║'));
  console.log(c.title('╚═══════════════════════════════════════════════════════════════╝\n'));
  
  // Busca cenários
  const scenarios = findScenarios(category);
  
  if (scenarios.length === 0) {
    console.log(c.fail('✗ Nenhum cenário encontrado!'));
    if (category) {
      console.log(c.warn(`  Categoria "${category}" não existe ou está vazia.`));
    }
    process.exit(1);
  }
  
  console.log(c.info(`📦 Encontrados ${scenarios.length} cenários`));
  if (category) {
    console.log(c.info(`🎯 Categoria: ${category}`));
  } else {
    console.log(c.info(`🎯 Executando TODOS os cenários`));
  }
  
  // Executa cenários
  const results = [];
  for (const scenario of scenarios) {
    const result = await runScenario(scenario);
    results.push(result);
  }
  
  // Gera relatório
  generateReport(results);
  
  // Exit code
  const allPassed = results.every(r => r.success);
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error(c.fail(`\n✗ ERRO FATAL: ${error.message}`));
  console.error(error.stack);
  process.exit(1);
});
