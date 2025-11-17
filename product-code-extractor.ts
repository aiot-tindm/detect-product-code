/**
 * Product Code Extractor
 * Extracts product codes from original_name and description fields
 */

export interface ProductRecord {
  item_id: string;
  translated_name: string;
  original_name: string;
  description?: string;
  collection_name: string;
  shopee_id: string;
}

export interface ExtractionResult {
  code: string | null;
  source: 'original_name' | 'description' | null;
  pattern: 1 | 2 | 3 | 4 | null;
}

/**
 * Extract product code from original_name field (Patterns 1-3)
 * Format: [7 digits][1 uppercase letter][4 digits] = 12 characters
 */
export function extractFromOriginalName(originalName: string): ExtractionResult {
  if (!originalName) {
    return { code: null, source: null, pattern: null };
  }

  // Pattern 3: Code After Size Information (most specific)
  // Example: EU37(23.5cm位) 4104125G0002・
  const pattern3Regex = /EU\d+[^)]*\)\s+(\d{7}[A-Z]\d{4})・/;
  const pattern3Match = originalName.match(pattern3Regex);
  if (pattern3Match) {
    return { code: pattern3Match[1], source: 'original_name', pattern: 3 };
  }

  // Pattern 2: Code After Dash
  // Example: - 2020324A0037・
  const pattern2Regex = /-\s+(\d{7}[A-Z]\d{4})・/;
  const pattern2Match = originalName.match(pattern2Regex);
  if (pattern2Match) {
    return { code: pattern2Match[1], source: 'original_name', pattern: 2 };
  }

  // Pattern 1: Code After Color
  // Example: ゴールド 2020324D0039・
  const pattern1Regex = /\s+(\d{7}[A-Z]\d{4})・/;
  const pattern1Match = originalName.match(pattern1Regex);
  if (pattern1Match) {
    return { code: pattern1Match[1], source: 'original_name', pattern: 1 };
  }

  return { code: null, source: null, pattern: null };
}

/**
 * Extract model number from description field (Pattern 4)
 * Format: Variable length alphanumeric after 【型番】
 */
export function extractFromDescription(description: string): ExtractionResult {
  if (!description) {
    return { code: null, source: null, pattern: null };
  }

  // Pattern 4: Model Number from Description
  // Example: 【型番】4M00160 or 【型番】\nGSWE982
  const pattern4Regex = /【型番】[^\n]*?\n?([A-Z0-9]+)/;
  const pattern4Match = description.match(pattern4Regex);

  if (pattern4Match) {
    return { code: pattern4Match[1], source: 'description', pattern: 4 };
  }

  return { code: null, source: null, pattern: null };
}

/**
 * Extract product code from a product record
 * Tries original_name first, then description
 */
export function extractProductCode(record: ProductRecord): ExtractionResult {
  // Try original_name first (Patterns 1-3)
  const originalNameResult = extractFromOriginalName(record.original_name);
  if (originalNameResult.code) {
    return originalNameResult;
  }

  // Try description (Pattern 4)
  if (record.description) {
    return extractFromDescription(record.description);
  }

  return { code: null, source: null, pattern: null };
}

/**
 * Append extracted code to translated_name if found
 */
export function extractAndAppendProductCode(record: ProductRecord): ProductRecord {
  const result = extractProductCode(record);

  if (!result.code) {
    return record;
  }

  // Check if code already exists in translated_name
  if (record.translated_name.includes(result.code)) {
    return record;
  }

  // Append code to translated_name
  const updatedTranslatedName = `${record.translated_name} - ${result.code}`;

  return {
    ...record,
    translated_name: updatedTranslatedName,
  };
}
