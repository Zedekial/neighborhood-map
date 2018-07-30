import React from 'react';
/* This will be the sidebar component, this will contain the list of places which you can click and interact with */

function Hamburger (props) {
  return (
    <div id='hamburger-icon'>
      <button id='hamburger-button' onClick={props.hideBar}>=< /button>
    </div>
  )
}

function DisplayInfo (props) {
    if(props.props.info === true) {
      return (
        <div>
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

function PlaceItem (props, hightlightPin, furtherInfo) {
  let buttonName = props.name.split(' ').join('-') + '-button'
    return (
      <div className='restaurant-container'>
        <span className='button-span'><button id={buttonName} value={props.name} onClick={e => furtherInfo(e)}>→</button></span>
        <li id={props.name}key={props.name} className='list-item' onClick={e => hightlightPin(e)}>{props.name}</li>
          <DisplayInfo
          props={props}
          />
      </div>
    )
}

function ListPlaces (props) {
  let hightlightPin = props.hightlightPin
  let furtherInfo = props.furtherInfo

  return (
    props.locations.filter((location) => location.show === true).map((location) =>
      PlaceItem(location, hightlightPin, furtherInfo)
    )
  )
}

const SideBar = (props) => (
  <div id='sidebar' key={props.index}>
    <div id='sidebar-inner' key={props.index}>
      <Hamburger
      hideBar={props.hideBar}
      />
      <div className='sidebar-filter'>
        <h2>Filter:</h2>
        <input id='search-field' onKeyUp={props.filterLocations} />
      </div>
      <div className='sidebar-nearby'>
        <h2>Nearby:</h2>
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
