#!/bin/bash

# Fix imports in all modules
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|import { AdmTahunAjaranPpd } from .*/adm-tahun-ajaran-ppd/entities/adm-tahun-ajaran-ppd.entity.|import { AdmTahunAjaran } from "../../adm-tahun-ajaran/entities/adm-tahun-ajaran.entity"|g' {} \;
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|import { AdmTahunAjaranPpdModule } from .*/adm-tahun-ajaran-ppd/adm-tahun-ajaran-ppd.module.|import { AdmTahunAjaranModule } from "../adm-tahun-ajaran/adm-tahun-ajaran.module"|g' {} \;
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|import { AdmTahunAjaranPpdService } from .*/adm-tahun-ajaran-ppd/adm-tahun-ajaran-ppd.service.|import { AdmTahunAjaranService } from "../adm-tahun-ajaran/adm-tahun-ajaran.service"|g' {} \;

# Fix module imports
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|AdmTahunAjaranPpdModule|AdmTahunAjaranModule|g' {} \;

# Fix service injections
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|admTahunAjaranPpdService: AdmTahunAjaranPpdService|admTahunAjaranService: AdmTahunAjaranService|g' {} \;

# Fix entity relations
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|@ManyToOne(() => AdmTahunAjaranPpd)|@ManyToOne(() => AdmTahunAjaran)|g' {} \;
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|tahunAjaranPpd: AdmTahunAjaranPpd|tahunAjaranPpd: AdmTahunAjaran|g' {} \;

# Fix service calls
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|this.admTahunAjaranPpdService|this.admTahunAjaranService|g' {} \;

# Fix JoinColumn
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|@JoinColumn({ name: .id_tahun_ajaran_ppd. })|@JoinColumn({ name: "id_tahun_ajaran_ppd", referencedColumnName: "idTahunAjaran" })|g' {} \;

# Fix import errors with trailing dots
find /Users/acidopal/Pesat/finance-be/src/modules -type f -name "*.ts" -exec sed -i '' 's|\.;|"|g' {} \;

# Build the project
cd /Users/acidopal/Pesat/finance-be && npm run build
