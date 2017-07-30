// create an array with nodes
var network;
var nodes, edges;
var serachKeywords = [];
var preKeyword;

//Global options
var options = {
  nodes: {
    shape: 'ellipse',
    scaling: {
      min: 10,
      max: 25,
      label: {min: 14, max: 30, drawThreshold: 9, maxVisible: 20}
    },
    font: {size: 17, face: 'Helvetica Neue, Helvetica, Arial'}
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: false,
    selectConnectedEdges: true
  },
};
makeNetwork();

$(document).ready(function () {
  $("#searchBtn").click(function () {
    console.log("search button cliked");
    var searchingWord = $("#searchInput").val();
    search(searchingWord);
  });
})

function search(keyword) {

  var jsonData;
  var url = "http://localhost:3000/keyword?keyword=" + keyword;

  $.get(url, function (jqXHR) {
  }, 'json' /* xml, text, script, html */)
    .done(function (jqXHR) {
    })
    .fail(function (jqXHR) {
      alert("error");
    })
    .always(function (jqXHR) {
      //alert("finished");
      console.log(jqXHR);
      jsonData = jqXHR;
      setData(keyword, jsonData);
      makeNetwork();
    });


}

function setData(upKeyword, jsonData) {

  var nodeData = [];
  var edgeData = [];

  nodeData.push({id: 0, label: upKeyword});
  for (var i = 0; i < jsonData.result.length; i++) {
    if (preKeyword !== jsonData.result[i].label) {
      nodeData.push({id: (i + 1), label: jsonData.result[i].label});
      edgeData.push({from: 0, to: (i + 1)});
    }

  }
  if (preKeyword !== upKeyword && preKeyword !== undefined) {
    nodeData.push({id: jsonData.result.length + 1, label: preKeyword, color: '#9f9faa'});
    edgeData.push({from: 0, to: jsonData.result.length + 1, arrows: 'from', color: '#9f9faa'});
  }
  // create nodes
  nodes = new vis.DataSet(nodeData);
  // create an array with edges
  edges = new vis.DataSet(edgeData);
  preKeyword = upKeyword;
}

function makeNetwork() {
  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
  network = new vis.Network(container, data, options);
  bindNetwork();
}

function bindNetwork() {
  network.on("click", expandEvent);
}

function expandEvent(params) { // Expand a node (with event handler)
  if (params.nodes.length) { //Did the click occur on a node?
    var selectedKeyword = params.nodes[0]; //The id of the node clicked
    var label = nodes.get(selectedKeyword).label;
    if (preKeyword !== label) {
      search(label);
    }
  }
}


$("#addKeywordBtn").click(function() {
  var addKeywordVal = $("#addKeywordVal").val();
  console.log(addKeywordVal);
  var url = "http://localhost:3000/keyword";
  var val = $("#addKeywordVal").val();
  $.post(url, { keyword: preKeyword, newKeyword: val }, function (jqXHR) {
    //success
  }, 'json' /* xml, text, script, html */)
    .done(function (jqXHR) {
    })
    .fail(function (jqXHR) {
      alert("error");
    })
    .always(function (jqXHR) {
      $('#myModal').modal('toggle');
    });
})