var upload;
var initialized;

function torrentDelete(torrent, li){
	$(li).append("<span>"+torrent.properties.infoHash +"</span>")
	var dl = document.createElement("a");

	$(li).append(dl)
	$(dl).text(" [delete]")
	$(dl).attr("href", "#")
	$(dl).click(function(e){
		e.preventDefault();
		if(confirm("Are you sure you want to delete " + torrent.properties.infoHash + "?")){
			$.post("/delete_torrent/"+torrent.properties.infoHash, function(){
				$(li).empty();
				torrentRestore(torrent, li);
			});	
		}
		
	})
}

function torrentRestore(torrent, li){
	var rs = document.createElement("a");
	$(li).append("<span>" + torrent.properties.infoHash.slice(0,4) + "*" + "</span>")
	$(li).append(rs);
	$(rs).text(" [restore]");
	$(rs).attr("href", "#")
	$(rs).click(function(e){
		e.preventDefault();
		if(confirm("Are you sure you want to restore this torrent, and this torrent has resolved all its DMCA complaints?")){
			$.post("/restore_torrent/" + torrent.properties.infoHash, function(){
				$(li).empty();
				torrentDelete(torrent, li);
			})
		}
	})
}


function initializeUpload(cb){
	resetUpload();
	$("#errorsDiv").empty();
	var uuid;

	var params = ANCHOR.getParams();

	$("#uuid").hide();

	//editing edition
	if(!$.isEmptyObject(params)){
		if(params.uuid){
			uploadModel.uuid = params.uuid;
			console.log(uploadModel.uuid);
			$("#uploadHeading a").text("Editing");
			$("#uploadHeading a").attr("href", "#upload?uuid=" + uploadModel.uuid);
			$("#uuid").show()
			$("#uuid").val(uploadModel.uuid)
			$("#uuid").prop("disabled", true)
			
			$(".DMCA").show();
			$(".merge_source").show();

			//get the data for this uuid, it's a new format being added
			$.get("/upload/" + uploadModel.uuid + "?buoy=" + ANCHOR.getParams().buoy, function(data){
				console.log(data);
				if(!data.record){
					cb();
					return;
				}
				

				//dmca complaint area
				/*data.record._fields[5].forEach(function(torrent){
					var li = document.createElement("li")
					$("#DMCA").append(li)
					if(torrent.properties.deleted){
						$(li).empty();
						torrentRestore(torrent, li);
					}
					else{
						$(li).empty();
						torrentDelete(torrent, li);
					}
					
				})*/

				$("#uploadHeading a").text("Editing " + toTitleCase(data.record._fields[0]))
				$("#title").val(data.record._fields[0]).trigger("change")
				$("#date").val(data.record._fields[3]).trigger("change");
				data.record._fields[1].forEach(function(author){
					addAuthor(author);
				})
				
				if(data.record._fields[2] && data.record._fields[2].length > 0){
					$("#classes_input").val(data.record._fields[2].join(", ")).trigger("change");
				}

				$("#edition_select").empty();
				uploadModel.editions = [];
				$("#edition_select").append("<option value='new'>New Edition</option>")
				$("#edition_select").val("new").trigger("change");
				$(".existing_edition").show();
				$("#edition_select").show();
				console.log(data.record._fields[0]);
				data.record._fields[4].forEach(function(edition, j){
					console.log(edition);
					var option = document.createElement("option");
					var publisherHtml = "";
					var editionField = "";
		      	data.record._fields[1].forEach(function(field, i){
		      		console.log(field);
			      	editionField += field.author ? field.author : ""
			      	if(data.record._fields[1][i+1]){
			      		editionField += ", "
			      	}
							else if(field.author && !field.author.endsWith(".")){
								editionField += ". "
							}
							else{
								editionField += " "
							}
			      })
			      editionField += data.record._fields[3] ? "(" + data.record._fields[3] + (edition.date ? "/" + edition.date + "). " : "). ") : ""
			      editionField += data.record._fields[0] + ". "


			      if(edition.publisher){
			        publisherHtml += edition.publisher ? edition.publisher + ". " : " "
			      }
			     
			      if(edition.title){
			      	if(!edition.title.endsWith(".")){
			      		editionField += edition.title + ". "
			      	}
			      	else{
			      		editionField += edition.title + " ";
			      	}
			      }
			      editionField += publisherHtml;
			      if(edition.no){
			      	editionField += "(" + edition.no + ")"
			      	if(edition.pages){
			      		editionField += ", "
			      	}
			      }
			      if(edition.pages){
			      	editionField += edition.pages + "."
			      }
					
					$(option).val(editionField);
					$(option).text(editionField);
					$("#edition_select").append(option);
					uploadModel.editions.push(edition);
				})

				$("#edition_title").val("");
				$("#edition_title").trigger("change");

				$("#edition_date").trigger("change");

				$("#edition_date").val("").trigger("change");

		
				//$("#edition_title").val($("#edition_select").val());

				//$("#edition_select").off();

				console.log(uploadModel)

				$("#edition_select option").each(function(){
					console.log($(this).val());
				})

				$("#edition_select").change(function(){
						console.log("HERE!!!!!!!!!!!!!!!");
						console.log($("#edition_select").val());
					if($("#edition_select").val() !== "new"){
						var pos = $("#edition_select").prop('selectedIndex') - 1;

						//edition array holds old selection
						console.log(data.record._fields[4]);
						console.log(data.record._fields[0]);
						uploadModel.editions[pos].uuid = data.record._fields[4][pos].uuid;
						uploadModel.edition.edition_uuid = data.record._fields[4][pos].uuid;

						console.log(data.record._fields[4][pos])
						console.log(uploadModel.edition.edition_uuid);
						console.log(uploadModel);
						$("#edition_title").val(uploadModel.editions[pos].title).trigger("change");
						$("#edition_no").val(uploadModel.editions[pos].no).trigger("change");
						$("#edition_date").val(uploadModel.editions[pos].date).trigger("change");
						$("#edition_publisher").val(uploadModel.editions[pos].publisher).trigger("change");
						$("#edition_pages").val(uploadModel.editions[pos].pages).trigger("change");

					}
					else{
						uploadModel.edition.edition_uuid = null;
						
					}
					

				})
/*
				var position = $("#edition_select").prop('selectedIndex');
					$("#edition_title").val(uploadModel.editions[position].title).trigger("change");
					$("#edition_date").val(uploadModel.editions[position].date).trigger("change");
					$("#edition_no").val(uploadModel.editions[position].no).trigger("change")
					$("#edition_publisher").val(uploadModel.editions[position].publisher).trigger("change");
					$("#edition_pages").val(uploadModel.editions[position].pages).trigger("change");

*/
				$("#ETH_price").change(function(){
					console.log($(this).val());
					uploadModel.ETH_price = $("#ETH_price").val();
				})


				$("#ETH_adderss").change(function(){
					uploadModel.ETH_address = $("#ETH_address").val();
				})

				$("#edition_publisher").change(function(){
					uploadModel.edition.edition_publisher = $("#edition_publisher").val();
				})

				$("#edition_pages").change(function(){
					uploadModel.edition.edition_pages = $("#edition_pages").val();
				})

				$("#edition_img").change(function(){
					uploadModel.edition.edition_img = $("#edition_img").val();
				})

				$("#edition_date").change(function(){
					uploadModel.edition.edition_date = $("#edition_date").val();
				})

				$("#edition_title").change(function(){ //this is the edition or volume, not the publisher
					uploadModel.edition.edition_title = $("#edition_title").val();
				})

				data.record._fields[7].properties.types.forEach(function(val){
					var option = document.createElement("option");
					$(option).val(val);
					$(option).text(val);
					$("#type").append(option);
					console.log(data.record._fields[6])
					$("#type").val(data.record._fields[6]);
					uploadModel.type = $("#type").val();
				})

				data.record._fields[7].properties.media.forEach(function(val){
						var option = document.createElement("option");
						$(option).val(val);
						$(option).text(val);
						$("#media").append(option);
						uploadModel.torrent.media = $("#media").val();
					})

				data.record._fields[7].properties.formats.forEach(function(val){
						var option = document.createElement("option");
						$(option).val(val);
						$(option).text(val);
						$("#format").append(option);
						uploadModel.torrent.format = $("#format").val();
					})
					cb();
				})			
		}
	}
	if(!params.uuid){
		$.get("/upload_structure/" + ANCHOR.getParams().buoy, function(data){
			data.buoy.types.forEach(function(val){
				var option = document.createElement("option");
				$(option).val(val);
				$(option).text(val);
				$("#type").append(option);
				uploadModel.type = $("#type").val();
			})

			data.buoy.media.forEach(function(val){
				var option = document.createElement("option");
				$(option).val(val);
				$(option).text(val);
				$("#media").append(option);
				uploadModel.torrent.media = $("#media").val();

			})

			data.buoy.formats.forEach(function(val){
				var option = document.createElement("option");
				$(option).val(val);
				$(option).text(val);
				$("#format").append(option);
				uploadModel.torrent.format = $("#format").val();

			})
			cb();
		})	
	}

	$("#format").change(function(){
		uploadModel.torrent.format = $(this).val();
	})

	$("#media").change(function(){
		uploadModel.torrent.media = $(this).val();
	})
		

}

