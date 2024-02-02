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
  selector: 'app-service_area',
  templateUrl: './service_area.component.html',
  styleUrls: ['./service_area.component.css'],
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
export class Service_areaComponent implements OnInit {
  constructor() {}
  statee = 'normal';
  initializeMap() {
    loadModules([
      'esri/config',
      'esri/Map',
      'esri/views/MapView',
      'esri/rest/serviceArea',
      'esri/rest/support/ServiceAreaParameters',
      'esri/rest/support/FeatureSet',
      'esri/Graphic',
      'esri/widgets/Locate',
      'esri/widgets/Fullscreen',
      'esri/widgets/Search',
      'esri/widgets/Compass',
      'esri/layers/FeatureLayer',
    ])
      .then(
        ([
          esriConfig,
          Map,
          View,
          serviceArea,
          ServiceAreaParams,
          FeatureSet,
          Graphic,
          Locate,
          Full,
          Search,
          Compass,
          FeatureLayer,
        ]) => {
          esriConfig.apiKey =
            'AAPK38c209f021054218bcb40a3ad0a98fb4mbNCjLBuc6XqNxb0Y1IlrMWZCam_yYzIb-9FRr5ah88lyClV83UuUqVJbwtKnaZx';
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
            var expression = filterValue
              ? `location = '${filterValue}'`
              : '1=1';
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

          const serviceAreaUrl =
            'https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea';

          view.on('click', function (event: any) {
            const locationGraphic = createGraphic(event.mapPoint);

            const driveTimeCutoffs = [5, 10, 15]; // Minutes
            const serviceAreaParams = createServiceAreaParams(
              locationGraphic,
              driveTimeCutoffs,
              view.spatialReference
            );

            solveServiceArea(serviceAreaUrl, serviceAreaParams);
          });

          // Create the location graphic
          function createGraphic(point: any) {
            view.graphics.removeAll();
            const graphic = new Graphic({
              geometry: point,
              symbol: {
                type: 'simple-marker',
                color: 'white',
                size: 0,
              },
            });

            view.graphics.add(graphic);
            return graphic;
          }

          function createServiceAreaParams(
            locationGraphic: any,
            driveTimeCutoffs: any,
            outSpatialReference: any
          ) {
            // Create one or more locations (facilities) to solve for
            const featureSet = new FeatureSet({
              features: [locationGraphic],
            });

            // Set all of the input parameters for the service
            const taskParameters = new ServiceAreaParams({
              facilities: featureSet,
              defaultBreaks: driveTimeCutoffs,
              trimOuterPolygon: true,
              outSpatialReference: outSpatialReference,
            });
            return taskParameters;
          }

          function solveServiceArea(url: any, serviceAreaParams: any) {
            return serviceArea.solve(url, serviceAreaParams).then(
              function (result: any) {
                if (result.serviceAreaPolygons.features.length) {
                  // Draw each service area polygon
                  result.serviceAreaPolygons.features.forEach(function (
                    graphic: any
                  ) {
                    graphic.symbol = {
                      type: 'simple-fill',
                      color: 'rgba(255,50,50,.25)',
                    };
                    view.graphics.add(graphic, 0);
                  });
                }
              },
              function (error: any) {
                console.log(error);
              }
            );
          }
        }
      )
      .catch((error: any) => {
        console.error('Error loading Esri modules:', error);
      });
  }

  ngOnInit() {
    this.initializeMap();
    setTimeout(() => {
      this.statee = 'neww';
    }, 200);
  }
}
