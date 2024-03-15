import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
   
  import type { OurFileRouter } from "@repo/utils/server";
import { generateReactHelpers } from "@uploadthing/react/hooks";

  export const UploadButton = generateUploadButton<OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
  export const { useUploadThing } = generateReactHelpers<OurFileRouter>();