# Product Code Pattern Analysis

## Analysis Date
2025-11-17

## Summary
After comprehensive analysis of the dataset (16,811 records), I have identified **4 distinct patterns** for product code extraction:
- **Patterns 1-3**: Extract from `original_name` field
- **Pattern 4**: Extract from `description` field

Including **1 MISSING pattern** (Pattern 3) that was not previously covered.

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

### Pattern 4: Model Number from Description Field ✅
**Description**: Extract model numbers (型番) from the product description field.

**Structure**: Text containing `【型番】` followed by the model number

**Examples**:
```
Example 1:
Description: "【型番】4M00160"
Extract: 4M00160

Example 2:
Description: "【型番】\nクレドール　シグノ\nGSWE982"
Extract: GSWE982
```

**Regex Pattern**: `【型番】[^\n]*?\n?([A-Z0-9]+)`

**Note**: Unlike Patterns 1-3 which have a fixed 12-character format, model numbers from descriptions have variable length.

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

### For original_name (Patterns 1-3)
All product codes appear in the **second segment** of the original_name field (between the first and second ・ separator):

```
Brand ・ [Second Segment with CODE] ・ Category ・ Details ・ Size
       ^                           ^
       First ・                    Second ・ (CODE always before this)
```

No codes were found in other segments.

### For description (Pattern 4)
Model numbers are located after the `【型番】` marker in the description field, which may appear anywhere in the description text.

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

### 2. Suggested Regex Patterns

**For original_name (Patterns 1-3)**:
```regex
(?:EU\d+[^)]*\))\s+(\d{7}[A-Z]\d{4})・|  # Pattern 3: After size
-\s+(\d{7}[A-Z]\d{4})・|                 # Pattern 2: After dash
\s+(\d{7}[A-Z]\d{4})・                   # Pattern 1: After color
```

**For description (Pattern 4)**:
```regex
【型番】[^\n]*?\n?([A-Z0-9]+)
```

### 3. Extraction Strategy

**For original_name**:
1. Try Pattern 3 first (most specific - with size)
2. Try Pattern 2 (with dash)
3. Try Pattern 1 (after color)

**For description**:
- Search for `【型番】` marker and extract the following alphanumeric code

---

## Test Cases

### Should Extract Code from original_name:
1. ✅ `3.1 Phillip Lim ブーツ ゴールド 2020324D0039・` → `2020324D0039`
2. ✅ `3.1 Phillip Lim クラッチバッグ - 2020324A0037・` → `2020324A0037`
3. ⚠️ `A.P.C. ブーツ 黒 EU36(22.5cm位) 0272224O0031・` → `0272224O0031` (CURRENTLY MISSING)

### Should Extract Code from description:
4. ✅ `【型番】4M00160` → `4M00160`
5. ✅ `【型番】\nクレドール　シグノ\nGSWE982` → `GSWE982`

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

The current extraction logic appears to cover **2 out of 4 patterns**:
- ✅ Pattern 1 (Code After Color) - Covered
- ✅ Pattern 2 (Code After Dash) - Covered
- ⚠️ **Pattern 3 (Code After Size Information) - MISSING** - Significant gap affecting ~15-20% of coded items
- ✅ Pattern 4 (Model Number from Description) - Separate extraction logic needed

The missing **Pattern 3** (Code After Size Information) is a significant gap in `original_name` extraction that should be addressed to ensure complete product code extraction.
