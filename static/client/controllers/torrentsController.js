var full = false;

function initializeTorrents(table, cb) {
 
  
  if ($(table) instanceof $.fn.dataTable.Api) {
    $(table).destroy();
  }
  
  
  
  function stopScroll(e){
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
          e.preventDefault();
    }
  }

  $(".partial_graph").on("mouseenter", function () {
    {
      window.removeEventListener("keydown", stopScroll);
      window.addEventListener("keydown", stopScroll);
    }
  });

  $(".partial_graph").on('mouseleave', function () {
    window.removeEventListener("keydown", stopScroll);
  });
  $(".loading").hide();
  $("#publisherTitle span").text("Publisher");
  $("#classTitle span").text("class")
  $("#sourceTitle span").text("Source");
  $("#authorTitle span").text("Author");
  $("#userUploadsTitle span").text("User Uploads");

  
  $(".adv_plus").unbind("click");
  $(".adv_plus").click(function (e) {
    e.preventDefault();
    $(".adv_plus").hide();
    $(".adv_minus").fadeIn(333);
    $(".adv_show").slideDown();
    setTimeout(function () {
      $(".adv_search").css({ height: 480 });
    }, 333);
  });

  $(".adv_minus").unbind("click");
  $(".adv_minus").click(function (e) {
    e.preventDefault();
    $(".adv_minus").hide();
    $(".adv_plus").fadeIn(333);
    setTimeout(function () {
      $(".adv_search").css({ height: 60 });
    }, 333);
    $(".adv_show").slideUp();
  });



  if (ANCHOR.getParams()) {
    if (
      !ANCHOR.getParams().title &&
      !ANCHOR.getParams().author &&
      !ANCHOR.getParams().classes &&
      ANCHOR.getParams.type === "all" &&
      ANCHOR.getParams().media === "all" &&
      ANCHOR.getParams().format === "all"
    ) {
      ANCHOR.removeParams("search");
      ANCHOR.setParams("search", "false");
    }
  }

  $(".download_graph").unbind("click");
  $(".download_graph").click(function (e) {
    e.preventDefault();
    $.post(
      "/download_graph",
      { nodeUUIDs: JSON.stringify(nodeUUIDs) },
      function (data) {
        nodeUUIDs = [];
        data.nodeUUIDs.forEach(function (uuid) {
          nodeUUIDs.push(uuid._fields[0]);
        });
        $.post(
          "/download_page",
          { all: JSON.stringify(nodeUUIDs) },
          function (data) {
            data.all.forEach(function (infoHash) {
              setTimeout(function () {
                window.location =
                  "magnet:?xt=urn:btih:" +
                  infoHash._fields[0] +
                  "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337";
              }, 236);
            });
          }
        );
      }
    );
  });

  $(".download_all").unbind("click");

  $(".download_all").click(function (e) {
    e.preventDefault();
    $.post("/download_page", { all: JSON.stringify(all) }, function (data) {
      data.all.forEach(function (infoHash) {
        setTimeout(function () {
          window.location =
            "magnet:?xt=urn:btih:" +
            infoHash._fields[0] +
            "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337";
        }, 236);
      });
    });
  });

  $(".download_all_top button").unbind("click");

  $(".download_all_top button").click(function (e) {
    e.preventDefault();
    var that = $(this);
    $.post(
      "/download_page",
      { all: JSON.stringify(top[that.attr("id")]) },
      function (data) {
        data.all.forEach(function (infoHash) {
          setTimeout(function () {
            window.location =
              "magnet:?xt=urn:btih:" +
              infoHash._fields[0] +
              "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337";
          }, 236);
        });
      }
    );
  });

  /*$("#download_class").click(function(e){
    e.preventDefault();
    $.post("/download_class?uuid=" + ANCHOR.getParams().uuid, function(data){
      data.records.forEach(function(record){
        setTimeout(function(){
            window.location = "magnet:?xt=urn:btih:" + record._fields[0] + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"

        },25)
      })
    })
  })

  $("#download_author").click(function(e){
    e.preventDefault();
    $.get("/download_author?uuid=" + ANCHOR.getParams().uuid, function(data){
      data.records.forEach(function(record){
        setTimeout(function(){
            window.location = "magnet:?xt=urn:btih:" + record._fields[0] + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"

        },25)
      })
    })
  })

  $("#download_source").click(function(e){
    e.preventDefault();
    $.get("/download_source?uuid=" + ANCHOR.getParams().uuid, function(data){
      data.records.forEach(function(record){
        setTimeout(function(){
            window.location = "magnet:?xt=urn:btih:" + record._fields[0] + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
        }, 25)
      })
    })
  })*/

  var all = [];
  var top = {
    top10_all_active: [],
    top10_all_day: [],
    top10_all_week: [],
    top10_all_month: [],
    top10_all_trinity: [],
    top10_all_year: [],
    top10_all_time: [],
  };
  
  $("#adv_class_all").prop("checked", false);
  $("#adv_class_any").prop("checked", true)
  
  if(ANCHOR.getParams() && ANCHOR.getParams.class_all){
    
    $("#adv_class_all").prop("checked", true);
    $("#adv_class_any").prop("checked", false);
  }
  else{
    $("#adv_class_all").prop("checked", false);
    $("#adv_class_any").prop("checked", true);
  }
  $("#adv_title").val(
    ANCHOR.getParams() && ANCHOR.getParams().title
      ? ANCHOR.getParams().title
      : ""
  );
  $("#adv_author").val(
    ANCHOR.getParams() && ANCHOR.getParams().author
      ? ANCHOR.getParams().author
      : ""
  );
  $("#adv_classes").val(
    ANCHOR.getParams() && ANCHOR.getParams().classes
      ? decodeEntities(ANCHOR.getParams().classes) === "undefined"
        ? ""
        : decodeEntities(ANCHOR.getParams().classes).replace(/['"]+/g, "")
      : ""
  );
  $("#adv_publisher").val(
    ANCHOR.getParams() && ANCHOR.getParams().publisher
      ? ANCHOR.getParams().publisher
      : ""
  );
  $("#adv_type").val(
    ANCHOR.getParams() && ANCHOR.getParams().type ? ANCHOR.getParams().type : ""
  );
  $("#adv_media").val(
    ANCHOR.getParams() && ANCHOR.getParams().media
      ? ANCHOR.getParams().media
      : ""
  );
  $("#adv_format").val(
    ANCHOR.getParams() && ANCHOR.getParams().format
      ? ANCHOR.getParams().format
      : ""
  );
  $("#top10_class_all").prop("checked", true);
  $("#top10_class_any").prop("checked", false);
  $("#top10_title").val(
    ANCHOR.getParams() && ANCHOR.getParams().title
      ? ANCHOR.getParams().title
      : ""
  );
  $("#top10_author").val(
    ANCHOR.getParams() && ANCHOR.getParams().author
      ? ANCHOR.getParams().author
      : ""
  );
  $("#top10_classes").val(
    ANCHOR.getParams() && ANCHOR.getParams().classes
      ? decodeEntities(ANCHOR.getParams().classes) === "undefined"
        ? ""
        : decodeEntities(ANCHOR.getParams().classes).replace(/['"]+/g, "")
      : ""
  );
  $("#top10_publisher").val(
    ANCHOR.getParams() && ANCHOR.getParams().publisher
      ? ANCHOR.getParams().publisher
      : ""
  );
  $("#top10_type").val(
    ANCHOR.getParams() && ANCHOR.getParams().type ? ANCHOR.getParams().type : ""
  );
  $("#top10_media").val(
    ANCHOR.getParams() && ANCHOR.getParams().media
      ? ANCHOR.getParams().media
      : ""
  );
  $("#top10_format").val(
    ANCHOR.getParams() && ANCHOR.getParams().format
      ? ANCHOR.getParams().format
      : ""
  );
  if (ANCHOR.getParams() && ANCHOR.getParams().class_all === "true") {
    $("#adv_class_all").prop("checked", true);
    $("#adv_class_any").prop("checked", false);
  } else {
    $("#adv_class_all").prop("checked", false);
    $("#adv_class_any").prop("checked", true);
  }
  if (ANCHOR.getParams() && ANCHOR.getParams().class_all === "true") {
    $("#top10_class_all").prop("checked", true);
    $("#top10_class_any").prop("checked", false);
  } else {
    $("#top10_class_all").prop("checked", false);
    $("#top10_class_any").prop("checked", true);
  }
  $.get("/advanced_search_ui", function (data) {
    $("#adv_type").empty();
    $("#adv_type").append("<option value='all'>All Types</option>");
    $("#adv_media").empty();
    $("#adv_media").append("<option value='all'>All Media</option>");
    $("#adv_format").empty();
    $("#adv_format").append("<option value='all'>All Formats</option>");
    $("#top10_type").empty();
    $("#top10_type").append("<option value='all'>All Types</option>");
    $("#top10_media").empty();
    $("#top10_media").append("<option value='all'>All Media</option>");
    $("#top10_format").empty();
    $("#top10_format").append("<option value='all'>All Formats</option>");
    data.buoy.types.forEach(function (val) {
      var option = document.createElement("option");
      $(option).val(val);
      $(option).text(decodeEntities(decodeEntities(val)));
      var option2 = document.createElement("option");
      $(option2).val(val);
      $(option2).text(decodeEntities(decodeEntities(val)));
      $("#adv_type").append(option);
      $("#top10_type").append(option2);
      if (ANCHOR.getParams() && ANCHOR.getParams().type) {
        $("#adv_type").val(ANCHOR.getParams() ? ANCHOR.getParams().type : "");
        $("#top10_type").val(ANCHOR.getParams() ? ANCHOR.getParams().type : "");
      }
    });
    data.buoy.media.forEach(function (val) {
      var option = document.createElement("option");
      $(option).val(val);
      $(option).text(decodeEntities(decodeEntities(val)));
      $("#adv_media").append(option);
      var option2 = document.createElement("option");
      $(option2).val(val);
      $(option2).text(decodeEntities(decodeEntities(val)));
      $("#top10_media").append(option2);
      if (ANCHOR.getParams() && ANCHOR.getParams().media) {
        $("#adv_media").val(ANCHOR.getParams() ? ANCHOR.getParams().media : "");

        $("#top10_media").val(
          ANCHOR.getParams() ? ANCHOR.getParams().media : ""
        );
      }
    });
    data.buoy.formats.forEach(function (val) {
      var option = document.createElement("option");
      $(option).val(val);
      $(option).text(decodeEntities(decodeEntities(val)));
      $("#adv_format").append(option);
      var option2 = document.createElement("option");
      $(option2).val(val);
      $(option2).text(decodeEntities(decodeEntities(val)));
      $("#top10_format").append(option2);
      if (ANCHOR.getParams() && ANCHOR.getParams().format) {
        $("#adv_format").val(
          ANCHOR.getParams() ? ANCHOR.getParams().format : ""
        );

        $("#top10_format").val(
          ANCHOR.getParams() ? ANCHOR.getParams().format : ""
        );
      }
    });
  });

  $("#adv_submit").unbind("click");
  $("#adv_submit").click(function () {
    ANCHOR.route(
      "#torrents?search=true&title=" +
        encodeURIComponent($("#adv_title").val()) +
        "&author=" +
        encodeURIComponent($("#adv_author").val()) +
        "&classes=" +
        ($("#adv_classes").val()
          ? JSON.stringify(encodeURIComponent($("#adv_classes").val()))
          : "") +
        "&class_all=" +
        $("#adv_class_all").prop("checked") +
        "&publisher=" +
        encodeURIComponent($("#adv_publisher").val()) +
        "&type=" +
        encodeURIComponent($("#adv_type").val()) +
        "&media=" +
        $("#adv_media").val() +
        "&format=" +
        $("#adv_format").val()
    );
    initializeTorrents("torrents", dismissLoader);
  });

  $("#top10_submit").unbind("click");
  $("#top10_submit").click(function () {
    ANCHOR.route(
      "#top10?search=true&classes=" +
        ($("#top10_classes").val()
          ? JSON.stringify($("#top10_classes").val())
          : "") +
        "&class_all=" +
        $("#top10_class_all").prop("checked") +
        "&publisher=" +
        $("#top10_publisher").val() +
        "&type=" +
        $("#top10_type").val() +
        "&media=" +
        $("#top10_media").val() +
        "&format=" +
        $("#top10_format").val()
        
    );
    
    initializeTorrents("top10_day", dismissLoader);
    initializeTorrents("top10_week", dismissLoader);
    initializeTorrents("top10_month", dismissLoader);
 
    initializeTorrents("top10_year", dismissLoader);
   
  });

  var torrentsTable;
  if (torrentsTable) {
    torrentsTable.destroy();
    $("#" + table + " tbody").empty();
    //torrentsTable.draw();
  }

  var hashes = []
  var url = ""
  if(table === "torrents"){
    if(!ANCHOR.getParams()){
      url = "/" + table 
    }
    else{
      url = "/" + table + "/adv_search"
    }
  }
  else if(table.indexOf("top10") > -1){
    if(!ANCHOR.getParams()){
      url = "/top10/" + table
    }
    else{
      url = "/top10_adv_search/" + table;
    }
  }
  else if(table === "class" || table === "author" || table === "source"){
    url = "/" + table + "/" + ANCHOR.getParams().uuid
  }
  else if (table==="publisher"){
    url = "/" + table + "/" + ANCHOR.getParams().publisher

  }
  

  $(document).mouseup(function (e) {
    var container = $(".seeAllField");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      container.hide();
    }
  });

  torrentsTable = $("#" + table).DataTable({
    bDestroy: true,
    responsive: {
        details: {
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            type: ''
        }
    },
    serverSide: true,
    bSort: true,
    pageLength: 10,
    "aoColumns": [
      { "sWidth": "0%" }, // 1st column width 
      { "sWidth": "50%" },
      { "sWidth": "12.5%" },
      { "sWidth": "12.5%" },
      { "sWidth": "12.5%" },
      { "sWidth": "12.5%" }

  
       // 3rd column width and so on 
    ],
    processing: true,
    searching: false,
    paging: true,
    info: true,
    columnDefs: [
      {
        target: 0,
        visible: false,
        searchable: false,
      },
      {
        target:4,
        responsivePriority:1
      }
    ],
    rowGroup: {
      dataSrc: 0,
      ordering: true,
      orderable: true,
    },
    stateSave: ANCHOR.getParams() && ANCHOR.getParams().search ? false : true,
    ajax: {
      url: url,
      type: "POST",
      data: {
        title: ANCHOR.getParams() ? ANCHOR.getParams().title : "",
        author: ANCHOR.getParams() ? ANCHOR.getParams().author : "",
        classes: ANCHOR.getParams() ? ANCHOR.getParams().classes : "",
        class_all: ANCHOR.getParams() ? ANCHOR.getParams().class_all : "",
        publisher: ANCHOR.getParams() ? ANCHOR.getParams().publisher : "",
        type: ANCHOR.getParams() ? ANCHOR.getParams().type : "",
        media: ANCHOR.getParams() ? ANCHOR.getParams().media : "",
        format: ANCHOR.getParams() ? ANCHOR.getParams().format : "",
      },
      dataSrc: function (data) {
        all = [];
        top = {
          top10_all_active: [],
          top10_all_day: [],
          top10_all_week: [],
          top10_all_month: [],
          top10_all_trinity: [],
          top10_all_year: [],
          top10_all_time: [],
        };

        var records = [];
        if (data && data.data[0]) {
          switch (ANCHOR.page()) {
            case "author":
            
                 $("#authorTitle span").text(decodeEntities(decodeEntities(data.data[0]._fields[5].properties.author)))
                 $(".author h4 span").text("Graph of " + decodeEntities(decodeEntities(data.data[0]._fields[5].properties.author)))
                 

              break;
            case "source":
              //TODO: maybe multiple calls here
              //$.get("/source_info/" + ANCHOR.getParams().uuid, function (data) {
                $("#sourceTitle span").text(decodeEntities(decodeEntities(data.data[0]._fields[0].properties.title)))
                $(".source h4 span").text("Graph of " + decodeEntities(decodeEntities(data.data[0]._fields[0].properties.title)))
                $("#addFormat").click(function () {
                  ANCHOR.route("#upload?uuid=" + ANCHOR.getParams().uuid);
                });
             
                ANCHOR.buffer();
              //});
              break;

            case "class":
              $("#classTitle span").text(decodeEntities(decodeEntities(data.data[0]._fields[5].properties.name)))
              $(".class h4 span").text("Graph of " + decodeEntities(decodeEntities(data.data[0]._fields[5].properties.name)))
              
              break;
            case "user_uploads":
              
              break;

            case "publisher":
              $("#publisherTitle span").text(decodeEntities(decodeEntities(data.data[0]._fields[5].properties.publisher)))
              $(".publisher h4 span").text("Graph of " + decodeEntities(decodeEntities(data.data[0]._fields[5].properties.publisher)))
              
              break;
          }
        }

        var editionsAdded = [];

        data.data.forEach(function (record) {
          var authorField = "";
          record._fields[1].forEach(function (field, i) {
            if (i === 0) {
              authorField += "<span class='normal'> by </span>";
            } else {
              authorField += ", ";
            }
            authorField +=
              "<a class='ANCHOR author sourceAuthor' href='#author?uuid=" +
              field.properties.uuid +
              "'>" +
              (field.properties.author.charAt(0) ==
              field.properties.author.charAt(0).toUpperCase()
                ? decodeEntities(field.properties.author)
                : decodeEntities(field.properties.author)) +
              "</a>";
          });


          var dateField = "";
          if (record._fields[0] && record._fields[0].properties.date) {
            dateField +=
              " <b>[" +
              decodeEntities(record._fields[0].properties.date) +
              "]</b> ";
          }

          var classesField = " ";
          var seeAll = false;
          var seeAllField = "<span class='seeAllField'>";
          record._fields[3].forEach(function (field, i) {
            if (i === 0) {
              if (field.properties.uuid) {
                classesField +=
                  "<a class='ANCHOR class' href='#class?uuid=" +
                  field.properties.uuid +
                  "'>" +
                  decodeEntities(field.properties.name) +
                  "</a>";
              }
            } else {
              if (field.properties.uuid) {
                classesField +=
                  ", <a class='ANCHOR class' href='#class?uuid=" +
                  field.properties.uuid +
                  "'>" +
                  decodeEntities(field.properties.name) +
                  "</a>";
              }
            }
          });

          seeAllField += "</span>";
          classesField += seeAllField;

          //to find source img

          var sourceIMG = "";


          var numPeers = 0;
          var top10Table = table;
          record._fields[2].forEach(function (edition) {
            var table =
              "<table class='torrentsTable'><thead><th>Format</th><th>Snatches</th>" +
              "<th>Download</th></tr></thead><tbody><tr>";

            if (edition.torrent) {
              if (
                record._fields[0].properties.type === "Nonfiction" ||
                record._fields[0].properties.type === "Short Story"
              ) {
                sourceIMG = "img/ebook.png";
              } else if (record._fields[0].properties.type === "Fiction") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjY3Ni0wNjQtcC5wbmc.jpeg?v=1740590934737"
              }
              else if(record._fields[0].properties.type === "Children Book"){
                sourceIMG =  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/free-book-icon-download-in-svg-png-gif-file-formats--wings-rainbow-flat-line-universal-elements-pack-miscellaneous-icons-453725.png?v=1732213182852";
                
              }
              else if (record._fields[0].properties.type === "Chant") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/Screenshot%20from%202025-01-31%2020-05-18.png?v=1738371956788";
              } else if (record._fields[0].properties.type === "Poetry") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/33yaqamzi1_8jam1asthi_vc061604.png?v=1733512506876";
              } else if (record._fields[0].properties.type === "Play") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/images.png?v=1732212422850";
              } else if (
                record._fields[0].properties.type === "Journal" ||
                record._fields[0].properties.type === "Essay"
              ) {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA3L2pvYjk1MC0wODUtcC5wbmc.png?v=1732212219488";
              } else if (record._fields[0].properties.type === "Lecture") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/teacher-icon-lg.png?v=1732212336151";
              } else if (
                record._fields[0].properties.type === "Documentary" ||
                record._fields[0].properties.type === "Movie" ||
                record._fields[0].properties.type === "Film"
              ) {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/free-film-164-444732.png?v=1718726531504";
              } else if (
                record._fields[0].properties.type === "Music" ||
                record._fields[0].properties.type === "Classical Music" ||
                record._fields[0].properties.type === "Chant"
              ) {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/Music_symbol_Segno.png?v=1718726632020";
              } else if (
                record._fields[0].properties.type === "Videogame" ||
                record._fields[0].properties.type === "Game"
              ) {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/Video_Game_History_Icon_Alternative.svg?v=1718726679991";
              } else if (
                record._fields[0].properties.type === "Software" ||
                record._fields[0].properties.type === "Program"
              ) {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/images.png?v=1718726747129";
              } else if (record._fields[0].properties.type === "Textbook") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/textbook.png?v=1732211690426";
              } else if (record._fields[0].properties.type === "Holy Book") {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/9ep0slh40v_8hw3mlx3u_vc016521.png?v=1732211944109";
              }
              else if(record._fields[0].properties.type === "Encyclopedia"){
                sourceIMG = "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L2pvYjcxNi0wNDIuanBn.jpg?v=1740177190686"
              }
              else {
                sourceIMG =
                  "https://cdn.glitch.global/ae615eaa-fa44-4c56-8e49-a21afe3e2c54/free-file-download-3490087-2924583.png?v=1718726937968";
              }
              if (
                record._fields[0] &&
                !record._fields[0].properties.imgSrc &&
                record._fields[0].properties.imgSrc !== "null"
              ) {
                $.get(
                  "https://www.googleapis.com/books/v1/volumes?q=intitle:" +
                    record._fields[0].properties.title +
                    "+inauthor:" +
                    (record._fields[1] && record._fields[1][0]
                      ? record._fields[1][0].properties.author.split(",")[0]
                      : ""),
                  function (data) {
                    if (
                      data.items &&
                      data.items.length > 0 &&
                      data.items[0].volumeInfo.imageLinks &&
                      (data.items[0].volumeInfo.title ===
                        record._fields[0].properties.title ||
                        data.items[0].volumeInfo.publishedDate ===
                          record._fields[0].properties.date)
                    ) {
                      sourceIMG =
                        data.items[0].volumeInfo.imageLinks.smallThumbnail;
                      $.post(
                        "/google_img/" + record._fields[0].properties.uuid,
                        { img: sourceIMG },
                        function (data) {}
                      );
                      $("#source_" + record._fields[0].properties.uuid).attr(
                        "src",
                        sourceIMG
                      );
                    }
                    if (!data.items) {
                      $.get(
                        "/source_cover/" +
                          record._fields[0].properties.title +
                          "?author=" +
                          (record._fields[1] && record._fields[1][0]
                            ? record._fields[1][0].properties.author.split(
                                ","
                              )[0]
                            : ""),
                        function (data) {
                          if (data.cover && data.cover["1x"]) {
                            sourceIMG = data.cover["1x"];
                            $(
                              "#source_" + record._fields[0].properties.uuid
                            ).attr("src", sourceIMG);
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                sourceIMG =
                  record._fields[0].properties.imgSrc &&
                  record._fields[0].properties.imgSrc !== "null"
                    ? record._fields[0].properties.imgSrc
                    : sourceIMG;
              }


              /*function toNumber({ low, high }) {
                let res = high;

                for (let i = 0; i < 32; i++) {
                  res *= 2;
                }

                return low + res;
              }*/

              if (edition.edition) {
                edition.edition.properties.numPeers = 0;

                edition.edition.properties.numPeers += edition.torrent.numPeers
                  ? edition.torrent.numPeers
                  : 0;
                if (edition.torrent) {
                  var publisherHtml = "";
                  var editionField = "";
                  record._fields[1].forEach(function (field, i) {
                    editionField += decodeEntities(field.properties.author);
                    if (record._fields[1][i + 1]) {
                      editionField += ", ";
                    } else if (
                      field.properties.author &&
                      !field.properties.author.endsWith(".")
                    ) {
                      editionField += ". ";
                    } else {
                      editionField += " ";
                    }
                  });
                  if (
                    !record._fields[0].properties.date &&
                    edition.edition.properties.date
                  ) {
                    editionField +=
                      "(" +
                      decodeEntities(edition.edition.properties.date) +
                      "). ";
                  } else {
                    editionField += record._fields[0].properties.date
                      ? "(" +
                        decodeEntities(record._fields[0].properties.date) +
                        (edition.edition.properties.date &&
                        edition.edition.properties.date !==
                          record._fields[0].properties.date
                          ? "/" +
                            decodeEntities(edition.edition.properties.date) +
                            "). "
                          : "). ")
                      : "";
                  }
                  editionField +=
                    record._fields[0].properties.type !== "Journal" &&
                    record._fields[0].properties.type !== "Essay"
                      ? "<span class='italics'>" +
                        decodeEntities(record._fields[0].properties.title) +
                        "</span>. "
                      : decodeEntities(record._fields[0].properties.title) +
                        ". ";

                  if (edition.edition.properties.publisher) {
                    if (
                      edition.edition.properties.publisher &&
                      edition.edition.properties.publisher.endsWith(".")
                    ) {
                      publisherHtml += edition.edition.properties.publisher
                        ? "<a id='edition_span_publisher' class='ANCHOR publisher' href='#publisher?publisher=" +
                          encodeURIComponent(
                            edition.edition.properties.publisher
                          ) +
                          "'>" +
                          decodeEntities(decodeEntities(edition.edition.properties.publisher)) +
                          "</a>"
                        : " ";
                    } else {
                      publisherHtml +=
                        (edition.edition.properties.publisher
                          ? "<a id='edition_span_publisher' class='ANCHOR publisher' href='#publisher?publisher=" +
                            encodeURIComponent(
                              edition.edition.properties.publisher
                            ) +
                            "'>" +
                            decodeEntities(
                              edition.edition.properties.publisher
                            ) +
                            "</a>"
                          : " ") +
                        (record._fields[0].properties.type !== "Journal"
                          ? ". "
                          : ", ");
                    }
                  }
                  if (record._fields[0].properties.type === "Journal") {
                    editionField += publisherHtml;
                  }
                  if (
                    edition.edition.properties.title &&
                    edition.edition.properties.title !== ""
                  ) {
                    if (!edition.edition.properties.title.endsWith(".")) {
                      editionField +=
                        decodeEntities(edition.edition.properties.title) +
                        (record._fields[0].properties.type !== "Journal"
                          ? ". "
                          : "");
                    } else {
                      editionField +=
                        decodeEntities(edition.edition.properties.title) + " ";
                    }
                  }
                  if (record._fields[0].properties.type !== "Journal") {
                    editionField += publisherHtml;
                  }
                  if (edition.edition.properties.no) {
                    editionField +=
                      "(" + decodeEntities(edition.edition.properties.no) + ")";
                    if (edition.edition.properties.pages) {
                      editionField += ": ";
                    }
                  }
                  if (edition.edition.properties.pages) {
                    editionField +=
                      decodeEntities(edition.edition.properties.pages) + ".";
                  }
                }
                //add torrents
                if (all.indexOf(edition.torrent.uuid === -1)) {
                  all.push(edition.torrent.uuid);
                }
                
                switch (top10Table) {
                  case "top10_active":
                    top["top10_all_active"].push(edition.torrent.uuid);
                    break;
                  case "top10_day":
                    top["top10_all_day"].push(edition.torrent.uuid);
                    break;
                  case "top10_week":
                    top["top10_all_week"].push(edition.torrent.uuid);
                    break;
                  case "top10_month":
                    top["top10_all_month"].push(edition.torrent.uuid);
                    break;                 
                  case "top10_year":
                    top["top10_all_year"].push(edition.torrent.uuid);
                    break;
                  
                }

                if(ANCHOR.page() === "top10" || hashes.indexOf(edition.torrent.infoHash) === -1){

                  hashes.push(edition.torrent.infoHash)
                  var tr = "<tr>";
                  tr += "<td>" + edition.torrent.format + "</td>";          
                  
                  tr +=
                    "<td class='light'><p>" +
                    edition.torrent.snatches +
                    "</p></td>";
               /*   tr +=
                    "<td class='here'>" +
                    timeSince(edition.torrent.created_at) +
                    " ago</td>";*/
                  tr +=
                    "<td><a class='infoHash" +
                    "' href='magnet:?xt=urn:btih:" +
                    edition.torrent.infoHash + "&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337'" +
                    "id='edition_" +
                    edition.edition.properties.uuid +
                    "' data-torrent-uuid = '" +
                    edition.torrent.uuid +
                    "' data-infohash='" + edition.torrent.infoHash +
                    "'>[Magnet]</a></td>"
                  /*&nbsp;" + 
                    "<a href='#torrent?uuid=" + edition.torrent.uuid + "' id='add_torrent_tab' data-infohash='" + edition.torrent.infoHash +
                    "' data-title='" + record._fields[0].properties.title + "' class='ANCHOR torrent stream' href='#torrent?uuid=" + edition.torrent.uuid +
                    "' data-torrent-uuid = '" + edition.torrent.uuid + 
                     "'>[WebTorrent]</a></td>"*/
                 
                  tr += "</tr>";
                  table += tr;
                }
                

                if (
                  editionsAdded.indexOf(edition.edition.properties.uuid) === -1
                ) {
                  editionsAdded.push(edition.edition.properties.uuid);
                  records[
                    editionsAdded.indexOf(edition.edition.properties.uuid)
                  ] = [
                    "<img class='tableImg' id='source_" +
                      record._fields[0].properties.uuid +
                      "' src='" +
                      sourceIMG +
                      "'>" +
                      "<div class='torrentSource'><span class='sourceType'>" +
                      decodeEntities(
                        decodeEntities(
                          decodeEntities(record._fields[0].properties.type)
                        )
                      ) +
                      "</span>" +
                      "<div class='tableHeading'><a id='sourceTab' class='ANCHOR source' href='#source?uuid=" +
                      record._fields[0].properties.uuid +
                      "'>" +
                      ($(window).width() > 1079 ? (record._fields[0].properties.title.length > 226 ? decodeEntities(record._fields[0].properties.title.substring(0,225) + "..."): decodeEntities(record._fields[0].properties.title)) : decodeEntities(record._fields[0].properties.title).substring(0,75) +
                      (record._fields[0].properties.title.length > 76 ? "..." : "")) +
                      
                      "</a>" +
                      dateField +
                      authorField +
                      "</div><br><div class='torrentClasses normal'>" +
                      classesField +
                      "</div></div>",
                    "<span id='edition_" +
                      edition.edition.properties.uuid +
                      "_field'>" +
                      editionField +
                      "</span>",
                    
                    edition.edition.properties.snatches,
                    // edition.edition.properties.numPeers,
                    "<span id='edition_date'>" +
                      (edition.edition.properties.date && edition.edition.properties.date !== "undefined" &&
                      edition.edition.properties.date !==
                        record._fields[0].properties.date
                        ? record._fields[0].properties.date +
                          "/" +
                           edition.edition.properties.date
                        : record._fields[0].properties.date) +
                      "</span>",

                    timeSince(edition.edition.properties.created_at) + " ago",
                    table,
                  ];
                } else {
                  

                  records[
                    editionsAdded.indexOf(edition.edition.properties.uuid)
                  ][5] =
                    records[
                      editionsAdded.indexOf(edition.edition.properties.uuid)
                    ][5].slice(0, -16) + tr;
                }

              }
            }
          });
        });

        return records;
      },
    },
    drawCallback: function () {
      
      

      $(document).off("click", ".infoHash");

      $(document).on("click", ".infoHash", function (e) {
       
        $.post("/snatched/" + $(this).data('infohash'));
        console.log($(this).data("infohash"))
        
      });
      
      $(document).on("contextmenu", ".infoHash", function(e){
        $.post("/snatched/" + $(this).data('infohash'));
        console.log($(this).data("infohash"))
        
      });

     


      cb();
    },
   
  })
  
  setTimeout(function(){
    $(".infoHash").text("[Magnet]")
  },3000)
  
  $(window).on('resize', function(){
    $(".infoHash").text("[Magnet]")
    
  })
  //$('th').unbind('click.DT')
}


