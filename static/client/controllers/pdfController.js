import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
var torrent = th0th.client.get("1dd42a66bdf9fd51dee88b14f525dbd557613e25");
    console.log(torrent);
    if(!torrent){
      th0th.addFile("1dd42a66bdf9fd51dee88b14f525dbd557613e25", function(torrent){
        if(torrent){
          console.log("Torrent downloaded!")
          torrent.files[0].getBuffer(async function(err, buffer){
            // Create a Blob from the buffer
            const PDFBlob = new Blob([buffer], { type: "application/pdf" });
            const loader = new WebPDFLoader(PDFBlob, {
              // required params = ...
              // optional params = ...
            });
            const docs = await loader.load();
            console.log(docs[0]);
            $.post("/#AI", {documents : docs}, function(data){
              $("#ai_res").text(data.response);
            })
          })
         
        }
      })
    }

// Read the file as a buffer




