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
	  	$.post("/dl/" + torrent.infoHash + "?numPeers=" + torrent.numPeers ? torrent.numPeers : 0, function(){
		
			});
			$.post("/snatched/" + torrent.infoHash, function(){
				
			})

	  }
	  function appendFiles(files){
	  	files.forEach(function(file){
	  		$("#output").append("<br><br>")
	  		file.appendTo("#output");
	  	})
	  }
	}  

//initializeHealth();

function prettyBytes(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

var prevUp = 0;
var prevDown = 0;
var ratio = 1.0;

function initializeHealth(){
	
	postHealth();
	setInterval(function(){
		postHealth();
	},21300)
}

function postHealth(){
	var adjDown = th0th.getDownloaded() - prevDown;
	var adjUp = th0th.getUploaded() - prevUp;
	prevUp += adjUp;
	prevDown += adjDown;	
	$.post("/update_health", {totalDown : adjDown, totalUp: adjUp}, function(data){
		ratio = data.totalUp ? (data.totalUp / data.totalDown).toFixed(1) : 0
		console.log(ratio);
		$("#stat_downloaded").text(data.totalDown !== 0 ? prettyBytes(data.totalDown) : 0);
		$("#stat_uploaded").text(data.totalUp !== 0 ? prettyBytes(data.totalUp) : 0);
		$("#stat_ratio").text(ratio);
	})
}



