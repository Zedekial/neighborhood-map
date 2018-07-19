import React from 'react';
/* Create the Googlemaps API component which will fetch and return data, this will be exported and accessed by other components */
/* global google */
const key = 'AIzaSyDbLLEvUq8BW8O6UDAP4jlDAHnJ3jNC6do'

export const LoadMap = (props, AddPinsToArray, GetMap, HandleInfoWindow) => {
  window.initMap = initMap;

  loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyDbLLEvUq8BW8O6UDAP4jlDAHnJ3jNC6do&callback=initMap')

  function loadJS (src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  function initMap () {
    let staringstraat = {lat: 52.3612186, lng: 4.8606227}
    let markersArray = []

    let map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 16,
        center: staringstraat,
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
    GetMap(map)

    let bounds = new google.maps.LatLngBounds()

    props.locations.map((location) => {

      let marker = new google.maps.Marker({
        name: location.name,
        position: location.position,
        placeId: location.placeId,
        map: map,
        animation: google.maps.Animation.DROP,
        infowindow: false,
      })
      bounds.extend(location.position)

      function infoContents () {
        return (
          <div>
            <h1>{marker.name}</h1>
          </div>
        )
      }

      function createInfoWindow(map, marker) {
        if(marker.infowindow === false) {
          let lastInfoWindow = []

          let infowindow = new google.maps.InfoWindow({
            content: marker.name,
          })
          infowindow.open(map, marker)
          HandleInfoWindow(lastInfoWindow)
          marker.infowindow = true

          console.log(props)

          map.addListener('click', () => {
            infowindow.close()
            marker.infowindow = false
            markersArray.map(marker => marker.setLabel(null))
          })
        }
      }



      marker.addListener('click', () =>
        createInfoWindow(map, marker)
      )

      marker.addListener('click', () => {
        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(()=> {
          marker.setAnimation(null)
        }, 1000)
      })
      // marker.addListener('mouseover', () =>
      //
      // )
      // marker.addListener('mouseout', () =>
      //
      // )

      map.fitBounds(bounds)
      markersArray.push(marker)
    })
    AddPinsToArray(markersArray)
  }
}
