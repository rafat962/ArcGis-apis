import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-best_road',
  templateUrl: './best_road.component.html',
  styleUrls: ['./best_road.component.css'],
  animations: [
    trigger('divState', [
      state(
        'normal',
        style({
          opacity: 0,
        })
      ),
      state(
        'neww',
        style({
          opacity: 1,
        })
      ),
      transition('normal <=> neww', animate(500)),
    ]),
  ],
})
export class Best_roadComponent implements OnInit {
  statee = 'normal';
  load_2() {
    loadModules([
      'esri/config',
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/rest/route',
      'esri/rest/support/RouteParameters',
      'esri/rest/support/FeatureSet',
      'esri/widgets/Locate',
      'esri/widgets/Fullscreen',
      'esri/widgets/Search',
      'esri/widgets/Compass',
      'esri/layers/FeatureLayer',
    ]).then(
      ([
        esriConfig,
        Map,
        View,
        Graphic,
        route,
        RouteParameters,
        FeatureSet,
        Locate,
        Full,
        Search,
        Compass,
        FeatureLayer,
      ]) => {
        esriConfig.apiKey =
          'AAPK38c209f021054218bcb40a3ad0a98fb4mbNCjLBuc6XqNxb0Y1IlrMWZCam_yYzIb-9FRr5ah88lyClV83UuUqVJbwtKnaZx';
        const routeUrl =
          'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';
        const map = new Map({
          basemap: 'satellite',
        });

        // ------------------------------ add feature and pop up
        var myPopupTemplate = {
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'name', label: 'اسم الفرع' },
                { fieldName: 'location', label: 'موقع الفرع' },
              ],
            },
            {
              type: 'media',
              mediaInfos: [
                {
                  type: 'image',
                  value: {
                    sourceURL: '{photos}',
                  },
                },
              ],
            },
          ],
        };
        const feature = new FeatureLayer({
          url: 'https://services7.arcgis.com/vW34tdBYiQgFwtVX/arcgis/rest/services/markets/FeatureServer',
          popupTemplate: myPopupTemplate,
        });
        map.add(feature);
        const view = new View({
          map: map,
          container: 'viewDiv',
          center: [31.235, 30.019],
          zoom: 11,
        });
        // ---------------------------------------------filter
        const filter = document.createElement('select');
        filter.className = 'form-select';
        filter.innerHTML = `
        <option value="">Bransh location</option>
        <option value="التجمع الخامس">Sheikh Zayed</option>
        <option value="فيصل">Faisal</option>
        <option value="الشيخ زايد">Fifth Settlement</option>
        `;
        filter.addEventListener('change', (ev: any) => {
          var selected = ev.target.value;
          applyFilter(selected);
        });

        function applyFilter(filterValue: string) {
          // Set the definitionExpression based on the selected filter value
          var expression = filterValue ? `location = '${filterValue}'` : '1=1';
          feature.definitionExpression = expression;
        }

        // ------------------------------widget
        const full = new Full({
          view: view,
        });
        const search = new Search({
          view: view,
        });
        const compass = new Compass({
          view: view,
        });
        view.ui.add(full, 'top-left');
        view.ui.add(search, 'top-right');
        view.ui.add(compass, 'bottom-left');
        view.ui.add(filter, 'bottom-right');
        //-----------------------------------
        const loc = new Locate({
          view: view, // Attaches the Locate button to the view
        });

        loc.on('locate', function (ev: any) {
          console.log(view.graphics.length);
          let point = {
            type: 'point', // autocasts as new Point()
            longitude: ev.position.coords.longitude,
            latitude: ev.position.coords.latitude,
          };
          addgraphic('org', point);
        });
        view.ui.add(loc, 'top-left');
        view.on('click', function (ev: any) {
          console.log(view.graphics.length);
          if (view.graphics.length === 0) {
            console.log('no');
          } else {
            if (view.graphics.length === 2) {
              addgraphic('new', ev.mapPoint);
              getRoute();
            } else if (view.graphics.length === 4) {
              view.graphics.splice(2, 5);
              addgraphic('new', ev.mapPoint);
              getRoute();
            } else {
              view.graphics.splice(2, 5);
              addgraphic('new', ev.mapPoint);
            }
          }
        });
        function addgraphic(type: any, point: any) {
          const graphic = new Graphic({
            symbol: {
              type: 'simple-marker',
              color: type === 'org' ? 'white' : 'blue',
              size: 8,
            },
            geometry: point,
          });
          view.graphics.add(graphic);
        }
        function getRoute() {
          console.log('done');
          const routeParams = new RouteParameters({
            stops: new FeatureSet({
              features: view.graphics.toArray(),
            }),
            returnDirections: true,
          });
          route
            .solve(routeUrl, routeParams)
            .then(function (data: any) {
              data.routeResults.forEach(function (result: any) {
                result.route.symbol = {
                  type: 'simple-line',
                  color: [5, 150, 255],
                  width: 3,
                };
                view.graphics.add(result.route);
              });
              if (data.routeResults.length > 0) {
                const directions = document.createElement('ol');
                directions.setAttribute(
                  'class',
                  'esri-widget esri-widget--panel esri-directions__scroller'
                );
                directions.style.marginTop = '0';
                directions.style.padding = '15px 15px 15px 30px';
                const features = data.routeResults[0].directions.features;
                features.forEach(function (result: any, i: any) {
                  const direction = document.createElement('li');
                  direction.innerHTML =
                    result.attributes.text +
                    ' (' +
                    result.attributes.length.toFixed(2) +
                    ' miles)';
                  directions.appendChild(direction);
                });
                view.ui.empty('top-right');
                view.ui.add(directions, 'top-right');
              }
            })
            .catch(function (error: any) {
              console.log(error);
            });
        }
      }
    );
  }

  load_3() {
    loadModules([
      'esri/config',
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/rest/route',
      'esri/rest/support/RouteParameters',
      'esri/rest/support/FeatureSet',
    ]).then(
      ([
        esriConfig,
        Map,
        MapView,
        Graphic,
        route,
        RouteParameters,
        FeatureSet,
      ]) => {
        esriConfig.apiKey =
          'AAPK38c209f021054218bcb40a3ad0a98fb4mbNCjLBuc6XqNxb0Y1IlrMWZCam_yYzIb-9FRr5ah88lyClV83UuUqVJbwtKnaZx';

        const map = new Map({
          basemap: 'satellite', // basemap styles service
        });

        const view = new MapView({
          container: 'viewDiv',
          map: map,
          center: [-118.24532, 34.05398], //Longitude, latitude
          zoom: 12,
        });

        const routeUrl =
          'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';

        view.on('click', function (event: any) {
          if (view.graphics.length === 0) {
            addGraphic('origin', event.mapPoint);
          } else if (view.graphics.length === 1) {
            addGraphic('destination', event.mapPoint);

            getRoute(); // Call the route service
          } else {
            view.graphics.removeAll();
            addGraphic('origin', event.mapPoint);
          }
        });
        function addGraphic(type: any, point: any) {
          const graphic = new Graphic({
            symbol: {
              type: 'simple-marker',
              color: type === 'origin' ? 'white' : 'black',
              size: '8px',
            },
            geometry: point,
          });
          view.graphics.add(graphic);
        }
        function getRoute() {
          const routeParams = new RouteParameters({
            apiKey:
              'AAPK38c209f021054218bcb40a3ad0a98fb4mbNCjLBuc6XqNxb0Y1IlrMWZCam_yYzIb-9FRr5ah88lyClV83UuUqVJbwtKnaZx',
            stops: new FeatureSet({
              features: view.graphics.toArray(),
            }),
            returnDirections: true,
          });
          route
            .solve(routeUrl, routeParams)
            .then(function (data: { routeResults: any[] }) {
              data.routeResults.forEach(function (result: {
                route: {
                  symbol: { type: string; color: number[]; width: number };
                };
              }) {
                result.route.symbol = {
                  type: 'simple-line',
                  color: [5, 150, 255],
                  width: 3,
                };
                view.graphics.add(result.route);
              });
              // Display directions
              if (data.routeResults.length > 0) {
                const directions = document.createElement('ol');
                directions.className =
                  'esri-widget esri-widget--panel esri-directions__scroller';
                directions.style.marginTop = '0';
                directions.style.padding = '15px 15px 15px 30px';
                const features = data.routeResults[0].directions.features;
                // Show each direction
                features.forEach(function (
                  result: { attributes: { text: string; length: number } },
                  i: any
                ) {
                  const direction = document.createElement('li');
                  direction.innerHTML =
                    result.attributes.text +
                    ' (' +
                    result.attributes.length.toFixed(2) +
                    ' miles)';
                  directions.appendChild(direction);
                });
                view.ui.empty('top-right');
                view.ui.add(directions, 'top-right');
              }
            })
            .catch(function (error: any) {
              console.log(error);
            });
        }
      }
    );
  }
  constructor() {}
  ngOnInit() {
    this.load_2();
    setTimeout(() => {
      this.statee = 'neww';
    }, 200);
  }
}
