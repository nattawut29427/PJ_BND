import { createRouteHandler } from "uploadthing/next";

import { FileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createRouteHandler({ router: FileRouter });