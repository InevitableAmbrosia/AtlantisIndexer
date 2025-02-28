

function seed(files, cb){
	th0th.seed(files,function(torrent){
		$("#infoHash").val(torrent.infoHash);
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
      $.get("/infoHash/" + ANCHOR.getParams().uuid, function(data){
        if(!data.free && !data.prem){
            alert("Please purchase Torrent infoHash first!")
            ANCHOR.route("#home");
        }
	  	  infoHash = data.free;
        if(data.prem){
          infoHash = data.prem;
        }

        const torrentId = "magnet:?xt=urn:btih:" + infoHash + "&tr=&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
        const $body = document.body
        const $progressBar = document.querySelector('#tor_progressBar')
        const $numPeers = document.querySelector('#tor_numPeers')
        const $downloaded = document.querySelector('#tor_downloaded')
        const $total = document.querySelector('#tor_total')
        const $remaining = document.querySelector('#tor_remaining')
        const $uploadSpeed = document.querySelector('#tor_uploadSpeed')
        const $downloadSpeed = document.querySelector('#tor_downloadSpeed')

        // Download the torrent
        var torrent = th0th.client.get(infoHash);
        if(!torrent){
          th0th.addFile(infoHash, function(torrent){
            if(torrent){
              function onProgress () {
          // Peers
                $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

                // Progress
                const percent = Math.round(torrent.progress * 100 * 100) / 100
                $progressBar.style.width = percent + '%'
                $downloaded.innerHTML = prettyBytes(torrent.downloaded)
                $total.innerHTML = prettyBytes(torrent.length)

                // Remaining time
                let remaining
                if (torrent.done) {
                  remaining = 'Done.'
                } else {
                  remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
                  remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
                }
                $remaining.innerHTML = remaining

                // Speed rates
                $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
                $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
              }
              function onDone () {
                $body.className += ' is-seed'
                onProgress(torrent)
              }
              
              torrent.on('done', onDone)
              setInterval(onProgress, 500)
              onProgress()
              appendFiles(torrent.files)
              $.post("/snatched/" + infoHash);
              console.log("HERE!")
              dl(torrent);
              $(".torrentFile").append(
                '<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>')
            }
          })
        }
        else{
          $.post("/snatched/" + infoHash);
          function onProgress () {
            // Peers
            $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

            // Progress
            const percent = Math.round(torrent.progress * 100 * 100) / 100
            $progressBar.style.width = percent + '%'
            $downloaded.innerHTML = prettyBytes(torrent.downloaded)
            $total.innerHTML = prettyBytes(torrent.length)

            // Remaining time
            let remaining
            if (torrent.done) {
              remaining = 'Done.'
            } else {
              remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
              remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
            }
            $remaining.innerHTML = remaining

            // Speed rates
            $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
            $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
          }
          function onDone() {
            $body.className += ' is-seed'
            onProgress(torrent)
          }

          torrent.on('done', onDone)
          setInterval(onProgress, 500)
          onProgress()
          appendFiles(torrent.files)
          dl(torrent);

        }
        
        
      })
      
      

        function dl(torrent){
          $.post("/dl/" + torrent.infoHash + "?numPeers=" + (torrent.numPeers ? torrent.numPeers : 0), function(){

          });


        }
        function appendFiles(files){
          $("#output").empty();
          //postHealth();
          files.forEach(function(file){
            $("#output").append("<br><br>")
            file.appendTo("#output");
            file.getBlobURL(function (err, url) {
                if (err) return log(err.message)
                $("#output").append('<a href="' + url + '">Download full file: ' + file.name + '</a>')
              })
          })
        }
      
      }      
      
  
	  
  	
	}  







