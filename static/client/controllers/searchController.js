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
                url: '/search?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
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
                url: '/search?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
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
                url: '/search?field=search_publishers',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide();
            ANCHOR.route("#publisher?publisher=" + ui.item.value)               
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
                url: '/search?field=search_sources',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide();
            $(".search_sources_input").val(decodeEntities(ui.item.value))
            ANCHOR.route("#source?uuid=" + ui.item.value)               
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
                url: '/search?field=search_sources',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide()
            ANCHOR.route("#upload?uuid=" + ui.item.value)               
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
                url: '/search?field=search_authors',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        console.log(decodeEntities(decodeEntities(item.label)))
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
                 }
            });
        },
        select : function(event, ui){
            this.value = $('<div />').html(ui.item.label).text();

            ANCHOR.route("#author?uuid=" + ui.item.value)               
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
                url: '/search?field=search_authors',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
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
                url: '/search?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
                 }
            });
        },
        select : function(event, ui){
            $(".mobile_menu").hide()

            ANCHOR.route("#class?uuid=" + ui.item.value)               
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
                url: '/search?field=search_classes',
                type: "get", //send it through get method
                success: function(data) {
                    response($.map(data, function(item) {
                        return {label : decodeEntities(decodeEntities((item.label))), value : item.value};
                    }))
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
}