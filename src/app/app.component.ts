import {Component, Input} from '@angular/core';
import {DataModel} from './model/data.model';
import {MeasurementModel} from './model/measurement.model';
import * as Chart from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {

  data: DataModel[];
  measurements: MeasurementModel[];
  areas: string[];
  dataset: DataModel[];
  measure: MeasurementModel;
  selectedArea: string;

  constructor() {
    this.data = [];
    this.dataset = [];
    this.measurements = [];
  }

  loadData(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);
      this.data = [];

      reader.onload = () => {
        const content = <string> reader.result;
        const lines: string[] = content.split('\n');

        if (lines[0].startsWith('id,value,location,sample date,measure')) {
          this.data = this.parseData(lines);
          this.areas = this.unique(this.data.map(item => item.location));
          console.log('Dataset loaded');
        } else {
          console.error('Invalid file loaded');
        }

      };
    }
  }

  unique(items: string[]): string[] {
    const unique = [];

    for (const item of items) {
      if (!unique.includes(item)) {
        unique.push(item);
      }
    }

    return unique;
  }

  parseData(lines: string[]): DataModel[] {
    const parsedMeasurements: DataModel[] = [];

    let firstLine = true;
    for (const line of lines) {
      if (firstLine) {
        firstLine = false;
      } else {
        const data = this.dataFromCsv(line);
        if (data !== null) {
          parsedMeasurements.push(data);
        }
      }
    }
    return parsedMeasurements;
  }

  dataFromCsv(line: string): DataModel {
    let params = line.split(',');
    if (params.length > 5) {
      const tempParams = [];
      tempParams.push(params.shift());
      tempParams.push(params.shift());
      tempParams.push(params.shift());
      tempParams.push(params.shift());
      tempParams.push(params.join(','));
      params = tempParams;
    }
    if (params.length !== 5) {
      return null;
    }
    // const date = moment(params[3], 'DD-MMM-YY').toDate();
    const date = new Date(params[3]);
    return new DataModel(parseInt(params[0], 10), parseFloat(params[1]), params[2], date, params[4]);
  }

  loadMeasurements(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);
      this.measurements = [];

      reader.onload = () => {
        const content = <string> reader.result;
        const lines: string[] = content.split('\n');
        if (lines[0].startsWith('measure,unit')) {
          this.measurements = this.parseMeasurements(lines);
          console.log('Measurements loaded');
        } else {
          console.error('Invalid file loaded');
        }
      };
    }
  }

  parseMeasurements(lines: string[]): MeasurementModel[] {
    const parsedMeasurements: MeasurementModel[] = [];

    let firstLine = true;
    for (const line of lines) {
      if (firstLine) {
        firstLine = false;
      } else {
        const measurement = this.measurementFromCsv(line);
        if (measurement !== null) {
          parsedMeasurements.push(measurement);
        }
      }
    }
    return parsedMeasurements;
  }

  measurementFromCsv(line: string): MeasurementModel {
    let params = line.split(',');
    if (params.length === 2) {
      return new MeasurementModel(params[0], params[1]);
    } else if (params.length > 2) {
      const tempParams = [];
      tempParams.push(params.pop());
      tempParams.push(params.join(','));
      params = tempParams.reverse();
      // while (params[0].includes('"')) {
      //   params[0] = params[0].replace('"', '');
      // }
      return new MeasurementModel(params[0], params[1]);
    } else {
      return null;
    }
  }

  generateGraph() {
    if (this.measure.measure !== '' && this.selectedArea !== '') {
      this.dataset = this.data
        .filter(item => item.location.startsWith(this.selectedArea))
        .filter(item => item.measure.startsWith(this.measure.measure));
    }
  }
}
