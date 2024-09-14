function initializeTorrents(table, cb){

	$("#download_all").click(function(e){
		e.preventDefault();
		$.get("/download_all", function(data){
			data.infoHashes.forEach(function(infoHash){
				setTimeout(function(){
						window.location = "magnet:?xt=urn:btih:" + infoHash._fields[0] + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"

		  	},25)
			})
		})
	})

	$("#download_class").click(function(e){
		e.preventDefault();
		$.get("/download_class?uuid=" + ANCHOR.getParams().uuid, function(data){
			data.infoHashes.forEach(function(infoHash){
				setTimeout(function(){
						window.location = "magnet:?xt=urn:btih:" + infoHash._fields[0] + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"

		  	},25)
			})
		})
	})

	$("#download_author").click(function(e){
		e.preventDefault();
		$.get("/download_author?uuid=" + ANCHOR.getParams().uuid, function(data){
			data.infoHashes.forEach(function(infoHash){
				setTimeout(function(){
						window.location = "magnet:?xt=urn:btih:" + infoHash._fields[0] + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"

		  	},25)
			})
		})
	})

	$("#adv_class_all").prop("checked",true)
	$("#adv_class_any").prop("checked", false)
	$("#adv_title").val(ANCHOR.getParams() && ANCHOR.getParams().title ? ANCHOR.getParams().title : "")
	$("#adv_author").val(ANCHOR.getParams() && ANCHOR.getParams().author ? ANCHOR.getParams().author : "")
	$("#adv_classes").val(ANCHOR.getParams() && ANCHOR.getParams().classes ? (decodeEntities(ANCHOR.getParams().classes) === "undefined" ? "" : decodeEntities(ANCHOR.getParams().classes).replace(/['"]+/g, '')) : "")
	$("#adv_publisher").val(ANCHOR.getParams() && ANCHOR.getParams().publisher ? ANCHOR.getParams().publisher : "");
	$("#adv_type").val(ANCHOR.getParams() && ANCHOR.getParams().type ? ANCHOR.getParams().type : "");
	$("#adv_media").val(ANCHOR.getParams() && ANCHOR.getParams().media ? ANCHOR.getParams().media : "");
	$("#adv_format").val(ANCHOR.getParams() && ANCHOR.getParams().format ? ANCHOR.getParams().format : "")
	if(ANCHOR.getParams() && ANCHOR.getParams().class_all === "true"){
		$("#adv_class_all").prop("checked", true)
		$("#adv_class_any").prop("checked", false)
	}
	else{
		$("#adv_class_all").prop("checked", false)
		$("#adv_class_any").prop("checked", true)
	}
	console.log(table)
	$.get("/advanced_search_ui", function(data){
		$("#adv_type").empty();
		$("#adv_type").append("<option value='all'>All Types</option>")
		$("#adv_media").empty();
		$("#adv_media").append("<option value='all'>All Media</option>")
		$("#adv_format").empty();
		$("#adv_format").append("<option value='all'>All Formats</option>")
		data.buoy.types.forEach(function(val){
			var option = document.createElement("option");
			$(option).val(val);
			$(option).text(decodeEntities(val));
			$("#adv_type").append(option);
			if(ANCHOR.getParams() && ANCHOR.getParams().type){
				$("#adv_type").val(ANCHOR.getParams() ? ANCHOR.getParams().type : "");
			}
		})
		data.buoy.media.forEach(function(val){
			var option = document.createElement("option");
			$(option).val(val);
			$(option).text(decodeEntities(val));
			$("#adv_media").append(option);

			if(ANCHOR.getParams() && ANCHOR.getParams().media){
				$("#adv_media").val(ANCHOR.getParams() ? ANCHOR.getParams().media : "")
			}
		})
		data.buoy.formats.forEach(function(val){
			var option = document.createElement("option");
			$(option).val(val);
			$(option).text(decodeEntities(val));
			$("#adv_format").append(option);

			if(ANCHOR.getParams() && ANCHOR.getParams().format){
				$("#adv_format").val(ANCHOR.getParams() ? ANCHOR.getParams().format : "")
			}
		})
	})

	$("#adv_submit").unbind("click");
	$("#adv_submit").click(function(){
		ANCHOR.route("#torrents?search=true&title=" + $("#adv_title").val() + "&author=" + $("#adv_author").val() +
			"&classes=" + ($("#adv_classes").val() ? JSON.stringify($("#adv_classes").val()) : "") + "&class_all=" + $("#adv_class_all").prop("checked") + "&publisher=" + $("#adv_publisher").val() + "&type=" + $("#adv_type").val() +
			"&media=" + $("#adv_media").val() + "&format=" + $("#adv_format").val())
	})

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
			url: ANCHOR.getParams() && ANCHOR.getParams().search ? "/advanced_search" : "/" + table + (ANCHOR.page() === "class" || ANCHOR.page() === "author" || 
				ANCHOR.page() === "user_downloads" || 
				ANCHOR.page() === "user_uploads" || 
				ANCHOR.page() === "source" ? "/" + ANCHOR.getParams().uuid : (ANCHOR.page() === "publisher" ? "/" + ANCHOR.getParams().publisher : "")),
			type: "POST",
			data : {
				title : ANCHOR.getParams() ? ANCHOR.getParams().title : "",
				author : ANCHOR.getParams() ? ANCHOR.getParams().author : "",
				classes : ANCHOR.getParams() ? ANCHOR.getParams().classes : "",
				class_all : ANCHOR.getParams() ? ANCHOR.getParams().class_all : "",
				publisher : ANCHOR.getParams() ? ANCHOR.getParams().publisher : "",
				type : ANCHOR.getParams() ? ANCHOR.getParams().type : "",
				media : ANCHOR.getParams() ? ANCHOR.getParams().media : "",
				format : ANCHOR.getParams() ? ANCHOR.getParams().format : ""
			},
			dataSrc : function(data){
				console.log(data);
				var records = [];
				if(data.data[0]){
					switch(ANCHOR.page()){
						case "author":
							$("#authorTitle").text((data.data[0]._fields[1][0].properties.author.charAt(0) == 
								data.data[0]._fields[1][0].properties.author.charAt(0).toUpperCase() ? 
								decodeEntities(data.data[0]._fields[1][0].properties.author) : toTitleCase(decodeEntities(data.data[0]._fields[1][0].properties.author))));
								audioModel.audio.pause();
								console.log(data.data[0]._fields[1])
								var authors = data.data[0]._fields[1]
								if(authors[0] && authors[0].properties.author === "Marx, K."){
									audioModel.audio = new Audio(audioModel.marx)

									audioModel.audio.play();
								}
								else if(authors[0] && authors[0].properties.author === "Perrone, P.J."){
									audioModel.audio = new Audio(audioModel.perrone)
									audioModel.audio.play();
								}
								else if(authors[0] && authors[0].properties.author === "Nietzsche, F."){
									audioModel.audio = new Audio(audioModel.nietzsche)
									audioModel.audio.play();
								}
							break;
						case "source":
							//TODO: maybe multiple calls here
							$("#sourceTitle").empty();
							$("#sourceTitle").append(decodeEntities(data.data[0]._fields[0].properties.title))
							$("#addFormat").click(function(){
								ANCHOR.route("#upload?uuid=" + data.data[0]._fields[0].properties.uuid)
							})
							audioModel.audio.pause();

							var authors = data.data[0]._fields[1]
							if(authors[0] && authors[0].properties.author === "Perrone, P.J."){
								audioModel.audio = new Audio(audioModel.perrone)
								audioModel.audio.play();
							}
							else if(data.data[0]._fields[0].properties.title === "Capital" || data.data[0]._fields[0].properties.title === "The Communist Manifesto"){
								audioModel.audio = new Audio(audioModel.marx)
								audioModel.audio.play();
							}
							else if(authors[0] && authors[0].properties.author === "Nietzsche, F."){
									audioModel.audio = new Audio(audioModel.nietzsche)
									audioModel.audio.play();
							}
							ANCHOR.buffer();
							break;
						case "class":
						  console.log(data);
							data.data.every(function(data){
								var classData = data._fields[3].find(x => x.properties.uuid === ANCHOR.getParams().uuid)
								console.log(data._fields[3]);
								console.log(classData);
								if(classData){
									$("#classTitle").text(decodeEntities(classData.properties.name))
									return true;
								}
								else{
									$("#classTitle").text("No class");
								}
							})
							break;
						case "user_uploads":
							console.log(data);
							$("#userUploadsTitle").text(decodeEntities(data.data[0]._fields[5]) + "'s Uploads!");
							break;
						case "user_downloads":
							$("#userDownloadsTitle").text(decodeEntities(data.data[0]._fields[5]) + "'s Downloads!")
							break;
						case "publisher":
							$("#publisherTitle").text(decodeEntities(ANCHOR.getParams().publisher))
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
			        authorField += "<a class='ANCHOR author sourceAuthor' href='#author?uuid=" + field.properties.uuid + "'>" +
			        (field.properties.author.charAt(0) == field.properties.author.charAt(0).toUpperCase() ? decodeEntities(field.properties.author) : 
			        toTitleCase(decodeEntities(field.properties.author))) + "</a>";
			        
			      })



			      //var publishersArray = record._fields[2].publishers;
			      
			      var dateField = ""
			      if(record._fields[0] && record._fields[0].properties.date){
			        dateField += " <b>[" + decodeEntities(record._fields[0].properties.date) + "]</b> "
			      }


			      var classesField = " ";
			      var seeAll = false;
			      var seeAllField = "<span class='seeAllField'>";
			      record._fields[3].forEach(function(field, i){
			        if(i === 0){
			          classesField += "<a class='ANCHOR class' href='#class?uuid=" + field.properties.uuid + "'>" + decodeEntities(field.properties.name) + "</a>";
			        }
			        else{
			          classesField += ", <a class='ANCHOR class' href='#class?uuid=" + 
			          field.properties.uuid + "'>" +  decodeEntities(field.properties.name) + "</a>"
			        }/*
			        else if(!seeAll){
			        	seeAll = true;
			        	seeAllField += ", <a class='ANCHOR class' href='#class?uuid=" + 
			        	field.properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>"  +  decodeEntities(field.properties.name) + "</a>"
			        	classesField += " <a id='seeAll' href='#'>[See All]</a>"

			        }
			        else{
			        	seeAllField += ", <a class='ANCHOR class' href='#class?uuid=" + 
			        	field.properties.uuid + "&buoy=" + ANCHOR.getParams().buoy + "'>" +  decodeEntities(field.properties.name) + "</a>"
			        }*/
			      })

			      seeAllField += "</span>"
			      classesField += seeAllField;

			      //to find source img
			      
			      var sourceIMG = "";

			      console.log("TO ADD EDITIONS");

			      var numPeers = 0;

			      record._fields[2].forEach(function(edition){
							var table = "<table class='torrentsTable'><thead><th>Media</th><th>Format</th><th>DL</th><th>infoHash</th><th>Peers</th><th>Snatches</th>"
						 + "<th>Time</th><th>User</th></tr></thead><tbody><tr>"

			      	if(edition.torrent){
			      		
			      	if(record._fields[0].properties.type === "Nonfiction" || record._fields[0].properties.type === "Fiction" 
			      		|| record._fields[0].properties.type === "Holy Book" || 
			      		record._fields[0].properties.type === "Short Story"){
					      sourceIMG = "img/ebook.png"

			      	}
			      	else if(record._fields[0].properties.type === "Poetry"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/images.png?v=1718941782053"
			      	}
			      	else if(record._fields[0].properties.type === "Play"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/Theatre_white.png?v=1718939464152";
			      	}
			      	else if(record._fields[0].properties.type === "Journal" || record._fields[0].properties.type === "Essay"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/free-news-paper-3114522-2598154.png?v=1718726134544"
			      	}
			      	else if(record._fields[0].properties.type === "Documentary" || record._fields[0].properties.type === "Movie" || record._fields[0].properties.type === "Film"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/free-film-164-444732.png?v=1718726531504"
			      	}
			      	else if(record._fields[0].properties.type === "Music" || record._fields[0].properties.type === "Classical Music" || record._fields[0].properties.type === "Chant"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/Music_symbol_Segno.png?v=1718726632020"
			      	}
			      	else if(record._fields[0].properties.type === "Videogame" || record._fields[0].properties.type === "Game"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/Video_Game_History_Icon_Alternative.svg?v=1718726679991"
			      	}
			      	else if(record._fields[0].properties.type === "Software" || record._fields[0].properties.type === "Program"){
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/images.png?v=1718726747129"
			      	}
			      	else{
			      		sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/free-file-download-3490087-2924583.png?v=1718726937968"
			      	}
					      			if(record._fields[0] && !record._fields[0].properties.imgSrc && record._fields[0].properties.imgSrc !== "null"){
					      				$.get("https://www.googleapis.com/books/v1/volumes?q=intitle:"+record._fields[0].properties.title +
									      			 "+inauthor:" + (record._fields[1] && record._fields[1][0] ? record._fields[1][0].properties.author.split(",")[0] : ""), function(data){
									      				
										      				if(data.items && data.items.length > 0 && data.items[0].volumeInfo.imageLinks 
										      					&& (data.items[0].volumeInfo.title === record._fields[0].properties.title || data.items[0].volumeInfo.publishedDate === record._fields[0].properties.date)){
										      					console.log(data.items[0].volumeInfo);
										      					sourceIMG = data.items[0].volumeInfo.imageLinks.smallThumbnail;
										      					$.post("/google_img/" + record._fields[0].properties.uuid, {img : sourceIMG}, function(data){

										      					})
										      					$("#source_" + record._fields[0].properties.uuid).attr("src", sourceIMG);
										      				}
                                  if(!data.items){
                                      $.get("/source_cover/" + record._fields[0].properties.title + "?author=" + (record._fields[1] && record._fields[1][0] ? 
                                      record._fields[1][0].properties.author.split(",")[0] : ""), function(data){
                                        console.log(data)
                                        if(data.cover && data.cover["1x"]){
                                          sourceIMG = data.cover["1x"];
                                          $("#source_" + record._fields[0].properties.uuid).attr("src", sourceIMG);
                                        }
                                    })
                                  }	
										      			})     			
						      		}
					      			else{
					      				sourceIMG = record._fields[0].properties.imgSrc && record._fields[0].properties.imgSrc !== "null" 
                          ? record._fields[0].properties.imgSrc : sourceIMG;
					      			}
					      			
				      	console.log(edition)

				      	function toNumber({ low, high }) {
								  let res = high

								  for (let i = 0; i < 32; i++) {
								    res *= 2
								  }

								  return low + res
								}
					      
								if(edition.edition){
					      edition.edition.properties.numPeers = 0;
					      console.log(edition.torrent.numPeers);
						  					     
						      edition.edition.properties.numPeers += edition.torrent.numPeers ? edition.torrent.numPeers : 0;
					      	if(edition.torrent){
						      	var publisherHtml = "";
						      	var editionField = "";
						      	record._fields[1].forEach(function(field, i){
							      	editionField += decodeEntities(field.properties.author)
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
							      	editionField += "(" + decodeEntities(edition.edition.properties.date) + "). ";
							      }
							      else{
							     	 editionField += record._fields[0].properties.date ? "(" + 
							     	 decodeEntities(record._fields[0].properties.date) + (edition.edition.properties.date && edition.edition.properties.date !== 
							     	 	record._fields[0].properties.date ? "/" + 
							     	 	decodeEntities(edition.edition.properties.date) + "). " : "). ") : ""

							      }
							      editionField += (record._fields[0].properties.type !== "Journal" && record._fields[0].properties.type !== "Essay" 
							      ? "<span class='italics'>" + decodeEntities(record._fields[0].properties.title) + "</span>. " : 
							      decodeEntities(record._fields[0].properties.title) + '. ')


							      if(edition.edition.properties.publisher){
							      	if(edition.edition.properties.publisher && edition.edition.properties.publisher.endsWith(".")){
							        	publisherHtml += edition.edition.properties.publisher ? decodeEntities(edition.edition.properties.publisher) + " " : " "
							      	}
							      	else{
							        	publisherHtml += (edition.edition.properties.publisher ? decodeEntities(edition.edition.properties.publisher) : " ") + 
							        	(record._fields[0].properties.type !== "Journal" ? ". " : ", ")
							        	console.log(record._fields[0].properties.type)
							      	}
							      }
							     if(record._fields[0].properties.type === "Journal"){
							     	  editionField += publisherHtml;
							     }
							      if(edition.edition.properties.title && edition.edition.properties.title !== ""){
							      	if(!edition.edition.properties.title.endsWith(".")){
							      		editionField += decodeEntities(edition.edition.properties.title) + (record._fields[0].properties.type !== "Journal" ? ". " : "")
							      	}
							      	else{
							      		editionField += decodeEntities(edition.edition.properties.title) + " ";
							      	}
							      }
							      if(record._fields[0].properties.type !== "Journal"){
							      	editionField += publisherHtml;
							      }
							      if(edition.edition.properties.no){
							      	editionField += "(" + decodeEntities(edition.edition.properties.no) + ")"
							      	if(edition.edition.properties.pages){
							      		editionField += ": "
							      	}
							      }
							      if(edition.edition.properties.pages){
							      	editionField += decodeEntities(edition.edition.properties.pages) + "."
							      }
							      
								}
						      	//add torrents
						      	console.log(edition.torrent.USD_price
)								
						      	console.log(edition.torrent.copyrighted)
						        var tr = "<tr>";
						        tr += "<td>" + edition.torrent.media + "</td>";
						        tr += "<td>" + edition.torrent.format + "</td>"
						        tr += "<td><a class='infoHash" + "' data-infohash='" + edition.torrent.infoHash + "' id='"+ edition.torrent.infoHash + "' href='magnet:?xt=urn:btih:" 
						        + edition.torrent.infoHash + "' data-torrent-uuid = '" + edition.torrent.uuid + " '>[MagnetURI]</a>&nbsp;&nbsp;" + 
						        "<a id='add_torrent_tab' data-infohash='" + edition.torrent.infoHash +
						        "' data-title='" + record._fields[0].properties.title + "' class='torrent stream' href='#torrent?infoHash=" + edition.torrent.infoHash + "' data-torrent-uuid = '" + edition.torrent.uuid + 
						         "'>[WebTorrent]</a></td>"
						        tr += "<td id='" + edition.torrent.uuid + "'><a class='queryInfoHash' id='infoHash_" + edition.torrent.uuid + 
						        "' data-torrent-uuid='" + edition.torrent.uuid + 
						        "' href='#'>[Copy infoHash]</a></td>"
						       // table += "<td>" + humanFileSize(torrent.properties.length) + "</td>"
						       tr += "<td class='light'><p>" + (edition.torrent.numPeers ? edition.torrent.numPeers : 0) + "</p></td>"
						        tr += "<td class='light'><p>" + edition.torrent.snatches + "</p></td>";
						        tr += "<td class='here'>" + timeSince(edition.torrent.created_at) + " ago</td>"
						        tr+="<td><a class='ANCHOR user' id='uptight' href='#user?uuid=" + edition.torrent.uploaderUUID + "'>" 
						        + edition.torrent.uploaderUser + "</a></td>"
						        tr += "</tr>"
						        table += tr;
							      table += "</tbody></table>"
				      	
				      	console.log(edition.edition.properties.uuid);
				      	if(editionsAdded.indexOf(edition.edition.properties.uuid) === -1){
						      editionsAdded.push(edition.edition.properties.uuid);

					      		records[editionsAdded.indexOf(edition.edition.properties.uuid)] = ["<img class='tableImg' id='source_" 
					      			+ record._fields[0].properties.uuid + "' src='" + sourceIMG + "'>" + 
								       "<div class='torrentSource'><span class='sourceType'>" +
					      			decodeEntities(record._fields[0].properties.type) + "</span>" + 
								        "<div class='tableHeading'><a id='sourceTab' class='ANCHOR source' href='#source?uuid=" + 
								        record._fields[0].properties.uuid + "'>" 
								        + decodeEntities(record._fields[0].properties.title) + "</a>"
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

			$(document).off("click", ".web3")

			$(document).on("click", ".web3", async function(e){
				e.preventDefault();
				initPayButton($(this));
			})

			$(document).off("click", ".web30")
			
			$(document).on("click", ".web30", async function(e){
				e.preventDefault();
				initPayButton($(this));
			})

			$(document).off("click", ".infoHash")

			$(document).on("click", ".infoHash", function(e){
				e.preventDefault();
				var that = $(this);
				
				console.log(that.data('torrent-uuid'));
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function(data){

					if(data.free){
						magnet_uri = "magnet:?xt=urn:btih:" + data.free + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337" 

						window.location = magnet_uri;
						that.attr("href", "magnet:?xt=urn:btih:" + data.free + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337") 

						$.post("/snatched/" + data.free);
					}
					else if(data.prem){
						magnet_uri = "magnet:?xt=urn:btih:" + data.prem + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337" 

						window.location = magnet_uri;
						that.attr("href", "magnet:?xt=urn:btih:" + data.prem + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337")

						$.post("/snatched/" + data.prem);
					}
					else{
						alert("Please purchase torrent infoHash first!")
					}

				})
			})

			var that = $(this);
			$(document).off("click", ".stream");

			$(document).on("click", ".stream", function(e){
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function(data){
					if(data.free || data.prem){
						$.post("/snatched/" + (data.free ? data.free : data.prem));
					}
					if(data.free){
						ANCHOR.route("#torrent?infoHash=" + data.free);
						that.attr("href", "#torrent?infoHash" + data.free)
					}
					else if(data.prem){
						ANCHOR.route("#torrent?infoHash=" + data.prem);
						that.attr("href", "#torrent?infoHash" + data.prem)
					}
					else{
						alert("Please purchase torrent infoHash first!")
					}

				})
			})

			$(document).off("click", ".queryInfoHash")

			$(document).on("click", ".queryInfoHash", function(e){
				e.preventDefault();
				console.log($(this).data("torrent-uuid"));
				var that = $(this);
				$.get("/infoHash/" + $(this).data("torrent-uuid"), function(data){
					if(data.free){
						copyToClipboard(data.free)
						that.text(data.free);
						$.post("/snatched/" + data.free);
					}
					else if(data.prem){
						copyToClipboard(data.prem)
						that.text(data.prem);
						$.post("/snatched/" + data.prem)
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


function toNumber({ low, high }) {
  let res = high

  for (let i = 0; i < 32; i++) {
    res *= 2
  }

  return low + res
}

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