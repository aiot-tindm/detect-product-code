# Product Code Extractor

A TypeScript tool to extract product codes from Japanese product names and enhance translated names to reduce duplicates.

## Overview

This tool processes CSV files containing product data with Japanese product descriptions. It:
- Extracts alphanumeric product codes from Japanese product names
- Appends extracted codes to translated product names
- Generates enhanced CSV output with unique product identifiers
- Provides detailed extraction statistics and reports

## Pattern Recognition

The extractor identifies product codes based on these patterns:
- **Format**: Alphanumeric codes (mix of numbers and uppercase letters)
- **Length**: 8-15 characters
- **Position**: Usually before Japanese separator (・) or at strategic positions
- **Examples**:
  - `2020324D0039` (from 3.1 Phillip Lim products)
  - `4104125G0002` (from BALLY products)
  - `0356324O0053` (from 45R products)

## Installation

```bash
npm install
```

## Usage

### Quick Start

```bash
npm run extract
```

This command will:
1. Build the TypeScript source
2. Process the input CSV file
3. Generate enhanced output files

### Development Mode

```bash
npm run dev
```

### Build Only

```bash
npm build
```

## Input Format

The tool expects a CSV file named `100095-146-investigate-1107.csv` with these columns:
- `item_id`: Unique product identifier
- `translated_name`: Translated product name
- `original_name`: Original Japanese product description
- `collection_name`: Collection identifier
- `shopee_id`: Shopee platform ID

## Output Files

### 1. Enhanced CSV (`output-enhanced-products.csv`)
Contains all original columns plus:
- Enhanced `translated_name` with appended product codes
- `extracted_code`: The extracted product code (if found)

### 2. Extraction Report (`extraction-report.txt`)
Includes:
- Extraction statistics
- Sample successful extractions
- Sample failed extractions
- Code pattern analysis

## Code Structure

```
src/
├── types.ts                 # TypeScript interfaces
├── productCodeExtractor.ts  # Core extraction logic
└── index.ts                 # Main processing script
```

## Key Functions

### `extractProductCode(originalName: string): string | null`
Extracts a product code from a Japanese product description.

### `extractAndAppendProductCode(record: ProductRecord): EnhancedProductRecord`
Enhances a single product record with the extracted code.

### `batchExtractProductCodes(records: ProductRecord[]): EnhancedProductRecord[]`
Processes multiple records in batch.

## Examples

**Input:**
```
translated_name: "BALLY bal 跟鞋 海軍藍 二手"
original_name: "BALLY・BALLY バリー パンプス 紺 EU37(23.5cm位) 4104125G0002・パンプス・紺・EU37(23.5cm位)"
```

**Output:**
```
translated_name: "BALLY bal 跟鞋 海軍藍 二手 - 4104125G0002"
extracted_code: "4104125G0002"
```

## Validation Rules

The tool validates extracted codes to ensure they are genuine product identifiers:
- Must be 8-15 characters long
- Must contain both letters and numbers
- Excludes size patterns (e.g., EU38)
- Excludes year patterns (e.g., 2020, 2021)
- Excludes purely numeric strings

## License

MIT
