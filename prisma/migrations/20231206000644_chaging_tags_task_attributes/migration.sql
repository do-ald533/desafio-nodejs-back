-- DropForeignKey
ALTER TABLE "tags_task" DROP CONSTRAINT "tags_task_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "tags_task" DROP CONSTRAINT "tags_task_task_id_fkey";

-- AddForeignKey
ALTER TABLE "tags_task" ADD CONSTRAINT "tags_task_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_task" ADD CONSTRAINT "tags_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
