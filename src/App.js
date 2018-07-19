import React, { Component } from 'react';
import './App.css';
import Map from './Map.js'
import SideBar from './SideBar.js'
import * as GoogleMapsAPI from './GoogleMapsAPI.js'
/* Get Map and store in state, this will be displayed by the map component.  */

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      /* The map, pins and other important data will be kept here */
      search: '',
      locations: [
        {
          name: 'Foodhallen',
          position: {lat: 52.3670364, lng: 4.8681683},
          placeId: 'ChIJtWMWEeAJxkcR7PV7zX9aRh0',
        },
        {
          name: 'Staring at Jacob',
          position: {lat: 52.362561, lng: 4.862040},
          placeId: 'ChIJ44b-WwnixUcRbP79ihdly2k',
        },
        {
          name: 'CoffeeRoastery Oud West',
          position: {lat: 52.361409, lng: 4.865066},
          placeId: 'ChIJl_CzlgnixUcRVaqS7SdNsu8',
        },
        {
          name: 'Fenan Klein Afrika',
          position: {lat: 52.361296, lng: 4.865163},
          placeId: 'ChIJrcMlvgnixUcRxPAJFCxIuPQ',
        },
        {
          name: 'Brood',
          position: {lat: 52.362821, lng: 4.864083},
          placeId: 'ChIJBccYKwrixUcRUw3GjLtOiPE',
        }
      ],
      markers: [],
      map: {},
      openInfoWindow: [],
    }
  this.AddPinsToArray = this.AddPinsToArray.bind(this)
  this.ShowPins=this.ShowPins.bind(this)
  this.HidePins=this.HidePins.bind(this)
  this.GetMap=this.GetMap.bind(this)
  this.HighlightPin=this.HighlightPin.bind(this)
  this.HandleInfoWindow=this.HandleInfoWindow.bind(this)

  }

  GetMap (map) {
    this.setState({
      map,
    })
  }

  HandleInfoWindow (openInfoWindow) {
    this.setState({
      openInfoWindow,
    })
  }

  PlacePins () {
    /* Place the created pins on the map */
  }

  HighlightPin (e) {
    console.log('Highlighting pin for ' + e.target.id)
    this.state.markers.map(marker => {
      if(e.target.id === marker.name) {
        console.log(marker + ' matches ' + e.target.id)
        marker.setLabel('!')
      }else(
        marker.setLabel(null)
      )
    })
  }

  ShowPins () {
    this.state.markers.forEach(marker => {
      marker.setMap(this.state.map)
    })
  }

  HidePins () {
    this.state.markers.forEach(marker => marker.setMap(null))
  }

  AddPinsToArray (pins) {
    this.setState({
      markers: pins,
    })
  }

  HideSideBar () {
    let sideBar = document.getElementById('sidebar')
    let hamburger = document.getElementById('hamburger-icon')
    let hamburgerBtn = document.getElementById('hamburger-button')
    let mapcontainer = document.getElementById('map-container')

    sideBar.classList.toggle('sidebar-hidden')
    hamburger.classList.toggle('hamburger-hidden')
    mapcontainer.classList.toggle('map-container-full')

    if(hamburger.classList.contains('hamburger-hidden')) {
      hamburgerBtn.innerHTML = '+'
    }else (
      hamburgerBtn.innerHTML = '='
    )
  }

  componentDidMount () {
    GoogleMapsAPI.LoadMap(this.state, this.AddPinsToArray, this.GetMap, this.HandleInfoWindow)
  }

  render() {
    return (
      <div id='app-container'>
        <SideBar
          hideBar={this.HideSideBar}
          hightlightPin={this.HighlightPin}
          locations={this.state.locations}
        />
        <Map
          location={this.state.location}
          hidePins={this.HidePins}
          showPins={this.ShowPins}
        />
      </div>
    );
  }
}

export default App;
