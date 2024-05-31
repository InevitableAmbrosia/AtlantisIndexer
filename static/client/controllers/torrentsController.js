function initializeTorrents(table, cb){
	console.log("INTIIALIZING TORRENTS")
	var torrentsTable;
	if(torrentsTable){
		torrentsTable.destroy();
		$("#" + table + " tbody").empty();
		//torrentsTable.draw();
	}

	$(document).mouseup(function(e) 
    {
        var container = $(".seeAllField");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
    })

	switch(ANCHOR.page()){
		case "author":
			$("#authorTitle").text("")
			break;
		case "source":
			$("#sourceTitle").text("")
			break;
	}

	torrentsTable = $("#" + table).DataTable({
		bDestroy: true,
		responsive : true,
		serverSide : true,
		pageLength: ANCHOR.page() === "top10" ? 10 : 25,
		processing: true,
		searching: false, paging : true, info: true,
		order: [],
		columnDefs: [
            {
                target: 0,
                visible: false,
                searchable: false
            }
        ],
		rowGroup : {
			dataSrc : 0
		},
		stateSave: false,
		ajax: {
			url: "/" + table + (ANCHOR.page() === "class" || ANCHOR.page() === "author" || ANCHOR.page() === "source" ? "/" + ANCHOR.getParams().uuid : ""),
			type: "POST",
			data : {
				buoy : ANCHOR.getParams().buoy
			},
			dataSrc : function(data){
				console.log(data);
				var records = [];
				if(data.data[0]){
					switch(ANCHOR.page()){
					case "author":
						$("#authorTitle").text((data.data[0]._fields[1][0].properties.author.charAt(0) == data.data[0]._fields[1][0].properties.author.charAt(0).toUpperCase() ? 
							data.data[0]._fields[1][0].properties.author : toTitleCase(data.data[0]._fields[1][0].properties.author)));
						break;
					case "source":
						$("#sourceTitle").append(data.data[0]._fields[0].properties.title +
						' <br> <a id="addFormat" href="#upload?buoy=' + ANCHOR.getParams().buoy + '&uuid=' + data.data[0]._fields[0].properties.uuid + '" class="ANCHOR upload">Edit</a>'	)
			
						ANCHOR.buffer();
						break;
					case "class":
					  console.log(data);
						data.data.every(function(data){
							var classData = data._fields[3].find(x => x.properties.uuid === ANCHOR.getParams().uuid)
							if(classData){
								$("#classTitle").text(classData.properties.name)
								return true;
							}
						})
						break;
						
				}	
				}
				

			  var editionsAdded = []

				data.data.forEach(function(record){
			      var authorField = "";
			      record._fields[1].forEach(function(field, i){
			        if(i === 0){
			          authorField += "<span class='normal'> by </span>"
			        }
			        else{
			          authorField += ", ";
			        }
			        authorField += "<a class='ANCHOR author' href='#author?uuid=" + field.properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>" +
			        (field.properties.author.charAt(0) == field.properties.author.charAt(0).toUpperCase() ? field.properties.author : 
			        toTitleCase(field.properties.author)) + "</a>";
			        
			      })



			      //var publishersArray = record._fields[2].publishers;
			      
			      var dateField = ""
			      if(record._fields[0] && record._fields[0].properties.date){
			        dateField += " <b>[" + record._fields[0].properties.date + "]</b> "
			      }


			      var classesField = " ";
			      var seeAll = false;
			      var seeAllField = "<span class='seeAllField'>";
			      record._fields[3].forEach(function(field, i){
			        if(i === 0){
			          classesField += "<a class='ANCHOR class' href='#class?uuid=" + field.properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>" + field.properties.name + "</a>";
			        }
			        else if(i<10){
			          classesField += ", <a class='ANCHOR class' href='#class?uuid=" + field.properties.uuid  + "&buoy=" + ANCHOR.getParams().buoy + "'>" + field.properties.name + "</a>"
			        }
			        else if(!seeAll){
			        	seeAll = true;
			        	seeAllField += ", <a class='ANCHOR class' href='#class?uuid=" + field.properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>"  + field.properties.name + "</a>"
			        	classesField += " <a id='seeAll' href='#'>[See All]</a>"

			        }
			        else{
			        	seeAllField += ", <a class='ANCHOR class' href='#class?uuid=" + field.properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>" + field.properties.name + "</a>"
			        }
			      })

			      seeAllField += "</span>"
			      classesField += seeAllField;

			      //to find source img
			      
			      var sourceIMG = "";

			      console.log("TO ADD EDITIONS");

			      var numPeers = 0;

			      record._fields[2].forEach(function(edition){
							var table = "<table class='torrentsTable'><thead><th>Media</th><th>Format</th><th>DL</th><th>infoHash</th><th>Peers</th><th>Snatches</th>"
						 + "<th>Time</th><th>Booty</th><th>User</th></tr></thead><tbody><tr>"

			      	if(edition.torrent){
			      		
			      		console.log(edition.torrent.buyHash);

				      	switch(edition.torrent.media){
					      		default : 
					      			sourceIMG = "img/ebook.png"
					      			break;
				      	}
				      	console.log(edition)

				      	function toNumber({ low, high }) {
								  let res = high

								  for (let i = 0; i < 32; i++) {
								    res *= 2
								  }

								  return low + res
								}
					      

					      edition.edition.properties.numPeers = 0;
					      console.log(edition.torrent.numPeers);
					     
						      edition.edition.properties.numPeers += edition.torrent.numPeers ? edition.torrent.numPeers : 0;
					      	if(edition.torrent){
						      	var publisherHtml = "";
						      	var editionField = "";
						      	record._fields[1].forEach(function(field, i){
							      	editionField += field.properties.author
							      	if(record._fields[1][i+1]){
							      		editionField += ", "
							      	}
											else if(field.properties.author && !field.properties.author.endsWith(".")){
												editionField += ". "
											}
											else{
												editionField += " "
											}
							      })
							      if(!record._fields[0].properties.date && edition.edition.properties.date){
							      	editionField += "(" + edition.edition.properties.date + "). ";
							      }
							      else{
							     	 editionField += record._fields[0].properties.date ? "(" + record._fields[0].properties.date + (edition.edition.properties.date ? "/" + edition.edition.properties.date + "). " : "). ") : ""

							      }
							      editionField += "<span class='italics'>" + record._fields[0].properties.title + "</span>. "


							      if(edition.edition.properties.publisher){
							      	if(edition.edition.properties.publisher && edition.edition.properties.publisher.endsWith(".")){
							        	publisherHtml += edition.edition.properties.publisher ? edition.edition.properties.publisher + " " : " "
							      	}
							      	else{
							        	publisherHtml += edition.edition.properties.publisher ? edition.edition.properties.publisher + ". " : " "
							      	}
							      }
							     
							      if(edition.edition.properties.title && edition.edition.properties.title !== ""){
							      	if(!edition.edition.properties.title.endsWith(".")){
							      		editionField += edition.edition.properties.title + ". "
							      	}
							      	else{
							      		editionField += edition.edition.properties.title + " ";
							      	}
							      }
							      editionField += publisherHtml;
							      if(edition.edition.properties.no){
							      	editionField += "(" + edition.edition.properties.no + ")"
							      	if(edition.edition.properties.pages){
							      		editionField += ", "
							      	}
							      }
							      if(edition.edition.properties.pages){
							      	editionField += edition.edition.properties.pages + "."
							      }
							      

							      //magnet:?xt=urn:btih:5d96abd0e938b9ff35cf3939a5e63258d029995f&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com
						      	//add torrents
						      	console.log(edition.torrent)
						        var tr = "<tr>";
						        tr += "<td>" + edition.torrent.media + "</td>";
						        tr += "<td>" + edition.torrent.format + "</td>"
						        tr += "<td><a class='infoHash" + "' data-infohash='" + edition.torrent.infoHash + "' id='"+ edition.torrent.infoHash + "' href='magnet:?xt=urn:btih:" 
						        + edition.torrent.infoHash +"' data-torrent-uuid = '" + edition.torrent.uuid + " '>[MagnetURI]</a>" + 
						        "<a id='add_torrent_tab' data-infohash='" + edition.torrent.infoHash +
						        "' data-title='" + record._fields[0].properties.title + "' class='torrent stream' href='#torrent?buoy=" +
						         ANCHOR.getParams().buoy + "&infoHash=" + edition.torrent.infoHash + "' data-torrent-uuid = '" + edition.torrent.uuid + "'>[WebTorrent]</a></td>"
						        //"&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337'> 
						        tr += "<td id='" + edition.torrent.uuid + "'><a class='queryInfoHash' data-torrent-uuid='" + edition.torrent.uuid + 
						        "' href='#'>Copy infoHash</a></td>"
						       // table += "<td>" + humanFileSize(torrent.properties.length) + "</td>"
						       tr += "<td>" + (edition.torrent.numPeers ? edition.torrent.numPeers : 0) + "</td>"
						        tr += "<td>" + edition.torrent.snatches + "</td>";
						        tr += "<td class='here'>" + timeSince(edition.torrent.created_at) + " ago</td>"
						        tr += "<td>" + (edition.torrent.buyHash === 0 ? "<input class='donateInput' id='" + edition.torrent.uuid + 
						        	"' placeholder='Donate ETH' class='yarrr'>" : "") 
						         +"<button class='web3' data-info-hash='" + (edition.torrent.buyHash > 0 ? "Protected." : edition.torrent.infoHash) +
						          "' data-curator-address='" + edition.torrent.curatorAddress + "'" 
						        	+ "data-booty='" + (edition.torrent.buyHash > 0 ? true : false) + 
						        	"'" + "data-torrent-uuid='" + edition.torrent.uuid + "'>" + (edition.torrent.buyHash === 0 ? "Arrr!!!" : 
						        edition.torrent.buyHash + " ETH") + "</button></td>"
						        tr+="<td><a class='ANCHOR user' href='#user?buoy=" + ANCHOR.getParams().buoy + " &uuid=" + edition.torrent.uploaderUUID + "'>" 
						        + edition.torrent.uploaderUser + "</a></td>"
						        tr += "</tr>"
						        table += tr;
							      table += "</tbody></table>"
				      	
				      	console.log(edition.edition.properties.uuid);
				      	if(editionsAdded.indexOf(edition.edition.properties.uuid) === -1){
						      editionsAdded.push(edition.edition.properties.uuid);

					      		records[editionsAdded.indexOf(edition.edition.properties.uuid)] = ["<img class='tableImg' src='" + sourceIMG + "'>" + 
								       "<div class='torrentSource'>" + 
								        "<div class='tableHeading'><a id='sourceTab' class='ANCHOR source' href='#source?uuid=" + 
								        record._fields[0].properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>" 
								        + record._fields[0].properties.title + "</a>"
								       + dateField + authorField + "</div><br><div class='torrentClasses normal'>" + classesField 
								       + "</div></div>",
								        editionField, 
								        edition.edition.properties.numPeers,
								        edition.edition.properties.snatches, timeSince(edition.edition.properties.created_at) + " ago", table]
		 			    	}	
				      	else{
				      		console.log("HERE")				      		
				      		records[editionsAdded.indexOf(edition.edition.properties.uuid)][5]  = records[editionsAdded.indexOf(edition.edition.properties.uuid)][5]
				      		.slice(0, -16) + tr + "</tbody></table>";
				      	}
	 			    	  console.log(editionsAdded, edition.edition.properties.uuid)
	 			    	
	 			    	console.log(records);	
			      	}
			      }
				      	
				    })	
			      })
			      
			    return records;
			}
		},
		drawCallback : function(){
		//	ANCHOR.buffer();
			$(document).on("click", "#seeAll", function(e){
				e.preventDefault();
				$("#seeAll").hide();
				$(".seeAllField").show();
			})

			$(document).on("click", ".web3", async function(e){
				e.preventDefault();
				initPayButton($(this));
			})

			/*$(document).on("click", ".torrentFile", function(e){
				e.preventDefault();
				var client = new WebTorrent();
				var that = $(this);
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function (data){
					if(data.free){
						client.seed("magnet:?xt=urn:btih:" + data.free, function(torrent){
							document.getElementById('my_iframe').src = torrent.torrentFileBlobURL;
							client = null;
						})
					}
					else if(data.prem){
						client.seed("magnet:?xt=urn:btih:" + data.prem, function(torrent){
							document.getElementById('my_iframe').src = torrent.torrentFileBlobURL;
							client = null;
						})
					}
					else{
						alert("Please purchase torrent infoHash first!")					
					}
					client = null;
				})
			})*/

			$(document).on("click", ".infoHash", function(e){
				e.preventDefault();
				var that = $(this);
				console.log(that.data('torrent-uuid'));
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function(data){
					if(data.free){
						magnet_uri = "magnet:?xt=urn:btih:" + data.free;
						window.location = magnet_uri;
						that.attr("href", "magnet:?xt=urn:btih:" + data.free)
						$.post("/snatched/" + data.free);
					}
					else if(data.prem){
						magnet_uri = "magnet:?xt=urn:btih:" + data.prem;
						window.location = magnet_uri;
						that.attr("href", "magnet:?xt=urn:btih:" + data.prem);
						$.post("/snatched/" + data.prem);
					}
					else{
						alert("Please purchase torrent infoHash first!")
					}

				})
			})

			var that = $(this);
			$(document).on("click", ".stream", function(e){
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function(data){
					if(data.free){
						ANCHOR.route("#torrent?buoy=" + ANCHOR.getParams().buoy + "&infoHash=" + data.free);
						that.attr("href", "#torrent?buoy=" + ANCHOR.getParams().buoy + "&infoHash" + data.free)
					}
					else if(data.prem){
						ANCHOR.route("#torrent?buoy=" + ANCHOR.getParams().buoy + "&infoHash=" + data.prem);
						that.attr("href", "#torrent?buoy=" + ANCHOR.getParams().buoy + "&infoHash" + data.prem)
					}
					else{
						alert("Please purchase torrent infoHash first!")
					}

				})
			})

			$(document).on("click", ".queryInfoHash", function(e){
				e.preventDefault();
				console.log($(this).data("torrent-uuid"));
				var that = $(this);
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function(data){
					if(data.free){
						copyToClipboard(data.free)
						that.text(data.free);
					}
					else if(data.prem){
						copyToClipboard(data.prem)
						that.text(data.prem);
					}
					else{
						alert("Please purchase torrent infoHash first!")
					}
				})
			})

			function copyToClipboard(infoHash) {
		    var $temp = $("<input>");
		    $("body").append($temp);
		    $temp.val(infoHash).select();
		    document.execCommand("copy");
		    $temp.remove();
		}

			$(document).on("change", ".donateInput", function(){
				$(this).next().data("yarrr", $(this).val())
			})

			$(document).on("click", "#add_torrent_tab", function(e){
				e.preventDefault()
				addTorrentTab($(this).data("title"), $(this).data("infohash"));
			})

			/*$(document).on("click", ".infoHash", function(e){
				e.preventDefault();
				console.log("CLACKED!!")
				var that = $(this);
			  $.post("/snatched/" + that.data("infohash"), function(data){
			  	window.location = "magnet:?xt=urn:btih:" + $(this).attr("id")
			  });

			  /*$(document).on("click", ".infoHash", function(e){
					e.preventDefault();
					console.log("CLACKED!!")
					var that = $(this);
				  $.post("/snatched/" + that.data("infohash"), function(data){
				  	window.location = "magnet:?xt=urn:btih:" + $(this).attr("id")
				  });
				})
			})*/
			cb();

		}

  	})
    $('th').unbind('click.DT')
}

function humanFileSize(bytes, si=false, dp=1) {
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

/*
function toNumber({ low, high }) {
  let res = high

  for (let i = 0; i < 32; i++) {
    res *= 2
  }

  return low + res
}*/

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
var aDay = 24*60*60*1000;