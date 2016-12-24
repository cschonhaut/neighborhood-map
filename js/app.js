	var map;
	var markers = [];

	function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8309, lng: -77.2311},
		zoom: 16
	});
	var largeInfowindow = new google.maps.InfoWindow();
	var bounds = new google.maps.LatLngBounds();
	console.log(vm);
	//Below uses the location arrary to create an array of markers on the init function
	for (var i = 0; i < vm.locationList().length; i++) {
		//Get position from location array
		var position = vm.locationList()[i].location;
		var title = vm.locationList()[i].title;
		//Create a marker for each location, and put into markers array
		var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
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

	var locations = [
		{title: 'The Ragged Edge', location: {lat: 39.830697, lng: -77.233677}},
		{title: 'The Ugly Mug', location: {lat: 39.833721, lng: -77.231317}},
		{title: 'Garryowen Irish Mub', location: {lat: 39.830703, lng: -77.234127}},
		{title: 'Blue and Gray', location: {lat: 39.830495, lng: -77.230845}},
		{title: 'The Pub', location: {lat: 39.830361, lng: -77.231099}},
		{title: 'Sydney Willoughby Run', location: {lat: 39.811368, lng: -77.225978}},
		{title: 'Tommys Pizza', location: {lat: 39.822148, lng: -77.232845}},
		{title: 'La Bella Italia', location: {lat: 39.832968, lng: -77.223382}}
	];

	function viewModel() {
		var self = this;
		self.locationList = ko.observableArray();
		locations.forEach(function(location) {
			self.locationList.push(location);
		});
	}
	function controlMarker(location){
		//alert('control mark this');
		var ourMarker = google.maps.getMarker('The Ragged Edge')
		google.maps.event.trigger(ourMarker, toggleBounce)
	}
	var vm = new viewModel();
	ko.applyBindings(vm);
	$( document ).ready(function(){
	});

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
			infowindow.setContent('<div>' + marker.title + '</div>');
			infowindow.open(map, marker);
			//Make sure info clears if closed
			infowindow.addListener('closeclick', function(){
				infowindow.setMarker(null);
			});
		}
	}
