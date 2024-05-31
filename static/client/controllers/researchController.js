function addTorrentTab(title, infoHash){
	//NSA
	console.log(getTorrentTabsInfoHashes(), infoHash);
	var infoHashFound = false;
	if(getTorrentTabsInfoHashes() && getTorrentTabsInfoHashes().indexOf(infoHash) !== -1){
		infoHashFound = true
	}
	if(!infoHashFound){
		if($(".researcher li").length === 6){
			$(".researcher li").first().remove();
			shiftTorrentTabs()
		}

		setTorrentTabs({title : title, infoHash : infoHash})
		initializeTorrentTabs(title, infoHash)	
			
	}
	
	
}

function initializeTorrentTabs(title, infoHash){
	var li = document.createElement("li");
	var a = document.createElement("a");
	var img = document.createElement("img");
	$(li).append(img);
	$(img).attr("src", "img/alexandria.jpg");
	$(li).append(a)
	$(a).attr("href", "#")
	$(a).text(title)
	$(".researcher").append(li);

	$(a).click(function(e){
		e.preventDefault();
		ANCHOR.route("#torrent?buoy=" + ANCHOR.getParams().buoy + "&infoHash=" + infoHash)
	})
}