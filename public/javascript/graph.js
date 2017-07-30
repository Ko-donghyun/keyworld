// create an array with nodes
var network;
var nodes, edges;
var searchKeywords = [];
var preKeyword;
var currentParams = null;
var nodeSize = 0;

//Global options
var options = {
    nodes: {
        shape: 'circle',
        scaling: {
            min: 10,
            max: 25,
            label: { min: 14, max: 30, drawThreshold: 9, maxVisible: 20 }
        },
        font: { size: 25, face: 'Helvetica Neue, Helvetica, Arial' }
    },
    interaction: {
        hover: true,
        hoverConnectedEdges: false,
        selectConnectedEdges: true
    },
};
makeNetwork();

function reset() {
    preKeyword = undefined;
    keyword = undefined;
    searchKeywords = [];
}

$(document).ready(function() {

    $('#searchInput').keypress(function(e) {
        if (e.which == '13') {
            e.preventDefault();
            reset();

            var searchingWord = $("#searchInput").val();
            $("#searchInput").blur();
            search(searchingWord);
        }
    });
    $("#searchBtn").click(function() {
        reset();
        var searchingWord = $("#searchInput").val();
        search(searchingWord);
    });
})

function search(keyword) {
    if (keyword === searchKeywords[0]) {
        searchKeywords[0] = undefined;
        searchKeywords[1] = keyword;
        $("#searchInput").val(keyword);
    } else if (preKeyword !== undefined) {
        searchKeywords[0] = preKeyword;
        searchKeywords[1] = keyword;
        $("#searchInput").val(preKeyword + ", " + keyword);
    } else {
        searchKeywords[1] = keyword;
        $("#searchInput").val(keyword);
    }
    var jsonData;
    if (searchKeywords[0] != undefined) {
        url = "/keyword/extension?keyword=" + searchKeywords[1] + "&previousKeyword=" + searchKeywords[0];
    } else {
        url = "/keyword?keyword=" + searchKeywords[1];
    }

    $.get(url, function(jqXHR) {}, 'json' /* xml, text, script, html */ )
        .done(function(jqXHR) {})
        .fail(function(jqXHR) {
            alert("error");
        })
        .always(function(jqXHR) {
            //alert("finished");
            jsonData = jqXHR;

            setData(keyword, jsonData);
            makeNetwork();
        });
}

function setData(upKeyword, jsonData) {
    if (searchKeywords[0] !== undefined) {
        addSearchNode(upKeyword, jsonData);
    } else {
        addDataNode(upKeyword, jsonData);
    }
}

function addSearchNode(upKeyword, jsonData) {
    var nodeData = [];
    var edgeData = [];

    nodeData.push({ id: 0, label: upKeyword, color: { background: '#ffffff', border: '#e68307', hover: { background: '#F59304', border: '#e68307' }, highlight: { background: '#F59304', border: '#e68307' } } });

    for (var i = 0; i < jsonData.result.length; i++) {
        nodeData.push({
            id: (i + 1),
            shape: 'icon',
            label: jsonData.result[i].label,
            font: {
                color: '#000000'
            },
            icon: {
                face: 'Ionicons',
                code: '\uf4a5',
                size: 50,
                color: '#000000'
            }
        });
        edgeData.push({
            from: 0,
            to: (i + 1),
            size: 30,
            scaling: { min: 5 },
        });
    }
    if (searchKeywords[0] !== upKeyword && searchKeywords[0] !== undefined) {
        nodeData.push({ id: jsonData.result.length + 1, label: preKeyword, color: '#9f9faa' });
        edgeData.push({ from: 0, to: jsonData.result.length + 1, arrows: 'from', color: '#9f9faa' });
    }
    // create nodes
    nodes = new vis.DataSet(nodeData);
    // create an array with edges
    edges = new vis.DataSet(edgeData);
    preKeyword = upKeyword;
}

