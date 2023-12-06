-- DropForeignKey
ALTER TABLE "user_projects" DROP CONSTRAINT "user_projects_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
