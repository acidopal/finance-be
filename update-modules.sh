#!/bin/bash

# Update all modules that depend on AdmTahunAjaranPpd to use AdmTahunAjaran instead

# Function to update a file
update_file() {
  local file=$1
  
  # Replace imports
  sed -i '' 's|import { AdmTahunAjaranPpd } from .*/adm-tahun-ajaran-ppd/entities/adm-tahun-ajaran-ppd.entity.|import { AdmTahunAjaran } from \../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity.|g' "$file"
  sed -i '' 's|import { AdmTahunAjaranPpdModule } from .*/adm-tahun-ajaran-ppd/adm-tahun-ajaran-ppd.module.|import { AdmTahunAjaranModule } from \../../adm-tahun-ajaran/adm-tahun-ajaran.module.|g' "$file"
  sed -i '' 's|import { AdmTahunAjaranPpdService } from .*/adm-tahun-ajaran-ppd/adm-tahun-ajaran-ppd.service.|import { AdmTahunAjaranService } from \../../adm-tahun-ajaran/adm-tahun-ajaran.service.|g' "$file"
  
  # Replace module imports
  sed -i '' 's|AdmTahunAjaranPpdModule|AdmTahunAjaranModule|g' "$file"
  
  # Replace service injections
  sed -i '' 's|admTahunAjaranPpdService: AdmTahunAjaranPpdService|admTahunAjaranService: AdmTahunAjaranService|g' "$file"
  
  # Replace entity relations
  sed -i '' 's|@ManyToOne(() => AdmTahunAjaranPpd)|@ManyToOne(() => AdmTahunAjaran)|g' "$file"
  sed -i '' 's|@JoinColumn({ name: .id_tahun_ajaran_ppd. })|@JoinColumn({ name: \x27id_tahun_ajaran_ppd\x27, referencedColumnName: \x27idTahunAjaran\x27 })|g' "$file"
  sed -i '' 's|tahunAjaranPpd: AdmTahunAjaranPpd|tahunAjaranPpd: AdmTahunAjaran|g' "$file"
  
  # Replace service calls
  sed -i '' 's|this.admTahunAjaranPpdService|this.admTahunAjaranService|g' "$file"
}

# Find all files that reference AdmTahunAjaranPpd
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec grep -l "AdmTahunAjaranPpd" {} \; | while read file; do
  echo "Updating $file"
  update_file "$file"
done

# Build the project
cd /Users/acidopal/Pesat/finance-be && npm run build
