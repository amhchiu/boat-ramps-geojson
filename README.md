# boat-ramps-geojson

Visualisation of boat ramps in Australia's Gold Coast. 

#### Technologies used:
- Leaflet for the map
- d3 for the Bar charts
- React + Redux
- Node/Express Backend
- Typescript

#### Running the app
- cd into `backend` folder
  - `yarn install`
  - open two terminal windows
  - `yarn build` + `yarn start`
- cd into `frontend` folder
  - `yarn install`
  - `yarn start`
  
 #### Usage tips
 - Panning and zooming on the map will only GET and display the boat ramps that fit within the visible map bounds.
 - There are two bar charts: Number or ramps per construction material and number of ramps per size category.
 - Panning and zooming will also update the bar chart values.
 - Clicking on a bar will change its colour and filter the markers on the map match the data of the selected bar. This can be toggled.
A few map properties can be configured in `frontend/src/FrontendConfig.json` including:
- How fast the map updates the markers after panning (milliseconds)
- Area size category range. Can add more or less to change the bar chart. These are the upper bounds.
- Map Center Lat, Lng.
 
There are a few unit tests on the redux actions which can be run with `yarn test`.

TO DO:
- Continue writing unit tests for the component functions
- Style the Map and Chart to be responsive.
