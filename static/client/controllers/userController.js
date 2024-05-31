$(".buoys").hide();
$("#buoys").empty();
$("#buoys_h3").hide();
$("#invites_h3").hide();
$("#invites").empty();
function initializeUser(cb){
	$(".buoys").hide();
	$("#buoys").empty();
	$("#invites").empty();
	$("#buoys_h3").hide();
	$("#invites_h3").hide();
	console.log("THERE")
	$.get("/user/" + ANCHOR.getParams().uuid, function(data){
		console.log(data);
		$("#user_name").text(data.user.user);
		console.log(getUser());
		if(data.self){
			if(data.buoys){
				data.buoys.forEach(function(buoy){	
					if(buoy.private){
						var li = document.createElement("li");
						var a = document.createElement("a");
						console.log(buoy);
						$("#buoys").append(li);
						$(li).append(a);

						$(a).attr("href", "#");
						$(a).text(buoy.buoy);
						$(a).click(function(e){
							e.preventDefault();
							setTabs();
							console.log("SETTING TABS")
							setPanel();
							switchBuoy();
							$(".buoys").val(buoy.uuid)

							ANCHOR.route("#buoy?buoy=" + buoy.uuid)
						})	
					}			
				
				})
			}			
			if(data.invite_uuids){
				data.invite_uuids.forEach(function(obj, i){
					console.log(getUser())
					var li = document.createElement("li");
					var span = document.createElement("span");
					$(span).text(data.invite_buoys[i].buoy);
					var button=document.createElement("button");

					$(button).click(function(){
						$.post("/accept_invite/" + obj.uuid,function(data){
							ANCHOR.route("#buoy?buoy="+data.invite_buoys[i].buoy);
						})
						return false;
						
					})

					$(button).text("Accept");

					$("#invites").append(li);
					$("#invites").append("<br>")
					$(li).append(span);
					$(li).append(button);
				})	
			}	
			$("#invites").show();
			$("#invites_h3").show();
			ANCHOR.buffer();
			
			$(".buoys").show();
			$("#buoys_h3").show()	
				
		}
		console.log("here");
		cb();
		
	})
	

}

function logout(){
	$("body").css("cursor", "progress");
	$.post("/logout", function(data){
		console.log("LOGGED OUT")
		setUser(null);
		$("body").css("cursor", "default");
		setAccess(null);
		userPanel(null);
		initializeBuoySelect(ANCHOR.getParams().buoy);
		ANCHOR.route("#buoy?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");

	})
}

function authenticateUser(){
	$.get("/auth", function(data){
		console.log(data.user)
	 	setUser(data.user)
	 	userPanel(data.user)
		initializeBuoySelect(ANCHOR.getParams().buoy);
 	})
}