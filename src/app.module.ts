import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { RefUangKeluarModule } from './modules/ref-uang-keluar/ref-uang-keluar.module';
import { RefUangMasukModule } from './modules/ref-uang-masuk/ref-uang-masuk.module';
import { RefSiswaModule } from './modules/ref-siswa/ref-siswa.module';
import { TransSiswaModule } from './modules/trans-siswa/trans-siswa.module';
import { RefSppModule } from './modules/ref-spp/ref-spp.module';
import { TransSppModule } from './modules/trans-spp/trans-spp.module';
import { TransUangMasukModule } from './modules/trans-uang-masuk/trans-uang-masuk.module';
import { TransUangKeluarModule } from './modules/trans-uang-keluar/trans-uang-keluar.module';
import { AdmRoleModule } from './modules/adm-role/adm-role.module';
import { AdmRoleAssignmentModule } from './modules/adm-role-assignment/adm-role-assignment.module';
import { AdmConfigModule } from './modules/adm-config/adm-config.module';
import { AdmMenuModule } from './modules/adm-menu/adm-menu.module';
import { AdmTahunAjaranModule } from './modules/adm-tahun-ajaran/adm-tahun-ajaran.module';

import { AdmUserModule } from './modules/adm-user/adm-user.module';
import { ChangePassModule } from './modules/change-pass/change-pass.module';
import { RefBiayaModule } from './modules/ref-biaya/ref-biaya.module';
import { RefCicilanModule } from './modules/ref-cicilan/ref-cicilan.module';
import { RefJabatanModule } from './modules/ref-jabatan/ref-jabatan.module';
import { RefKaryawanModule } from './modules/ref-karyawan/ref-karyawan.module';
import { RefListUangKeluarModule } from './modules/ref-list-uang-keluar/ref-list-uang-keluar.module';
import { RefListUangMasukModule } from './modules/ref-list-uang-masuk/ref-list-uang-masuk.module';
// import { RefPpdbToSisModule } from './modules/ref-ppdb-to-sis/ref-ppdb-to-sis.module';
import { RefPrivilageModule } from './modules/ref-privilage/ref-privilage.module';
import { RefSiswaKompBiayaModule } from './modules/ref-siswa-komp-biaya/ref-siswa-komp-biaya.module';
import { RefSppTypeModule } from './modules/ref-spp-type/ref-spp-type.module';
import { RefTabsisModule } from './modules/ref-tabsis/ref-tabsis.module';
import { TransPengembalianDspModule } from './modules/trans-pengembalian-dsp/trans-pengembalian-dsp.module';
// import { TransPengembalianDspPpdbModule } from './modules/trans-pengembalian-dsp-ppdb/trans-pengembalian-dsp-ppdb.module';
import { PpdbSiswaModule } from './modules/ppdb-siswa/ppdb-siswa.module';
import { PpdbKomponenBiayaModule } from './modules/ppdb-komponen-biaya/ppdb-komponen-biaya.module';
import { PpdbKeuanganModule } from './modules/ppdb-keuangan/ppdb-keuangan.module';
import { TransSiswaPpdbModule } from './modules/trans-siswa-ppdb/trans-siswa-ppdb.module';
// import { TransSppPpdbModule } from './modules/trans-spp-ppdb/trans-spp-ppdb.module';
import { KasSiswaModule } from './modules/kas-siswa/kas-siswa.module';
// import { KasSiswaPpdbModule } from './modules/kas-siswa-ppdb/kas-siswa-ppdb.module';
import { KasSppModule } from './modules/kas-spp/kas-spp.module';
// import { KasSppPpdbModule } from './modules/kas-spp-ppdb/kas-spp-ppdb.module';
import { KasUangKeluarModule } from './modules/kas-uang-keluar/kas-uang-keluar.module';
import { KasUangMasukModule } from './modules/kas-uang-masuk/kas-uang-masuk.module';
import { CicilanKeuanganModule } from './modules/cicilan-keuangan/cicilan-keuangan.module';
// import { CicilanKeuanganPpdbModule } from './modules/cicilan-keuangan-ppdb/cicilan-keuangan-ppdb.module';
import { RepBalanceAllModule } from './modules/rep-balance-all/rep-balance-all.module';
import { RepBalanceBlnModule } from './modules/rep-balance-bln/rep-balance-bln.module';
import { RepBalanceHariModule } from './modules/rep-balance-hari/rep-balance-hari.module';
import { RepBalanceThnModule } from './modules/rep-balance-thn/rep-balance-thn.module';
import { RepPenerimaanModule } from './modules/rep-penerimaan/rep-penerimaan.module';
import { RepPenerimaanHarianModule } from './modules/rep-penerimaan-harian/rep-penerimaan-harian.module';
// import { RepPpdbModule } from './modules/rep-ppdb/rep-ppdb.module';
import { RepSppSiswaModule } from './modules/rep-spp-siswa/rep-spp-siswa.module';
import { RepSppSiswaBulanModule } from './modules/rep-spp-siswa-bulan/rep-spp-siswa-bulan.module';
import { RepSppSiswaHarianModule } from './modules/rep-spp-siswa-harian/rep-spp-siswa-harian.module';
import { RepSppSiswaTahunModule } from './modules/rep-spp-siswa-tahun/rep-spp-siswa-tahun.module';
import { RepTransSiswaModule } from './modules/rep-trans-siswa/rep-trans-siswa.module';
import { RefKelasModule } from './modules/ref-kelas/ref-kelas.module';
import { MappingKelasModule } from './modules/mapping-kelas/mapping-kelas.module';
import { RefSmkModule } from './modules/ref-smk/ref-smk.module';
import { RefJurModule } from './modules/ref-jur/ref-jur.module';
import { RefJenisBayarModule } from './modules/ref-jenis-bayar/ref-jenis-bayar.module';
import { RefKomponenCicilanModule } from './modules/ref-komponen-cicilan/ref-komponen-cicilan.module';
import { RefListBiayaModule } from './modules/ref-list-biaya/ref-list-biaya.module';
import { RefMappingBiayaSiswaModule } from './modules/ref-mapping-biaya-siswa/ref-mapping-biaya-siswa.module';
import { RefMappingCicilanSiswaModule } from './modules/ref-mapping-cicilan-siswa/ref-mapping-cicilan-siswa.module';
import { RefMappingKelasModule } from './modules/ref-mapping-kelas/ref-mapping-kelas.module';
import { RefMenuPrivilageModule } from './modules/ref-menu-privilage/ref-menu-privilage.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // I18n
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: false,
      },
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        dateStrings: true,
        extra: {
          connectionLimit: 10,
        },
        timezone: '+00:00',
        legacySpatialSupport: false,
        charset: 'utf8mb4_unicode_ci',
      }),
    }),

    // Common modules
    CommonModule,

    // Feature modules
    AuthModule,
    RefUangKeluarModule,
    RefUangMasukModule,
    RefSiswaModule,
    TransSiswaModule,
    RefSppModule,
    TransSppModule,
    TransUangMasukModule,
    TransUangKeluarModule,
    AdmRoleModule,
    AdmRoleAssignmentModule,
    AdmConfigModule,
    AdmMenuModule,
    AdmTahunAjaranModule,
    AdmUserModule,
    ChangePassModule,
    RefBiayaModule,
    RefCicilanModule,
    RefJabatanModule,
    RefKaryawanModule,
    RefListUangKeluarModule,
    RefListUangMasukModule,
    // RefPpdbToSisModule,
    RefPrivilageModule,
    RefSiswaKompBiayaModule,
    RefSppTypeModule,
    RefTabsisModule,
    TransPengembalianDspModule,
    // TransPengembalianDspPpdbModule,
    PpdbSiswaModule,
    PpdbKomponenBiayaModule,
    PpdbKeuanganModule,
    TransSiswaPpdbModule,
    // TransSppPpdbModule,
    KasSiswaModule,
    // KasSiswaPpdbModule,
    KasSppModule,
    // KasSppPpdbModule,
    KasUangKeluarModule,
    KasUangMasukModule,
    CicilanKeuanganModule,
    // CicilanKeuanganPpdbModule,
    RepBalanceAllModule,
    RepBalanceBlnModule,
    RepBalanceHariModule,
    RepBalanceThnModule,
    RepPenerimaanModule,
    RepPenerimaanHarianModule,
    // RepPpdbModule,
    RepSppSiswaModule,
    RepSppSiswaBulanModule,
    RepSppSiswaHarianModule,
    RepSppSiswaTahunModule,
    RepTransSiswaModule,
    RefKelasModule,
    MappingKelasModule,
    // New modules
    RefSmkModule,
    RefJurModule,
    RefJenisBayarModule,
    RefKomponenCicilanModule,
    RefListBiayaModule,
    RefMappingBiayaSiswaModule,
    RefMappingCicilanSiswaModule,
    RefMappingKelasModule,
    RefMenuPrivilageModule,
    // Other modules will be added here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
