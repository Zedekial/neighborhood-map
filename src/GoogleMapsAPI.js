import React from 'react';
import ReactDOMServer from 'react-dom/server'
/* Create the Googlemaps API component which will fetch and return data, this will be exported and accessed by other components */
/* global google */
const key = 'AIzaSyDbLLEvUq8BW8O6UDAP4jlDAHnJ3jNC6do'

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
      })

      bounds.extend({lat, lng})

      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      })
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      })

      marker.addListener('click', () =>
        createInfoWindow(map, marker, props, HandleInfoWindow, InfoWindowX)
      )

      marker.addListener('click', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(()=> {
          marker.setAnimation(null)
        }, 1000)
      })
      map.fitBounds(bounds)
      GetMap(map, bounds)
      markersArray.push(marker)
    })
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


/*  Fix this function. Not finished. */
export function getPhotos (locations) {
  locations.forEach(location => {
    let photoUrl = ''
    let lat = location.venue.location.lat
    let lng = location.venue.location.lng
    fetch('https://maps.googleapis.com/maps/api/streetview?size=400x400&location=' + lat + ',' + lng + '&fov=90&heading=35&pitch=10&key=' + key)
    .then(results => {
      photoUrl = results
      return photoUrl
    })
  })
}

export function createInfoWindow(map, marker, props, HandleInfoWindow, InfoWindowX) {
  function InfoWindowContent() {
    return(
      <div id='infowindow-content'>
        <h3>Name: {marker.name}</h3>
        <div>
          <h4>Address: </h4>
            <p>{marker.address}</p>
          <h4>Categories:</h4>
            <p>{marker.categories}</p>
        </div>
        <ul>
          <span><b><u>Hours</u></b></span>
          <li>Monday: </li>
          <li>Tuesday: </li>
          <li>Wednesday: </li>
          <li>Thursday: </li>
          <li>Friday: </li>
          <li>Saturday: </li>
          <li>Sunday: </li>
        </ul>
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
    setTimeout(() => {
      let infowindowParent = document.querySelector('.gm-style-iw')
      infowindowParent.parentNode.classList.toggle('infowindow-styler')

      let infoX = infowindowParent.nextSibling
      infoX.addEventListener('click', () => InfoWindowX())
    },100)
    marker.infowindow = true
    map.addListener('click', () => {
      infowindow.close()
      marker.infowindow = false
      props.markers.map(marker => marker.setLabel(null))
    })
  }
}
