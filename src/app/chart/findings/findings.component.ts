import {Component, Input, OnInit} from '@angular/core';
import {DataModel} from '../../model/data.model';
import {PointModel} from './point.model';
import * as Chart from 'chart.js';
import * as ColorConvert from 'color-convert';
import {FindingModel} from './finding.model';
import {DatePoint} from './datePoint';
import {TallyModel} from './tally.model';

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
  anomaly1Chart: Chart;
  anomaly2Chart: Chart;
  anomaly3Chart: Chart;
  birdFinding1Chart: Chart;
  birdFinding2Chart: Chart;
  birdFinding3Chart: Chart;

  findings: FindingModel[];
  anomalies: FindingModel[];
  birdFindings: FindingModel[];

  datasetSize: number;
  areaSize: number;

  constructor() {
    this.areas = [];
    this.dataset = [];
    this.findings = [];
    this.anomalies = [];
    this.birdFindings = [];
    this.findings.push(new FindingModel('Finding 1',
      'Temperature yearly circadian rhythm',
      [
        'Temperature per year follows a yearly circadian rhythm, rising in the summer and dropping in the winter.',
        'There are a few outliers in the data, for example in Kohsoom on the 35th of July 2004 the temperature rose to 37C and in Decha ' +
        'on the 16th August 2014 it dropped to 15C.',
        'Scatter chart seemed like the most affective chart type as I wanted to represent hundreds of data points with data overlapping as little as possible, this wouldn\'t be possible with for example a bar chart,',
        'I felt it was necessary to overlap all the years, this lead to a very clean graph whilst making it easier to read.'
      ]));
    this.findings.push(new FindingModel('Finding 2',
      'Herbicides',
      [
        'Alachlor and Atrazine are both ingredients in herbicides, both these chemicals have been found in 7 of the' +
        ' locations, suggesting runoff into the river from one of the higher locations.',
        'These measurements were only significant between the years 2005 and 2007.',
        'I decided to use a scatter plot graph over a line graph for this data as multiple results were made a day' +
        ' and it provided a clearer picture of the decline.',
        'I used two graphs so as not to over populate the results.'
      ]));
    this.findings.push(new FindingModel('Finding 3',
      'Chlorodinine',
      [
        'There was a drop in Chlorodinine levels in 7 of the locations at the start of 2015',
        'The only erroneous measurement being a measurement from Kohsoom.',
        'Scatter plots clearly denote the movement in measurements. Other types such as line graph and bar graph wouldn\'t have as much clarity.'
      ]));
    this.findings.push(new FindingModel('Finding 4',
      'Cyanides',
      [
        'The levels of Cyanides spiked in Decha in 2010 and 2012, suggesting dumping',
        'A bar graph seemed like the most clear way to represent this data, a scatter plot would have looked too sparse.'
      ]));
    this.findings.push(new FindingModel('Finding 5',
      'Iron',
      [
        'There was a massive spike in a few locations (Busarakhan, Chai, Kannika, Sakda, Somchair, Kahsoom) iron levels on August 10th 2003.',
        ' The spikes indicate the levels were 20-37g/l maybe this was an event of dumping but as the spike only' +
        ' occurred in one reading so this may be due to a faulty sensor.',
        'I used a line chart for this finding as it helps clearly denote where the spike is on the graph.'
      ]));
    this.anomalies.push(new FindingModel('Anomaly 1',
      'Chai water measurements',
      [
        'The consistency of water measurements in Chai shot up and other locations did not do the same.',
        'I chose to use a scatter plot for this graph as I felt that a line graph didn\'t properly' +
        ' represent the consistency without the point markers.',
        'Also included is the measurements for Boonsri for a comparison of the consistencies',
      ]));
    this.anomalies.push(new FindingModel('Anomaly 2',
      'Chai COD-Cr measurements',
      [
        'COD-Cr in Chai was not recorded between May 2005 and July 2006.',
        'This may be due to a broken sensor, the readings were erratic before and after the lack of recordings.',
        'A bar chart seemed the best way to represent this value as a line chart would not have shows that there were null values between two steps (without manipulating the data more)',
        'To generate this graph I tallied up the number of records by year after filtering by location and measure'
      ]));
    this.anomalies.push(new FindingModel('Anomaly 3',
      'Missing data',
      [
        'There are no reading for Nickel from 2000 to the end of 2001.',
        'This may be due to either the data being missing or a malicious entity removing the data.',
        'I chose to use a bar graph for this result because show the missing data unlike a line graph which would draw over the space.',
        'A bar chart seemed the best way to represent this value as a line chart would not have shows that there were null values between two steps (without manipulating the data more)',
        'To generate this graph I tallied up the number of records by year after filtering by location and measure'
      ]));
    this.birdFindings.push(new FindingModel('Finding 1',
      'COD-Cr deters fish',
      [
        'COD-Cr represents the oxygen deficiency of water, fish tend to be dettered from living in low oxygen envrironments.',
        'If the Pipit bird eats wildlife that lives in the water around these areas, they would have to migrate to other locations to eat.',
        'As seen in the graph, COD-Cr ratings in Tansanee become extremely high, suggesting there will not be much wildlife living there.',
        'A filled line chart line chart seemed the most sensible method of representing the peaks in the measurements as a scatter graph would not have directed the reader to the points as clearly.'
      ]));
    this.birdFindings.push(new FindingModel('Finding 2',
      'Arsenic',
      [
        'The current drinking water standard, or Maximum Contaminant Level (MCL), from the U.S. Environmental' +
        ' Protection Agency (EPA) is 0.010 mg/L or parts per million (ppm).',
        'Arsenic is a very poisonous chemical that was found to be in multiple locations in the dataset.',
        'Between 2008 and 2016 arsenic readings have slowly increased in some areas (Chai, Kannika, Sakda, Somchair, Tansanee),' +
        ' the data between these locations has a strong positive correlation.',
        'One reading (Tansanee - August 9, 2015) was way over the safe level of Arsenic (10μg) at 17μg,' +
        ' this may be due to an erroneous reading but is definitely worrying.',
        'A line graph was the most fitting as I was trying to show a continuous trend over time.'
      ]));
    this.birdFindings.push(new FindingModel('Finding 3',
      'Damage to plantlife',
      [
        'The water supplies in some locations (Boonsri, Busarakhan, Chai, Kannika, Kohsoom, Sakda, Somchair, Tansanee)' +
        ' have severe levels of Bicarbonates in the water supply.',
        'The maximum safe level of Bicarbonate in water is 150ppm',
        'Bicarbonates damage plants that live near the waters, giving the wildlife less vegetation to eat/area to scavenge.',
        'The data shows a yearly circadian cycle, meaning the cause may be seasonal' +
        ' or there is a time of year where pollutants are more likely to be produced by entities.',
        'The line graph was the most effective for this finding. A bar chart would have been good for comparing the data at a single time but I wanted a continuous flow of data.'
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
    this.anomaly1(this.dataset);
    this.anomaly2(this.dataset);
    this.anomaly3(this.dataset);
    this.birdFinding1(this.dataset);
    this.birdFinding2(this.dataset);
    this.birdFinding3(this.dataset);
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

    this.finding1Chart = this.defineScatterChart(datasets, [], 'finding1', 'scatter', 'Month of the year', 'Water Temperature (°C)');
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
      for (let i = 0; i < areaData.length; i++) {
        const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
        datasets.push({
          label: desiredAreas[i],
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

    this.finding2aChart = this.defineLongTimeScatterChart(
      materialDatasets[0],
      [],
      'finding2a',
      'scatter',
      'Date of Recording',
      'Alachlor level (μg)');
    this.finding2aChart.update(1);
    this.finding2bChart = this.defineLongTimeScatterChart(
      materialDatasets[1],
      [],
      'finding2b',
      'scatter',
      'Date of Recording',
      'Atrazine level (μg)');
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
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: desiredAreas[i],
        labelColor: colors[i],
        data: points,
        pointRadius: 2,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 1
      });
    }


    this.finding3Chart = this.defineLongTimeScatterChart(
      datasets,
      [],
      'finding3',
      'scatter',
      'Date of Recording',
      'Chlorodinine level (μg)');
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
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: desiredAreas[i],
        labelColor: colors[i],
        data: points,
        pointRadius: 2,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 1
      });
    }


    this.finding4Chart = this.defineLongTimeScatterChart(datasets, [], 'finding4', 'bar', 'Date of Recording', 'Cyanide Levels (μg)');
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
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: desiredAreas[i],
        labelColor: colors[i],
        data: points,
        pointRadius: 2,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 1
      });
    }


    this.finding5Chart = this.defineLongTimeScatterChart(datasets, [], 'finding5', 'line', 'Date of Recording', 'Iron Levels (μg)');
    this.finding5Chart.update(1);
  }

  anomaly1(data: DataModel[]) {
    const materialData: DataModel[][] = [];
    const materials = [
      'water temperature'
    ];
    const desiredAreas = [
      'boonsri',
      'chai'
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
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: desiredAreas[i],
        labelColor: colors[i],
        data: points,
        pointRadius: 2,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 1
      });
    }


    this.anomaly1Chart = this.defineLongTimeScatterChart(datasets, [], 'anomaly1', 'scatter', 'Date of Recording', 'Water Temperature (°C)');
    this.anomaly1Chart.update(1);
  }

  anomaly2(data: DataModel[]) {
    const material = 'Chemical Oxygen Demand (Cr)';
    const desiredArea = 'chai';

    const chaiChems = data.filter(item => item.measure.toLowerCase().startsWith(material.toLowerCase()))
      .filter(item => item.location.toLowerCase().startsWith(desiredArea.toLowerCase()));

    const months: Map<string, TallyModel> = new Map();
    for (const point of chaiChems) {
      const pointMonth = `${point.sampleDate.getUTCFullYear()}`;
      if (months.has(pointMonth)) {
        months.set(pointMonth, months.get(pointMonth).increment());
      } else {
        months.set(pointMonth, new TallyModel(new Date(point.sampleDate.getUTCFullYear(), 1, 1)));
      }
    }

    const monthValues = Array.from(months.values());
    const color = this.generateColors(2)[0];

    this.anomaly2Chart = this.defineLongTimeScatterChart([{
      label: 'quantity',
      labelColor: color,
      data: monthValues.map(tally => tally.toChart()),
      backgroundColor: color[0],
      borderColor: color[1],
      borderWidth: 1
    }], [], 'anomaly2', 'bar', 'Date of Recording', 'Oxygen Demand (mg/l)');
  }

  anomaly3(data: DataModel[]) {
    const materials = [
      'nickel'
    ];

    const nickelPoints = data.filter(item => item.measure.toLowerCase().startsWith(materials[0].toLowerCase()));

    const months: Map<string, TallyModel> = new Map();
    for (const point of nickelPoints) {
      const pointMonth = `${point.sampleDate.getUTCFullYear()}`;
      if (months.has(pointMonth)) {
        months.set(pointMonth, months.get(pointMonth).increment());
      } else {
        months.set(pointMonth, new TallyModel(new Date(point.sampleDate.getUTCFullYear(), 1, 1)));
      }
    }

    const monthValues = Array.from(months.values());
    const color = this.generateColors(2)[0];


    this.anomaly3Chart = this.defineLongTimeScatterChart([{
      label: 'quantity',
      labelColor: color,
      data: monthValues.map(tally => tally.toChart()),
      backgroundColor: color[0],
      borderColor: color[1],
      borderWidth: 1
    }], [], 'anomaly3', 'bar', 'Month of Recordings', 'Nickel content (μg)');
    this.anomaly3Chart.update(1);
  }

  birdFinding1(data: DataModel[]) {
    const areaData: DataModel[][] = [];
    for (const area of this.areas) {
      areaData.push(data
        .filter(item => item.location.startsWith(area))
        .filter(item => item.measure.toLocaleLowerCase().startsWith('chemical oxygen demand (cr)')));
    }
    const datasets = [];
    const colors = this.generateColors(areaData.length);
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: this.areas[i],
        labelColor: colors[i],
        data: this.sortlines(points),
        pointRadius: 2,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 1
      });
    }

    this.birdFinding1Chart = this.defineLongTimeScatterChart(datasets, [], 'birdFinding1', 'line', 'Month of Recordings', 'Chemical Oxygen Demand (Cr)');
    this.birdFinding1Chart.update(1);
  }

  birdFinding2(data: DataModel[]) {
    const desiredAreas = [
      'chai',
      'kannika',
      'sakda',
      'somchair',
      'tansanee'
    ];

    const arsenicData = data.filter(item => item.measure.toLowerCase().startsWith('arsenic'));
    console.log(arsenicData.length);

    const areaData: DataModel[][] = [];
    for (const area of desiredAreas) {
      areaData.push(arsenicData
        .filter(item => item.location.toLowerCase().startsWith(area))
        .filter(item => item.sampleDate.getUTCFullYear() > 2007));
    }
    let datasets = [];
    const colors = this.generateColors(areaData.length);
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: desiredAreas[i],
        labelColor: colors[i],
        data: points,
        fill: false,
        lineTension: 0,
        pointRadius: 0,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 2
      });
    }
    datasets = datasets.filter(aDataset => aDataset.data.length > 0);


    this.birdFinding2Chart = this.defineLongTimeScatterChart(datasets, [], 'birdFinding2', 'line', 'Month of Recording', 'Arsenic Level (μg)');
    this.birdFinding2Chart.update(1);
  }

  birdFinding3(data: DataModel[]) {
    const desiredAreas = [
      'boonsri',
      'busarakhan',
      'chai',
      'kannika',
      'kohsoom',
      'sakda',
      'somchair',
      'tansanee'
    ];

    const arsenicData = data.filter(item => item.measure.toLowerCase().startsWith('bicarbonates'));
    console.log(arsenicData.length);

    const areaData: DataModel[][] = [];
    for (const area of desiredAreas) {
      areaData.push(arsenicData
        .filter(item => item.location.toLowerCase().startsWith(area))
        .filter(item => item.sampleDate.getUTCFullYear() > 2007));
    }
    let datasets = [];
    const colors = this.generateColors(areaData.length);
    for (let i = 0; i < areaData.length; i++) {
      const points: DatePoint[] = this.convertToFullYearPoints(areaData[i]);
      datasets.push({
        label: desiredAreas[i],
        labelColor: colors[i],
        data: points,
        pointRadius: 0,
        fill: false,
        backgroundColor: colors[i][0],
        borderColor: colors[i][1],
        borderWidth: 2
      });
    }
    datasets = datasets.filter(aDataset => aDataset.data.length > 0);


    this.birdFinding3Chart = this.defineLongTimeScatterChart(datasets, [], 'birdFinding3', 'line', 'Month of Recording', 'Bicarbonates (mg/l)');
    this.birdFinding3Chart.update(1);
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

  defineLongTimeScatterChart(datasets, labels: string[], chartName: string, chartType: string, xLabel: string, yLabel: string) {
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
            position: 'bottom',
            scaleLabel: {
              display: true,
              labelString: xLabel
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: yLabel
            }
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

  defineScatterChart(datasets, labels: string[], chartName: string, chartType: string, xLabel: string, yLabel: string) {
    return new Chart(chartName, {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: xLabel
            },
            type: 'linear',
            position: 'bottom'
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: yLabel
            }
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

  sortlines(models: DatePoint[]): DatePoint[] {
    return models.sort((a, b) => {
      if (a.date.getTime() < b.date.getTime()) {
        return -1;
      }
      return 1;
    });
  }
}
