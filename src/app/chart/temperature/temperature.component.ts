import {Component, Input, OnInit} from '@angular/core';
import {LineModel} from '../bar/line.model';
import * as Chart from 'chart.js';
import {DataModel} from '../../model/data.model';
import {PointModel} from './point.model';

@Component({
  selector: 'app-chartjs-temperature-graph-component',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.styl']
})
export class TemperatureComponent implements OnInit {

  chartType: string;
  chart: Chart;
  areas: string[];

  constructor() {
    this.chartType = 'scatter';
  }

  ngOnInit() {
  }

  @Input()
  set existingAreas(areas: string[]) {
    this.areas = areas;
  }

  @Input()
  set dataPoints(data: DataModel[]) {
    const areaData: DataModel[][] = [];
    for (const area of this.areas) {
      areaData.push(data
        .filter(item => item.location.startsWith(area))
        .filter(item => item.measure.toLocaleLowerCase().startsWith('water temperature')));
    }
    this.setDataPoints(areaData);
  }

  convertToPoints(data: DataModel[]): PointModel[] {
    return data.map(item => {
      const endOfYear = new Date(item.sampleDate.getUTCFullYear() + 1, 0, 0);
      const timeSinceStartOfYear = (endOfYear.getTime() - item.sampleDate.getTime()) / 31536000000 * 12;

      return new PointModel(timeSinceStartOfYear, item.value);
    });
  }

  sortDataPoints(models: DataModel[]): DataModel[] {
    return models.sort((a, b) => {
      if (a.sampleDate.getTime() < b.sampleDate.getTime()) {
        return -1;
      }
      return 1;
    });
  }

  setDataPoints(input: DataModel[][]) {
    const datasets = [];
    for (let i = 0; i < input.length; i++) {
      input[i] = this.sortDataPoints(input[i]);
      const points: PointModel[] = this.convertToPoints(input[i]);
      const randomColor = this.getRandomColor();
      datasets.push({
        label: this.areas[i],
        labelColor: randomColor,
        data: points,
        pointRadius: 2,
        backgroundColor: randomColor,
        borderWidth: 0
      });
    }

    this.chart = new Chart('temperature', {
      type: 'scatter',
      data: {
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom'
          }]
        }
      }
    });
    this.chart.update(1);
  }

  getRandomColor() {
    const letters = '3456789ABC';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }
}
