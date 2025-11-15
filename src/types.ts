/**
 * Represents a product record from the CSV file
 */
export interface ProductRecord {
  item_id: string;
  translated_name: string;
  original_name: string;
  collection_name: string;
  shopee_id: string;
}

/**
 * Represents an enhanced product record with appended product code
 */
export interface EnhancedProductRecord extends ProductRecord {
  extracted_code?: string;
  enhanced_name: string;
}
