$(function () {
  $("#searchBtn").click(function () {
    var val = $("#searchInput").val();
    var url = "http://ec2-52-78-185-227.ap-northeast-2.compute.amazonaws.com/verse/bible?version=kor&bibleName=1pet&startChapter=5&endChapter=5&startVerse=3&endVerse=4";
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
