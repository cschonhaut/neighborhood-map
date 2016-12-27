	var map;
	var markers = [];

	function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8309, lng: -77.2311},
		zoom: 16
	});
	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	//Below uses the location arrary to create an array of markers on the init function
	for (var i = 0; i < vm.locationList().length; i++) {
		//Get position from location array
		var position = vm.locationList()[i].location;
		var title = vm.locationList()[i].title;
		var address = vm.locationList()[i].address;
		var phone = vm.locationList()[i].phone;

		//Create a marker for each location, and put into markers array
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			address: address,
			phone: phone,
			animation: google.maps.Animation.DROP,
			id: i
		});
		marker.addListener('click', toggleBounce);
		//Push the marker to the marker array
		//markers.push(marker);
		vm.locationList()[i].marker = marker;
		//console.log('Location List: '+vm.locationList()[i].marker.title);
		//Extend boundaries of map if needed
		bounds.extend(marker.position);
		//Onclick event to open info window
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
	}
	map.fitBounds(bounds);

	// Responsiveness
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});
}

	$('.sidebar-open').click(function (e) {
  	$('.sidebar-list').toggleClass('expand');
	});

	var locations = [
		{
			title: 'The Ragged Edge Coffee House',
			location: {lat: 39.830697, lng: -77.233677},
			address: '110 Chambersburg St.',
			phone: '717-334-4464',
			yelpID: 'the-ragged-edge-coffee-house-gettysburg'
		},

		{
			title: 'The Ugly Mug Cafe',
			location: {lat: 39.833721, lng: -77.231317},
			address: '168 Carlisle St.',
			phone: '717-398-2011',
			yelpID: 'the-ugly-mug-cafe-at-cockles-corner-gettysburg'
		},

		{
			title: 'Garryowen Irish Mub',
			location: {lat: 39.830703, lng: -77.234127},
			address: '126 Chambersburg St.',
			phone: '717-337-2719',
			yelpID: 'the-garryowen-irish-pub-gettysburg'
		},

		{
			title: 'Blue and Gray Bar & Grill',
			location: {lat: 39.830495, lng: -77.230845},
			address: '2 Baltimore St.',
			phone: '717-334-1999',
			yelpID: 'blue-and-gray-bar-and-grill-gettysburg'
		},

		{
			title: 'The Pub',
			location: {lat: 39.830361, lng: -77.231099},
			address: '2 Lincoln Sq.',
			phone: '717-334-7100',
			yelpID: 'the-pub-and-restaurant-gettysburg'
		},

		{
			title: 'Sydney Willoughby Run',
			location: {lat: 39.811368, lng: -77.225978},
			address: '730 Chambersburg Rd.',
			phone: '717-334-3774',
			yelpID: 'sidney-willoughby-run-gettysburg'
		},

		{
			title: 'Tommys Pizza',
			location: {lat: 39.822148, lng: -77.232845},
			address: '105 Steinwehr Ave.',
			phone: '717-334-4721',
			yelpID: 'tommys-pizza-gettysburg'
		},

		{
			title: 'La Bella Italia',
			location: {lat: 39.832968, lng: -77.223382},
			address: '402 York St.',
			phone: '717-334-1978',
			yelpID: 'la-bella-italia-gettysburg'
		}
	];

	// var markers = function(data){
	// 	this.title = ko.observable(data.title);
	// 	this.lat = ko.observable(data.lat);
	// 	this.lng = ko.observable(data.lng);
	// 	this.address = ko.observable(data.address);
	// 	this.phone = ko.observable(data.phone);
	// 	this.marker = ko.observable();
	// };

	function viewModel() {
		var self = this;
		self.locationList = ko.observableArray();
		locations.forEach(function(location) {
			self.locationList.push(location);
		});
	}

	// marker animation upon list click
	function controlMarker(location){
		//var ourMarker = google.maps.getMarker();
		//google.maps.event.trigger(ourMarker, toggleBounce)
		console.log(location);
		getYelpData(location);
		google.maps.event.trigger(location.marker, 'click');
	}
	var vm = new viewModel();
	ko.applyBindings(vm);
	$( document ).ready(function(){
	});

	// marker animation upon marker click
	function toggleBounce() {
		var self = this;
		if (self.getAnimation() !== null) {
  			self.setAnimation(null); // stopping the animation on a second click
		} else {
  			self.setAnimation(google.maps.Animation.BOUNCE);
  			setTimeout(function(){
  				self.setAnimation(null);
  			}, 1500);
	  		}
		}

	//Function that populates the info window upon clicking. Only one window can open at a time.
	function populateInfoWindow(marker, infowindow) {
		//Make sure infowindow is not already opened on this marker
		if (infowindow.marker !=marker) {
			infowindow.marker = marker;
			infowindow.setContent('<div><strong>' + marker.title + '</strong><br>' + marker.address + '<br>' + marker.phone + '</div>');
			infowindow.open(map, marker);
			//Make sure info clears if closed
			infowindow.addListener('closeclick', function(){
				infowindow.setMarker(null);
			});
		}
	}

	var googleError = function() {
				alert('Google Maps is not currently available')
			};


// Yelp Functionality

function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
};

function getYelpData(location){
    var yelpID = location.yelpID;
    var auth = {
             yelp_key: "L7ggInri9G0tCkmKmjf7aw",
				yelp_token: "ZH_WIQdU26QTB3E1N0TCk75d1ww7qo_g",
				yelp_key_secret: "87CtC0_r6MgY31pVxyw89M9XKM8",
				yelp_token_secret: "3AZO_Hj67qAp-zqXEuAOnDlIuFo",
    };

    var yelp_url = "http://api.yelp.com/v2/business/" + yelpID;

    var parameters = {
    oauth_consumer_key: auth.yelp_key,
    oauth_token: auth.yelp_token,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oath_version: '1.0',
    callback: 'cb',
    // radius_filter: 16093.4, // 10 miles
    // term: 'food',
    // location: 'Gettysburg PA',
    // sort: '0'
    // limit: 1
	};

	var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, auth.yelp_key_secret, auth.yelp_token_secret);
    parameters.oauth_signature = encodedSignature;

	var settings = {
		      url: yelp_url,
		      data: parameters,
		      cache: true,
		      dataType: 'jsonp',
		      success: function(results) {

             	// Concatination for Yelp API data
             	content = '<h3>'+results.name+'</h3><br>'
				 		  +'<img src="'+results.rating_img_url+'" alt="Star Rating"><br>'
						  +'<img src="'+results.image_url+'" alt="'+results.name+'"><br>'
						  +'<a href="tel:'+results.display_phone+'">'+results.display_phone+'</a><br>'
						  +'<a href ="'+results.url+'">View on Yelp</a>';

                  $("#location_details").empty().append(content);

		      },
		      error: function() {
		        // Error handling
		        $("#location_details").append('<p>Try again.</p>');
		      }
		   };
		   $.ajax(settings);
		}
		//getYelpData(locations[0]);

