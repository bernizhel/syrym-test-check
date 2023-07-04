#! /usr/bin/env bash

response=$(curl -sSL -d '{"form": {"name": "Name", "phone": "79204003020", "address": "Address"}, "cart": {"0": {"name": "Product", "price": 1, "count": 1}}}' -H "Content-Type: application/json" 'http://localhost:3000/hw/store/api/checkout')

REGEXP='^\{"id":\d{1}\}'

echo $response

if [[ ! $response =~ $REGEXP ]]; then
    echo "OK"
    exit 0
else
    echo "BUG_ID=2 FOUND"
    exit 1
fi
