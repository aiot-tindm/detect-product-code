#!/bin/bash

echo "=== COMPREHENSIVE PATTERN ANALYSIS ==="
echo ""

echo "1. Standard Pattern: [Color/Description] [CODE]・"
echo "   (Code appears before the middle ・ separator)"
cat 100095-146-investigate-1107.csv | cut -d',' -f3 | grep -E '[0-9]{7}[A-Z][0-9]{4}・' | head -10
echo ""
echo "---"
echo ""

echo "2. Pattern with DASH: - [CODE]・"
cat 100095-146-investigate-1107.csv | cut -d',' -f3 | grep -E '\- [0-9]{7}[A-Z][0-9]{4}・' | head -10
echo ""
echo "---"
echo ""

echo "3. Pattern with SIZE BEFORE code: EU##(...) [CODE]・"
cat 100095-146-investigate-1107.csv | cut -d',' -f3 | grep -E 'EU[0-9]+[^・]*\) [0-9]{7}[A-Z][0-9]{4}・' | head -10
echo ""
echo "---"
echo ""

echo "4. Checking for codes in THIRD segment (after second ・):"
cat 100095-146-investigate-1107.csv | cut -d',' -f3 | grep -E '・[^・]*・[^・]*[0-9]{7}[A-Z][0-9]{4}' | head -10
echo ""
echo "---"
echo ""

echo "5. Looking for codes WITHOUT the standard format:"
echo "   (Different lengths or patterns)"
cat 100095-146-investigate-1107.csv | cut -d',' -f3 | grep -oE '[0-9A-Z]{10,14}' | grep -E '^[0-9]+[A-Z]+[0-9]+$' | sort -u | head -20
echo ""
