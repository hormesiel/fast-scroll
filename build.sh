#!/bin/bash

echo ""
echo "Building..."
echo ""

rm -rf build/
mkdir build/

# Main files
cp manifest.json build/
cp index.js build/
cp -r res build/
cp -r _locales build/

# Settings files
mkdir build/settings/
cp settings/index.html build/settings/

# Sass -> CSS && ES6 -> ES5
rollup -c
