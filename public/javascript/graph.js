// create an array with nodes
var network;
var nodes, edges;


//Global options
var options = {
    nodes: {
        shape: 'ellipse',
        scaling: {
            min: 10,
            max: 20,
            label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 }
        },
        font: { size: 17, face: 'Helvetica Neue, Helvetica, Arial' }
    },
    interaction: {
        hover: true,
        hoverConnectedEdges: false,
        selectConnectedEdges: true
    },
};
makeNetwork();

$(document).ready(function() {
    $("#searchBtn").click(function() {
        console.log("search button cliked");
        var searchingWord = $("#searchInput").val();
        console.log(searchingWord);
        search(searchingWord);
    });
})

function search(keyword) {
    setData(keyword);
    makeNetwork();
}

function setData(upKeyword) {
    var jsonData = '{"success":"1","result":[{"label":"Machine Learning"}, {"label": "BigData"}, {"label": "Virtual Reality"}, {"label": "Augmented Reality"} ]}';

    var parsedData = JSON.parse(jsonData);

    var nodeData = [];
    var edgeData = [];

    nodeData.push({ id: 0, label: upKeyword }, );
    for (var i = 0; i < parsedData.result.length; i++) {
        nodeData.push({ id: (i + 1), label: parsedData.result[i].label });
        edgeData.push({ from: 0, to: (i + 1) });
    }

    console.log(nodeData);
    console.log(edgeData);


    // create nodes
    nodes = new vis.DataSet(nodeData);
    // create an array with edges
    edges = new vis.DataSet(edgeData);
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
        var label = nodes.get(selectedKeyword).label
        console.log(label);
        search(label);
    }
}