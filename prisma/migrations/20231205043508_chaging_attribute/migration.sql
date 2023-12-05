-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
