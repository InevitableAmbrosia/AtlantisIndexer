function htmlSearch(){
    $(document).keyup(function(e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            $(".autosuggestBox").hide();
        }
    });
    $(document).mouseup(function(e) 
    {
        var container = $(".autosuggestBox");
        clearTimeout(timeoutId);
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            container.hide();
        }
    })


    $(".searchField").on('click', function(e){
        if(search && records && records[$(this).parent().attr("class")]){
            $(this).next().show();
        }
    })

    var search;
    var records;
    var timeoutId;
    var classes;

    $(".search_dialectic_classes_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)

                    response(data);
                 }
            });
        },
        select : function(event, ui){
            
            $(".search_dialectic_classes_input").val($(this).val().substring(0, $(this).val().lastIndexOf(",")) + 
                                            ($(this).val().indexOf(",") > -1 ? ", " : "") +
                                         ui.item.label)      
            return false;         
        }
    })

    $(".src_search_dialectic_classes_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            
            $(".src_search_dialectic_classes_input").val($(this).val().substring(0, $(this).val().lastIndexOf(",")) + 
                                            ($(this).val().indexOf(",") > -1 ? ", " : "") +
                                         ui.item.label)      
            return false;         
        }
    })

    $(".search_publishers_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_publishers',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide();
            $(".search_sources_input").val(decodeEntities(ui.item.value))
            ANCHOR.route("#publisher?publisher=" + ui.item.value + "&buoy=" + ANCHOR.getParams().buoy)               
        }
    })

     $(".search_sources_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_sources',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide();
            $(".search_sources_input").val(decodeEntities(ui.item.value))
            ANCHOR.route("#source?uuid=" + ui.item.value + "&buoy=" + ANCHOR.getParams().buoy)               
        }
    })

     $(".search_upload_sources_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_sources',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide()
            ANCHOR.route("#upload?uuid=" + ui.item.value + "&buoy=" + ANCHOR.getParams().buoy)               
        }
    })

     $(".search_authors_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_authors',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            this.value = $('<div />').html(ui.item.label).text();

            ANCHOR.route("#author?uuid=" + ui.item.value + "&buoy=" + ANCHOR.getParams().buoy)               
        }
    })


     $(".search_upload_authors_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_authors',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide()
            $(".search_upload_authors_input").val("")
            addAuthor({uuid : ui.item.value, author : ui.item.label}) 
            return false;             
        }
    })

     $(".search_classes_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide()

            ANCHOR.route("#class?uuid=" + ui.item.value + "&buoy=" + ANCHOR.getParams().buoy)               
        }
    })


     $(".search_upload_classes_input").autocomplete({
        scroll : true,
        source: function( request, response ) {
            $.ajax({
                /* Snip */
                data : { 
                    term : request.term
                },
                url: '/search/' + ANCHOR.getParams().buoy + '?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    console.log(data)
                    response(data);
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide()
            
            $(".search_upload_classes_input").val($(this).val().substring(0, $(this).val().lastIndexOf(",")) + 
                                            ($(this).val().indexOf(",") > -1 ? ", " : "") +
                                         ui.item.label)      
            return false;         
        }
    })

   /* $('.searchField').keyup(function(){ //letter has been pressed
        var that = this;
        search = $(this).val();
        classes=false;
        if($(that).attr("id")==="classes_input"){
            console.log("HEREEEE");
            classes=true;
        }
        if(!search){
            $(".autosuggestBox").hide(); //.search ul ul   
        }
        // stop previous timeouts
        clearTimeout(timeoutId)
        timeoutId = setTimeout(function () {
            console.log(search.substring(search.lastIndexOf(",") + 1).trim())
            $.ajax({
                url : '/search?field=' + $(that).parent().attr("class"), //the server page that will handle the request
                type : 'GET', //the method of sending the data
                data: 'q='+ (!classes ? search : search.substring(search.lastIndexOf(",") +1).trim()), //the data you are sending
                success : function(data){
                    search="";
                    records = data.records;
                    $(that).parent().children("ul").empty();
                    if(!data.records || data.records.length === 0){
                        $(that).parent().children("ul").hide();   
                        records[$(that).parent().attr("class")] = false        
                    }
                    data.records.forEach(function(record){
                        if(record){
                            records[$(that).parent().attr("class")] = true;
                            $(that).parent().children("ul").show();                    
                        }
                        else{
                            records[$(that).parent().attr("class")] = false;
                            $(that).parent().children("ul").hide();           
                        }
                        console.log($(that).parent().get(0).tagName)
                        //header
                        if($(that).parent().get(0).tagName !== "DIV"){
                            switch($(that).parent().attr("class")){
                                case "search_sources":
                                    $($(that).parent().children("ul")).append("<li><a class='ANCHOR source' href='#source?uuid=" + record._fields[0].properties.uuid + "'>"+
                                     record._fields[0].properties.title + "</a></li>");
                                    ANCHOR.buffer();
                                    break;
                                case "search_authors":
                                    $($(that).parent().children("ul")).append("<li><a class='ANCHOR author' href='#author?uuid=" + record._fields[0].properties.uuid + "'>"+ 
                                        (record._fields[0].properties.author.charAt(0) == record._fields[0].properties.author.charAt(0).toUpperCase() ? 
                                            record._fields[0].properties.author : toTitleCase(record._fields[0].properties.author)) +
                                         "</a></li>");
                                    ANCHOR.buffer();
                                    break;
                                case "search_classes":
                                    $($(that).parent().children("ul")).append("<li><a class='ANCHOR class' href='#class?uuid=" + record._fields[0].properties.uuid + "'>"+ 
                                        record._fields[0].properties.name + "</a></li>");
                                    ANCHOR.buffer();
                                    break;
                            }
                        }
                        //upload page
                        else{
                            switch($(that).parent().attr("class")){
                                case "search_sources":
                                    $($(that).parent().children("ul")).append("<li><a id='search_source_" + record._fields[0].properties.uuid + "' href='#'>"+
                                     record._fields[0].properties.title + "</a></li>");
                                    $("#search_source_" + record._fields[0].properties.uuid).click(function(e){
                                        e.preventDefault();
                                        $(".autosuggestBox").hide();
                                        ANCHOR.route("#upload?silo="+ getSilo().uuid + "&uuid=" + record._fields[0].properties.uuid)
                                    })
                                    break;
                                case "search_authors":
                                    $(that).parent().children("ul").append("<li><a href='#' id='search_author_" + record._fields[0].properties.uuid + "'>"
                                    + (record._fields[0].properties.author.charAt(0) == record._fields[0].properties.author.charAt(0).toUpperCase() ?
                                     record._fields[0].properties.author : toTitleCase(record._fields[0].properties.author)) + "</a></li>")
                                    $("#search_author_" + record._fields[0].properties.uuid).click(function(e){
                                        e.preventDefault();
                                        console.log("HEREEEEEE")
                                        $.post("/add_author", {author : record._fields[0].properties.author}, function(data){
                                            $(".autosuggestBox").hide();
                                            addAuthor(data);
                                        })
                                    })
                                    break;
                                case "search_classes":
                                    $($(that).parent().children("ul")).append("<li><a href='#' id='search_class_" + record._fields[0].properties.uuid + "'>"+
                                     record._fields[0].properties.name + "</a></li>");
                                    $("#search_class_" + record._fields[0].properties.uuid).click(function(e){
                                        e.preventDefault();

                                        $("#classes_input").val($("#classes_input").val().substring(0, $("#classes_input").val().lastIndexOf(",")) + 
                                            ($("#classes_input").val().indexOf(",") > -1 ? ", " : "") +
                                         record._fields[0].properties.name).trigger("change")
                                        console.log(record._fields[0].properties.name)
                                        $(".autosuggestBox").hide();
                                    })
                                    break;
                            }
                        }
                    })
                }
            });
         }, 501);        
    });    */
}