function addAuthor(data){

	if(!data || !data.author){
		return false;
	}

	uploadModel.authors.push({
		uuid : data.uuid,
		author : data.author
	});

	addAuthorArea(uploadModel.authors[uploadModel.authors.length - 1].uuid, uploadModel.authors[uploadModel.authors.length - 1].author, function(err, div, select, input, remove, id){

		uploadModel.authors[uploadModel.authors.length - 1].importance = $(select).val();
		uploadModel.authors[uploadModel.authors.length - 1].role = $(input).val();

		$(select).change(function(){
			uploadModel.authors[uploadModel.authors.length - 1].importance = $(select).val();
		})
		$(input).change(function(){
			uploadModel.authors[uploadModel.authors.length - 1].role = $(input).val();
		})

		$(remove).click(function(){
			removeAuthorArea(div, id);
			uploadModel.authors = uploadModel.authors.filter(function( obj ) {
			    return obj.uuid !== data.uuid;
			});
		})
	});

	return false;

}

function htmlUpload(){
	resetUpload();
	ANCHOR.buffer();

	 //updateUpload();


	$("#edition_select").hide();

	$("#edition").hide();

	$("#edition_check").click(function(){
		if($(this).is(":checked")){
			$("#edition").show();
		}
		else{
			$("#edition").hide()
		}
	})

	$("#author_importance").hide();
	$("#author_role").hide();

	$("input:file").change(function(){
		var files = this.files; 
		seed(files, function(err, torrent){
			uploadModel.torrent.length = torrent.length;
			uploadModel.torrent.infoHash = torrent.infoHash;
			uploadModel.torrent.torrentFileBlobURL = torrent.torrentFileBlobURL;
			uploadModel.torrent.media = $("#media").val();
			uploadModel.torrent.format = $("#format").val();
			$(".torrentArea").append('<a href="' + torrent.torrentFileBlobURL + '" target="_blank" download="' + torrent.name + '.torrent">[Torrent]</a>')
			$(".torrentArea").append('&nbsp;<a href="magnet:?xt=urn:btih:' + torrent.infoHash + '">[magnetURI]</a>')
		});
	})

	$("#infoHash").change(function(){
		uploadModel.torrent.infoHash = $(this).val();
		uploadModel.torrent.media = $("#media").val();
		uploadModel.torrent.format = $("#format").val();
	})

	$("#title").change(function(){
		uploadModel.title = $("#title").val();
	})


	$("#date").change(function(){
		uploadModel.date = $("#date").val();
	})

//didn't work	$("#type").val("nonfiction").trigger("change");

	$("#type").change(function(){
		uploadModel.type = $("#type").val();
	})

	$("#edition_publisher").change(function(){
		uploadModel.edition.edition_publisher = $("#edition_publisher").val();
	})

	$("#edition_title").change(function(){
		uploadModel.edition.edition_title = $("#edition_title").val();
	})

	$("#edition_date").change(function(){
		uploadModel.edition.edition_date = $("#edition_date").val();
	})

	$("#edition_pages").change(function(){
		uploadModel.edition.edition_pages = $("#edition_pages").val();
	})

	$("#edition_img").change(function(){
		uploadModel.edition.edition_img = $("#edition_img").val();
	})

	$("#edition_no").change(function(){
		uploadModel.edition.edition_no = $("#edition_no").val()
	})

	

	$("#add_author").click(function(e){
		e.preventDefault();

      $("body").css("cursor", "progress");
		$.post("/add_author", {author : $("#author_input").val()}, function(data){
        $("body").css("cursor", "default");
			addAuthor(data);
		})
	})

	$("#create_author").click(function(e){
		e.preventDefault();
       $("body").css("cursor", "progress");
		var retVal = confirm("Are you sure this author does not exist?");
           if( retVal === false ) {
              return false;
          }
		$.post("/create_author", {author : $("#author_input").val()}, function(data){
         $("body").css("cursor", "default");
			addAuthor(data);
		})
	})

	$("#classes_input").change(function(){
		uploadModel.classes = $("#classes_input").val().split(",");		
	})

	$("#submit").click(function(e){
		e.preventDefault();
		$("#submit").prop("disabled", true)
		$("body").css("cursor", "progress");
		$.post("/upload/" + uploadModel.uuid, {buoy : ANCHOR.getParams().buoy, type: uploadModel.type, edition_img : uploadModel.edition.edition_img, 
			edition_pages : uploadModel.edition.edition_pages, edition_publisher : uploadModel.edition.edition_publisher,
		 date: uploadModel.date, title : uploadModel.title, authors : JSON.stringify(uploadModel.authors), ETH_address: uploadModel.ETH_address, ETH_price: uploadModel.ETH_price, 
		 torrent : JSON.stringify(uploadModel.torrent), 
			edition_date : uploadModel.edition.edition_date, edition_uuid : uploadModel.edition.edition_uuid, 
			edition_title : uploadModel.edition.edition_title, classes : JSON.stringify(uploadModel.classes)},
			 function(data){
			 	$("body").css("cursor", "default");
			if(data.errors && data.errors.length > 0){
				addError(data.errors[0].msg);
				$("#submit").prop("disabled", false)
			}
			else{				
				resetUpload();
			}
			if(data.uuid)
				ANCHOR.route("#source?buoy=" + ANCHOR.getParams().buoy + "&uuid=" + data.uuid);
			return false; 
		})
	})


	initialized = true;

}

