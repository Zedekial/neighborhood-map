import React, { Component } from 'react';
import './App.css';
import Map from './Map.js'
import SideBar from './SideBar.js'
import Header from './Header.js'
import * as GoogleMapsAPI from './GoogleMapsAPI.js'

window.gm_authFailure = () => { alert("I'm sorry, the map had an error while loading! Please refresh and try again");}

/* The main app component is created as a class and contains the main functions for the overall app. These are passed down to child components for use */
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      /* The map, pins and other important data will be kept here. These are kept here for reference later on, for example the map object is kept here so
      it can be accessed at anytime by accessing state */
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
      hideSideBar: false,
      /* Although Apis such as foursquare and flickr will provide images, these are not satisfactory and so manual images have been saved, uploaded and linked */
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
  }
  /* All methods here are using es6 arrow functions to prevent the need for binding of this on each one from within the app class*/

  /* The map and its bounds are passed from the googlemapsAPI after being created for later reference */
  GetMap = (map, bounds) => {
    this.setState({
      map: map,
      mapBounds: bounds,
    })
  }

  /* As well as the map, the pins/markers need to be kept in the array for accessing later */
  AddPinsToArray = (pins) => {
    this.setState({
      markers: pins,
    })
  }

  /* This will center the map, move the current infowindow and marker into 'previous' and then close the current infowindow. It acts as a kind of reset. */
  CenterMap = () => {
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

  /* When the search function is used from the sidebar component the search target is passed here, this is then set in the state. Both the markers and locations arrays
  are then mapped over and those which match the search filter will be shown, those that don't match will be hidden using either a boolean for the locations or setMap(null)
  for the markers. This is where the map object comes into play for returning markers later */
  FilterLocations = (e) => {
    /* If the search term is blank everything will be reset, else the filter will be set */
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

    /* We look through each location in the array to find any matches */
    this.state.locations.forEach((location) => {
      /* First we set the name of the location and it's category to uppercase for search purposes */
      let thisLocation = location.name.toUpperCase()
      let thisCategory = location.categories[0].name.toUpperCase()

      /* Then we check if the location does't match, then the category. If neither match the 'show' boolean is set to false, this is checked when displaying locations in the sidebar */
      if(!thisLocation.includes(this.state.filter.toUpperCase())) {
        if(!thisCategory.includes(this.state.filter.toUpperCase())) {
        location.show = false
        /* Then the markers are checked over and those that match the id of the location will be removed from the map */
        this.state.markers.forEach((marker) => {
          if(marker.placeId === location.id) {
            marker.setMap(null)
              }
            })
          }
        }
      })
    }
  }

  /* This method is to prevent multiple infowindows being opened, it will also set the state with previous and current infowindow/marker */
  HandleInfoWindow = (newInfoWindow, newMarker) => {
    /* If this is run for the first time the openInfoWindow will be an empty string so we will set the intial marker and infowindow */
    if(this.state.openInfoWindow === '') {
      this.setState({
        openInfoWindow: newInfoWindow,
        currentMarker: newMarker,
      })
    /* Otherwise we will move the current marker and infowindow to previous and set the new current marker/infowindow with those passed down to this method  */
    }else {
      this.setState({
        previousInfoWindow: this.state.openInfoWindow,
        openInfoWindow: newInfoWindow,
        previousMarker: this.state.currentMarker,
        currentMarker: newMarker,
      })
      /* The previous marker needs to have its boolean reset to false to allow it to open an infowindow again, this is done by copying the marker first to prevent
      mutating state directly */
      setTimeout(()=> {
        let markerCopy = this.state.previousMarker

        markerCopy.infowindow = false

        this.setState({ previousMarker: markerCopy })
        this.state.previousInfoWindow.close()
      },50)
    }
  }

  /* Because the methods for handling infowindows and markers are my own we must also handling closing the infowindow by its X button ourselves
  the infowindow X button is grabbed inside of the createinfowindow function in the googlemapsAPI component and this method is called from there */
  InfoWindowX = () => {
    let currentMarkerCopy = this.state.currentMarker
    currentMarkerCopy.infowindow = false
    this.setState({ currentMarker: currentMarkerCopy })
  }

  /* When a location is clicked on from the list we want to bounce the pin and open an infowindow for its corresponding marker. This method is called from the marker location
  list item in SideBar and then passes through the relevant props to the creatinfowindow function in the googlemaps API */
  HighlightPin = (e) => {
    this.state.markers.forEach(marker => {
      if(e.target.id === marker.name) {
        GoogleMapsAPI.createInfoWindow(this.state.map, marker, this.state, this.HandleInfoWindow, this.InfoWindowX)
      }
    })
  }

  /* The next two methods simply show and hide the pins, these are called from the buttons in the map component */
  ShowPins = () => {
    this.state.markers.forEach(marker => {
      marker.setMap(this.state.map)
    })
  }

  HidePins = () => {
    this.state.markers.forEach(marker => marker.setMap(null))
  }


  /* This toggles the state which controls the sidebar being shown or hidden, this is done with conditional rendering. It also sets a class on the mapcontainer to make it full width */
  HideSideBar = () => {
    let mapcontainer = document.getElementById('map-container')
    mapcontainer.classList.toggle('map-container-full')

    if(this.state.hideSideBar === true) {
      this.setState({ hideSideBar: false })
    }else {
      this.setState({ hideSideBar: true })
    }
  }

  /* Clicking on the button within each location node in the sidebar will provide more information about it, this is done using conditional rendering */
  FurtherInfo = (e) => {
    let buttonContent = document.getElementById(e.target.id)
    let restaurantContainer = e.target.closest('div')

    restaurantContainer.classList.toggle('restaurant-selected')
    restaurantContainer.focus()

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

  /* When the component has mounted the data from the foursquare API is fetched to set the array of locations. First this data is parsed to json and then for each object in the data
  a location is pushed to a blank array. Once this has finished the array is used to update state */
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
        alert(`Sorry there has been an error loading the locations! details of this error are ${err} <br> Hint: You might be offline, check your internet connection and try again`)
        console.log(`Error loading data, error is ${err}`)
      })
      .then((newLocations) => {
        let venuesArray = []
        newLocations.forEach(location =>{
          /* The show, info and imgUrl properties are set for later use on each locations. Additionally the names are tidied up for use in setting the URL, this is
          because of some names having symbols like & or accented letters in them */
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
      /* Once we have locations we can call the LoadMap function inside the googlemapsAPI component. This is where async script is loaded to enable the
      api to work within a React app */
      .then(() => {
          GoogleMapsAPI.LoadMap(this.state, this.AddPinsToArray, this.GetMap, this.HandleInfoWindow, this.InfoWindowX)
        })
      /* Once we have loaded the map we will set the boolean of maploading to false, this displays a simple 'Loading...' message when true */
      .then(()=> {
        this.setState({
          mapLoading: false,
        })
      })
      .catch(e => console.log(e))
  }

  /* Render the Header, SideBar and Map components, passing them the state or methods they need as props */
  render() {
    return (
      <div key={1} id='app-container'>
        <Header />
         {!this.state.hideSideBar &&
          (<SideBar
          hideBar={this.HideSideBar}
          hightlightPin={this.HighlightPin}
          filterLocations={this.FilterLocations}
          furtherInfo={this.FurtherInfo}
          locations={this.state.locations}
          hideSideBar={this.state.hideSideBar}
          />)}
        <Map
          location={this.state.location}
          loading={this.state.mapLoading}
          hideSideBar={this.state.hideSideBar}
          hidePins={this.HidePins}
          showPins={this.ShowPins}
          centerMap={this.CenterMap}
          hideBar={this.HideSideBar}
        />
      </div>
    );
  }
}

export default App;
