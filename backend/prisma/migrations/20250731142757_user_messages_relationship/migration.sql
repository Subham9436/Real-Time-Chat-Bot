-- AlterTable
ALTER TABLE "public"."Users" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_sendersId_fkey" FOREIGN KEY ("sendersId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_ReceiversId_fkey" FOREIGN KEY ("ReceiversId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
