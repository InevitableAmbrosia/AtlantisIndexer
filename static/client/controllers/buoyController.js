function initializeBuoy(cb){
	$("#invite_button").hide();
	$("#edit_buoy_textarea").hide();
	$("#submit_buoy_textarea").hide();
	$("#ranks").hide();
	$("#invite_input").hide();
	$("#edit_buoy_description").hide();
	$(".buoy_bulletins").empty();
	$("#buoy_preferences").hide();

	console.log("HARBOR");
	$.get("/home?user="+ (getUser() ? getUser().uuid : null), function(data){
		setBuoy(data.buoy);
		setAccess(data.access);
		var buoy = data.buoy
		var access = getAccess();
		console.log(data);
		console.log(access);
		if(access){
			if(access.rankTitle === "Philosopher King" || access.rankTitle === "Silver" || access.rankTitle === "Gold" || access.rankTitle === "Guardian"){
				$("#buoy_preferences").show();
			}
			console.log(getUser())
			if(access.description){
				console.log("ACCESS")

				$("#edit_buoy_description").show();
			}
			if(buoy.private && access.invites){
				$("#invite_button").show();
				$("#invite_input").show();
			}	
		}
		
		if(data.buoy.bulletin_title){
			for(var i=data.buoy.bulletin_title.length -1; i >= 0; i--){
				var h3 = document.createElement('h3');
				$(h3).text(decodeEntities(data.buoy.bulletin_title[i]));
				var p = document.createElement('p');
				$(p).text(decodeEntities(data.buoy.bulletin_text[i]));
				$(".buoy_bulletins").append(h3);
				$(".buoy_bulletins").append(p);
				$(".buoy_bulletins").append("<br>")
			}
		}
		$("#buoy_description").html(decodeEntities(buoy.description));
		$("#buoy_title").text(buoy.buoy);
		//loader gif
		cb();
	})
}


function populate(id, val){
	var input = document.createElement("input");
	 $(input).attr("placeholder", "Type");
	 $(input).addClass("type_input");
	 if(val) $(input).val(val);
	 $("#" + id + "_buoy").append(input);
	 var a = document.createElement('a');
	 $(a).text("[-]");
	 $(a).attr("href", "#")
	 $("#" + id + "_buoy").append(a);
	 var br = document.createElement("br");
	 $("#" + id + "_buoy").append(br);
	 $(a).click(function(e){
	 	e.preventDefault();
	 	$(a).remove();
	 	$(input).remove();
	 	$(br).remove();
	 })
}

function decodeEntities(encodedString) {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

function initializeEditBuoy(cb){
	$("#add_types_buoy").empty();
	$("#add_media_buoy").empty();
	$("#add_formats_buoy").empty();
	$.get("/upload_structure", function(data){
		console.log(data);
		data.buoy.types.forEach(function(val){
			populate("add_types", val);
		})
		data.buoy.media.forEach(function(val){
			populate("add_media", val);
		})
		data.buoy.formats.forEach(function(val){
			populate("add_formats", val);
		})
		cb();

	})
}
