$(function () {
  $("#searchBtn").click(function () {
    var val = $("#searchInput").val();
    var url = "http://localhost:3000/api/test";
    // $.post( url , {
    //   value: val,
    // }, function(jqXHR) {
    //   alert( "success" );
    // }, 'json' /* xml, text, script, html */)
    //   .done(function(jqXHR) {
    //     alert( "second success" );
    //   })
    //   .fail(function(jqXHR) {
    //     alert( "error" );
    //   })
    //   .always(function(jqXHR) {
    //     alert( "finished" );
    //   });


    $.get( url, function(jqXHR) {
      alert( "success" );
    }, 'json' /* xml, text, script, html */)
      .done(function(jqXHR) {
        alert( "second success" );
      })
      .fail(function(jqXHR) {
        alert( "error" );
      })
      .always(function(jqXHR) {
        alert( "finished" );
      });


  })
});
