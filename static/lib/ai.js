"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var pdf_1 = require("@langchain/community/document_loaders/web/pdf");
var nike10kPDFPath = "https://s3.us-west-1.wasabisys.com/luminist/EB/R/Regardie%20-%20The%20Complete%20Golden%20Dawn.pdf";
// Read the file as a buffer
var buffer = await promises_1.default.readFile(nike10kPDFPath);
// Create a Blob from the buffer
var nike10kPDFBlob = new Blob([buffer], { type: "application/pdf" });
var loader = new pdf_1.WebPDFLoader(nike10kPDFBlob, {
// required params = ...
// optional params = ...
});
var docs = await loader.load();
console.log(docs[0]);
