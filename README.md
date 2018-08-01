This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Neighborhood Maps

This is the final project for the Udacity Front End Nano Degree. The project was created using React and uses two APIs.

See [Live version on github pages](http://Zedekial.github.io/neighborhood-map)

## Table of Contents

* [APIs](#apis)
* [Project Overview](#project-overview)
* [Running the App](#running-the-app)
* [Disclaimer](#disclaimer)

## APIs

[Googlemaps API](https://developers.google.com/maps/documentation/) - Which is used to implement the map, markers and create infowindows.

[Foursquare API](https://developer.foursquare.com/docs/api/getting-started) - Which is used to fetch a group of locations based on the search term 'restaurant' and fill the array
which the locations in this app are created from.

***My own free API keys were used in this app, if you download this for testing purposes or clone it, please try to use your own key if possible, otherwise please be mindful of usage.***

## Project Overview

The app is a single page website displaying a local neighborhood map and a number of close-by cafes/restaurants. The locations are displayed as list items in the sidebar and also as markers on the map.

Clicking on these locations will display further information below `when clicking the arrow` or will highlight the marker and open an infowindow displaying further information and an image of this location `when clicking the name`.

A filter/search function is also implemented by using the `input field` at the top of the sidebar. Locations can be filtered by either name or category IE cafe, ethiopian or so on.

### Further information

This app was also created with accessibility in mind and contains aria labels and a sensible tab order.

## Running the app

**1**: Run a live demo [here](http://Zedekial.github.io/neighborhood-map)  which uses gh-pages

**2**: Download or clone the repo onto your local machine

```
To run on a local machine:
* `cd` to the neighborhood-map folder
* run 'npm install' to install relevant dependencies
* start the development server with 'npm start', this should open a page automatically with the app running, otherwise visit `http://localhost:3000` in your browser

> `create-react-app` does implement a service worker, however this is only live during a production build. If you wish to view the app with a service worker please run `npm run serve` and visit `localhost:5000`.
```

### Disclaimer

This app was created for the purposes of the Udacity Nano Degree course. It is not intended to be fully live and therefore contains images gathered from google images, these are not owned by me.

The design of this application is all by the **Author**.

### Bugs

If you clone, download or run this app and find any bugs, please don't hesitate to let me know. This can be done by commenting the bug on the main `app.js` file and I will squash any bugs found. 
