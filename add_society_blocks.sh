#!/bin/bash

# Add society blocks for D-1 to D-22
for i in {1..22}
do
  curl -X POST http://localhost:5000/api/society-blocks \
    -H "Content-Type: application/json" \
    -d "{\"societyId\": 1, \"blockName\": \"D-$i\", \"flatsCount\": 8}"

  echo ""
done