#!/bin/bash

# Clean old builds
rm -rf build/
mkdir build/

# Copy main files
cp manifest.json build/
cp -r res build/
cp -r _locales build/

# Copy settings files
mkdir build/settings/
cp settings/index.html build/settings/

# Compile code
rollup -c