function addDataNode(upKeyword, jsonData) {
    var nodeData = [];
    var edgeData = [];

    nodeData.push({ id: 0, label: upKeyword, color: { background: '#ffffff', border: '#e68307', hover: { background: '#F59304', border: '#e68307' }, highlight: { background: '#F59304', border: '#e68307' } } });
    for (var i = 0, ii = jsonData.result.length; i < ii; i++) {
        nodeData.push({ id: (i + 1), label: jsonData.result[i].label, font: { size: 15 }, color: { background: '#ffffff', border: '#6d9b77', hover: { background: '#85BD91', border: '#6d9b77' }, highlight: { background: '#85BD91', border: '#6d9b77' } } });
        edgeData.push({ from: 0, to: (i + 1), color: '#6d9b77' });
    }
    if (searchKeywords[0] !== upKeyword && searchKeywords[0] !== undefined) {
        nodeData.push({ id: jsonData.result.length + 1, label: preKeyword, color: '#9f9faa' });
        edgeData.push({ from: 0, to: jsonData.result.length + 1, arrows: 'from', color: '#9f9faa' });
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

$("#mynetwork").contextmenu(function(e) {
    //Do something
    e.preventDefault();
    e.stopPropagation();
});


function bindNetwork() {
    network.on("click", expandEvent);
    network.on("oncontext", rightMouseClickEvent);
    network.on("hoverNode", function(params) {
        currentParams = params;
    });
    network.on("blurNode", function(params) {
        currentParams = null;
    });
}

function expandEvent(params) { // Expand a node (with event handler)
    if (params.edges.length === 0) return;

    var selectedKeyword = params.nodes[0]; //The id of the node clicked
    if (nodes.get(selectedKeyword) === null) return;
    var label = nodes.get(selectedKeyword).label;
    label = label.trim();
    if (searchKeywords[0] !== undefined && searchKeywords[1] !== undefined && searchKeywords[0] !== label && searchKeywords[1] !== label) {
        //구글로 이동
        //https://www.google.com/search?q=apple+ipad+jobs&oq=apple+ipad+jobs
        src = "https://www.google.com/search?q=" + searchKeywords[0] + "+" + searchKeywords[1] + "+" + label +
            "&oq=" + searchKeywords[0] + "+" + searchKeywords[1] + "+" + label;
        var newWinodow = window.open("about:black");
        newWinodow.location.href = src
    } else if (params.nodes.length) { //Did the click occur on a node?

        if (preKeyword !== label) {
            search(label);
        }
    }
}

function rightMouseClickEvent(params) {
    if (currentParams === null) return;
    var tempNodes = nodes.get();
    for (var i = 0, ii = nodes.length; i < ii; i++) {
        if (currentParams.node == tempNodes[i].id) {
            selectedKeyword = tempNodes[i].label;
        }
    }
    if (selectedKeyword === searchKeywords[1]) {
        return;
    }
    $("#askWord").html(selectedKeyword);
    $('#delModal').modal('show');
}

$("#addKeywordBtn").click(function() {
    var url = "/keyword";
    var val = $("#addKeywordVal").val();
    var obj = { keyword: preKeyword, newKeyword: val };


    if (searchKeywords[0] !== undefined) {
        url += '/extension';
        obj = { previousKeyword: searchKeywords[0], keyword: preKeyword, newKeyword: val };
    }
    $.post(url, obj, function(jqXHR) {
            //success
        }, 'json' /* xml, text, script, html */ )
        .done(function(jqXHR) {
            console.log(val);
            var node = {
                id: nodes.length + 1,
                label: val,
                font: { size: 15 },
                color: {
                    background: '#ffffff',
                    border: '#6d9b77',
                    hover: { background: '#85BD91', border: '#6d9b77' },
                    highlight: { background: '#85BD91', border: '#6d9b77' }
                }
            };
            var edge = { from: 0, to: nodes.length + 1, color: '#6d9b77' };
            nodes.add(node);
            edges.add(edge);
        })
        .fail(function(jqXHR) {
            alert("error");
        })
        .always(function(jqXHR) {
            $('#addModal').modal('toggle');
        });
});

$("#delKeywordBtn").click(function() {
    var url = "/keyword/report";
    var val = $("#askWord").text();
    var email = $("#forDelEmail").val();
    var obj = { ancestorKeyword: searchKeywords[0], parentKeyword: preKeyword, keyword: val, email: email };

    $.post(url, obj, function(jqXHR) {
            //success
        }, 'json' /* xml, text, script, html */ )
        .done(function(jqXHR) {})
        .fail(function(jqXHR) {
            alert("error");
        })
        .always(function(jqXHR) {
            $('#delModal').modal('toggle');
        });
});

$('.modal').on('hidden.bs.modal', function(e) {
    $("#forDelEmail").val("");
    $("#addKeywordVal").val("");
});