#!/usr/bin/env node

/**
 * RUNNER DE CENÁRIO INDIVIDUAL
 * 
 * Executa um único cenário e mostra resultados detalhados.
 * 
 * Uso:
 *   node executarCenario.js cenarios/realisticos/condominio-pequeno.scenario.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cores
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

const c = {
  title: (text) => `${colors.bright}${colors.cyan}${text}${colors.reset}`,
  pass: (text) => `${colors.green}${text}${colors.reset}`,
  fail: (text) => `${colors.red}${text}${colors.reset}`,
  warn: (text) => `${colors.yellow}${text}${colors.reset}`,
  info: (text) => `${colors.blue}${text}${colors.reset}`,
  metric: (text) => `${colors.magenta}${text}${colors.reset}`,
};

async function runSingleScenario(scenarioPath) {
  console.log(c.title('\n╔═══════════════════════════════════════════════════════════════╗'));
  console.log(c.title('║  RUNNER DE CENÁRIO INDIVIDUAL                                 ║'));
  console.log(c.title('╚═══════════════════════════════════════════════════════════════╝\n'));
  
  // Resolve path
  const fullPath = path.isAbsolute(scenarioPath) 
    ? scenarioPath 
    : path.join(__dirname, scenarioPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(c.fail(`✗ Arquivo não encontrado: ${fullPath}`));
    process.exit(1);
  }
  
  console.log(c.info(`📄 Carregando: ${path.basename(fullPath)}\n`));
  
  // Carrega cenário
  const module = await import(fullPath);
  const scenario = module.scenario || module.default;
  
  // Header
  console.log(c.title('═'.repeat(80)));
  console.log(c.title(`  ${scenario.name}`));
  console.log(c.title('═'.repeat(80)));
  console.log(`\n${scenario.description}\n`);
  
  // Estatísticas de entrada
  console.log(c.info('📊 DADOS DE ENTRADA:'));
  console.log(`\n  Unidades: ${scenario.units.length}`);
  console.log(`  Vagas: ${scenario.spaces.length}`);
  console.log(`  Ratio: ${(scenario.spaces.length / scenario.units.length * 100).toFixed(1)}%`);
  
  // Breakdown de unidades
  const breakdown = {
    pcd: scenario.units.filter(u => u.isPCD).length,
    elderly: scenario.units.filter(u => u.isElderly).length,
    defaulting: scenario.units.filter(u => u.isDefaulting).length,
    absent: scenario.units.filter(u => !u.isPresentInAssembly).length,
    regular: scenario.units.filter(u => !u.isPCD && !u.isElderly && !u.isDefaulting).length
  };
  
  console.log(c.info('\n  Breakdown de Unidades:'));
  if (breakdown.pcd > 0) console.log(`    • PCDs: ${breakdown.pcd}`);
  if (breakdown.elderly > 0) console.log(`    • Idosos: ${breakdown.elderly}`);
  if (breakdown.defaulting > 0) console.log(`    • Inadimplentes: ${breakdown.defaulting}`);
  if (breakdown.absent > 0) console.log(`    • Ausentes: ${breakdown.absent}`);
  console.log(`    • Regulares: ${breakdown.regular}`);
  
  // Breakdown de vagas
  const spaceBreakdown = {
    pcd: scenario.spaces.filter(s => s.isPCD).length,
    elderly: scenario.spaces.filter(s => s.isElderly).length,
    covered: scenario.spaces.filter(s => s.coverage === 'COVERED').length,
    locked: scenario.spaces.filter(s => s.access === 'LOCKED').length,
    critical: scenario.spaces.filter(s => s.isCritical).length
  };
  
  console.log(c.info('\n  Breakdown de Vagas:'));
  if (spaceBreakdown.pcd > 0) console.log(`    • PCD: ${spaceBreakdown.pcd}`);
  if (spaceBreakdown.elderly > 0) console.log(`    • Idoso: ${spaceBreakdown.elderly}`);
  console.log(`    • Cobertas: ${spaceBreakdown.covered}`);
  if (spaceBreakdown.locked > 0) console.log(`    • Trancadas: ${spaceBreakdown.locked}`);
  if (spaceBreakdown.critical > 0) console.log(`    • Críticas: ${spaceBreakdown.critical}`);
  
  // Config
  console.log(c.info('\n  Configuração:'));
  console.log(`    • Seed: ${scenario.config.seed}`);
  
  // Expectativas
  if (scenario.expectedResults) {
    console.log(c.info('\n📋 EXPECTATIVAS:'));
    for (const [key, value] of Object.entries(scenario.expectedResults)) {
      let displayValue = value;
      if (typeof value === 'number') {
        displayValue = value < 1 ? (value * 100).toFixed(1) + '%' : value.toFixed(2);
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Sim' : 'Não';
      }
      console.log(`    • ${key}: ${displayValue}`);
    }
  }
  
  // Nota de integração
  console.log(c.warn('\n\n⚠️  NOTA IMPORTANTE:'));
  console.log(c.warn('  Este runner mostra a estrutura do cenário.'));
  console.log(c.warn('  Para executar o sorteio real, integre com raffleEngine.ts'));
  console.log(c.warn('  usando ts-node ou compilando para JavaScript.\n'));
  
  console.log(c.title('═'.repeat(80)));
  console.log(c.pass('\n✓ Cenário validado e pronto para execução\n'));
}

// Main
const scenarioPath = process.argv[2];

if (!scenarioPath) {
  console.log(c.fail('\n✗ Uso: node executarCenario.js <caminho-do-cenário>\n'));
  console.log('Exemplos:');
  console.log('  node executarCenario.js cenarios/realisticos/condominio-pequeno.scenario.js');
  console.log('  node executarCenario.js cenarios/casos-extremos/escassez.scenario.js');
  console.log('');
  process.exit(1);
}

runSingleScenario(scenarioPath).catch(error => {
  console.error(c.fail(`\n✗ ERRO: ${error.message}`));
  console.error(error.stack);
  process.exit(1);
});
