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
		order: [],
		stateSave: true,
		ajax: {
			url: "/classes",
			type: "POST",
			dataSrc : function(data){

				console.log(data);
				var records = [];

				data.data.forEach(function(record){
			      
			      records.push(["<a class='ANCHOR class' href='#class?uuid=" + record._fields[0].properties.uuid + 
			      	"'>" + record._fields[0].properties.name +"</a>", 
			      	record._fields[2] ? record._fields[2] : ""] 
			      	)

			    })
			    
			    return records;
			}
		},
		drawCallback : function(){
			//ANCHOR.buffer();
			cb();
		}

  	})
    $('th').unbind('click.DT')


}