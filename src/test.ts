import { extractProductCode, extractAndAppendProductCode } from './productCodeExtractor';
import { ProductRecord } from './types';

/**
 * Simple test cases to demonstrate product code extraction
 */
function runTests() {
  console.log('🧪 Running Product Code Extraction Tests\n');
  console.log('=' .repeat(60) + '\n');

  const testCases: Array<{
    name: string;
    originalName: string;
    expectedCode: string | null;
  }> = [
    {
      name: '3.1 Phillip Lim Boot',
      originalName: '3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)',
      expectedCode: '2020324D0039',
    },
    {
      name: 'BALLY Sandal',
      originalName: 'BALLY・BALLY バリー サンダル 黒x白(ボーダー) 4104125O0040・サンダル・ミュール・黒x白(ボーダー)・EU38(24.5cm位)',
      expectedCode: '4104125O0040',
    },
    {
      name: 'BALLY Pump',
      originalName: 'BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)',
      expectedCode: '4104125G0002',
    },
    {
      name: '45R Sandal',
      originalName: '45R・45R フォーティーファイブアール サンダル 茶 0356324O0053・サンダル・ミュール・茶・EU38(24.5cm位)',
      expectedCode: '0356324O0053',
    },
    {
      name: 'BVLGARI Ring (no code)',
      originalName: 'Bvlgari・BVLGARI 指輪・指輪・リング・クリア・ONE SIZE',
      expectedCode: null,
    },
    {
      name: '3.1 Phillip Lim Clutch',
      originalName: '3.1 Phillip Lim・3.1 Phillip Lim クラッチバッグ - 2020324A0037・クラッチバッグ・-',
      expectedCode: '2020324A0037',
    },
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Input: ${testCase.originalName.substring(0, 80)}...`);

    const extracted = extractProductCode(testCase.originalName);
    const success = extracted === testCase.expectedCode;

    if (success) {
      console.log(`✅ PASS - Extracted: "${extracted}"`);
      passed++;
    } else {
      console.log(`❌ FAIL - Expected: "${testCase.expectedCode}", Got: "${extracted}"`);
      failed++;
    }

    console.log('');
  });

  console.log('=' .repeat(60));
  console.log(`\nTest Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests\n`);

  // Test the full enhancement function
  console.log('Testing Full Enhancement Function:');
  console.log('=' .repeat(60) + '\n');

  const sampleRecord: ProductRecord = {
    item_id: '122917618',
    translated_name: 'BALLY bal 跟鞋 海軍藍 二手',
    original_name: 'BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)',
    collection_name: 'buyma-shopee-01_a60001___',
    shopee_id: '52000800445',
  };

  console.log('Original Record:');
  console.log(`  Item ID: ${sampleRecord.item_id}`);
  console.log(`  Translated Name: ${sampleRecord.translated_name}`);
  console.log(`  Original Name: ${sampleRecord.original_name}\n`);

  const enhanced = extractAndAppendProductCode(sampleRecord);

  console.log('Enhanced Record:');
  console.log(`  Item ID: ${enhanced.item_id}`);
  console.log(`  Enhanced Name: ${enhanced.enhanced_name}`);
  console.log(`  Extracted Code: ${enhanced.extracted_code}\n`);

  console.log('=' .repeat(60) + '\n');
}

runTests();
