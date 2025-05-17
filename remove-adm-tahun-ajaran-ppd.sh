#!/bin/bash

# Remove the AdmTahunAjaranPpd module
rm -rf /Users/acidopal/Pesat/finance-be/src/modules/adm-tahun-ajaran-ppd

# Build the project
cd /Users/acidopal/Pesat/finance-be && npm run build
