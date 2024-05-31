var torrentTabs = []

function setTorrentTabs(tab){
	torrentTabs.push(tab);
}

function getTorrentTabs(){
	return torrentTabs;
}

function shiftTorrentTabs(){
	torrentTabs.shift();
}

function getTorrentTabsInfoHashes(){
	var infoHashes = [];	
	getTorrentTabs().forEach(function(tab){
		infoHashes.push(tab.infoHash);
	})
	return infoHashes;
}