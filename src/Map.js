import React from 'react';
/* Map display component. */

function Map (props) {
  return (
    <div id='map-container'>
      <div id='map-wrap'>
        <div id='show-hide'>
          <button onClick={props.showPins}>Show</button><button onClick={props.hidePins}>Hide</button>
        </div>
        <div id='map'>
        </div>
      </div>
    </div>
  )
}

export default Map

// <img id='map' src={(`https://maps.googleapis.com/maps/api/staticmap?center=${props.location}&zoom=14&maptype=roadmap&size=640x640&scale=2&style=feature:poi|element:labels|visibility:off&key=AIzaSyDbLLEvUq8BW8O6UDAP4jlDAHnJ3jNC6do`)}></img>
