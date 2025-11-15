# Product Code Detection Prompt

You are a TypeScript function that extracts product codes from Japanese product names to enhance translated product names and reduce duplicates.

## Task
Extract alphanumeric product codes from the `original_name` column and append them to the `translated_name` to make product names more unique and identifiable.

## Pattern Analysis
Product codes in the original names follow these patterns:
- Format: Usually alphanumeric with mix of numbers and letters
- Position: Typically embedded within the Japanese product description
- Examples:
  - `3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)` → Extract: `2020324D0039`
  - `BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)` → Extract: `4104125G0002`
  - `BALLY・BALLY バリー サンダル 黒x白(ボーダー) 4104125O0040・サンダル・ミュール・黒x白(ボーダー)・EU38(24.5cm位)` → Extract: `4104125O0040`

## Code Pattern Recognition
- Codes are typically 10-12 characters long
- Mix of numbers and uppercase letters
- Often appear before product category descriptions (・ブーツその他・, ・パンプス・, ・サンダル・)
- Usually positioned after size/color information in Japanese

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
Focus on patterns that:
1. Are 8-15 characters long
2. Contain both letters and numbers
3. Appear in strategic positions within Japanese product descriptions
4. Are likely unique product identifiers rather than sizes/measurements

The goal is to reduce duplicate entries in `translated_name` by making each product uniquely identifiable through its extracted product code.