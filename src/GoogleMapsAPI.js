import React from 'react';
import ReactDOMServer from 'react-dom/server'
/* global google */
const key = 'AIzaSyDbLLEvUq8BW8O6UDAP4jlDAHnJ3jNC6do'

/* The google maps api works a bit differently with React, to enable everything to work without a framework like google-maps-react (which limits functionality)
the script/map needs to be loaded asyncronously. Also to keep things tidy anything google maps related, suce as markers and infowindows are dealt with in this component */
export const LoadMap = (props, AddPinsToArray, GetMap, HandleInfoWindow, InfoWindowX) => {
  window.initMap = initMap;

  loadJS('https://maps.googleapis.com/maps/api/js?key=' + key + '&callback=initMap')

  function loadJS (src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  /* First we build the map, we disable stylers and functionality to keep things simple. Otherwise it's just a webpage containing google maps */
  function initMap () {
    let markersArray = []

    let map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 16,
        disableDefaultUI: true,
        clickableIcons: false,
        draggable: false,
        zoomControl: false,
        disableDoubleClickZoom: true,
        styles: [
          {
            featureType: 'poi', stylers: [{visibility: 'off'}]
          },
        ],
      }
    )

    let bounds = new google.maps.LatLngBounds()

    const defaultIcon = makeMarkerIcon('0091ff')
    const highlightedIcon = makeMarkerIcon('ffa64d')

    /* Once the map is created the locations array is accessed from state (passed down as props) for each location a marker is created.
    For the imageUrl it grabs it's url form state */
    props.locations.forEach(location => {
      let lat = parseFloat(location.location.lat)
      let lng = parseFloat(location.location.lng)

      let marker = new google.maps.Marker({
        name: location.name,
        address: location.location.address,
        position: {lat, lng},
        placeId: location.id,
        map: map,
        animation: google.maps.Animation.DROP,
        infowindow: false,
        categories: location.categories[0].name,
        icon: defaultIcon,
        imgUrl: location.imgUrl,
      })

      bounds.extend({lat, lng})
      marker.tabindex = 0

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      })
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      })

      marker.addListener('click', () => {
        createInfoWindow(map, marker, props, HandleInfoWindow, InfoWindowX)
      })

      marker.addListener('click', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(()=> {
          marker.setAnimation(null)
        }, 1000)
      })
      map.fitBounds(bounds)
      /* Once all markers have been created and the bounds has been set, the getmap method is called and passed in the map object and bounds parameters for later use */
      GetMap(map, bounds)
      markersArray.push(marker)
    })

    /* The markers have also been pushed to an array which is passed through to AddPinsToArray, this method sets the state using this array, again for later use */
    AddPinsToArray(markersArray)



    function makeMarkerIcon (markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=restaurant|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(24, 35),
        new google.maps.Point(0, 0),
        new google.maps.Point(0, 0),
        new google.maps.Size(24,35));
        return markerImage;
      }
  }

}

/* The createinfowindow function is accessed from within multiple components and so is exported. */
export function createInfoWindow(map, marker, props, HandleInfoWindow, InfoWindowX) {
  /* The content must first be created as a function using jsx, then a variable is created using ReactDomServer and renter to string */
  function InfoWindowContent() {
    return(
      <div id='infowindow-content' tabindex='0'>
        <div id='img-container'>
          <img id='restaurant-img' src={marker.imgUrl} alt={`${marker.name} restaurant`} tabindex='0' />
        </div>
        <div id='inner-infowindow' tabindex='0'>
          <h3>Name: {marker.name}</h3>
          <div>
          {marker.address ?
            (
              <div>
                <h4>Address: </h4>
                <p>{marker.address},</p>
                <p>Amsterdam</p>
              </div>
            )
              :
            (
              <div>
                <p><i>No address found</i></p>
              </div>
            )
            }
            <h4>Category:</h4>
              <p>{marker.categories}</p>
          </div>
        </div>
      </div>
    )
  }
  const info_content = ReactDOMServer.renderToString(<InfoWindowContent />)

  if(marker.infowindow === false) {
    let infowindow = new google.maps.InfoWindow({
      content: info_content,
    })
    HandleInfoWindow(infowindow, marker)
    infowindow.open(map, marker)
    map.setCenter(marker.position)
    setTimeout(() => {
      /* To use a googlemaps infowindow comfortably I have grabbed the infowindow parent div and then used this to also grab the X button for use */
      let infowindowParent = document.querySelector('.gm-style-iw')
      infowindowParent.parentNode.classList.toggle('infowindow-styler')
      infowindowParent.focus()

      /* The X button closes the window but doesn't work with other function and booleans which prevent multiple windows and close previous windows. So a separate
      method is created which is called when pressing the X button */
      let infoX = infowindowParent.nextSibling
      infoX.addEventListener('click', () => InfoWindowX())
    },100)
    marker.infowindow = true
    /* If the map is clicked, all current infowindows are closed and markers are reset */
    map.addListener('click', () => {
      infowindow.close()
      marker.infowindow = false
      props.markers.map(marker => marker.setLabel(null))
    })
  }
}