function resetUpload(){
		$("#edition_select").empty();
		$("#edition_select").off("change");
		$(".torrentArea").empty();
		uploadModel.torrent = {infoHash : "", media : "", format : ""};
		uploadModel.uuid = undefined;
		uploadModel.edition = {
		edition_date : "",
		edition_title : "",
		edition_img : "",
		edition_publisher : "",
		edition_no : "",
		edition_pages : "",
		edition_uuid : "null"
		};
		uploadModel.ETH_address = "";
		uploadModel.ETH_price = "";
		uploadModel.editions = [];
		uploadModel.date = "";
		uploadModel.authors = [];
		uploadModel.classes = []
		uploadModel.title = "";
	
		$(".DMCA").hide();
		$(".merge_source").hide();
		$("#merge_source_input").val("");
		$("#uploadHeading a").text("Upload")

		$(".torrent_a").remove();
		$("#infoHash").val("");

		$("#title").val("");
		$("#date").val("");

		$("#author_input").val("");
		$(".removeAuthor").click();
		$(".author_break").remove();

		$("#upload_files").val(null);
		$("#classes_input").val("");
	

		$("#edition_publisher").val("");
		$("#edition_pages").val("");
		$("#edition_title").val("");
		$("#edition_date").val("");
		$("#edition_img").val("");
		$("#edition_no").val("");

		$("#edition_title").prop("disabled",false)
		$("#edition_date").prop("disabled",false)
		$("#edition_no").prop("disabled",false)
		$("#edition_publisher").prop("disabled",false)
		$("#edition_pages").prop("disabled",false)

		//$("#tags_select").val("----")

		$("#edition_check").prop("checked", false)
		$("#edition").hide();

		//$("#edition_select").append("<option selected value='Standard Edition'>Standard Edition</option>")
		$("#edition_select").hide();
		$(".existing_edition").hide();
		//$("#media").val("ebook");
		//$("#format").val("PDF")

		$(".break").remove();

		$("#type").empty();
		$("#media").empty();
		$("#format").empty();

		$("#submit").prop("disabled", false)

		$("#DMCA").empty();
		//$("#errorsDiv").empty();
}
	
