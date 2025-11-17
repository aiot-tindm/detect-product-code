#!/bin/bash

echo "=== Analyzing Product Code Patterns ==="
echo ""
echo "Pattern 1: Code after color (e.g., 'Color CODE・')"
cat 100095-146-investigate-1107.csv | grep -E '・[^・]+ [0-9]{7}[A-Z][0-9]{4}・' | head -5
echo ""

echo "Pattern 2: Code after dash (e.g., '- CODE・')"
cat 100095-146-investigate-1107.csv | grep -E '- [0-9]{7}[A-Z][0-9]{4}・' | head -5
echo ""

echo "Pattern 3: Code after size (e.g., 'EU37(23.5cm位) CODE・')"
cat 100095-146-investigate-1107.csv | grep -E 'EU[0-9]+[^・]* [0-9]{7}[A-Z][0-9]{4}・' | head -5
echo ""

echo "Pattern 4: Code with no prefix pattern"
cat 100095-146-investigate-1107.csv | grep -E '[ァ-ヶー]+ [0-9]{7}[A-Z][0-9]{4}・' | head -5
echo ""

echo "Looking for potential missing patterns..."
echo "Entries with different code formats:"
cat 100095-146-investigate-1107.csv | grep -oE '[0-9A-Z]{8,15}' | grep -E '[0-9].*[A-Z].*[0-9]' | sort -u | head -20
