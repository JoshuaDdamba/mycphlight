var access_token = "16384709.6ac06b4.49b97800d7fd4ac799a2c889f50f2587",
    access_parameters = {
        access_token: access_token
    };

var $slideshow  = document.getElementById('slideshow');
var $main = document.getElementById('main');
var slideN=0;
var slides = [];

var ajax = {};

// CREATE THE SEARCH FIELD
var search = document.createElement('input');
search.type = 'text';
search.className = 'tag';
search.name = 'tag';
search.id = 'tag';

// CREATE THE SUBMIT BUTTON
var submit = document.createElement('input');
submit.type = 'submit';
submit.value = 'fetch tags';


//**************************************************************************************************************************


var map = L.map($main).setView([55.710,12.529], 14);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={access_token}', {
    id: 'ddamba.ofm04n7i',
    access_token: 'pk.eyJ1IjoiZGRhbWJhIiwiYSI6Ik9vX1VPdmcifQ.nEbSOXJ-DWVGhiEY771xvg',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//********* create overlaping marker spiderfier Object ***********''
var overlappics = new OverlappingMarkerSpiderfier(map, {
  keepSpiderfied: true
});

//**************************************************************************************************************************

var featureMap = {};
function mapRegions(data) {
  console.log(data);
  var geojsonLayer = L.geoJson(data.features[21]);
  geojsonLayer.addTo(map);
}

function getRegions() {
  var xhttp = new XMLHttpRequest();
  var url = "/regions.geojson";
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      mapRegions(JSON.parse(xhttp.responseText));
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

getRegions();

// ABOVE THIS LINE, THE LOGIC:

// JSONP. See: http://stackoverflow.com/a/22780569/971008
function jsonp(url, callback) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
}

function showPopup(e) {

	var media = e.media;
  var popup = L.popup();
  popup.setLatLng(e._latlng);
  popup.setContent('<a onclick="map.closePopup()"><img width="300px" src="'+media.images.standard_resolution.url+'"/></a><br><a href="'+media.link+'">'+"Gå til Instagram-profil"+'</a>');
  popup.openOn(map);

}

overlappics.addListener('click', showPopup);


function addToMap(media) {

  var icon = L.icon({
    iconUrl: media.images.thumbnail.url,
    iconSize: [40, 40]
  });


  var marker = L.marker([media.location.latitude, media.location.longitude], {icon:icon});
	// augments the media object with the media.
	marker.media = media;




  //marker.bindPopup('<img width="300px" src="'+media.images.standard_resolution.url+'"/><a href="'+media.link+'">'+"Til instagram profil"+'</a>')
  //clusterGroup.addLayer(marker)


  //map.addLayer(clusterGroup);
  //marker.addTo(map);
  map.addLayer(marker);
  overlappics.addMarker(marker);


  /*overlappics.addListener('spiderfy', function(marker) {
   map.closePopup();
  });*/


  //marker.on('click', showPopup);
  //marker.bindPopup('<a onclick=""><img width="300px" src="'+media.images.standard_resolution.url+'"/></a>')
}


function addToList(media) {

  var img = document.createElement('img');
  img.src = media.images.thumbnail.url;


  var link = document.createElement('a');
  link.appendChild(document.createTextNode(media.link));
  link.href = media.link;

  $mainLeft.appendChild(img);
  $mainLeft.appendChild(link);
  $mainLeft.appendChild(document.createElement('br'));
}
// slide show
function showSlide() {

  if(slides.length > 0) {

		if(slideN > slides.length-1) slideN = 0;
		if(slideN < 0) slideN = slides.length -1;

    var wrapper = document.createElement('div');
    var img = document.createElement('img');


      img.src = slides[slideN].images.standard_resolution.url;//.replace("s640x640","s1024x1024");
    var link = document.createElement('a');
    var linkHolder = document.getElementById("linktoInst");
    link.href = slides[slideN].link;
    linkHolder.innerHTML= '<a href="'+slides[slideN].link+'">Gå til Instagram-profil</a>'
    link.appendChild(img);

    $slideshow.innerHTML = '';
    $slideshow.appendChild(link);

  }

  //setTimeout(function () {
  //  showSlide(++slideN)
  //}, 3000);

}


function addToSlideShow(media) {

  /*var figure = document.createElement('figure');
  var img = document.createElement('img');
  img.src = media.images.thumbnail.url;
  figure.appendChild(img);
  $miscMiddle.appendChild(figure);*/
  slides.push(media);

}

function fetchGrams (tag, count, access_parameters) {


  var url = 'https://api.instagram.com/v1/tags/'+tag+'/media/recent?callback=?&count='+count+'&access_token='+access_parameters.access_token;
  // 16384709.6ac06b4.49b97800d7fd4ac799a2c889f50f2587';
  jsonp(url, function(response) {

    if(response.data.length) {
      for(var i in response.data) {
        addToSlideShow(response.data[i]);
        if(response.data[i].location !== null) {
          addToMap(response.data[i]);
        } else {
          //addToList(response.data[i]);
        }
      }
      showSlide(1);
    } else {
      $main.innerHTML("No content found");
    }
  });
}

fetchGrams('SpotNV', 3000, access_parameters);

/*function handleFormSubmission(e) {

  var tag = this.tag.value;
  if (e.preventDefault) e.preventDefault();
  console.log("value:" , tag);
  if(tag.length) {
    fetchGrams(tag, 40, access_parameters);
  }
  return false;
}*/

