import React, { Component } from 'react';
import './App.css';
import Map from './Map.js'
import SideBar from './SideBar.js'
import Header from './Header.js'
import * as GoogleMapsAPI from './GoogleMapsAPI.js'
/* Get Map and store in state, this will be displayed by the map component.  */

window.gm_authFailure = () => { alert("I'm sorry, the map had an error while loading! Please refresh and try again");}

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
      imgUrls: {
        'Addis_Ababa': 'https://image.ibb.co/hVN3b8/Addis_Ababa.jpg',
        'Bagels_and_Beans': 'https://image.ibb.co/fTgww8/Bagels_Beans.jpg',
        'Barrica': 'https://image.ibb.co/nRtWUT/Barrica.jpg',
        'Biladi': 'https://image.ibb.co/cmJWUT/Biladi.jpg',
        'cafe_Comodo': 'https://image.ibb.co/m3d9G8/cafe_C_modo.jpg',
        'Cafe_Lennep': 'https://image.ibb.co/e8H3b8/Cafe_Lennep.jpg',
        'Cafe_Panache': 'https://image.ibb.co/khc3b8/Cafe_Panache.jpg',
        'Coffee_Plaza': 'https://image.ibb.co/gXtn3o/Coffee_Plaza.jpg',
        'Dikke_Graaf': 'https://image.ibb.co/gOKuio/Dikke_Graaf.jpg',
        'Donerland_Eethuis': 'https://image.ibb.co/bH4uio/D_nerland_Eethuis.jpg',
        'Doppio_Espresso': 'https://image.ibb.co/ceRUG8/Doppio_Espresso.jpg',
        'Fenan_Klein_Afrika': 'https://image.ibb.co/gmfd9T/Fenan_Klein_Afrika.jpg',
        'Frankies_Corner': 'https://image.ibb.co/nLx3b8/Frankies_Corner.jpg',
        'Lalibela': 'https://image.ibb.co/d6wJ9T/Lalibela.jpg',
        'Lokaal_Edel': 'https://image.ibb.co/nO2Eio/Lokaal_Edel.jpg',
        'Meneer_de_Wit_Heeft_Honger': 'https://image.ibb.co/foZib8/Meneer_de_Wit_Heeft_Honger.jpg',
        'Saffraan': 'https://image.ibb.co/kVcfOo/Saffraan.jpg',
        'Staring_at_Jacob': 'https://image.ibb.co/iKDbw8/Staring_at_Jacob.jpg',
        't_Saoto_Huisje': 'https://image.ibb.co/n5NVOo/t_Saoto_Huisje.jpg',
        'Vegan_Junk_Food_Bar': 'https://image.ibb.co/dxmqOo/Vegan_Junk_Food_Bar.jpg',
      }
    }
  this.AddPinsToArray = this.AddPinsToArray.bind(this)
  this.ShowPins=this.ShowPins.bind(this)
  this.HidePins=this.HidePins.bind(this)
  this.GetMap=this.GetMap.bind(this)
  this.HighlightPin=this.HighlightPin.bind(this)
  this.HandleInfoWindow=this.HandleInfoWindow.bind(this)
  this.InfoWindowX=this.InfoWindowX.bind(this)
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
        let markerCopy = {...this.state.previousMarker}

        this.state.previousInfoWindow.close()
        markerCopy.infowindow = false
        this.setState({
          previousMarker: markerCopy,
        })
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

    this.state.locations.forEach((location) => {
      let thisLocation = location.name.toUpperCase()
      let thisCategory = location.categories[0].name.toUpperCase()
      // let filter = this.state.filter.toUpperCase()
      if(!thisLocation.includes(this.state.filter.toUpperCase())) {
        if(!thisCategory.includes(this.state.filter.toUpperCase())) {
        location.show = false
        this.state.markers.forEach((marker) => {
          if(marker.placeId === location.id) {
            marker.setMap(null)
            // console.log(`hiding ${marker.name} with ${marker.placeId}`)
          }
        })
      }
      }else {
        location.show = true
        this.state.markers.forEach((marker) => {
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
        let markerCopy = this.state.previousMarker

        markerCopy.infowindow = false

        this.setState({ previousMarker: markerCopy })
        this.state.previousInfoWindow.close()
      },50)
    }
}

  InfoWindowX () {
    let currentMarkerCopy = this.state.currentMarker
    currentMarkerCopy.infowindow = false
    this.setState({ currentMarker: currentMarkerCopy })
  }

  HighlightPin (e) {
    this.state.markers.forEach(marker => {
      if(e.target.id === marker.name) {
        GoogleMapsAPI.createInfoWindow(this.state.map, marker, this.state, this.HandleInfoWindow)
      }
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
    let sidebarInner = document.getElementById('sidebar-inner')
    let hamburger = document.getElementById('hamburger-icon')
    let hamburgerBtn = document.getElementById('hamburger-button')
    let mapcontainer = document.getElementById('map-container')

    sidebarInner.classList.toggle('sidebar-inner-hidden')
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
    let buttonContent = document.getElementById(e.target.id)
    let restaurantContainer = e.target.closest('div')

    restaurantContainer.classList.toggle('restaurant-selected')

    this.setState({
      locations: this.state.locations.map(location => {
        if(e.target.value === location.name) {
          if(location.info === true) {
            location.info = false
            buttonContent.innerHTML = '→'
          }else if(location.info === false) {
            location.info = true
            buttonContent.innerHTML = '↑'
          }
        }
        return location
      })
    })
  }

  componentDidMount () {
    this.setState({
      mapLoading: true,
    })
    fetch('https://api.foursquare.com/v2/venues/explore?ll=52.362884,4.863844&query=food&v=20180323&limit=20&intent=browse&radius=700&client_id=ZG1TWXPHE4V2ZEN0JK1GOGOA3NKLN2JQGPNJSN14AVYICL1X&client_secret=GGYHPT4BTUIBCWUZISGPS5JFAXUZHBYKTMVWK2AZAWPTAHCX&X-RateLimit-Remaining')
      .then(res => {
        if(res.ok) {
          return res.json()
        }else {
          return Promise.reject(' - The data was not successfully loaded from the api call')
        }
      })
      .then(data => data.response.groups[0].items)
      .catch(err => {
        alert(`Sorry there has been an error loading the locations! details of this error are ${err}`)
        console.log(`Error loading data, error is ${err}`)
      })
      .then((newLocations) => {
        let venuesArray = []
        newLocations.forEach(location =>{
          let newLocation = location.venue
          let tidyName = newLocation.name.split(' ').join('_').replace(/ö|ó/g, 'o').replace('\'', '').replace('&', 'and')
          newLocation.show = true
          newLocation.info = false
          newLocation.imgUrl = this.state.imgUrls[`${tidyName}`]
          venuesArray.push(newLocation)
        })
        this.setState({
          locations: venuesArray
        })
      })
      .then(
        setTimeout(() => {
          GoogleMapsAPI.LoadMap(this.state, this.AddPinsToArray, this.GetMap, this.HandleInfoWindow, this.InfoWindowX)
          this.setState({
            mapLoading: false,
          })
        },500)
      )
      .catch(e => console.log(e))
  }

  render() {
    return (
      <div key='app-container' id='app-container'>
        <Header />
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
