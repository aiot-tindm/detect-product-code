# Product Code Detection Prompt

You are a TypeScript function that extracts product codes from Japanese product names to enhance translated product names and reduce duplicates.

## Task
Extract alphanumeric product codes from the `original_name` column and append them to the `translated_name` to make product names more unique and identifiable.

## Pattern Analysis
Product codes in the original names follow these 4 distinct patterns:

### Pattern 1: Code After Color
- `3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)` → Extract: `2020324D0039`
- `BALLY・BALLY バリー サンダル 黒x白(ボーダー) 4104125O0040・サンダル・ミュール・黒x白(ボーダー)・EU38(24.5cm位)` → Extract: `4104125O0040`

### Pattern 2: Code After Dash
- `3.1 Phillip Lim・3.1 Phillip Lim クラッチバッグ - 2020324A0037・クラッチバッグ・-` → Extract: `2020324A0037`
- `A.P.C.・A.P.C. アーペーセー ショルダーバッグ 黒 - 0272225S0073・ショルダーバッグ・ポシェット・黒・-` → Extract: `0272225S0073`

### Pattern 3: Code After Size Information ⚠️ IMPORTANT
- `BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)` → Extract: `4104125G0002`
- `A.P.C.・A.P.C. アーペーセー ブーツ 黒 EU36(22.5cm位) 0272224O0031・ブーツその他・黒・EU36(22.5cm位)` → Extract: `0272224O0031`
- `Burberry・BURBERRY バーバリー スニーカー EU35(21.5cm位) 4119224D0117・スニーカー・ベージュx黒( ...・EU35(21.5cm位)` → Extract: `4119224D0117`

### Pattern 4: Code After Product Type
- `COMME des GARCONS・COMME des GARCONS COMME des GARCONS 2001124G0044・ローファー・オックスフォード・白・23cm` → Extract: `2001124G0044`

## Code Pattern Recognition
- **Format**: Exactly 12 characters: `[7 digits][1 uppercase letter][4 digits]`
- Example format: `2020324D0039`, `4104125G0002`, `0272224O0031`
- Codes always appear in the second segment (between first and second ・ separator)
- Position varies based on 4 distinct patterns:
  1. **After color**: `[Product] [Color] [CODE]・`
  2. **After dash**: `[Product] - [CODE]・`
  3. **After size**: `[Product] [Color] EU##(...) [CODE]・` ⚠️ Important pattern
  4. **After product type**: `[Product] [CODE]・` (no color/dash)

## Function Specification

```typescript
interface ProductRecord {
  item_id: string;
  translated_name: string;
  original_name: string;
  collection_name: string;
  shopee_id: string;
}

function extractAndAppendProductCode(record: ProductRecord): ProductRecord {
  // Extract product code from original_name using regex pattern
  // Look for alphanumeric codes that match the identified patterns
  // Common patterns to match:
  // - 10-12 character alphanumeric codes (e.g., 2020324D0039, 4104125G0002)
  // - Positioned strategically in Japanese product descriptions
  
  // If product code found:
  // - Append to translated_name in format: "translated_name - {code}"
  // - Only append if not already present in translated_name
  
  // Return updated record with enhanced translated_name
}
```

## Expected Output Enhancement
- Input: `"BALLY bal 跟鞋 海軍藍 二手"`
- With code: `"BALLY bal 跟鞋 海軍藍 二手 - 4104125G0002"`

## Regex Strategy
Extract codes matching ALL of these criteria:
1. Exactly 12 characters long
2. Format: `[7 digits][1 uppercase letter][4 digits]`
3. Appear in the second segment (between first and second ・ separator)
4. Follow one of the 4 patterns above

**Recommended extraction order**:
1. Check Pattern 3 first (most specific - after size like `EU##(...)`)
2. Check Pattern 2 (after dash `-`)
3. Check Pattern 1 & 4 (after color or product type)

**Combined regex pattern**:
```
(?:EU\d+[^)]*\))\s+(\d{7}[A-Z]\d{4})・|  # Pattern 3: After size
-\s+(\d{7}[A-Z]\d{4})・|                 # Pattern 2: After dash
\s+(\d{7}[A-Z]\d{4})・                   # Pattern 1 & 4: General case
```

The goal is to reduce duplicate entries in `translated_name` by making each product uniquely identifiable through its extracted product code.