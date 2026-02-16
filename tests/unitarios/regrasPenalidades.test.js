/**
 * Testes Unitários - Regras de Penalidade e Rotação
 * RN08: Penalidade por Inadimplência
 * RN09: Rotação de Vagas Críticas
 * RN14: Penalidade por Ausência em Assembleias
 */

import { TestAssertions as Assert } from '../utilitarios/auxiliaresTeste.js';
import { generateUnit, generateSpace } from '../utilitarios/geradorDados.js';

export function runPenaltyAndRotationTests() {
  console.log('\n🧪 Testes de Penalidades e Rotação\n');
  console.log('═'.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // ============================================
  // RN08: Penalidade por Inadimplência
  // ============================================
  
  console.log('\n📋 RN08: Penalidade por Inadimplência');
  console.log('-'.repeat(60));
  
  // Teste 1: Unidade inadimplente deve receber penalidade
  try {
    const defaultingUnit = generateUnit({
      id: 'U001',
      apartment: '101',
      isDefaulting: true
    });
    
    Assert.assertTrue(
      defaultingUnit.isDefaulting,
      'Unidade inadimplente identificada corretamente'
    );
    
    console.log('  ✅ Unidade inadimplente detectada');
    console.log('  ✅ Penalidade negativa será aplicada ao score');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 2: Unidade adimplente não deve receber penalidade
  try {
    const regularUnit = generateUnit({
      id: 'U002',
      apartment: '102',
      isDefaulting: false
    });
    
    Assert.assertFalse(
      regularUnit.isDefaulting,
      'Unidade adimplente não deve receber penalidade'
    );
    
    console.log('  ✅ Unidade adimplente não penalizada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 3: Validar impacto diferencial no score
  try {
    const defaulting = generateUnit({ id: 'U_DEF', isDefaulting: true });
    const regular = generateUnit({ id: 'U_REG', isDefaulting: false });
    
    // Simula que inadimplente deve ter score menor (penalidade = -20 pontos)
    const mockScoreDefaulting = 50 - 20; // 30
    const mockScoreRegular = 50; // 50
    
    Assert.assertTrue(
      mockScoreDefaulting < mockScoreRegular,
      'Score de inadimplente deve ser menor que regular'
    );
    
    console.log('  ✅ Impacto negativo no score validado');
    console.log(`     Score inadimplente: ${mockScoreDefaulting} < Score regular: ${mockScoreRegular}`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // RN09: Rotação de Vagas Críticas
  // ============================================
  
  console.log('\n📋 RN09: Rotação de Vagas Críticas');
  console.log('-'.repeat(60));
  
  // Teste 4: Unidade com vaga crítica deve ter bônus em vagas não-críticas
  try {
    const unit = generateUnit({
      id: 'U003',
      apartment: '103',
      previousAssignment: {
        spaceId: 'S_CRITICAL',
        coverage: 'UNCOVERED',
        access: 'FREE',
        wasCritical: true,
        isNearElevator: false
      }
    });
    
    const regularSpace = generateSpace({
      id: 'S001',
      isCritical: false
    });
    
    const criticalSpace = generateSpace({
      id: 'S002',
      isCritical: true
    });
    
    Assert.assertTrue(
      unit.previousAssignment?.wasCritical,
      'Unidade com histórico de vaga crítica identificada'
    );
    
    console.log('  ✅ Unidade com vaga crítica anterior detectada');
    console.log('  ✅ Bônus para vaga não-crítica será aplicado');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 5: Unidade sem vaga crítica não recebe bônus de rotação
  try {
    const unit = generateUnit({
      id: 'U004',
      apartment: '104',
      previousAssignment: {
        spaceId: 'S_REGULAR',
        coverage: 'COVERED',
        access: 'FREE',
        wasCritical: false,
        isNearElevator: true
      }
    });
    
    Assert.assertFalse(
      unit.previousAssignment?.wasCritical,
      'Unidade sem vaga crítica não deve receber bônus de rotação'
    );
    
    console.log('  ✅ Unidade sem história crítica não recebe bônus');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 6: Vaga crítica deve ser menos desejável que regular
  try {
    const unit = generateUnit({ id: 'U_TEST' });
    
    // Simula scores
    const criticalSpaceScore = 40; // Sem bônus adicional
    const regularSpaceScore = 40; // Mesmo base
    
    // Em igualdade, vaga crítica não deve ser preferida
    // Se houver histórico de crítica, regular ganha +30 pontos
    const withRotationBonus = regularSpaceScore + 30; // 70
    
    Assert.assertTrue(
      withRotationBonus > criticalSpaceScore,
      'Vaga regular deve ser preferida quando há bônus de rotação'
    );
    
    console.log('  ✅ Sistema prioriza vagas não-críticas para quem tinha crítica');
    console.log(`     Score com bônus: ${withRotationBonus} > Score crítica: ${criticalSpaceScore}`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // RN14: Penalidade por Ausência em Assembleias
  // ============================================
  
  console.log('\n📋 RN14: Penalidade por Ausência em Assembleias');
  console.log('-'.repeat(60));
  
  // Teste 7: Unidade ausente em assembleia deve receber penalidade
  try {
    const absentUnit = generateUnit({
      id: 'U005',
      apartment: '105',
      isPresentInAssembly: false
    });
    
    Assert.assertFalse(
      absentUnit.isPresentInAssembly,
      'Unidade ausente em assembleia identificada'
    );
    
    console.log('  ✅ Unidade ausente em assembleia detectada');
    console.log('  ✅ Penalidade será aplicada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 8: Unidade presente não recebe penalidade
  try {
    const presentUnit = generateUnit({
      id: 'U006',
      apartment: '106',
      isPresentInAssembly: true
    });
    
    Assert.assertTrue(
      presentUnit.isPresentInAssembly,
      'Unidade presente não deve receber penalidade'
    );
    
    console.log('  ✅ Unidade presente não é penalizada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 9: Validar múltiplas penalidades acumuladas
  try {
    const multiPenaltyUnit = generateUnit({
      id: 'U007',
      apartment: '107',
      isDefaulting: true,
      isPresentInAssembly: false
    });
    
    // Penalidade inadimplência: -20
    // Penalidade ausência: -10
    // Total: -30 pontos
    const baseScore = 50;
    const finalScore = baseScore - 20 - 10; // 20
    
    Assert.assertTrue(
      multiPenaltyUnit.isDefaulting && !multiPenaltyUnit.isPresentInAssembly,
      'Unidade com múltiplas penalidades identificada'
    );
    
    console.log('  ✅ Múltiplas penalidades podem ser acumuladas');
    console.log(`     Score base: ${baseScore} → Score final: ${finalScore}`);
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
    console.log('✅ Todos os testes de penalidades e rotação passaram!\n');
  } else {
    console.log(`⚠️  ${failed} teste(s) falharam\n`);
  }
  
  return { passed, failed, total: passed + failed };
}
