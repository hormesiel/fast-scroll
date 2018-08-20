#!/bin/bash

bash build.sh

# Watch for changes
while ./sleep_until_modified.sh "**/*.*" ; do
  bash build.sh ;
done
