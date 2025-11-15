import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { ProductRecord, EnhancedProductRecord } from './types';
import { batchExtractProductCodes, extractProductCode } from './productCodeExtractor';

/**
 * Main function to process the CSV file
 */
async function main() {
  const inputFile = path.join(process.cwd(), '100095-146-investigate-1107.csv');
  const outputFile = path.join(process.cwd(), 'output-enhanced-products.csv');
  const reportFile = path.join(process.cwd(), 'extraction-report.txt');

  console.log('🚀 Product Code Extraction Tool');
  console.log('================================\n');

  // Read the CSV file
  console.log(`📖 Reading input file: ${inputFile}`);
  const fileContent = fs.readFileSync(inputFile, 'utf-8');

  // Parse CSV
  console.log('🔍 Parsing CSV data...');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true, // Handle inconsistent column counts
  }) as ProductRecord[];

  console.log(`✅ Found ${records.length} records\n`);

  // Process records
  console.log('⚙️  Extracting product codes...');
  const enhancedRecords = batchExtractProductCodes(records);

  // Generate statistics
  const codesExtracted = enhancedRecords.filter(r => r.extracted_code).length;
  const codesNotFound = enhancedRecords.length - codesExtracted;
  const extractionRate = ((codesExtracted / enhancedRecords.length) * 100).toFixed(2);

  console.log(`\n📊 Extraction Statistics:`);
  console.log(`   Total records:        ${enhancedRecords.length}`);
  console.log(`   Codes extracted:      ${codesExtracted}`);
  console.log(`   Codes not found:      ${codesNotFound}`);
  console.log(`   Extraction rate:      ${extractionRate}%\n`);

  // Prepare output CSV with enhanced names
  const outputRecords = enhancedRecords.map(record => ({
    item_id: record.item_id,
    translated_name: record.enhanced_name,
    original_name: record.original_name,
    collection_name: record.collection_name,
    shopee_id: record.shopee_id,
    extracted_code: record.extracted_code || '',
  }));

  // Write enhanced CSV
  console.log(`💾 Writing enhanced CSV to: ${outputFile}`);
  const csvOutput = stringify(outputRecords, {
    header: true,
    quoted: true,
  });
  fs.writeFileSync(outputFile, csvOutput);

  // Generate detailed report
  console.log(`📄 Generating extraction report: ${reportFile}`);
  const report = generateReport(enhancedRecords, codesExtracted, codesNotFound, extractionRate);
  fs.writeFileSync(reportFile, report);

  console.log('\n✨ Processing complete!');
  console.log(`\nOutput files:`);
  console.log(`  - Enhanced CSV: ${outputFile}`);
  console.log(`  - Report:       ${reportFile}\n`);
}

/**
 * Generate a detailed extraction report
 */
function generateReport(
  records: EnhancedProductRecord[],
  extracted: number,
  notFound: number,
  rate: string
): string {
  const lines: string[] = [];

  lines.push('Product Code Extraction Report');
  lines.push('==============================\n');
  lines.push(`Generated: ${new Date().toISOString()}\n`);

  lines.push('Summary Statistics:');
  lines.push(`  Total records processed: ${records.length}`);
  lines.push(`  Codes successfully extracted: ${extracted}`);
  lines.push(`  Codes not found: ${notFound}`);
  lines.push(`  Extraction success rate: ${rate}%\n`);

  // Sample successful extractions
  lines.push('\nSample Successful Extractions (first 20):');
  lines.push('==========================================\n');
  const successfulSamples = records.filter(r => r.extracted_code).slice(0, 20);
  successfulSamples.forEach((record, index) => {
    lines.push(`${index + 1}. Item ID: ${record.item_id}`);
    lines.push(`   Original: ${record.original_name.substring(0, 100)}...`);
    lines.push(`   Code: ${record.extracted_code}`);
    lines.push(`   Enhanced: ${record.enhanced_name}`);
    lines.push('');
  });

  // Sample failed extractions
  lines.push('\nSample Failed Extractions (first 20):');
  lines.push('======================================\n');
  const failedSamples = records.filter(r => !r.extracted_code).slice(0, 20);
  failedSamples.forEach((record, index) => {
    lines.push(`${index + 1}. Item ID: ${record.item_id}`);
    lines.push(`   Original: ${record.original_name.substring(0, 100)}...`);
    lines.push(`   Translated: ${record.translated_name}`);
    lines.push('');
  });

  // Pattern frequency analysis
  lines.push('\nExtracted Code Pattern Analysis:');
  lines.push('================================\n');
  const codeLengths = new Map<number, number>();
  records.filter(r => r.extracted_code).forEach(r => {
    const len = r.extracted_code!.length;
    codeLengths.set(len, (codeLengths.get(len) || 0) + 1);
  });

  lines.push('Code length distribution:');
  Array.from(codeLengths.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([length, count]) => {
      lines.push(`  ${length} characters: ${count} codes`);
    });

  return lines.join('\n');
}

// Run the main function
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
