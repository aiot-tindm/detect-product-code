import { ProductRecord, EnhancedProductRecord } from './types';

/**
 * Regex patterns to match product codes in Japanese product descriptions
 *
 * Pattern breakdown:
 * 1. Primary pattern: Alphanumeric codes 8-15 characters (common format)
 *    - Must contain at least one letter and one number
 *    - Examples: 2020324D0039, 4104125G0002, 0356324O0053
 *
 * 2. Positioned before Japanese separator (・) or within product description
 */
const PRODUCT_CODE_PATTERNS = [
  // Pattern 1: Alphanumeric code before ・ separator (most common)
  // Matches: 2020324D0039・, 4104125G0002・, etc.
  /\s([0-9A-Z]{8,15})・/,

  // Pattern 2: Alphanumeric code at end of brand/product description
  // Matches codes that appear after color/size info
  /\s([0-9A-Z]{8,15})\s*$/,

  // Pattern 3: Alphanumeric code containing both letters and numbers
  // More strict: ensures mix of letters and numbers
  /\s([0-9]+[A-Z]+[0-9]+[A-Z0-9]*)(?=・|\s|$)/,
  /\s([A-Z]*[0-9]+[A-Z]+[0-9A-Z]*)(?=・|\s|$)/,
];

/**
 * Validates if a string is likely a product code
 *
 * Criteria:
 * - Length between 8-15 characters
 * - Contains both letters and numbers
 * - Not purely numeric (to avoid sizes/years)
 * - Not common measurement patterns
 */
function isValidProductCode(code: string): boolean {
  // Must be 8-15 characters
  if (code.length < 8 || code.length > 15) {
    return false;
  }

  // Must contain at least one letter and one number
  const hasLetter = /[A-Z]/.test(code);
  const hasNumber = /[0-9]/.test(code);

  if (!hasLetter || !hasNumber) {
    return false;
  }

  // Reject if it's purely numeric
  if (/^[0-9]+$/.test(code)) {
    return false;
  }

  // Reject common size patterns like EU38, EU37, etc.
  if (/^EU[0-9]+$/.test(code)) {
    return false;
  }

  // Reject year patterns (e.g., 2020, 2021, etc.)
  if (/^(19|20)[0-9]{2}$/.test(code)) {
    return false;
  }

  return true;
}

/**
 * Extracts product code from the original Japanese product name
 *
 * @param originalName - The Japanese product description
 * @returns The extracted product code or null if not found
 */
export function extractProductCode(originalName: string): string | null {
  if (!originalName || typeof originalName !== 'string') {
    return null;
  }

  // Try each pattern in order of specificity
  for (const pattern of PRODUCT_CODE_PATTERNS) {
    const match = originalName.match(pattern);
    if (match && match[1]) {
      const code = match[1];
      if (isValidProductCode(code)) {
        return code;
      }
    }
  }

  return null;
}

/**
 * Checks if the translated name already contains the product code
 *
 * @param translatedName - The translated product name
 * @param code - The product code to check
 * @returns True if code is already present, false otherwise
 */
function hasProductCode(translatedName: string, code: string): boolean {
  return translatedName.includes(code) || translatedName.includes(` - ${code}`);
}

/**
 * Enhances a product record by extracting and appending the product code
 *
 * @param record - The original product record
 * @returns Enhanced product record with appended product code
 */
export function extractAndAppendProductCode(record: ProductRecord): EnhancedProductRecord {
  const code = extractProductCode(record.original_name);

  let enhancedName = record.translated_name;

  // If code found and not already in translated name, append it
  if (code && !hasProductCode(record.translated_name, code)) {
    enhancedName = `${record.translated_name} - ${code}`;
  }

  return {
    ...record,
    extracted_code: code || undefined,
    enhanced_name: enhancedName,
  };
}

/**
 * Batch process multiple product records
 *
 * @param records - Array of product records to process
 * @returns Array of enhanced product records
 */
export function batchExtractProductCodes(records: ProductRecord[]): EnhancedProductRecord[] {
  return records.map(extractAndAppendProductCode);
}
