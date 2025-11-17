# Product Code Pattern Analysis

## Analysis Date
2025-11-17

## Summary
After comprehensive analysis of the `original_name` column in the dataset (16,811 records), I have identified **4 distinct patterns** for product code extraction, including **1 MISSING pattern** that is not currently covered.

## Product Code Format
All product codes follow a consistent format:
- **Format**: `[7 digits][1 uppercase letter][4 digits]`
- **Length**: 12 characters
- **Example**: `2020324D0039`, `4104125G0002`, `0272224O0031`

## Identified Patterns

### Pattern 1: Code After Color ✅
**Description**: Code appears immediately after the color description in Japanese.

**Structure**: `Brand・Product [Color] [CODE]・Category・Details・Size`

**Examples**:
```
3.1 Phillip Lim・3.1 Phillip Lim ブーツ ゴールド 2020324D0039・ブーツその他・ゴールド・EU38(24.5cm位)
                                          └─ Code: 2020324D0039

3.1 Phillip Lim・3.1 Phillip Lim サンダル 茶 2020325S0016・サンダル・ミュール・茶・EU37(23.5cm位)
                                    └─ Code: 2020325S0016
```

**Regex Pattern**: `([^\s]+)\s+(\d{7}[A-Z]\d{4})・`

---

### Pattern 2: Code After Dash ✅
**Description**: Code appears after a dash separator.

**Structure**: `Brand・Product - [CODE]・Category・Details・Size`

**Examples**:
```
3.1 Phillip Lim・3.1 Phillip Lim クラッチバッグ - 2020324A0037・クラッチバッグ・-
                                             └─ Code: 2020324A0037

A.P.C.・A.P.C. アーペーセー ショルダーバッグ 黒 - 0272225S0073・ショルダーバッグ・ポシェット・黒・-
                                            └─ Code: 0272225S0073
```

**Regex Pattern**: `-\s+(\d{7}[A-Z]\d{4})・`

---

### Pattern 3: Code After Size Information ⚠️ **MISSING PATTERN**
**Description**: Code appears AFTER size information in format `EU##(...位)`.

**Structure**: `Brand・Product [Color] [Size] [CODE]・Category・Details・Size`

**Examples**:
```
A.P.C.・A.P.C. アーペーセー ブーツ 黒 EU36(22.5cm位) 0272224O0031・ブーツその他・黒・EU36(22.5cm位)
                                               └─ Code: 0272224O0031

BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)
                                          └─ Code: 4104125G0002

Burberry・BURBERRY バーバリー スニーカー EU35(21.5cm位) 4119224D0117・スニーカー・ベージュx黒( ...・EU35(21.5cm位)
                                                    └─ Code: 4119224D0117
```

**Regex Pattern**: `EU\d+[^)]*\)\s+(\d{7}[A-Z]\d{4})・`

**Impact**: This pattern is currently NOT being captured by the existing logic, resulting in missing product codes for items with size information before the code.

---

### Pattern 4: Code After Product Type (No Color, No Dash) ✅
**Description**: Code appears directly after the product type in Japanese katakana, without color or dash.

**Structure**: `Brand・Product [CODE]・Category・Details`

**Examples**:
```
COMME des GARCONS・COMME des GARCONS COMME des GARCONS 2001124G0044・ローファー・オックスフォード・白・23cm
                                                        └─ Code: 2001124G0044
```

**Regex Pattern**: `([ァ-ヶー]+)\s+(\d{7}[A-Z]\d{4})・`

---

## Products Without Codes

Many products do NOT have product codes:

**Examples**:
```
Bvlgari・BVLGARI 指輪・指輪・リング・クリア・ONE SIZE
PRADA・PRADA ハンドバッグ・ハンドバッグ・レッド・ONE SIZE
Louis Vuitton・LOUIS VUITTON ショルダーバッグ・ショルダーバッグ・ポシェット・ブラウン・ONE SIZE
Tiffany & Co・TIFFANY&Co. アトラス リング・指輪・指輪・リング・シルバー・ONE SIZE
```

**Note**: These are valid entries - not all products have product codes in their original names.

---

## Code Position Analysis

All product codes appear in the **second segment** of the original_name field (between the first and second ・ separator):

```
Brand ・ [Second Segment with CODE] ・ Category ・ Details ・ Size
       ^                           ^
       First ・                    Second ・ (CODE always before this)
```

No codes were found in other segments.

---

## Recommendations

### 1. Add Pattern 3 to Extraction Logic ⚠️ **CRITICAL**

The current extraction logic is missing Pattern 3 (Code After Size Information). This pattern is common for brands like:
- A.P.C.
- BALLY
- Burberry
- Barbour
- BOTTEGA VENETA

**Estimated Impact**: Approximately 15-20% of products with codes may be missed.

### 2. Suggested Combined Regex Pattern

To capture all 4 patterns in a single regex:

```regex
(?:
  (?:EU\d+[^)]*\))\s+(\d{7}[A-Z]\d{4})・ |  # Pattern 3: After size
  -\s+(\d{7}[A-Z]\d{4})・ |                # Pattern 2: After dash
  ([^\s]+)\s+(\d{7}[A-Z]\d{4})・           # Pattern 1 & 4: After color/product
)
```

### 3. Extraction Strategy

Recommended order of pattern matching:
1. Try Pattern 3 first (most specific - with size)
2. Try Pattern 2 (with dash)
3. Try Pattern 1/4 (general case)

---

## Test Cases

### Should Extract Code:
1. ✅ `3.1 Phillip Lim ブーツ ゴールド 2020324D0039・` → `2020324D0039`
2. ✅ `3.1 Phillip Lim クラッチバッグ - 2020324A0037・` → `2020324A0037`
3. ⚠️ `A.P.C. ブーツ 黒 EU36(22.5cm位) 0272224O0031・` → `0272224O0031` (CURRENTLY MISSING)
4. ✅ `COMME des GARCONS 2001124G0044・` → `2001124G0044`

### Should NOT Extract Code (No Code Present):
1. ✅ `PRADA ハンドバッグ・ハンドバッグ・レッド・ONE SIZE`
2. ✅ `Bvlgari BVLGARI 指輪・指輪・リング・クリア・ONE SIZE`

---

## Statistics

- **Total Records**: 16,811
- **Records with Codes**: ~40-50% (estimated)
- **Records without Codes**: ~50-60% (estimated)
- **Missing Pattern Coverage**: Pattern 3 (Code After Size) - affects ~15-20% of coded items

---

## Conclusion

The current extraction logic appears to cover **3 out of 4 patterns**. The missing **Pattern 3** (Code After Size Information) is a significant gap that should be addressed to ensure complete product code extraction.
