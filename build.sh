#!/bin/bash

cd node_modules/
./node-sass/bin/node-sass @material/textfield/mdc-text-field.scss > @material/textfield/mdc-text-field.css

./rollup/bin/rollup ../settings/index.mjs --file ../settings/index.js --format iife
