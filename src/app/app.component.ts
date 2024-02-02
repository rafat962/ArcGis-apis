import { Component, OnInit } from '@angular/core';
import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
constructor() {}


load(){
  loadModules(["esri/WebScene", "esri/analysis/AreaMeasurementAnalysis", "esri/views/SceneView"]).then((
    [WebScene,AreaMeasurementAnalysis,
    SceneView]
  ) => {
    const map = new WebScene({
      portalItem: {
        id: "340f87d4f3ef4184b04bcd76261cdf9c"
      }
    });

    const view = new SceneView({
      container: "viewDiv",
      map,
      qualityProfile: "high"
    });

    // create a AreaMeasurement object and add it to the `view.analyses`
    const areaMeasurementAnalysis = new AreaMeasurementAnalysis();
    view.analyses.add(areaMeasurementAnalysis);

    view.when(() => {
      const hitTestLayers = view.map.layers.filter((layer:any) => layer.title === "Parcels");
      view.on("click", async (event:any) => {
        // remove the current measured geometry from the layer when the user clicks on the map
        areaMeasurementAnalysis.geometry = null;
        // get results only from the "Parcels" layer
        const hitTestResult = await view.hitTest(event, { include: hitTestLayers });
        if (hitTestResult.results.length > 0) {
          const geometry = hitTestResult.results[0].graphic.geometry;
          // pass the polygon geometry to the areaMeasurementAnalysis to display a new measurement
          areaMeasurementAnalysis.geometry = geometry;
          // zoom to the selected geometry
          view.goTo(geometry);
        }
      });
    });

    view.ui.add("info", "top-right");
  });
}


initializeMap() {
  loadModules([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',
    'esri/rest/serviceArea',
    'esri/rest/support/ServiceAreaParameters',
    'esri/rest/support/FeatureSet',
    'esri/Graphic'
  ]).then(([esriConfig, Map, MapView, serviceArea, ServiceAreaParams, FeatureSet, Graphic]) => {


    const map = new Map({
      basemap: 'satellite'
    });

    const view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [135.5023, 34.6937], // Longitude, latitude
      zoom: 11
    });

    const serviceAreaUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea';

    view.on('click', function (event:any) {

      const locationGraphic = createGraphic(event.mapPoint);

      const driveTimeCutoffs = [5, 10, 15]; // Minutes
      const serviceAreaParams = createServiceAreaParams(locationGraphic, driveTimeCutoffs, view.spatialReference);

      solveServiceArea(serviceAreaUrl, serviceAreaParams);

    });
    // Create the location graphic
    function createGraphic(point:any) {
      view.graphics.removeAll();
      const graphic = new Graphic({
        geometry: point,
        symbol: {
          type: 'simple-marker',
          color: 'white',
          size: 8
        }
      });

      view.graphics.add(graphic);
      return graphic;
    }

    function createServiceAreaParams(locationGraphic:any, driveTimeCutoffs:any, outSpatialReference:any) {

      // Create one or more locations (facilities) to solve for
      const featureSet = new FeatureSet({
        features: [locationGraphic]
      });

      // Set all of the input parameters for the service
      const taskParameters = new ServiceAreaParams({
        facilities: featureSet,
        defaultBreaks: driveTimeCutoffs,
        trimOuterPolygon: true,
        outSpatialReference: outSpatialReference
      });
      return taskParameters;

    }

    function solveServiceArea(url:any, serviceAreaParams:any) {

      return serviceArea.solve(url, serviceAreaParams)
        .then(function (result:any) {
          if (result.serviceAreaPolygons.features.length) {
            // Draw each service area polygon
            result.serviceAreaPolygons.features.forEach(function (graphic:any) {
              graphic.symbol = {
                type: 'simple-fill',
                color: 'rgba(255,50,50,.25)'
              };
              view.graphics.add(graphic, 0);
            });
          }
        }, function (error:any) {
          console.log(error);
        });

    }

  }).catch((error:any) => {
    console.error('Error loading Esri modules:', error);
  })
}
ngOnInit() {

}



}
