-- CreateTable
CREATE TABLE "link" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "link_slug_idx" ON "link"("slug");

-- CreateIndex
CREATE INDEX "link_userId_idx" ON "link"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "link_slug_key" ON "link"("slug");
