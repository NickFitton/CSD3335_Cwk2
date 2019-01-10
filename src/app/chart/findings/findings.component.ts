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
  finding3Chart: Chart;
  finding4Chart: Chart;
  finding5Chart: Chart;

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
        'There are a few outliers in the data, for example in Kohsoom on the 35th of July 2004 the temperature rose to 37C and in Decha ' +
        'on the 16th August 2014 it dropped to 15C.'
      ]));
    this.findings.push(new FindingModel('Finding 2',
      'Herbicides',
      [
        'Alachlor and Atrazine are both ingredients in herbicides, both these chemicals have been found in 7 of the' +
        ' locations, suggesting runoff into the river from one of the higher locations.',
        'These measurements were only significant between the years 2005 and 2007.',
        'I decided to use a scatter plot graph over a line graph for this data as multiple results were made a day' +
        ' and it provided a clearer picture of the decline.'
      ]));
    this.findings.push(new FindingModel('Finding 3',
      'Chlorodinine',
      [
        'There was a drop in Chlorodinine levels in 7 of the locations at the start of 2015',
        'The only erroneous measurement being a measurement from Kohsoom.'
      ]));
    this.findings.push(new FindingModel('Finding 4',
      'Cyanides',
      [
        'The levels of Cyanides spiked in Decha in 2010 and 2012, suggesting dumping'
      ]));
    this.findings.push(new FindingModel('Finding 5',
      'Iron',
      [
        'There was a massive spike in Group 8 iron levels on August 10th 2003.',
        ' The spikes indicate the levels were 20-37g/l maybe this was an event of dumping but as the spike only' +
        ' occurred in one reading so this may be due to a faulty sensor.'
      ]));
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
    this.finding3(this.dataset);
    this.finding4(this.dataset);
    this.finding5(this.dataset);
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
      'alachlor', 'atrazine'
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

    const materialDatasets = materialData.map(matDatSet => {
      const areaData: DataModel[][] = [];
      for (const area of desiredAreas) {
        areaData.push(matDatSet
          .filter(item => item.location.toLowerCase().startsWith(area))
          .filter(item => item.sampleDate.getUTCFullYear() > 2004 && item.sampleDate.getUTCFullYear() < 2008));
      }
      let datasets = [];
      const colors = this.generateColors(areaData.length);
      console.log(areaData.length);
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
      datasets = datasets.filter(aDataset => aDataset.data.length > 0);

      return datasets;
    });

    this.finding2aChart = this.defineLongTimeScatterChart(materialDatasets[0], [], 'finding2a', 'scatter');
    this.finding2aChart.update(1);
    this.finding2bChart = this.defineLongTimeScatterChart(materialDatasets[1], [], 'finding2b', 'scatter');
    this.finding2bChart.update(1);
  }

  finding3(data: DataModel[]) {
    const materialData: DataModel[][] = [];
    const materials = [
      'chlorodinine'
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
          .filter(item => item.location.toLowerCase().startsWith(area)));
      }
      const datasets = [];
      const colors = this.generateColors(areaData.length);
      console.log(areaData.length);
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


    this.finding3Chart = this.defineLongTimeScatterChart(datasets, [], 'finding3', 'scatter');
    this.finding3Chart.update(1);
  }

  finding4(data: DataModel[]) {
    const materialData: DataModel[][] = [];
    const materials = [
      'cyanides'
    ];
    const desiredAreas = [
      'decha'
    ];

    for (const material of materials) {
      materialData.push(data.filter(item => item.measure.toLowerCase().startsWith(material.toLowerCase())));
    }

      const areaData: DataModel[][] = [];
      for (const area of desiredAreas) {
        areaData.push(materialData[0]
          .filter(item => item.location.toLowerCase().startsWith(area)));
      }
      const datasets = [];
      const colors = this.generateColors(areaData.length);
      console.log(areaData.length);
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


    this.finding4Chart = this.defineLongTimeScatterChart(datasets, [], 'finding4', 'bar');
    this.finding4Chart.update(1);
  }

  finding5(data: DataModel[]) {
    const materialData: DataModel[][] = [];
    const materials = [
      'iron'
    ];
    const desiredAreas = [
      'busarakhan',
      'chai',
      'kannika',
      'sakda',
      'somchair',
      'kahsoom'
    ];

    for (const material of materials) {
      materialData.push(data.filter(item => item.measure.toLowerCase().startsWith(material.toLowerCase())));
    }

      const areaData: DataModel[][] = [];
      for (const area of desiredAreas) {
        areaData.push(materialData[0]
          .filter(item => item.location.toLowerCase().startsWith(area)));
      }
      const datasets = [];
      const colors = this.generateColors(areaData.length);
      console.log(areaData.length);
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


    this.finding5Chart = this.defineLongTimeScatterChart(datasets, [], 'finding5', 'line');
    this.finding5Chart.update(1);
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
