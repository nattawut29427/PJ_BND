import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const uploadThing = createUploadthing();

export const fileRouter = {
  skewerImageUpload: uploadThing({
    image: { maxFileSize: "4MB", maxFileCount: 1 }, 
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Uploaded file URL:", file.url);
      console.log("Metadata received:", metadata);


    }),
} satisfies FileRouter;

export type FileRouter = typeof fileRouter;
