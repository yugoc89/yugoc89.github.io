;( function( window ) {

	function GoogleMap(callback) {
			
		// Create an array of styles.
		var styles = [
			{
			  stylers: [
				{ hue: "#19ccc" },
				{ saturation: "-10" },
				{ lightness: "-100" }
			  ]
			},{
			  featureType: "road",
			  elementType: "geometry",
			  stylers: [
				{ visibility: "off" }
			  ]
			},{
			  featureType: "road",
			  elementType: "labels",
			  stylers: [
				{ visibility: "off" }
			  ]
			},{
			  featureType: "administrative",
			  elementType: "all",
			  stylers: [
				{ visibility: "off" }
			  ]
			},{
			  featureType: "administrative",
			  elementType: "all",
			  stylers: [
				{ saturation: "0" },
				{ lightness: "0" },
			  ]
			},{
			  featureType: "landscape",
			  elementType: "all",
			  stylers: [
				{ lightness: "30" }
			  ]
			},{
			  featureType: "all",
			  elementType: "labels",
			  stylers: [
				{ visibility: "off" }
			  ]
			}

		];

		var marker = [];
		var contentString = [];
		var infobox;
		var number;
		var i;

		var locations = [
			['Belgium',50.8387,4.363405,0],
			['England',51.5286416,-0.1015987,0],
			['France',48.8588589,2.3470599,0],
			['Germany',52.5075419,13.4261419,0],
			['Poland',52.232938,21.0611941,0],
			['Japan',35.673343,139.710388,0],
			['Peru',-9.189967,-75.015152,0],
			['Scotland',55.8554602,-4.2324586,0],
			['Spain',40.4378271,-3.6795367,0],
		];


		var styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'});

		var mapOptions = {
			zoom: 3,
			disableDefaultUI: true,
			center: new google.maps.LatLng(51.5286416, -0.1015987),
			mapTypeControlOptions: {
				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
			}
		};
		
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		var icon1 = '/assets/images/common/point.png';
		var boxText = document.getElementById('infobox');
		var texts = boxText.querySelectorAll('.googleMap-link');

		for (i = 0; i < texts.length; i++) {  

			marker[i] = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map,
				icon: icon1,
				animation: google.maps.Animation.DROP
		  	});

			//contentString[i] = '<a class="googleMap-link" href="/countries/' + locations[i][0] + '.html" onclick="callback()">' + locations[i][0] + '</a>';

			countries(marker[i], i);
		}

		function countries(marker, number) {

			var myOptions = {
				content: texts[number],
				disableAutoPan: false,
				maxWidth: 150,
				pixelOffset: new google.maps.Size(0, 0),
				zIndex: 99,
				boxStyle: { 
					background: '#fff',
					opacity: 1,
					width: "140px",
					//border: '1px solid #1ac'
				},

				infoBoxClearance: new google.maps.Size(1, 1),
				isHidden: false,
				pane: "floatPane",
				enableEventPropagation: true
			};

		  	google.maps.event.addListener(marker, 'mouseover', function() {
				infobox = new InfoBox(myOptions);
				//infobox.setContent(contentString[number]);
				infobox.open(map,this);
			});
			google.maps.event.addListener(marker, 'mouseout', function() {
				infobox.close();
			});
		}

		map.mapTypes.set('map_style', styledMap);
		map.setMapTypeId('map_style');

		google.maps.event.addListener(marker, 'click', function() {
			map.setZoom(5);
			map.setCenter(marker.getPosition());
		});

		if (callback) {
			callback();
		}
	}

	window.GoogleMap = GoogleMap;

})( window );
	