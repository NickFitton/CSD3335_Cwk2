import {Component} from '@angular/core';
import {DataModel} from './model/data.model';
import {MeasurementModel} from './model/measurement.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {

  data: DataModel[];
  measurements: MeasurementModel[];

  constructor() {
    this.data = [];
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

        this.data = this.parseData(lines);
        console.log('Measurements loaded');
      };
    }
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
    if (params.length !== 5) {
      const tempParams = [];
      tempParams.push(params.pop());
      tempParams.push(params.pop());
      tempParams.push(params.pop());
      tempParams.push(params.pop());
      tempParams.push(params.join(','));
      params = tempParams;
    }
    return new DataModel(parseInt(params[0], 10), parseFloat(params[1]), params[2], new Date(params[3]), params[4]);
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

        this.measurements = this.parseMeasurements(lines);
        console.log('Measurements loaded');
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
      params.reverse();
      tempParams.push(params.pop());
      params.reverse();
      tempParams.push(params.join(','));
      params = tempParams.reverse();
      return new MeasurementModel(params[0], params[1]);
    } else {
      return null;
    }
  }
}
