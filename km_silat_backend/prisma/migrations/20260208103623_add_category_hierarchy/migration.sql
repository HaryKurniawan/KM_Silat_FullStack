-- CreateTable
CREATE TABLE "Pengguna" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengguna_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anggota" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "peran" TEXT NOT NULL,
    "angkatan" TEXT NOT NULL,
    "spesialisasi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anggota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kejuaraan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "prestasi" TEXT NOT NULL,
    "anggotaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kejuaraan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriRoadmap" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "subjudul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "warnaAksen" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ikon" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KategoriRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRoadmap" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "tipeVideo" TEXT NOT NULL DEFAULT 'youtube',
    "kontenDetail" TEXT NOT NULL,
    "ikon" TEXT NOT NULL,
    "kategoriRoadmapId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Komentar" (
    "id" TEXT NOT NULL,
    "namaPengguna" TEXT NOT NULL,
    "avatarPengguna" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suka" INTEGER NOT NULL DEFAULT 0,
    "disukai" BOOLEAN NOT NULL DEFAULT false,
    "itemRoadmapId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Komentar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jadwal" (
    "id" INTEGER NOT NULL,
    "hari" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Istirahat',
    "kategori" TEXT,
    "waktu" TEXT,
    "lokasi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jadwal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pengguna_username_key" ON "Pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriRoadmap_slug_key" ON "KategoriRoadmap"("slug");

-- CreateIndex
CREATE INDEX "KategoriRoadmap_parentId_idx" ON "KategoriRoadmap"("parentId");

-- CreateIndex
CREATE INDEX "KategoriRoadmap_slug_idx" ON "KategoriRoadmap"("slug");

-- CreateIndex
CREATE INDEX "ItemRoadmap_kategoriRoadmapId_idx" ON "ItemRoadmap"("kategoriRoadmapId");

-- CreateIndex
CREATE INDEX "Komentar_itemRoadmapId_idx" ON "Komentar"("itemRoadmapId");

-- CreateIndex
CREATE INDEX "Komentar_parentId_idx" ON "Komentar"("parentId");

-- AddForeignKey
ALTER TABLE "Kejuaraan" ADD CONSTRAINT "Kejuaraan_anggotaId_fkey" FOREIGN KEY ("anggotaId") REFERENCES "Anggota"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KategoriRoadmap" ADD CONSTRAINT "KategoriRoadmap_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "KategoriRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemRoadmap" ADD CONSTRAINT "ItemRoadmap_kategoriRoadmapId_fkey" FOREIGN KEY ("kategoriRoadmapId") REFERENCES "KategoriRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_itemRoadmapId_fkey" FOREIGN KEY ("itemRoadmapId") REFERENCES "ItemRoadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Komentar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
