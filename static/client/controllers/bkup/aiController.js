function initializeAI(){
	var infoHash = "8f0d112241ffddaf009681e27dd4e8aeb9c5f7cf"
	var torrent = th0th.client.get(infoHash);
    console.log(torrent);
    if(!torrent){
      //th0th.addFile(infoHash, function(torrent){
       // if(torrent){
          console.log("Torrent downloaded!")
          //torrent.on("done", function(){
				//torrent.files[0].getBuffer(async function(err, buffer){
	            // Create a Blob from the buffer
	            console.log("GOT BUFFER")
	         //   const PDFBlob = new Blob([buffer], { type: "application/pdf" });
	           // const loader = new window.WebPDFLoader(PDFBlob,{splitPages:false});
	            //const documents = await loader.load();
	            //text_splitter = new window.CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
				//docs = await text_splitter.splitDocuments(documents)
	            /*$.post("/ai",// {documents : JSON.stringify(documents)}, 
	            	function(data){
	              $("#ai_res").text(data.response);
	            })*/
	       //   })

         // })
          	
         
       // }
      //})
	}

	$("#ai_submit").click(function(){
		$.post("/ai_prompt", {prompt : $("#ai_prompt").val()}, function(data){
			$("#ai_res").text(data.response)
		})
	})

	$("#ai_upload").change(function(){
		var files= this.files;
		seed(files, function(err, torrent){
			//torrent.on("done", function(){
				torrent.files[0].getBuffer(async function(err,buffer){
					bufferToDB(buffer, function(docs){
							$.post("/ai_upload", {infoHash : torrent.infoHash, documents : JSON.stringify(docs)})
					});
				})	
			//})
			
			//alert("Please download the torrent file and seed in BiglyBT with the WebTorrent plugin. Other torrent clients do not support WebTorrent seeding to the Browser. ****WEBTORRENT DESKTOP IS CURRENTLY BROKEN, SO DO NOT USE IT****")
			
		});
	})
	
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

async function bufferToDB(buffer, cb){
	const PDFBlob = new Blob([buffer], { type: "application/pdf" });
    const loader = new window.WebPDFLoader(PDFBlob,{splitPages:false})
    const documents = await loader.load();
    text_splitter = new window.RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
	docs = await text_splitter.splitDocuments(documents)
	console.log(docs)
	if(docs.length > 25){
    	cb(getRandom(docs, 25))
	}
	else{
		cb(docs)
	}
}