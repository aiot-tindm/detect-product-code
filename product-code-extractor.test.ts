/**
 * Product Code Extractor - Unit Tests
 * Comprehensive test coverage for all 4 patterns
 */

import {
  extractFromOriginalName,
  extractFromDescription,
  extractProductCode,
  extractAndAppendProductCode,
  ProductRecord,
  ExtractionResult,
} from './product-code-extractor';

describe('Product Code Extractor', () => {
  describe('Pattern 1: Code After Color', () => {
    it('should extract code after color in Japanese', () => {
      const originalName = '3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('2020324D0039');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(1);
    });

    it('should extract code after striped pattern description', () => {
      const originalName = 'BALLY・BALLY バリー サンダル 黒x白(ボーダー) 4104125O0040・サンダル・ミュール・黒x白(ボーダー)・EU38(24.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('4104125O0040');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(1);
    });

    it('should extract code after simple color', () => {
      const originalName = '3.1 Phillip Lim・3.1 Phillip Lim サンダル 茶 2020325S0016・サンダル・ミュール・茶・EU37(23.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('2020325S0016');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(1);
    });

    it('should extract code after black color', () => {
      const originalName = '3.1 Phillip Lim・3.1 Phillip Lim サンダル 黒 2020325L0022・サンダル・ミュール・黒・EU38(24.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('2020325L0022');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(1);
    });

    it('should extract code after multi-color description', () => {
      const originalName = '3.1 Phillip Lim・3.1 Phillip Lim サンダル 紺x茶x白等(花柄) 2020325O0048・サンダル・ミュール・紺x茶x白等(花柄)・EU39(25.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('2020325O0048');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(1);
    });
  });

  describe('Pattern 2: Code After Dash', () => {
    it('should extract code after dash separator', () => {
      const originalName = '3.1 Phillip Lim・3.1 Phillip Lim クラッチバッグ - 2020324A0037・クラッチバッグ・-';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('2020324A0037');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(2);
    });

    it('should extract code after dash with color before dash', () => {
      const originalName = 'A.P.C.・A.P.C. アーペーセー ショルダーバッグ 黒 - 0272225S0073・ショルダーバッグ・ポシェット・黒・-';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('0272225S0073');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(2);
    });

    it('should extract code after dash with beige color', () => {
      const originalName = '3.1 Phillip Lim・3.1 Phillip Lim クラッチバッグ - 2020324N0004・クラッチバッグ・ベージュx茶( ...・-';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('2020324N0004');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(2);
    });

    it('should extract code after dash for AURALEE brand', () => {
      const originalName = 'AURALEE・AURALEE オーラリー ポーチ ベージュ - 0489925F0164・ポーチ・ベージュ・-';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('0489925F0164');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(2);
    });
  });

  describe('Pattern 3: Code After Size Information ⚠️ CRITICAL', () => {
    it('should extract code after EU size for BALLY brand', () => {
      const originalName = 'BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('4104125G0002');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });

    it('should extract code after EU size for A.P.C. brand', () => {
      const originalName = 'A.P.C.・A.P.C. アーペーセー ブーツ 黒 EU36(22.5cm位) 0272224O0031・ブーツその他・黒・EU36(22.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('0272224O0031');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });

    it('should extract code after EU size for Burberry brand', () => {
      const originalName = 'Burberry・BURBERRY バーバリー スニーカー EU35(21.5cm位) 4119224D0117・スニーカー・ベージュx黒( ...・EU35(21.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('4119224D0117');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });

    it('should extract code after EU size with half size', () => {
      const originalName = 'A.P.C.・A.P.C. アーペーセー ブーツ 黒 EU37(23.5cm位) 0272225Y0086・ブーツその他・黒・EU37(23.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('0272225Y0086');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });

    it('should extract code after EU size for BALLY boots', () => {
      const originalName = 'BALLY・BALLY バリー ブーツ 白 EU35(21.5cm位) 4104125M0003・ブーツその他・白・EU35(21.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('4104125M0003');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });

    it('should extract code after EU size for Barbour brand', () => {
      const originalName = 'Barbour・Barbour バブアー スニーカー EU37(23.5cm位) 4211625L0014・スニーカー・カーキxピンク...・EU37(23.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('4211625L0014');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });

    it('should extract code after EU size for BOTTEGA VENETA', () => {
      const originalName = 'BOTTEGA VENETA・BOTTEGA VENETA ブーティ EU35(21.5cm位) 4103923Y0100・ブーツその他・グレー系(茶が...・EU35(21.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBe('4103923Y0100');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(3);
    });
  });

  describe('Pattern 4: Model Number from Description', () => {
    it('should extract model number on same line', () => {
      const description = '【商品番号】PD-0001011748\n【ブランド】MONCLER／モンクレール\n【型番】4M00160\n【表記サイズ】36';
      const result = extractFromDescription(description);

      expect(result.code).toBe('4M00160');
      expect(result.source).toBe('description');
      expect(result.pattern).toBe(4);
    });

    it('should extract model number on next line', () => {
      const description = '【型番】\nクレドール　シグノ\nGSWE982\n\n【刻印・シリアルナンバー】';
      const result = extractFromDescription(description);

      expect(result.code).toBe('GSWE982');
      expect(result.source).toBe('description');
      expect(result.pattern).toBe(4);
    });

    it('should extract alphanumeric model number', () => {
      const description = '【素材】レザー\n【型番】2VH131\n【カラー】ブラック';
      const result = extractFromDescription(description);

      expect(result.code).toBe('2VH131');
      expect(result.source).toBe('description');
      expect(result.pattern).toBe(4);
    });

    it('should extract model number with letters and numbers', () => {
      const description = '【付属品】箱 保存袋\n【型番】AB123CD\n【特記事項】-';
      const result = extractFromDescription(description);

      expect(result.code).toBe('AB123CD');
      expect(result.source).toBe('description');
      expect(result.pattern).toBe(4);
    });
  });

  describe('Edge Cases and Negative Tests', () => {
    it('should return null for products without codes - BVLGARI ring', () => {
      const originalName = 'Bvlgari・BVLGARI 指輪・指輪・リング・クリア・ONE SIZE';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });

    it('should return null for products without codes - PRADA handbag', () => {
      const originalName = 'PRADA・PRADA ハンドバッグ・ハンドバッグ・レッド・ONE SIZE';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });

    it('should return null for products without codes - Louis Vuitton', () => {
      const originalName = 'Louis Vuitton・LOUIS VUITTON ショルダーバッグ・ショルダーバッグ・ポシェット・ブラウン・ONE SIZE';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });

    it('should return null for empty original_name', () => {
      const result = extractFromOriginalName('');

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });

    it('should return null for empty description', () => {
      const result = extractFromDescription('');

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });

    it('should return null for description without 型番', () => {
      const description = '【商品番号】PD-0001011748\n【ブランド】MONCLER\n【カラー】ブラック';
      const result = extractFromDescription(description);

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });

    it('should not extract invalid code format (wrong length)', () => {
      const originalName = 'Test・Product 123ABC・Category・-';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBeNull();
    });

    it('should not extract code without required format (no letter)', () => {
      const originalName = 'Test・Product 202032400039・Category・-';
      const result = extractFromOriginalName(originalName);

      expect(result.code).toBeNull();
    });
  });

  describe('extractProductCode - Combined Logic', () => {
    it('should prefer original_name code over description', () => {
      const record: ProductRecord = {
        item_id: '123',
        translated_name: 'Test Product',
        original_name: '3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)',
        description: '【型番】4M00160',
        collection_name: 'test',
        shopee_id: '456',
      };

      const result = extractProductCode(record);

      expect(result.code).toBe('2020324D0039');
      expect(result.source).toBe('original_name');
      expect(result.pattern).toBe(1);
    });

    it('should use description if original_name has no code', () => {
      const record: ProductRecord = {
        item_id: '123',
        translated_name: 'Test Product',
        original_name: 'PRADA・PRADA ハンドバッグ・ハンドバッグ・レッド・ONE SIZE',
        description: '【型番】2VH131',
        collection_name: 'test',
        shopee_id: '456',
      };

      const result = extractProductCode(record);

      expect(result.code).toBe('2VH131');
      expect(result.source).toBe('description');
      expect(result.pattern).toBe(4);
    });

    it('should return null if both fields have no code', () => {
      const record: ProductRecord = {
        item_id: '123',
        translated_name: 'Test Product',
        original_name: 'PRADA・PRADA ハンドバッグ・ハンドバッグ・レッド・ONE SIZE',
        description: '【ブランド】PRADA\n【カラー】レッド',
        collection_name: 'test',
        shopee_id: '456',
      };

      const result = extractProductCode(record);

      expect(result.code).toBeNull();
      expect(result.source).toBeNull();
      expect(result.pattern).toBeNull();
    });
  });

  describe('extractAndAppendProductCode - Full Workflow', () => {
    it('should append code from Pattern 1 to translated_name', () => {
      const record: ProductRecord = {
        item_id: '115076683',
        translated_name: '3.1 Phillip Lim gold 靴子 金 二手',
        original_name: '3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)',
        collection_name: 'buyma-shopee-01_a60001___',
        shopee_id: '42476179896',
      };

      const result = extractAndAppendProductCode(record);

      expect(result.translated_name).toBe('3.1 Phillip Lim gold 靴子 金 二手 - 2020324D0039');
    });

    it('should append code from Pattern 2 to translated_name', () => {
      const record: ProductRecord = {
        item_id: '107517682',
        translated_name: '3.1 Phillip Lim 手拿包 二手',
        original_name: '3.1 Phillip Lim・3.1 Phillip Lim クラッチバッグ - 2020324A0037・クラッチバッグ・-',
        collection_name: 'buyma-shopee-01_a50066_3.1 Phillip Lim__3.1 phillip lim',
        shopee_id: '58000926924',
      };

      const result = extractAndAppendProductCode(record);

      expect(result.translated_name).toBe('3.1 Phillip Lim 手拿包 二手 - 2020324A0037');
    });

    it('should append code from Pattern 3 to translated_name', () => {
      const record: ProductRecord = {
        item_id: '122917618',
        translated_name: 'BALLY bal 跟鞋 海軍藍 二手',
        original_name: 'BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)',
        collection_name: 'buyma-shopee-01_a60001___',
        shopee_id: '52000800445',
      };

      const result = extractAndAppendProductCode(record);

      expect(result.translated_name).toBe('BALLY bal 跟鞋 海軍藍 二手 - 4104125G0002');
    });

    it('should append code from Pattern 4 (description) to translated_name', () => {
      const record: ProductRecord = {
        item_id: '999',
        translated_name: 'MONCLER TRAILGRIP 運動鞋 二手',
        original_name: 'MONCLER・MONCLER スニーカー・スニーカー・ピンクベージュ・ONE SIZE',
        description: '【型番】4M00160\n【表記サイズ】36',
        collection_name: 'test',
        shopee_id: '111',
      };

      const result = extractAndAppendProductCode(record);

      expect(result.translated_name).toBe('MONCLER TRAILGRIP 運動鞋 二手 - 4M00160');
    });

    it('should not append code if already present in translated_name', () => {
      const record: ProductRecord = {
        item_id: '123',
        translated_name: '3.1 Phillip Lim gold 靴子 金 二手 - 2020324D0039',
        original_name: '3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)',
        collection_name: 'test',
        shopee_id: '456',
      };

      const result = extractAndAppendProductCode(record);

      expect(result.translated_name).toBe('3.1 Phillip Lim gold 靴子 金 二手 - 2020324D0039');
    });

    it('should not modify record if no code found', () => {
      const record: ProductRecord = {
        item_id: '123',
        translated_name: 'PRADA 手提包 黑色 二手',
        original_name: 'PRADA・PRADA ハンドバッグ・ハンドバッグ・ブラック・ONE SIZE',
        collection_name: 'test',
        shopee_id: '456',
      };

      const result = extractAndAppendProductCode(record);

      expect(result.translated_name).toBe('PRADA 手提包 黑色 二手');
    });
  });

  describe('Pattern Priority Tests', () => {
    it('should prioritize Pattern 3 over Pattern 1 when size is present', () => {
      // This ensures Pattern 3 (after size) takes precedence
      const originalName = 'BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)';
      const result = extractFromOriginalName(originalName);

      expect(result.pattern).toBe(3); // Should match Pattern 3, not Pattern 1
      expect(result.code).toBe('4104125G0002');
    });

    it('should prioritize Pattern 2 over Pattern 1 when dash is present', () => {
      const originalName = 'A.P.C.・A.P.C. アーペーセー ショルダーバッグ 黒 - 0272225S0073・ショルダーバッグ・ポシェット・黒・-';
      const result = extractFromOriginalName(originalName);

      expect(result.pattern).toBe(2); // Should match Pattern 2, not Pattern 1
      expect(result.code).toBe('0272225S0073');
    });
  });

  describe('Real-world Test Cases from Dataset', () => {
    const testCases = [
      {
        name: '3.1 Phillip Lim boots',
        original_name: '3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)',
        expectedCode: '2020324D0039',
        expectedPattern: 1,
      },
      {
        name: 'BALLY pumps with size',
        original_name: 'BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)',
        expectedCode: '4104125G0002',
        expectedPattern: 3,
      },
      {
        name: 'A.P.C. shoulder bag with dash',
        original_name: 'A.P.C.・A.P.C. アーペーセー ショルダーバッグ 黒 - 0272225S0073・ショルダーバッグ・ポシェット・黒・-',
        expectedCode: '0272225S0073',
        expectedPattern: 2,
      },
      {
        name: 'Comme des Garcons shoes',
        original_name: 'COMME des GARCONS・COMME des GARCONS COMME des GARCONS 2001124G0044・ローファー・オックスフォード・白・23cm',
        expectedCode: '2001124G0044',
        expectedPattern: 1,
      },
    ];

    testCases.forEach(({ name, original_name, expectedCode, expectedPattern }) => {
      it(`should correctly extract code for: ${name}`, () => {
        const result = extractFromOriginalName(original_name);
        expect(result.code).toBe(expectedCode);
        expect(result.pattern).toBe(expectedPattern);
      });
    });
  });
});
