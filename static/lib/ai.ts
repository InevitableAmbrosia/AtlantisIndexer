import fs from "fs/promises";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

const nike10kPDFPath = "https://s3.us-west-1.wasabisys.com/luminist/EB/R/Regardie%20-%20The%20Complete%20Golden%20Dawn.pdf";

// Read the file as a buffer
const buffer = await fs.readFile(nike10kPDFPath);

// Create a Blob from the buffer
const nike10kPDFBlob = new Blob([buffer], { type: "application/pdf" });

const loader = new WebPDFLoader(nike10kPDFBlob, {
  // required params = ...
  // optional params = ...
});

const docs = await loader.load();
console.log(docs[0]);