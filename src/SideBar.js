import React from 'react';
import App from './App.js'
/* This will be the sidebar component, this will contain the list of places which you can click and interact with */

function Hamburger (props) {
  return(
    <div id='hamburger-icon'>
      <button id='hamburger-button' onClick={props.hideBar}>=< /button>
    </div>
  )
}
/* Fix the follow two functions to display locations  */

function PlaceItem (props, hightlightPin) {
    return (
      <li id={props.name} className='list-item' onClick={e => hightlightPin(e)}>{props.name}</li>
    )
}

function ListPlaces (props) {
  let hightlightPin = props.hightlightPin

  return (
    props.locations.map((location) =>
      PlaceItem(location, hightlightPin)
    )
  )
}

function SideBar (props) {
  return (
    <div id='sidebar'>
      <Hamburger
        hideBar={props.hideBar}
      />
      <div>
        <h2>Filter:</h2>
        <input id='search-field' /><button onClick={props.getMap}>Go!</button>
        <h2>Nearby:</h2>
        <ul id='locations-list'>
          <ListPlaces
            locations={props.locations}
            hightlightPin={props.hightlightPin}
          />
        </ul>
      </div>
    </div>
  )
}

export default SideBar
