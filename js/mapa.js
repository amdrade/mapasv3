var map;
var idInfoBoxAberto;
var infoBox = [];
var markers = [];
var coords = new Array();

function initialize() {	
	var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
	
    var options = {
        zoom: 5,
		center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);
}

initialize();

function abrirInfoBox(id, marker) {
	if (typeof(idInfoBoxAberto) == 'number' && typeof(infoBox[idInfoBoxAberto]) == 'object') {
		infoBox[idInfoBoxAberto].close();
	}

	infoBox[id].open(map, marker);
	idInfoBoxAberto = id;
}

function carregarCoordenadas(){
	$.getJSON('js/pontos.json', function(pontos) {
		$.each(pontos, function(index, ponto) {
			coords.push({p:new google.maps.LatLng(ponto.Latitude, ponto.Longitude),'Id':ponto.Id,'Descricao':ponto.Descricao});
		});
	});
}

carregarCoordenadas();
function marcarPontos(){
	var latlngbounds = new google.maps.LatLngBounds();
	var i = 0;
	console.log(coords[i]);
	var interval = setInterval(function(){
		var marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			position: coords[i].p
		});
		
		var myOptions = {
					content: "<p>" + coords[i].Descricao + "</p>",
					pixelOffset: new google.maps.Size(-150, 0)
        		};
var id = coords[i].Id;
		infoBox[coords[i].Id] = new InfoBox(myOptions);
		infoBox[coords[i].Id].marker = marker;
			
		infoBox[coords[i].Id].listener = google.maps.event.addListener(marker, 'mouseover', function (e) {
			abrirInfoBox(id, marker);
		});
		
		markers.push(marker);
			
		latlngbounds.extend(marker.position);

		i++;
		if(i>=coords.length){
			clearInterval(interval);
			var markerCluster = new MarkerClusterer(map, markers);
			map.fitBounds(latlngbounds);
		}
			
	},1000);
	
}


//carregarPontos();