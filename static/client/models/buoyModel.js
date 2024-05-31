var buoyModel = {
}

var accessModel = {}

var buoysArr = []
function setBuoy(buoy){
	console.log("HEREEEEEEEEE");
	console.log(buoy);
	buoyModel = buoy;
}

function getBuoy(){
	return buoyModel;
}

function getBuoys(){
	return getUser().buoys;
}


function setBuoys(buoys){
	//$.post("/buoys", {buoys : JSON.stringify(getUser().buoys)}, function(data){
		buoysArr = buoys;
		//console.log(getUser().buoys)			
	//})
}