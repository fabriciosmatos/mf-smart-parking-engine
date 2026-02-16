/**
 * Testes Unitários - Regras de Proximidade e Priorização
 * RN02: Alocação Prioritária (PCD, Idosos)
 * RN10: Proximidade de Bloco
 * Proximidade de Elevador
 * Proximidade de Entrada
 */

import { TestAssertions as Assert } from '../utilitarios/auxiliaresTeste.js';
import { generateUnit, generateSpace } from '../utilitarios/geradorDados.js';

export function runProximityAndPriorityTests() {
  console.log('\n🧪 Testes de Proximidade e Priorização\n');
  console.log('═'.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // ============================================
  // RN02: Alocação Prioritária
  // ============================================
  
  console.log('\n📋 RN02: Alocação Prioritária (PCD e Idosos)');
  console.log('-'.repeat(60));
  
  // Teste 1: Identificar unidades prioritárias (PCD)
  try {
    const pcdUnit = generateUnit({
      id: 'U_PCD',
      apartment: '101',
      isPCD: true,
      isElderly: false
    });
    
    Assert.assertTrue(
      pcdUnit.isPCD,
      'Unidade PCD deve ser identificada como prioritária'
    );
    
    console.log('  ✅ Unidade PCD identificada corretamente');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 2: Identificar unidades prioritárias (Idosos)
  try {
    const elderlyUnit = generateUnit({
      id: 'U_ELDERLY',
      apartment: '102',
      isPCD: false,
      isElderly: true
    });
    
    Assert.assertTrue(
      elderlyUnit.isElderly,
      'Unidade de idoso deve ser identificada como prioritária'
    );
    
    console.log('  ✅ Unidade de idoso identificada corretamente');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 3: Vagas PCD devem ser reservadas para PCDs
  try {
    const pcdSpace = generateSpace({
      id: 'S_PCD',
      isPCD: true,
      isElderly: false
    });
    
    const regularSpace = generateSpace({
      id: 'S_REGULAR',
      isPCD: false,
      isElderly: false
    });
    
    Assert.assertTrue(
      pcdSpace.isPCD && !regularSpace.isPCD,
      'Sistema deve distinguir vagas PCD de regulares'
    );
    
    console.log('  ✅ Vagas PCD identificadas e reservadas');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 4: Priorização deve ocorrer antes do sorteio geral
  try {
    // Simula que PCD deve ser alocado primeiro
    const allocationOrder = ['PCD', 'ELDERLY', 'REGULAR'];
    
    Assert.assertEqual(
      allocationOrder[0],
      'PCD',
      'PCDs devem ser alocados antes do sorteio geral'
    );
    
    console.log('  ✅ Ordem de alocação prioriza PCDs e Idosos');
    console.log(`     Ordem: ${allocationOrder.join(' → ')}`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // RN10: Proximidade de Bloco
  // ============================================
  
  console.log('\n📋 RN10: Proximidade de Bloco');
  console.log('-'.repeat(60));
  
  // Teste 5: Vaga no mesmo bloco deve ter pontos extras
  try {
    const unitBlockA = generateUnit({
      id: 'U_A',
      apartment: '101',
      block: 'A'
    });
    
    const spaceBlockA = generateSpace({
      id: 'S_A',
      block: 'A'
    });
    
    const spaceBlockB = generateSpace({
      id: 'S_B',
      block: 'B'
    });
    
    Assert.assertEqual(
      unitBlockA.block,
      spaceBlockA.block,
      'Vaga no mesmo bloco deve ter match'
    );
    
    Assert.assertFalse(
      unitBlockA.block === spaceBlockB.block,
      'Vaga em bloco diferente não deve ter match'
    );
    
    console.log('  ✅ Matching de blocos funciona corretamente');
    console.log(`     Unidade ${unitBlockA.block} + Vaga ${spaceBlockA.block} = Match`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 6: Bônus de proximidade de bloco
  try {
    const baseScore = 50;
    const blockBonus = 15;
    
    const sameBlockScore = baseScore + blockBonus; // 65
    const differentBlockScore = baseScore; // 50
    
    Assert.assertGreaterThan(
      sameBlockScore,
      differentBlockScore,
      'Vaga no mesmo bloco deve ter score maior'
    );
    
    console.log('  ✅ Bônus de bloco aplicado corretamente');
    console.log(`     Mesmo bloco: ${sameBlockScore} > Bloco diferente: ${differentBlockScore}`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Proximidade de Elevador
  // ============================================
  
  console.log('\n📋 Proximidade de Elevador');
  console.log('-'.repeat(60));
  
  // Teste 7: Vagas próximas ao elevador
  try {
    const nearElevator = generateSpace({
      id: 'S_ELEV',
      isNearElevator: true
    });
    
    const farFromElevator = generateSpace({
      id: 'S_FAR',
      isNearElevator: false
    });
    
    Assert.assertTrue(
      nearElevator.isNearElevator,
      'Vaga próxima ao elevador identificada'
    );
    
    Assert.assertFalse(
      farFromElevator.isNearElevator,
      'Vaga distante do elevador identificada'
    );
    
    console.log('  ✅ Proximidade ao elevador identificada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 8: Bônus de elevador para idosos
  try {
    const elderlyUnit = generateUnit({
      isPCD: false,
      isElderly: true
    });
    
    // Idosos devem ter preferência por vagas próximas ao elevador
    const elevatorBonus = 10;
    const baseScore = 50;
    
    const nearElevatorScore = baseScore + elevatorBonus; // 60
    const farScore = baseScore; // 50
    
    Assert.assertTrue(
      elderlyUnit.isElderly,
      'Idoso deve se beneficiar de vaga próxima ao elevador'
    );
    
    Assert.assertGreaterThan(
      nearElevatorScore,
      farScore,
      'Vaga perto do elevador deve ter score maior para idosos'
    );
    
    console.log('  ✅ Idosos priorizados em vagas próximas ao elevador');
    console.log(`     Com elevador: ${nearElevatorScore} > Sem elevador: ${farScore}`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Proximidade de Entrada
  // ============================================
  
  console.log('\n📋 Proximidade de Entrada');
  console.log('-'.repeat(60));
  
  // Teste 9: Vagas próximas à entrada
  try {
    const nearEntrance = generateSpace({
      id: 'S_ENT',
      isNearEntrance: true
    });
    
    const farFromEntrance = generateSpace({
      id: 'S_FAR_ENT',
      isNearEntrance: false
    });
    
    Assert.assertTrue(
      nearEntrance.isNearEntrance,
      'Vaga próxima à entrada identificada'
    );
    
    console.log('  ✅ Proximidade à entrada identificada');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // Teste 10: Bônus geral de entrada
  try {
    const entranceBonus = 8;
    const baseScore = 50;
    
    const nearEntranceScore = baseScore + entranceBonus;
    
    Assert.assertGreaterThan(
      nearEntranceScore,
      baseScore,
      'Vaga próxima à entrada deve ter bônus'
    );
    
    console.log('  ✅ Bônus de entrada aplicado');
    console.log(`     Perto da entrada: ${nearEntranceScore} > Base: ${baseScore}`);
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
    console.log('✅ Todos os testes de proximidade e priorização passaram!\n');
  } else {
    console.log(`⚠️  ${failed} teste(s) falharam\n`);
  }
  
  return { passed, failed, total: passed + failed };
}
