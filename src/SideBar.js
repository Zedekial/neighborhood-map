import React from 'react';
/* This is the sidebar component, this contains the list of places which can be clicked on to highlight the marker, or a button to pop open more information within the bar.
Additionally it contains a filter/search input */

/* Just a basic hide/show button. This is conditionally rendered and will either be rendered on the sidebar or on the map directly if the sidebar is hidden */
function Hamburger (props) {
  return !props.hideSideBar &&
  (
    <div id='hamburger-icon' className='hamburger-on-sidebar'>
      <button id='hamburger-button' onClick={props.hideBar} aria-label='Hide the sidebar'>=< /button>
    </div>
  )
}

/* Each list item has a hidden furtherinfo pane which will be displayed upon clicking an arrow button above it. This is conditionally rendered for each list item */
function DisplayInfo (props) {
    if(props.props.info === true) {
      return (
        <div tabIndex='0'>
          <h4>Address: </h4>
          <div>
            <p>{props.props.location.formattedAddress.map(address => {
              return (
                <li>{address}</li>
              )
            })}</p>
          </div>
          <h4>Restaurant Type:</h4>
          <p>{props.props.categories[0].name}</p>
        </div>
      )
    }else {
      return null
    }

}

/* Each list item is built with a furtherinfo button which will set a boolean for conditional rendering and uses an onclick function which will call a method in the app.js
component which highlights the matching marker and opens an infowindow on it  */
function PlaceItem (props, hightlightPin, furtherInfo) {
  let buttonName = props.name.split(' ').join('-') + '-button'
    return (
      <div className='restaurant-container'>
        <span className='button-span'><button name={`Display further info for ${props.name}`} aria-label={`Display more information about ${props.name}`} className='info-button' id={buttonName} value={props.name} onClick={e => furtherInfo(e)}>→</button></span>
        <li name={`highlight the pin and open an infowindow for ${props.name}`} id={props.name} key={props.id} className='list-item' onClick={e => hightlightPin(e)} onKeyUp={e => hightlightPin(e)} tabIndex='0'>{props.name}</li>
          <DisplayInfo
          props={props}
          />
      </div>
    )
}

/* Using the locations contained in state, this function will create a list item for each one, passing down needed functions as props. It will also filter based on
a boolean 'show' which is set during filtering of the list using the searchbar at the top */
function ListPlaces (props) {
  let hightlightPin = props.hightlightPin
  let furtherInfo = props.furtherInfo

  return (
    props.locations.filter((location) => location.show === true).map((location) =>
      PlaceItem(location, hightlightPin, furtherInfo)
    )
  )
}

/* The sidebar contains all locations as list items, a search bar to filter locations by name or category and a hamburger to show/hide the menu */
const SideBar = (props) => (
  <div id='sidebar' key={props.index}>
    <Hamburger
    hideBar={props.hideBar}
    hideSideBar={props.hideSideBar}
    />
    <div id='sidebar-inner' key={props.index}>
      <div className='sidebar-filter'>
        <h2>Filter:</h2>
        <input id='search-field' onChange={props.filterLocations} aria-label='Filter restaurants by category or name' />
      </div>
      <div key={props.locations[0]} className='sidebar-nearby'>
        <h2 tabIndex='0' aria-label='List of local restaurants'>Nearby:</h2>
        <ul key={props.locations[0]} id='locations-list'>
        <ListPlaces
        locations={props.locations}
        hightlightPin={props.hightlightPin}
        furtherInfo={props.furtherInfo}
        />
        </ul>
      </div>
    </div>
  </div>
)

export default SideBar
