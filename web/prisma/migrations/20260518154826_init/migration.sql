-- CreateTable
CREATE TABLE "table_kpi_marketing" (
    "id" SERIAL NOT NULL,
    "tasklist" VARCHAR(100) NOT NULL,
    "kpi" VARCHAR(100) NOT NULL,
    "karyawan" VARCHAR(100) NOT NULL,
    "deadline" DATE NOT NULL,
    "aktual" DATE NOT NULL,

    CONSTRAINT "table_kpi_marketing_pkey" PRIMARY KEY ("id")
);
