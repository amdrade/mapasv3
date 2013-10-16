var map;
var idInfoBoxAberto;
var infoBox = [];
var markers = [];
var coords = [];

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
			coords.push(new google.maps.LatLng(ponto.Latitude, ponto.Longitude));
		});
	});
}


function carregarPontos() {
	 
	$.getJSON('js/pontos.json', function(pontos) {
		
		var latlngbounds = new google.maps.LatLngBounds();
		var i = 0;
		$.each(pontos, function(index, ponto) {
			
			var interval = setInterval(function() {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
					title: "Meu ponto personalizado! :-D",
					icon: 'img/marcador.png',
					animation: google.maps.Animation.DROP,
					map: map
				});	

				var myOptions = {
					content: "<p>" + ponto.Descricao + "</p>",
					pixelOffset: new google.maps.Size(-150, 0)
        		};

				infoBox[ponto.Id] = new InfoBox(myOptions);
				infoBox[ponto.Id].marker = marker;
			
				infoBox[ponto.Id].listener = google.maps.event.addListener(marker, 'mouseover', function (e) {
					abrirInfoBox(ponto.Id, marker);
				});
			
				markers.push(marker);
			
				latlngbounds.extend(marker.position);
				console.log(pontos.length);
				i++;
				if(i >= pontos.length)
					clearInterval(interval);
			},1000);
		});
		
		var markerCluster = new MarkerClusterer(map, markers);
		
		map.fitBounds(latlngbounds);		
		
	});
	
}

carregarPontos();