var classesTable;
var classesTopTable;
function initializeClasses(cb){
	$("#add_class_button").removeAttr("disabled")
	if(classesTable){
		classesTable.destroy();
		$("#classes tbody").empty();
		//torrentsTable.draw();
	}
	if(classesTopTable){
		classesTopTable.destroy();
		$("#classes_top tbody").empty();
		//torrentsTable.draw();
	}


	classesTopTable = $("#classes_top").DataTable({
		responsive : true,
		serverSide : true,
		pageLength: 10,
		processing: true,
		searching: false, paging : false, info: true,
		order: [],
		stateSave: true,
		ajax: {
			url: "/classes/top",
			type: "POST",
			dataSrc : function(data){

				console.log(data);
				var records = [];
				if(data.data && data.data[0] && data.data.length > 0){
					data.data.forEach(function(record){
			      	if(record._fields[0].properties.name && record._fields[0].properties.name !== "undefined" && record._fields[2] && record._fields[3]){
			      		records.push(["<a class='ANCHOR class' href='#class?uuid=" + record._fields[0].properties.uuid + 
				      	"'>" + record._fields[0].properties.name +"</a>"] 
				      	)

				    
			      	}
			      })
				      
				}
				
			    
			    return records;
			      	
			}
		},
		drawCallback : function(){
			//ANCHOR.buffer();
			cb();
		}
	})

	classesTable = $("#classes").DataTable({
		responsive : true,
		serverSide : true,
		pageLength: 25,
		processing: true,
		searching: false, paging : true, info: true,
		orderFixed: [1, 'desc'],
		stateSave: true,
		ajax: {
			url: "/classes",
			type: "POST",
			dataSrc : function(data){

				console.log(data);
				var records = [];

				data.data.forEach(function(record){

			      	//if(record._fields[0].properties.name && record._fields[0].properties.name !== "undefined" && record._fields[2] && record._fields[3]){
			      
				      records.push(["<a class='ANCHOR class' href='#class?uuid=" + record._fields[0].properties.uuid + "'>" + record._fields[0].properties.name +"</a>", 
				      	record._fields[2] ? record._fields[2] : "", record._fields[3] ? record._fields[3] : ""] 
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