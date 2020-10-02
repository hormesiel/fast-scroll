#!/bin/bash

builddir=_build/
srcdir=src/

# Clean old builds
rm -rf $builddir
mkdir $builddir

# Copy main files
cp $srcdir/manifest.json $builddir
cp -r $srcdir/res $builddir
cp -r $srcdir/_locales $builddir

# Copy settings files
mkdir $builddir/settings
cp $srcdir/settings/index.html $builddir/settings/

# Copy libs files
cp -r libs $builddir

# Compile code
node node_modules/rollup/dist/bin/rollup -c $1 # '$1' equals '--watch' when provided
