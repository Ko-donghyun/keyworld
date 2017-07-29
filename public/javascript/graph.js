// create an array with nodes

var nodes, edges;

nodes = new vis.DataSet([
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Public' },
    { id: 3, label: 'hardware' },
    { id: 4, label: 'software' },
    { id: 5, label: 'California' },
    { id: 6, label: 'Tim Cook' },
    { id: 7, label: 'Steve Jobs' },
    { id: 8, label: 'Steve Wozniak' },
    { id: 9, label: 'iPhone' },
    { id: 10, label: 'iCloud' }
]);

// create an array with edges
edges = new vis.DataSet([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 },
    { from: 1, to: 6 },
    { from: 1, to: 7 },
    { from: 1, to: 8 },
    { from: 1, to: 9 },
    { from: 1, to: 10 }
]);

// create a network
var container = document.getElementById('mynetwork');

var data = {
    nodes: nodes,
    edges: edges
};
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
var network = new vis.Network(container, data, options);

function makeNetwork() {
    network = new vis.Network(container, data, options);
    bindNetwork();
}

function bindNetwork() {

}

function bind() {
    var findButton = document.getElementById('submit');
    findButton.onclick = function() {
        console.log("submit 클릭됨");
        searchNetworkFromInput();
    }
}

function searchNetworkFromInput() {
    var cf = document.getElementsByClassName("inputKeyword")[0];
    var input = cf.value;
    getData();
}

function getData() {
    var data = JSON.parse(inputData.json);
}