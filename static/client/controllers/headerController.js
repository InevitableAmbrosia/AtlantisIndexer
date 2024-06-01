function switchBuoy(){
	$.get("/buoy/" + ANCHOR.getParams().buoy + "?user="+ (getUser() ? getUser().uuid : null), function(data){
		setAccess(data.access);
		setBuoy(data.buoy);
		setPanel();
		setTabs();
		setH1();
		//$(".buoy_select").val(ANCHOR.getParams().buoy)
	})
}


function initializeBuoySelect(uuid){
	$(".buoy_select").empty();
	$(".buoy_select").hide();
	console.log("UUID " + uuid);
	$.get("/buoys", function(data){
		console.log(data);
		data.buoys.forEach(function(record){
		console.log("HERE")
		console.log(record);
		//if(buoy.uuid !== "b5d89482-b58d-11ed-afa1-0242ac120002" && buoy.uuid !== "d2b358ee-b58d-11ed-afa1-0242ac120002"){
		var option = document.createElement("option");
		$(option).text(record._fields[0].properties.buoy);
		$(option).val(record._fields[0].properties.uuid);
		$(".buoy_select").append(option)
		})
		if(uuid && uuid !== "undefined")
			$(".buoy_select").val(uuid);
		$(".buoy_select").on('change', function(){
			ANCHOR.route("#" + ANCHOR.page() + "?buoy=" + $(this).val() + (ANCHOR.page() === "user" ? "&user=" + getUser().uuid : ""))
			$.get("/buoy/" + $(this).val(), function(data){				
				switchBuoy();
				console.log(getBuoy().uuid);					
			})
		})
		$(".buoy_select").fadeIn(6000)

	})	
	
}

function setPanel(){
	$(".upload_panel").attr("href", ANCHOR.getParams() ? "#upload?buoy="+ ANCHOR.getParams().buoy : "#upload?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002")
	$(".login").attr("href", ANCHOR.getParams() ? "#login?buoy="+ ANCHOR.getParams().buoy : "#login?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002")
	$(".register").attr("href", ANCHOR.getParams() ? "#register?buoy="+ ANCHOR.getParams().buoy : "register?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002")
	$(".user_profile").attr("href", ANCHOR.getParams() ? "#user?buoy="+ ANCHOR.getParams().buoy : "#user?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002")
	$(".logout").attr("href", ANCHOR.getParams() ? "#buoy?buoy="+ ANCHOR.getParams().buoy : "#logout?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	$(".create_buoy").attr("href", ANCHOR.getParams() ? "#create_buoy?buoy="+ ANCHOR.getParams().buoy : "#create_buoy?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	$(".file_manager").attr("href", ANCHOR.getParams() ? "#file_manager?buoy="+ ANCHOR.getParams().buoy : "#file_manager?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	ANCHOR.buffer();
}

function setTabs(){
	$(".torrentTab").attr("href", ANCHOR.getParams() ? "#torrents?buoy="+ ANCHOR.getParams().buoy : "#torrents?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	$(".classesTab").attr("href", ANCHOR.getParams() ? "#classes?buoy=" + ANCHOR.getParams().buoy : "#classes?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	$(".top10Tab").attr("href", ANCHOR.getParams() ? "#top10?buoy="+ ANCHOR.getParams().buoy : "#top10?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	$(".graphTab").attr("href", ANCHOR.getParams() ? "#graph?buoy="+ ANCHOR.getParams().buoy : "#graph?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002");
	$(".forumTab").attr("href", ANCHOR.getParams() ? "#forum?buoy="+ ANCHOR.getParams().buoy : "#forum?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002")
	ANCHOR.buffer();
}

function setH1(){
	$(".buoy").attr("href", ANCHOR.getParams() ? "#buoy?buoy=" + ANCHOR.getParams().buoy : "#buoy?buoy=d2b358ee-b58d-11ed-afa1-0242ac120002")
	ANCHOR.buffer();
}

function userPanel(user){
	if(user){
		console.log("HERE SETtiNG USER PANEL!");
		$(".user_profile").text(user.user);
		$(".user_li").fadeIn('slow');
		$(".logout_li").fadeIn('slow');
		$(".login_li").hide();
		$(".reg_li").hide();
		$(".create_buoy_li").fadeIn('slow');
	}
	else{
		console.log("NO USER PANEL")
		$(".user_li").hide();
		$(".logout_li").hide();
		$(".login_li").fadeIn('fast');
		$(".reg_li").fadeIn('fast');
		$(".create_buoy_li").hide();
	}
}

function initializeUserPanel(){
	console.log("HIDING USER PANEL")
	$(".create_buoy_li").hide();
	$(".user_li").hide();
	$(".logout_li").hide();
	$(".login_li").hide();
	$(".reg_li").hide();
}
