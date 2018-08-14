CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

CREATE TABLE "Labels" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Labels" PRIMARY KEY AUTOINCREMENT,
    "Label" TEXT NULL,
    "Created" TEXT NOT NULL,
    "Custom" INTEGER NOT NULL
);

CREATE TABLE "Entities" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Entities" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NULL,
    "Value" TEXT NULL,
    "Created" TEXT NOT NULL,
    "Custom" INTEGER NOT NULL,
    "LabelId" INTEGER NULL,
    CONSTRAINT "FK_Entities_Labels" FOREIGN KEY ("LabelId") REFERENCES "Labels" ("Id") ON DELETE RESTRICT
);

CREATE INDEX "IX_Entities_LabelId" ON "Entities" ("LabelId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20180814183747_v1.0.0', '2.1.0-rtm-30799');

