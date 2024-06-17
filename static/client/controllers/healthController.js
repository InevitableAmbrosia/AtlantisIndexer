function initializeHealth(){
	postHealth();
	health.healthInterval = setInterval(function(){
		postHealth();
	},30000)

	health.mintInterval = setInterval(function(){
		var numSeeding = th0th.client.torrents.length;
		var amount = parseInt(numSeeding / 8)
		console.log("ASDF: " + numSeeding, amount)

		if(amount > 0){
			$.post("/mintSeeding", {amount : amount}, function(data){
		})
		}
	},86400000) //
}

function postHealth(){
	health.adjDown = th0th.getDownloaded() - health.prevDown;
	health.adjUp = th0th.getUploaded() - health.prevUp;
	health.prevUp += health.adjUp;
	health.prevDown += health.adjDown;
	//health.mintUp += health.adjUp;
	
	$.post("/mintBytes", {adjUp : health.adjUp}, function(data){

	})
	//console.log(health.mintUp);
	//104857600 100 mb
	/*if(health.mintUp > 100){
		health.mintUp = 0;
		$.post("/mintBytes", function(data){

		})	
	}*/
	
	$.post("/update_health", {totalDown : health.adjDown, totalUp: health.adjUp}, function(data){
		if(user){
			health.totalUp = data.totalUp;
			health.totalDown = data.totalDown;
			health.ATLANTIS = data.ATLANTIS;
		}
		else{
			health.totalUp = data.anonTotalUp;
			health.totalDown = data.anonTotalDown;
		}
		health.ratio = health.totalUp ? (health.totalUp / health.totalDown).toFixed(3) : 0
		console.log(health.ratio);
		console.log(data);
		$(".stat_downloaded").text(health.totalDown !== 0 ? prettyBytes(health.totalDown) : 0);
		$(".stat_uploaded").text(health.totalUp !== 0 ? prettyBytes(health.totalUp) : 0);
		$(".stat_ratio").text(health.ratio);
		$(".stat_ATLANTIS").text(health.ATLANTIS);
	})
}


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
