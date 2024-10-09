function initializeBuoy(cb){
  //donation
  $(".donate").unbind("click")
  $(".donate").click(function(e){
	e.preventDefault();
		alert("BTC Address: 3D3wMrdQ44p92YcL2fzyxHTdmkWqHoz9wQ")
	})
  
  //social
  
  //fb
  var script = document.createElement('script');

  script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v21.0";
  document.head.appendChild(script);
  
  //twitter
  window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

	$("#invite_button").hide();
	$("#edit_buoy_textarea").hide();
	$("#submit_buoy_textarea").hide();
	$("#ranks").hide();
	$("#invite_input").hide();
	$("#edit_buoy_description").hide();
	$(".buoy_bulletins").empty();
	$("#buoy_preferences").hide();
  $("#stats_featured").empty();
  $.get("/stats", function(data){
    $("#stats_featured").append("<a href='#source?uuid=" + data.source.properties.uuid + "' class='ANCHOR source'>" +
                               data.source.properties.title + "</a>")
    $("#stats_torrents").text(toNumber(data.numTorrents));
    $("#stats_sources").text(toNumber(data.numSources));
    $("#stats_users").text(toNumber(data.numUsers));
    $("#stats_classes").text(toNumber(data.numClasses));
    $("#stats_snatches").text(data.snatches)
  })
  
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
		
		if(data.bulletins && data.bulletins.length > 0){
			data.bulletins.forEach(function(bulletin){
				
				var h3 = document.createElement('h3');
				$(h3).text(decodeEntities(bulletin.properties.title));
				var p = document.createElement('p');
				$(p).text(decodeEntities(bulletin.properties.text));
				var span = document.createElement("span");
				var div = document.createElement("div");
				$(span).html("Posted by <a href='#user?uuid=" + bulletin.properties.userUUID + "' class='ANCHOR user'>" + bulletin.properties.userName + "</a> " + timeSince(bulletin.properties.time) + " ago.");
				if(bulletin.properties.title !== "About Us" && bulletin.properties.title !== "Testing New Bulletin System" && bulletin.properties.title !== "Testing Bulletin System"){
					$(div).addClass("bulletin");
					$(div).attr("id", bulletin.properties.uuid)
					$(".buoy_bulletins").append(div);
					$(div).append(h3);
					$(div).append(span);
					$(div).append(p);
					$(div).append("<br>")			
				}
				
			})
		}

		if(data.buoy.bulletin_title){

			for(var i=data.buoy.bulletin_title.length -1; i >= 0; i--){
				
				var h3 = document.createElement('h3');
				$(h3).text(decodeEntities(data.buoy.bulletin_title[i]));
				var p = document.createElement('p');
				$(p).text(decodeEntities(data.buoy.bulletin_text[i]));
				var div = document.createElement("div");

				if(data.buoy.bulletin_title[i] !== "Testing New Bulletin System" && data.buoy.bulletin_title[i] !== "Test" && data.buoy.bulletin_title[i] !== "Gangstalking" && data.buoy.bulletin_title[i] !== "Shameless Self-Promotion"){
					$(div).addClass("bulletin");
					$(div).attr("id", data.buoy.bulletin_title[i]);
					$(".buoy_bulletins").append(div);
					$(div).append(h3);
					$(div).append(p);
					$(div).append("<br>")
				}
				
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
