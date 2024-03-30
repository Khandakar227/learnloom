import { UploadButton, UploadDropzone, useUploadThing } from "./uploadthing";


const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    // Get date components
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    // Construct the formatted date string
    const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;
  
    return formattedDate;
  };

export { useUploadThing, UploadButton, UploadDropzone, formatDateTime };
