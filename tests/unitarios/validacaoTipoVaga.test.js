/**
 * Testes Unitários - Validação de Tipos de Vaga
 * RN01-EXTENDED: Incompatibilidade entre vagas de CARRO e MOTO
 * 
 * Testa a separação correta entre:
 * - Vagas de CARRO (tipos P, M, G)
 * - Vagas de MOTO (tipo MOTO)
 * 
 * Validações:
 * ✓ Carros NÃO podem ser alocados em vagas MOTO
 * ✓ Motos NÃO podem ser alocadas em vagas de CARRO
 * ✓ Inventário deve ser validado SEPARADAMENTE por tipo
 * ✓ Déficit de um tipo não é compensado por excesso do outro
 */

import { TestAssertions as Assert } from '../utilitarios/auxiliaresTeste.js';
import { generateUnit, generateSpace } from '../utilitarios/geradorDados.js';

/**
 * Auxiliar: Conta vagas por tipo
 */
function countSpacesByType(spaces) {
  const carSpaces = spaces.filter(s => s.type !== 'MOTO').length; // P, M, G
  const motoSpaces = spaces.filter(s => s.type === 'MOTO').length;
  return { carSpaces, motoSpaces };
}

/**
 * Auxiliar: Conta solicitações por tipo
 */
function countRequestsByType(units) {
  const carRequests = units.reduce((acc, u) => acc + (u.carSpaces || 0), 0);
  const motoRequests = units.reduce((acc, u) => acc + (u.motoSpaces || 0), 0);
  return { carRequests, motoRequests };
}

/**
 * Auxiliar: Valida inventário por tipo
 */
function validateInventoryByType(units, spaces) {
  const { carRequests, motoRequests } = countRequestsByType(units);
  const { carSpaces, motoSpaces } = countSpacesByType(spaces);
  
  const hasCarDeficit = carRequests > carSpaces;
  const hasMotoDeficit = motoRequests > motoSpaces;
  const hasInventoryIssue = hasCarDeficit || hasMotoDeficit;
  
  return {
    carRequests,
    carSpaces,
    carDeficit: carSpaces - carRequests,
    hasCarDeficit,
    motoRequests,
    motoSpaces,
    motoDeficit: motoSpaces - motoRequests,
    hasMotoDeficit,
    hasInventoryIssue
  };
}

