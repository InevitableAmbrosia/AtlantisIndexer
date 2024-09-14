function switchBuoy(){
	$.get("/home?user="+ (getUser() ? getUser().uuid : null), function(data){
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
	$(".upload_panel").attr("href", "#upload")
	$(".login").attr("href", "#login")
	$(".register").attr("href", "#register")
	$(".user_profile").attr("href", "#user")
	$(".logout").attr("href", "#home");
	$(".file_manager").attr("href", "#file_manager");
	ANCHOR.buffer();
}

function setTabs(){
	$(".torrentTab").attr("href", "#torrents");
	$(".classesTab").attr("href", "#classes");
	$(".top10Tab").attr("href", "#top10");
	$(".worldSpiritTab").attr("href", "#world_spirit")
	$(".graphTab").attr("href", "#graph");
	ANCHOR.buffer();
}

function setH1(){
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
	$(".donate").click(function(e){
	e.preventDefault();
		alert("BTC Address: 3D3wMrdQ44p92YcL2fzyxHTdmkWqHoz9wQ")
	})
}
