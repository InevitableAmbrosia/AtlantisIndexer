function initializeStGeorge(){
	$("#st_george_hide").click(function(e){
		e.preventDefault();
		$("#st_george_show").fadeIn('fast');
		$(this).fadeOut('fast');
		$("#st_george_chatbox").fadeOut();
		$("#st_george_img").fadeOut();
		$("#st_george_ai").fadeOut();
		$("#st_george_button").fadeOut();
		$("#st_george_header").animate({"bottom" : 0})
		$("#st_george").fadeOut();
	})


	$("#st_george_show").click(function(e){
		e.preventDefault();
		$("#st_george_hide").fadeIn('fast');
		$(this).fadeOut('fast');
		$("#st_george_chatbox").fadeIn('slow');
		$("#st_george_img").fadeIn('slow');
		$("#st_george_ai").fadeIn('slow')
		$("#st_george_button").fadeIn('slow')
		$("#st_george").fadeIn('slow')
		$("#st_george_header").animate({"bottom" : 312})
	})

	$("#st_george_button").click(function(){
		console.log("CLICKED AI")
		georgePost($("#st_george_ai").val())
	})

	$("#st_george_ai").on('keyup', function (e) {
	    if (e.key === 'Enter' || e.keyCode === 13) {
	        georgePost($(this).val());
	    }
	});

	function georgePost(val){
		$("#st_george_button").prop("disabled", true)
		$("#st_george_ai").val("")
		var arr = val.split(" ");
		var sw = arr[0];
		if(!arr[0] && val === "/interest"){
			sw = "/interest"
		}
		if(sw === "/source" || sw === "/author" || sw === "/class"){
			$.post("/recommend" + sw, {uuid : arr[1]}, function(data){
				$("#st_george_button").prop("disabled", false)		
				if(!data.errors){
					var a = document.createElement(a)
					switch(sw){
						case "/source":
							georgeUpdate("source", data.source.uuid, data.source.title);
						break;	
						case "/author":
						georgeUpdate("author", data.author.uuid, data.author.author);
							break;
						case "/class":
							georgeUpdate("class", data.class.uuid, data.class.name);
							break;					
						default : 
							break;
					}			
				}
				else{
					$("#st_george_chatbox").append("No records found.<br>")
				}

			});
		}
		else if(sw === "/interest"){
			var infoHashes = []
			if(getTorrentTabs().length === 0){
				$("#st_george_chatbox").append("Download a torrent to recommend based on interest!")
				$("#st_george_button").prop("disabled", false)

			}
			else{
				itemsProcessed = 0;
				getTorrentTabs().forEach((item, index, array) => {
				
				    itemsProcessed++;
				    infoHashes.push(item.infoHash);
				    if(itemsProcessed === array.length) {
				    	console.log(infoHashes);
					    $.post("/george_torrent", {infoHashes: JSON.stringify(infoHashes)}, function(data){
							console.log("POST RETURN@")
							$("#st_george_button").prop("disabled", false)
							if(!data.errors){
								console.log(data);
								georgeUpdate("torrent", data.torrent.infoHash, data.source);

							}
							else{
								$("#st_george_chatbox").append("No records found.<br>")

							}
						})	
				    }
				
				});
				
			}
			
		}
		else if(sw === "/oracle"){

		}
		else{
			$("#st_george_button").prop("disabled",false)
			$("#st_george_chatbox").append("<span>Invalid syntax.<br>AI Syntax:<br>Recommendations:<br>/source [uuid]<br>/interest (based on downloads)" +
				"<br>Oracle: /oracle</span>")

		}
	}

	function georgeUpdate(sw, uuid, str){
		var a = document.createElement("a")
		$(a).text(str);
		var param = "?uuid=" + uuid
		if(sw === "torrent"){
			param = "?infoHash=" + uuid
			ANCHOR.route("#torrent?infoHash=" + uuid + "&buoy=" + ANCHOR.getParams().buoy)
		}
		$(a).attr("href", "#" + sw + param + "&buoy=" + ANCHOR.getParams().buoy)
		$(a).addClass("ANCHOR");
		$(a).addClass(sw)
		$("#st_george_chatbox").append(a)
		$("#st_george_chatbox").append("<br>")
	}
}