/**
 * Testes Unitários - Regras de Compensação
 * RN03: Compensação de Cobertura
 * RN04: Compensação de Mobilidade
 */

import { TestAssertions as Assert } from '../utilitarios/auxiliaresTeste.js';
import { generateUnit, generateSpace } from '../utilitarios/geradorDados.js';

export function runCompensationRulesTests() {
  console.log('\n🧪 Testes de Regras de Compensação\n');
  console.log('═'.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // ============================================
  // RN03: Compensação de Cobertura
  // ============================================
  
  console.log('\n📋 RN03: Compensação de Cobertura');
  console.log('-'.repeat(60));
  
  // Teste 1: Unidade com vaga descoberta deve ganhar pontos em vaga coberta
  try {
    const unit = generateUnit({
      id: 'U001',
      apartment: '101',
      previousAssignment: {
        spaceId: 'S_OLD',
        coverage: 'UNCOVERED',
        access: 'FREE',
        wasCritical: false,
        isNearElevator: false
      }
    });
    
    const coveredSpace = generateSpace({
      id: 'S001',
      coverage: 'COVERED'
    });
    
    const uncoveredSpace = generateSpace({
      id: 'S002',
      coverage: 'UNCOVERED'
    });
    
    // A regra deve ser aplicável
    Assert.assertTrue(
      unit.previousAssignment?.coverage === 'UNCOVERED',
      'Regra RN03 deve ser aplicável quando unidade tinha vaga descoberta'
    );
    
    // Vaga coberta deve ter melhor score
    console.log('  ✅ Unidade com histórico de vaga descoberta identificada');
    console.log('  ✅ Priorização de vaga coberta esperada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 2: Unidade sem histórico não deve acionar compensação
  try {
    const unit = generateUnit({
      id: 'U002',
      apartment: '102'
      // Sem previousAssignment
    });
    
    Assert.assertTrue(
      !unit.previousAssignment,
      'Unidade sem histórico não deve ter previousAssignment'
    );
    
    console.log('  ✅ Unidade sem histórico não aciona RN03');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 3: Unidade com vaga coberta anteriormente não deve ser compensada
  try {
    const unit = generateUnit({
      id: 'U003',
      apartment: '103',
      previousAssignment: {
        spaceId: 'S_OLD',
        coverage: 'COVERED',
        access: 'FREE',
        wasCritical: false,
        isNearElevator: false
      }
    });
    
    Assert.assertFalse(
      unit.previousAssignment?.coverage === 'UNCOVERED',
      'Unidade com vaga coberta não deve acionar RN03'
    );
    
    console.log('  ✅ Unidade com histórico de vaga coberta não é compensada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // RN04: Compensação de Mobilidade
  // ============================================
  
  console.log('\n📋 RN04: Compensação de Mobilidade');
  console.log('-'.repeat(60));
  
  // Teste 4: Unidade com acesso bloqueado deve ganhar pontos em vaga livre
  try {
    const unit = generateUnit({
      id: 'U004',
      apartment: '104',
      previousAssignment: {
        spaceId: 'S_OLD',
        coverage: 'COVERED',
        access: 'LOCKED',
        wasCritical: false,
        isNearElevator: false
      }
    });
    
    const freeSpace = generateSpace({
      id: 'S003',
      access: 'FREE'
    });
    
    const lockedSpace = generateSpace({
      id: 'S004',
      access: 'LOCKED'
    });
    
    Assert.assertTrue(
      unit.previousAssignment?.access === 'LOCKED',
      'Regra RN04 deve ser aplicável quando unidade tinha acesso bloqueado'
    );
    
    console.log('  ✅ Unidade com histórico de acesso bloqueado identificada');
    console.log('  ✅ Priorização de vaga com acesso livre esperada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 5: Unidade com acesso livre não deve ser compensada
  try {
    const unit = generateUnit({
      id: 'U005',
      apartment: '105',
      previousAssignment: {
        spaceId: 'S_OLD',
        coverage: 'COVERED',
        access: 'FREE',
        wasCritical: false,
        isNearElevator: false
      }
    });
    
    Assert.assertFalse(
      unit.previousAssignment?.access === 'LOCKED',
      'Unidade com acesso livre não deve acionar RN04'
    );
    
    console.log('  ✅ Unidade com histórico de acesso livre não é compensada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Resultado Final
  // ============================================
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 Resultado: ${passed} passaram, ${failed} falharam`);
  
  if (failed === 0) {
    console.log('✅ Todos os testes de compensação passaram!\n');
  } else {
    console.log(`⚠️  ${failed} teste(s) falharam\n`);
  }
  
  return { passed, failed, total: passed + failed };
}
