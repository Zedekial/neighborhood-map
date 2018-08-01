import React from 'react';
/* Map display component. */

/* The map component is mostly just a conatiner for the googlemap, it will also conditionally render the hamburger button if the sidebar is hidden */
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
        {props.hideSideBar &&
          (<div id='hamburger-icon' className='hamburger-on-map'>
            <button id='hamburger-button' onClick={props.hideBar} aria-label='show the sidebar'>+< /button>
          </div>)}
          {/* The show hide buttons call a method in the app.js component which will either show or hide all markers */}
          <div id='show-hide'>
            <button id='show-hide-button' onClick={props.showPins} tabIndex='-1'>Show</button><button id='show-hide-button' onClick={props.hidePins} tabIndex='-1'>Hide</button>
            <div>
              <button onClick={showHide} id='hide-buttons' tabIndex='-1'>-</button>
            </div>
          </div>
            <div>
              <button onClick={props.centerMap} id='center-map'>Center Map</button>
            </div>
          <div id='map' aria-label='google map picture'>
          </div>
        </div>
      </div>
    )
  }
}
/* The showhide button will tuck the show/hide buttons under the header and peak out enough to be clicked on again to show them */
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
