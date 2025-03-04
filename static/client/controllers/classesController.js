var classesTable;
function initializeClasses(cb){
	$("#add_class_button").removeAttr("disabled")
	if(classesTable){
		classesTable.destroy();
		$("#classes tbody").empty();
		//torrentsTable.draw();
	}



	classesTable = $("#classes").DataTable({
		responsive : true,
		serverSide : true,
		pageLength: 25,
		processing: true,
		searching: false, paging : true, info: true,
		stateSave: true,
		ajax: {
			url: "/classes",
			type: "POST",
			dataSrc : function(data){

				var records = [];

				data.data.forEach(function(record){

			      	//if(record._fields[0].properties.name && record._fields[0].properties.name !== "undefined" && record._fields[2] && record._fields[3]){
			      
				      records.push(["<a class='ANCHOR class' href='#class?uuid=" + record._fields[0].properties.uuid + "'>" + decodeEntities(decodeEntities(record._fields[0].properties.name)) +"</a>", 
				      	record._fields[2] ? record._fields[2] : 0, record._fields[3] ? record._fields[3] : 0] 
				      	)
			      	//}	
			    })	
			     
			      
			    
			    return records;
			}
		},
		drawCallback : function(){
			//ANCHOR.buffer();
			cb();
		}

  	})
    //$('th').unbind('click.DT')


}