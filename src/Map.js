import React from 'react';
import * as GoogleMapsAPI from './GoogleMapsAPI.js'
/* Map display component. */

function Map (props) {
  if(props.loading === true) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }else {
    return (
      <div id='map-container'>
        <div id='map-wrap'>
          <div id='show-hide'>
            <button id='show-hide-button' onClick={props.showPins}>Show</button><button onClick={props.hidePins}>Hide</button>
            <div>
              <button onClick={showHide} id='hide-buttons'>-</button>
            </div>
          </div>
            <div>
              <button onClick={props.centerMap}id='center-map'>Center Map</button>
            </div>
          <div id='map'>
          </div>
        </div>
      </div>
    )
  }
}

function showHide() {
  let miniMenu = document.getElementById('show-hide')
  let hiddenButtons = document.getElementById('hide-buttons')

  miniMenu.classList.toggle('hide')
  if(miniMenu.classList.contains('hide')) {
    hiddenButtons.innerHTML = '____'
  }else {
    hiddenButtons.innerHTML = '-'
  }
}

export default Map

// <img id='map' src={(`https://maps.googleapis.com/maps/api/staticmap?center=${props.location}&zoom=14&maptype=roadmap&size=640x640&scale=2&style=feature:poi|element:labels|visibility:off&key=AIzaSyDbLLEvUq8BW8O6UDAP4jlDAHnJ3jNC6do`)}></img>
