import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const prisma = new PrismaClient();
const uploadThing = createUploadthing();

export const fileRouter = {
  skewerImageUpload: uploadThing({
    image: { maxFileSize: "4MB", maxFileCount: 1 }, 
  })
    .onUploadComplete(async ({ metadata, file }) => {
        // eslint-disable-next-line no-console
      console.log("Uploaded file URL:", file.url);
        // eslint-disable-next-line no-console
      console.log("Metadata received:", metadata);


    }),
} satisfies FileRouter;

export type FileRouter = typeof fileRouter;
