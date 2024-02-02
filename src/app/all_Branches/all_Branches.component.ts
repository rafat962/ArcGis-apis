import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { loadModules } from 'esri-loader';

@Component({
  selector: 'app-all_Branches',
  templateUrl: './all_Branches.component.html',
  styleUrls: ['./all_Branches.component.css'],
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
export class All_BranchesComponent implements OnInit {
  private mapView: any; // Declare the mapView variable
  private featureLayer: any; // Declare the featureLayer variable
  statee = 'normal';
  constructor() {}

  ngOnInit() {
    this.load();
  }

  load() {
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Fullscreen',
      'esri/widgets/Search',
      'esri/widgets/Locate',
      'esri/widgets/Compass',
      'esri/layers/FeatureLayer',
    ]).then(([Map, View, Full, Search, Locate, Compass, FeatureLayer]) => {
      setTimeout(() => {
        this.statee = 'neww';
      }, 200);
      const map = new Map({
        basemap: 'satellite',
      });
      // Define the popup template
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

      // Create the feature layer with the popup template
      this.featureLayer = new FeatureLayer({
        url: 'https://services7.arcgis.com/vW34tdBYiQgFwtVX/arcgis/rest/services/markets/FeatureServer',
        popupTemplate: myPopupTemplate,
      });

      map.add(this.featureLayer);

      // Create the map view
      this.mapView = new View({
        map: map,
        container: 'mapView',
        center: [31.235, 30.019],
        zoom: 11,
      });

      // Add the filter select dropdown
      const fillter = document.createElement('select');
      fillter.className = 'form-select';
      fillter.innerHTML = `
        <option value="">Bransh location</option>
        <option value="التجمع الخامس">Sheikh Zayed</option>
        <option value="فيصل">Faisal</option>
        <option value="الشيخ زايد">Fifth Settlement</option>
        `;

      // Add event listener to filter features when the selection changes
      fillter.addEventListener('change', (ev: any) => {
        const selectValue = ev.target.value;
        this.applyFilter(selectValue);
      });
      // Add the filter select to the bottom-right of the map
      this.mapView.ui.add(fillter, 'bottom-right');

      // Add other widgets
      const full = new Full({
        view: this.mapView,
      });
      const locate = new Locate({
        view: this.mapView,
      });
      const search = new Search({
        view: this.mapView,
      });
      const compass = new Compass({
        view: this.mapView,
      });

      this.mapView.ui.add(full, 'top-left');
      this.mapView.ui.add(locate, 'top-left');
      this.mapView.ui.add(search, 'top-right');
      this.mapView.ui.add(compass, 'bottom-left');
    });
  }
  applyFilter(filterValue: string) {
    // Set the definitionExpression based on the selected filter value
    const expression = filterValue ? `location = '${filterValue}'` : '1=1';
    this.featureLayer.definitionExpression = expression;
  }
}
