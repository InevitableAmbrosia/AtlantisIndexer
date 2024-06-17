function seed(files, cb){
	th0th.seed(files,function(torrent){
		$("#infoHash").val(torrent.infoHash);
		console.log("seeding " + torrent.infoHash)
		$(".torrent_message").empty();
/*	<a href='magnet:?xt=urn:btih:" + torrent.infoHash + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337'>[MG]</a>	
	$('<input />').attr('type', 'hidden')
	        .attr("name", "size")
	        .addClass('torrent_size')
	        .val(torrent.length)
	        .appendTo('.upload');*/	
	    cb(null, torrent);
	})

	$(".torrent_a").click(function(e){
		e.preventDefault();
		return false;
	})
}

  function initializeTorrent(){
  	$(".torrentFile").empty();
    var infoHash = "";
	  if(ANCHOR.getParams()){
	  	infoHash = ANCHOR.getParams().infoHash;
	  }
  	console.log(infoHash)

	  const torrentId = "magnet:?xt=urn:btih:" + infoHash + "&tr=&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
	  const $body = document.body
	  const $progressBar = document.querySelector('#progressBar')
	  const $numPeers = document.querySelector('#numPeers')
	  const $downloaded = document.querySelector('#downloaded')
	  const $total = document.querySelector('#total')
	  const $remaining = document.querySelector('#remaining')
	  const $uploadSpeed = document.querySelector('#uploadSpeed')
	  const $downloadSpeed = document.querySelector('#downloadSpeed')

	  // Download the torrent
	  var torrent = th0th.client.get(infoHash);
	  console.log(torrent);
	  if(!torrent){
	  	th0th.addFile(infoHash, function(torrent){
	  		if(torrent){
	  			appendFiles(torrent.files)
	  			dl(torrent);
	  		  $(".torrentFile").append(
	  		  	'<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>')
	  		}
	  	})
	  }
	  else{
	  	appendFiles(torrent.files)
	  	dl(torrent);
	  	
	  }

	  function dl(torrent){
	  	console.log(torrent.numPeers)
	  	$.post("/dl/" + torrent.infoHash + "?numPeers=" + (torrent.numPeers ? torrent.numPeers : 0), function(){
		
			});
			

	  }
	  function appendFiles(files){
	  	$("#output").empty();
	  	postHealth();
	  	files.forEach(function(file){
	  		$("#output").append("<br><br>")
	  		file.appendTo("#output");
	  	})
	  }
	}  








