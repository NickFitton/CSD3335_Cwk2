import {Component, Input, OnInit} from '@angular/core';
import {DataModel} from '../../model/data.model';
import {PointModel} from './point.model';
import * as Chart from 'chart.js';
import * as ColorConvert from 'color-convert';
import {FindingModel} from './finding.model';
import {DatePoint} from './datePoint';

@Component({
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.styl']
})
export class FindingsComponent implements OnInit {

  dataset: DataModel[];
  areas: string[];
  finding1Chart: Chart;
  finding2aChart: Chart;
  finding2bChart: Chart;
  finding2cChart: Chart;

  findings: FindingModel[];

  datasetSize: number;
  areaSize: number;

  constructor() {
    this.areas = [];
    this.dataset = [];
    this.findings = [];
    this.findings.push(new FindingModel('Finding 1',
      'Temperature yearly circadian rhythm',
      [
        'Temperature per year follows a yearly circadian rhythm, rising in the summer and dropping in the winter.',
        'There are a few outliers in the data, for example in Kohsoom on the 35th of July 2004 the temperature rose to 37C and in Decha' +
        'on the 16th August 2014 it dropped to 15C.'
      ]));
    this.findings.push(new FindingModel('Finding 2',
      'Herbicides',
      []));
  }

  ngOnInit() {
  }

  @Input()
  set findingAreas(areas: string[]) {
    this.areas = areas;
    this.areaSize = areas.length;

    if (this.dataset.length !== 0) {
      this.generateFindings();
    }
  }

  @Input()
  set findingDataset(dataset: DataModel[]) {
    this.dataset = dataset;
    this.datasetSize = dataset.length;

    if (this.areas.length !== 0) {
      this.generateFindings();
    }
  }

  generateFindings() {
    this.finding1(this.dataset);
    this.finding2(this.dataset);
  }

  finding1(data: DataModel[]) {
    const areaData: DataModel[][] = [];
    for (const area of this.areas) {
      areaData.push(data
        .filter(item => item.location.startsWith(area))
        .filter(item => item.measure.toLocaleLowerCase().startsWith('water temperature')));
    }
    const datasets = [];
    const colors = this.generateColors(areaData.length);
    for (let i = 0; i < areaData.length; i++) {
      const points: PointModel[] = this.convertToPoints(areaData[i]);
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

    this.finding1Chart = this.defineScatterChart(datasets, [], 'finding1', 'scatter');
    this.finding1Chart.update(1);
  }

  finding2(data: DataModel[]) {
    const materialData: DataModel[][] = [];
    const materials = [
      // 'alachlor', 'atrazine', 'trifluralin'
      'Alachlor'
    ];
    const desiredAreas = [
      'boonsri',
      'busarakhan',
      'chai',
      'kannika',
      'kohsoom',
      'sakda',
      'somchair'
    ];
    for (const material of materials) {
      materialData.push(data.filter(item => item.measure.toLowerCase().startsWith(material.toLowerCase())));
    }

    const areaData: DataModel[][] = [];
    for (const area of desiredAreas) {
      areaData.push(materialData[0]
        .filter(item => item.location.toLowerCase().startsWith(area))
        .filter(item => item.sampleDate.getUTCFullYear() > 2004 && item.sampleDate.getUTCFullYear() < 2008));
    }
    const datasets = [];
    const colors = this.generateColors(areaData.length);
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
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

    this.finding2aChart = this.defineLongTimeScatterChart(datasets, [], 'finding2a', 'scatter');
    this.finding2aChart.update(1);
  }

  convertToFullYearPoints(data: DataModel[]): DatePoint[] {
    return data.map(item => new DatePoint(item.sampleDate, item.value, item.location, item.sampleDate));
  }

  convertToPoints(data: DataModel[]): PointModel[] {
    return data.map(item => {
      const endOfYear = new Date(item.sampleDate.getUTCFullYear() + 1, 0, 0);
      const timeSinceStartOfYear = 12 - ((endOfYear.getTime() - item.sampleDate.getTime()) / 31536000000 * 12);
      return new PointModel(timeSinceStartOfYear, item.value, item.location, item.sampleDate);
    });
  }

  defineLongTimeScatterChart(datasets, labels: string[], chartName: string, chartType: string) {
    return new Chart(chartName, {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            position: 'bottom'
          }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const dataPoint = <PointModel> dataset.data[tooltipItem.index];
              return `${dataPoint.location} - ${dataPoint.date.toDateString()}`;
            }
          }
        }
      }
    });
  }

  defineScatterChart(datasets, labels: string[], chartName: string, chartType: string) {
    return new Chart(chartName, {
      type: chartType,
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
            label: function (tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const dataPoint = <PointModel> dataset.data[tooltipItem.index];
              return `${dataPoint.location} - ${dataPoint.date.toDateString()}`;
            }
          }
        }
      }
    });
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