export function runVehicleTypeValidationTests() {
  console.log('\n🧪 Testes de Validação de Tipos de Vaga\n');
  console.log('═'.repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  // ============================================
  // Teste 1: Identificação Correta de Tipos
  // ============================================
  
  console.log('\n📋 Teste 1: Identificação de Tipos de Vaga');
  console.log('-'.repeat(60));
  
  try {
    const carSpaceP = generateSpace({ id: 'S001', type: 'P' });
    const carSpaceM = generateSpace({ id: 'S002', type: 'M' });
    const carSpaceG = generateSpace({ id: 'S003', type: 'G' });
    const motoSpace = generateSpace({ id: 'S004', type: 'MOTO' });
    
    // P, M, G são vagas de CARRO
    Assert.assertTrue(
      carSpaceP.type !== 'MOTO',
      'Vaga tipo P deve ser reconhecida como vaga de CARRO'
    );
    
    Assert.assertTrue(
      carSpaceM.type !== 'MOTO',
      'Vaga tipo M deve ser reconhecida como vaga de CARRO'
    );
    
    Assert.assertTrue(
      carSpaceG.type !== 'MOTO',
      'Vaga tipo G deve ser reconhecida como vaga de CARRO'
    );
    
    // MOTO é vaga de MOTO
    Assert.assertTrue(
      motoSpace.type === 'MOTO',
      'Vaga tipo MOTO deve ser reconhecida como vaga de MOTO'
    );
    
    console.log('  ✅ Tipos P, M, G identificados como CARRO');
    console.log('  ✅ Tipo MOTO identificado corretamente');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 2: Contagem de Solicitações por Tipo
  // ============================================
  
  console.log('\n📋 Teste 2: Contagem de Solicitações por Tipo');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      generateUnit({ id: 'U001', carSpaces: 1, motoSpaces: 0 }),
      generateUnit({ id: 'U002', carSpaces: 1, motoSpaces: 0 }),
      generateUnit({ id: 'U003', carSpaces: 2, motoSpaces: 0 }), // 2 carros
      generateUnit({ id: 'U004', carSpaces: 0, motoSpaces: 1 }),
      generateUnit({ id: 'U005', carSpaces: 0, motoSpaces: 2 }), // 2 motos
      generateUnit({ id: 'U006', carSpaces: 1, motoSpaces: 1 }), // Misto
    ];
    
    const { carRequests, motoRequests } = countRequestsByType(units);
    
    Assert.assertEquals(
      carRequests,
      5, // 1+1+2+0+0+1 = 5
      'Deve somar corretamente solicitações de CARRO'
    );
    
    Assert.assertEquals(
      motoRequests,
      4, // 0+0+0+1+2+1 = 4
      'Deve somar corretamente solicitações de MOTO'
    );
    
    console.log(`  ✅ Contagem de carros: ${carRequests} (esperado: 5)`);
    console.log(`  ✅ Contagem de motos: ${motoRequests} (esperado: 4)`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 3: Contagem de Vagas por Tipo
  // ============================================
  
  console.log('\n📋 Teste 3: Contagem de Vagas por Tipo');
  console.log('-'.repeat(60));
  
  try {
    const spaces = [
      generateSpace({ id: 'S001', type: 'P' }),
      generateSpace({ id: 'S002', type: 'M' }),
      generateSpace({ id: 'S003', type: 'G' }),
      generateSpace({ id: 'S004', type: 'P' }),
      generateSpace({ id: 'S005', type: 'MOTO' }),
      generateSpace({ id: 'S006', type: 'MOTO' }),
    ];
    
    const { carSpaces, motoSpaces } = countSpacesByType(spaces);
    
    Assert.assertEquals(
      carSpaces,
      4, // P+M+G+P = 4
      'Deve somar corretamente vagas de CARRO (P, M, G)'
    );
    
    Assert.assertEquals(
      motoSpaces,
      2, // MOTO+MOTO = 2
      'Deve somar corretamente vagas de MOTO'
    );
    
    console.log(`  ✅ Contagem de vagas de carro: ${carSpaces} (esperado: 4)`);
    console.log(`  ✅ Contagem de vagas de moto: ${motoSpaces} (esperado: 2)`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 4: Validação - Inventário Perfeito
  // ============================================
  
  console.log('\n📋 Teste 4: Validação de Inventário Perfeito');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      ...Array.from({ length: 10 }, (_, i) => 
        generateUnit({ id: `UC${i}`, carSpaces: 1, motoSpaces: 0 })
      ),
      ...Array.from({ length: 3 }, (_, i) => 
        generateUnit({ id: `UM${i}`, carSpaces: 0, motoSpaces: 1 })
      )
    ];
    
    const spaces = [
      ...Array.from({ length: 10 }, (_, i) => 
        generateSpace({ id: `SC${i}`, type: 'M' })
      ),
      ...Array.from({ length: 3 }, (_, i) => 
        generateSpace({ id: `SM${i}`, type: 'MOTO' })
      )
    ];
    
    const validation = validateInventoryByType(units, spaces);
    
    Assert.assertFalse(
      validation.hasInventoryIssue,
      'Inventário perfeito NÃO deve ter issue'
    );
    
    Assert.assertFalse(
      validation.hasCarDeficit,
      'Inventário perfeito NÃO deve ter déficit de CARRO'
    );
    
    Assert.assertFalse(
      validation.hasMotoDeficit,
      'Inventário perfeito NÃO deve ter déficit de MOTO'
    );
    
    Assert.assertEquals(
      validation.carRequests,
      validation.carSpaces,
      'Solicitações de CARRO devem ser iguais a vagas de CARRO'
    );
    
    Assert.assertEquals(
      validation.motoRequests,
      validation.motoSpaces,
      'Solicitações de MOTO devem ser iguais a vagas de MOTO'
    );
    
    console.log('  ✅ Inventário perfeito detectado corretamente');
    console.log(`  ✅ Carro: ${validation.carRequests}=${validation.carSpaces}`);
    console.log(`  ✅ Moto: ${validation.motoRequests}=${validation.motoSpaces}`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 5: Validação - Déficit de CARRO
  // ============================================
  
  console.log('\n📋 Teste 5: Detecção de Déficit de CARRO');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      ...Array.from({ length: 15 }, (_, i) => 
        generateUnit({ id: `UC${i}`, carSpaces: 1, motoSpaces: 0 })
      ),
      ...Array.from({ length: 5 }, (_, i) => 
        generateUnit({ id: `UM${i}`, carSpaces: 0, motoSpaces: 1 })
      )
    ];
    
    const spaces = [
      ...Array.from({ length: 10 }, (_, i) => // Faltam 5 vagas de carro
        generateSpace({ id: `SC${i}`, type: 'M' })
      ),
      ...Array.from({ length: 5 }, (_, i) => // Motos OK
        generateSpace({ id: `SM${i}`, type: 'MOTO' })
      )
    ];
    
    const validation = validateInventoryByType(units, spaces);
    
    Assert.assertTrue(
      validation.hasInventoryIssue,
      'Déficit de CARRO deve gerar inventory issue'
    );
    
    Assert.assertTrue(
      validation.hasCarDeficit,
      'Deve detectar déficit de CARRO'
    );
    
    Assert.assertFalse(
      validation.hasMotoDeficit,
      'NÃO deve detectar déficit de MOTO (motos estão OK)'
    );
    
    Assert.assertEquals(
      validation.carRequests,
      15,
      'Deve contar 15 solicitações de CARRO'
    );
    
    Assert.assertEquals(
      validation.carSpaces,
      10,
      'Deve contar 10 vagas de CARRO'
    );
    
    Assert.assertEquals(
      validation.carDeficit,
      -5, // Faltam 5
      'Déficit de CARRO deve ser -5'
    );
    
    console.log('  ✅ Déficit de CARRO detectado corretamente');
    console.log(`  ✅ Carro: ${validation.carRequests} solicitações → ${validation.carSpaces} vagas (faltam ${Math.abs(validation.carDeficit)})`);
    console.log(`  ✅ Moto: ${validation.motoRequests}=${validation.motoSpaces} (OK)`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 6: Validação - Déficit de MOTO
  // ============================================
  
  console.log('\n📋 Teste 6: Detecção de Déficit de MOTO');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      ...Array.from({ length: 20 }, (_, i) => 
        generateUnit({ id: `UC${i}`, carSpaces: 1, motoSpaces: 0 })
      ),
      ...Array.from({ length: 12 }, (_, i) => 
        generateUnit({ id: `UM${i}`, carSpaces: 0, motoSpaces: 1 })
      )
    ];
    
    const spaces = [
      ...Array.from({ length: 20 }, (_, i) => // Carros OK
        generateSpace({ id: `SC${i}`, type: 'M' })
      ),
      ...Array.from({ length: 8 }, (_, i) => // Faltam 4 vagas de moto
        generateSpace({ id: `SM${i}`, type: 'MOTO' })
      )
    ];
    
    const validation = validateInventoryByType(units, spaces);
    
    Assert.assertTrue(
      validation.hasInventoryIssue,
      'Déficit de MOTO deve gerar inventory issue'
    );
    
    Assert.assertFalse(
      validation.hasCarDeficit,
      'NÃO deve detectar déficit de CARRO (carros estão OK)'
    );
    
    Assert.assertTrue(
      validation.hasMotoDeficit,
      'Deve detectar déficit de MOTO'
    );
    
    Assert.assertEquals(
      validation.motoRequests,
      12,
      'Deve contar 12 solicitações de MOTO'
    );
    
    Assert.assertEquals(
      validation.motoSpaces,
      8,
      'Deve contar 8 vagas de MOTO'
    );
    
    Assert.assertEquals(
      validation.motoDeficit,
      -4, // Faltam 4
      'Déficit de MOTO deve ser -4'
    );
    
    console.log('  ✅ Déficit de MOTO detectado corretamente');
    console.log(`  ✅ Carro: ${validation.carRequests}=${validation.carSpaces} (OK)`);
    console.log(`  ✅ Moto: ${validation.motoRequests} solicitações → ${validation.motoSpaces} vagas (faltam ${Math.abs(validation.motoDeficit)})`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 7: Validação - Déficit DUPLO
  // ============================================
  
  console.log('\n📋 Teste 7: Detecção de Déficit Duplo (CARRO e MOTO)');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      ...Array.from({ length: 30 }, (_, i) => 
        generateUnit({ id: `UC${i}`, carSpaces: 1, motoSpaces: 0 })
      ),
      ...Array.from({ length: 15 }, (_, i) => 
        generateUnit({ id: `UM${i}`, carSpaces: 0, motoSpaces: 1 })
      )
    ];
    
    const spaces = [
      ...Array.from({ length: 25 }, (_, i) => // Faltam 5 vagas de carro
        generateSpace({ id: `SC${i}`, type: 'M' })
      ),
      ...Array.from({ length: 10 }, (_, i) => // Faltam 5 vagas de moto
        generateSpace({ id: `SM${i}`, type: 'MOTO' })
      )
    ];
    
    const validation = validateInventoryByType(units, spaces);
    
    Assert.assertTrue(
      validation.hasInventoryIssue,
      'Déficit duplo deve gerar inventory issue'
    );
    
    Assert.assertTrue(
      validation.hasCarDeficit,
      'Deve detectar déficit de CARRO'
    );
    
    Assert.assertTrue(
      validation.hasMotoDeficit,
      'Deve detectar déficit de MOTO'
    );
    
    Assert.assertEquals(
      validation.carDeficit,
      -5, // Faltam 5 carros
      'Déficit de CARRO deve ser -5'
    );
    
    Assert.assertEquals(
      validation.motoDeficit,
      -5, // Faltam 5 motos
      'Déficit de MOTO deve ser -5'
    );
    
    console.log('  ✅ Déficit DUPLO detectado corretamente');
    console.log(`  ✅ Carro: ${validation.carRequests} → ${validation.carSpaces} (faltam ${Math.abs(validation.carDeficit)})`);
    console.log(`  ✅ Moto: ${validation.motoRequests} → ${validation.motoSpaces} (faltam ${Math.abs(validation.motoDeficit)})`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 8: Validação - Excesso NÃO Compensa Déficit
  // ============================================
  
  console.log('\n📋 Teste 8: Excesso de CARRO NÃO Compensa Déficit de MOTO');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      ...Array.from({ length: 10 }, (_, i) => 
        generateUnit({ id: `UC${i}`, carSpaces: 1, motoSpaces: 0 })
      ),
      ...Array.from({ length: 15 }, (_, i) => 
        generateUnit({ id: `UM${i}`, carSpaces: 0, motoSpaces: 1 })
      )
    ];
    
    const spaces = [
      ...Array.from({ length: 25 }, (_, i) => // 15 vagas EXTRAS de carro
        generateSpace({ id: `SC${i}`, type: 'M' })
      ),
      ...Array.from({ length: 10 }, (_, i) => // Faltam 5 vagas de moto
        generateSpace({ id: `SM${i}`, type: 'MOTO' })
      )
    ];
    
    const validation = validateInventoryByType(units, spaces);
    
    Assert.assertTrue(
      validation.hasInventoryIssue,
      'Deve ter inventory issue (déficit de MOTO)'
    );
    
    Assert.assertTrue(
      validation.hasMotoDeficit,
      'Deve detectar déficit de MOTO'
    );
    
    Assert.assertFalse(
      validation.hasCarDeficit,
      'NÃO deve ter déficit de CARRO (tem excesso)'
    );
    
    Assert.assertTrue(
      validation.carDeficit > 0,
      'Deve ter EXCESSO de vagas de CARRO (positivo)'
    );
    
    Assert.assertTrue(
      validation.motoDeficit < 0,
      'Deve ter DÉFICIT de vagas de MOTO (negativo)'
    );
    
    console.log('  ✅ Regra de incompatibilidade validada');
    console.log(`  ✅ Carro: ${validation.carRequests} → ${validation.carSpaces} (sobram +${validation.carDeficit})`);
    console.log(`  ✅ Moto: ${validation.motoRequests} → ${validation.motoSpaces} (faltam ${validation.motoDeficit})`);
    console.log('  ✅ Excesso de CARRO NÃO compensa déficit de MOTO (incompatibilidade)');
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Teste 9: Validação - Excesso é Válido
  // ============================================
  
  console.log('\n📋 Teste 9: Excesso de Vagas é Válido (Não Bloqueia)');
  console.log('-'.repeat(60));
  
  try {
    const units = [
      ...Array.from({ length: 20 }, (_, i) => 
        generateUnit({ id: `UC${i}`, carSpaces: 1, motoSpaces: 0 })
      ),
      ...Array.from({ length: 5 }, (_, i) => 
        generateUnit({ id: `UM${i}`, carSpaces: 0, motoSpaces: 1 })
      )
    ];
    
    const spaces = [
      ...Array.from({ length: 30 }, (_, i) => // 10 vagas extras de carro
        generateSpace({ id: `SC${i}`, type: 'M' })
      ),
      ...Array.from({ length: 8 }, (_, i) => // 3 vagas extras de moto
        generateSpace({ id: `SM${i}`, type: 'MOTO' })
      )
    ];
    
    const validation = validateInventoryByType(units, spaces);
    
    Assert.assertFalse(
      validation.hasInventoryIssue,
      'Excesso de vagas NÃO deve gerar inventory issue'
    );
    
    Assert.assertFalse(
      validation.hasCarDeficit,
      'NÃO deve ter déficit de CARRO (tem excesso)'
    );
    
    Assert.assertFalse(
      validation.hasMotoDeficit,
      'NÃO deve ter déficit de MOTO (tem excesso)'
    );
    
    Assert.assertTrue(
      validation.carDeficit > 0,
      'Deve ter EXCESSO de vagas de CARRO'
    );
    
    Assert.assertTrue(
      validation.motoDeficit > 0,
      'Deve ter EXCESSO de vagas de MOTO'
    );
    
    console.log('  ✅ Excesso de vagas não bloqueia sorteio');
    console.log(`  ✅ Carro: ${validation.carRequests} → ${validation.carSpaces} (sobram +${validation.carDeficit})`);
    console.log(`  ✅ Moto: ${validation.motoRequests} → ${validation.motoSpaces} (sobram +${validation.motoDeficit})`);
    passed++;
    
  } catch (error) {
    console.log(`  ❌ ${error.message}`);
    failed++;
  }
  
  // ============================================
  // Resumo dos Testes
  // ============================================
  
  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Resumo dos Testes de Validação de Tipos\n`);
  console.log(`   ✅ Passaram: ${passed}`);
  console.log(`   ❌ Falharam: ${failed}`);
  console.log(`   📈 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  return { passed, failed };
}

export default runVehicleTypeValidationTests;
