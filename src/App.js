import React, { Component } from 'react';
import './App.css';
import Map from './Map.js'
import SideBar from './SideBar.js'
import * as GoogleMapsAPI from './GoogleMapsAPI.js'
import * as FoursquareAPI from './FoursquareAPI.js'
/* Get Map and store in state, this will be displayed by the map component.  */

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      /* The map, pins and other important data will be kept here */
      locations: [],
      markers: [],
      map: {},
      mapBounds: {},
      openInfoWindow: '',
      previousInfoWindow: '',
      currentMarker:'',
      previousMarker:'',
      filter: '',
      mapLoading: false,
    }
  this.AddPinsToArray = this.AddPinsToArray.bind(this)
  this.ShowPins=this.ShowPins.bind(this)
  this.HidePins=this.HidePins.bind(this)
  this.GetMap=this.GetMap.bind(this)
  this.HighlightPin=this.HighlightPin.bind(this)
  this.HandleInfoWindow=this.HandleInfoWindow.bind(this)
  this.FilterLocations=this.FilterLocations.bind(this)
  this.FurtherInfo=this.FurtherInfo.bind(this)
  this.CenterMap=this.CenterMap.bind(this)
  }

  GetMap (map, bounds) {
    this.setState({
      map: map,
      mapBounds: bounds,
    })
  }

  CenterMap () {
    this.state.map.fitBounds(this.state.mapBounds)
    if(this.state.openInfoWindow !== '') {
      this.setState({
        previousInfoWindow: this.state.openInfoWindow,
        previousMarker: this.state.currentMarker,
      })
      setTimeout(()=> {
        this.state.previousInfoWindow.close()
        this.state.previousMarker.infowindow = false
      },50)
    }
  }

  FilterLocations (e) {
    if(e.target.value === '') {
      this.setState({
        filter: '',
      })
      this.state.locations.map((location) => location.show = true)
      this.state.markers.map(marker => marker.setMap(this.state.map))
    }else {
      this.setState({
        filter: e.target.value,
      })

    this.state.locations.map((location) => {
      console.log(location)
      let thisLocation = location.name.toUpperCase()
      let thisCategory = location.categories[0].name.toUpperCase()
      let filter = this.state.filter.toUpperCase()
      if(!thisLocation.includes(filter)) {
        if(!thisCategory.includes(filter)) {
        location.show = false
        this.state.markers.map((marker) => {
          if(marker.placeId === location.id && location.show === false) {
            console.log('Marker and Location ID match for ' + marker.name + ' ' + location.name)
            marker.setMap(null)
          }
        })
      }
      }else {
        location.show = true
        this.state.markers.map((marker) => {
          marker.setMap(this.state.map)
          })
        }

      })
    }
  }

  HandleInfoWindow (newInfoWindow, newMarker) {
    if(this.state.openInfoWindow === '') {
      this.setState({
        openInfoWindow: newInfoWindow,
        currentMarker: newMarker,
      })
    }else {
      this.setState({
        previousInfoWindow: this.state.openInfoWindow,
        openInfoWindow: newInfoWindow,
        previousMarker: this.state.currentMarker,
        currentMarker: newMarker,
      })
      setTimeout(()=> {
        this.state.previousInfoWindow.close()
        this.state.previousMarker.infowindow = false
      },50)
      }
  }

  HighlightPin (e) {
    this.state.markers.map(marker => {
      if(e.target.id === marker.name) {
        marker.setLabel('!')
        GoogleMapsAPI.createInfoWindow(this.state.map, marker, this.state, this.HandleInfoWindow)
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

  FurtherInfo (e) {
    console.log('working' + ' ' + e.target.id)
    let buttonContent = document.getElementById(e.target.id)

    this.state.locations.map(location => {
      if(e.target.value === location.name) {
        if(location.info === true) {
          console.log('a match, ' + location.info + ' will change to ' + false)
          location.info = false
          buttonContent.innerHTML = '+'
          console.log('true is now ' + location.info)
        }else if(location.info === false) {
          console.log('a match, ' + location.info + ' will change to ' + true)
          location.info = true
          buttonContent.innerHTML = '-'
          console.log('false is now ' + location.info)
        }
      }
    })
  }

  componentDidMount () {
    this.setState({
      mapLoading: true,
    })
    fetch('https://api.foursquare.com/v2/venues/explore?ll=52.362884,4.863844&query=food&v=20180323&limit=20&intent=browse&radius=700&client_id=ZG1TWXPHE4V2ZEN0JK1GOGOA3NKLN2JQGPNJSN14AVYICL1X&client_secret=GGYHPT4BTUIBCWUZISGPS5JFAXUZHBYKTMVWK2AZAWPTAHCX')
      .then(res => res.json())
      .then(data => data.response.groups[0].items)
      .then((newLocations) => {
        let venuesArray = []
        // GoogleMapsAPI.getPhotos(newLocations) /* This isn't right */
        newLocations.map(location =>{
          let newLocation = location.venue
          newLocation.show = true
          newLocation.info = false
          venuesArray.push(newLocation)
        })
        this.setState({
          locations: venuesArray
        })
      })
      .then(
        setTimeout(() => {
          GoogleMapsAPI.LoadMap(this.state, this.AddPinsToArray, this.GetMap, this.HandleInfoWindow)
          this.setState({
            mapLoading: false,
          })
        },500)
      )
  }

  render() {
    return (
      <div id='app-container'>
        <SideBar
          hideBar={this.HideSideBar}
          hightlightPin={this.HighlightPin}
          filterLocations={this.FilterLocations}
          furtherInfo={this.FurtherInfo}
          locations={this.state.locations}
        />
        <Map
          location={this.state.location}
          loading={this.state.mapLoading}
          hidePins={this.HidePins}
          showPins={this.ShowPins}
          centerMap={this.CenterMap}
        />
      </div>
    );
  }
}

export default App;
