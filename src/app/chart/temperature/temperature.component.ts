import {Component, Input, OnInit} from '@angular/core';
import * as Chart from 'chart.js';
import {DataModel} from '../../model/data.model';
import {PointModel} from './point.model';
import * as ColorConvert from 'color-convert';

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

  ngOnInit() {
  }

  convertToPoints(data: DataModel[]): PointModel[] {
    return data.map(item => {
      const endOfYear = new Date(item.sampleDate.getUTCFullYear() + 1, 0, 0);
      const timeSinceStartOfYear = 12 - ((endOfYear.getTime() - item.sampleDate.getTime()) / 31536000000 * 12);
      return new PointModel(timeSinceStartOfYear, item.value, item.location, item.sampleDate);
    });
  }

  setDataPoints(input: DataModel[][]) {
    const datasets = [];
    const labels = [];
    const colors = this.generateColors(input.length);
    for (let i = 0; i < input.length; i++) {
      const points: PointModel[] = this.convertToPoints(input[i]);
      datasets.push({
        label: this.areas[i],
        labelColor: colors[i],
        data: points,
        pointRadius: 2,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 1
      });
    }

    this.chart = new Chart('temperature', {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom'
          }]
        },
          tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const dataPoint = <PointModel> dataset.data[tooltipItem.index];
                    return `${dataPoint.location} - ${dataPoint.date.toDateString()}`;
                }
            }
          }
      }
    });
    this.chart.update(1);
  }

  generateColors(count: number): string[][] {
    const colors: string[][] = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor(((i + 1) / count) * 360);
      const rgbLight = ColorConvert.hsv.rgb([hue, 75, 95]);
      const rgbDark = ColorConvert.hsv.rgb([hue, 80, 90]);
      const light = `#${rgbLight[0].toString(16)}${rgbLight[1].toString(16)}${rgbLight[2].toString(16)}`;
      const dark = `#${rgbDark[0].toString(16)}${rgbDark[1].toString(16)}${rgbDark[2].toString(16)}`;
      colors.push([light, dark]);
    }
    return colors;
  }
}
