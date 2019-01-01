import {Component, Input, OnInit} from '@angular/core';
import {LineModel} from './line.model';
import * as Chart from 'chart.js';
import {DataModel} from '../../model/data.model';

@Component({
  selector: 'app-chartjsline-graph-component',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.styl']
})
export class LineComponent implements OnInit {

  chartType: string;
  charts: Chart[];
  canvasIds: string[];

  constructor() {
    this.charts = [];
    this.canvasIds = [
      'canvas0',
      'canvas1',
      'canvas2',
      'canvas3',
      'canvas4',
      'canvas5',
      'canvas6',
      'canvas7',
      'canvas8',
      'canvas9'
    ];
    this.chartType = 'line';
  }

  @Input()
  set dataPoints(data: DataModel[][]) {
    let pointer = 0;
    while (data.length > pointer && this.canvasIds.length > pointer) {
      this.setDataPoints(data[pointer], this.charts[pointer], this.canvasIds[pointer]);
      pointer++;
    }
  }

  @Input()
  set graphType(type: string) {
    if (type !== undefined) {
      this.chartType = type;
      for (const chart of this.charts) {
        chart.config.type = type;
        chart.update();
      }
    }
  }

  static sortBars(models: LineModel[]): LineModel[] {
    return models.sort((a, b) => {
      if (a.time.getTime() / 1000 < b.time.getTime() / 1000) {
        return -1;
      }
      return 1;
    });
  }

  static convertToBars(data: DataModel[]): LineModel[] {
    return data.map(item => new LineModel(item.sampleDate, item.value));
  }

  static writeLabels(bars: LineModel[]): Date[] {
    return bars.map(bar => bar.time);
  }

  ngOnInit() {
  }

  setDataPoints(input: DataModel[], chart: Chart, chartName: string) {
    console.log(input);
    if (chart !== undefined) {
      chart.destroy();
    }

    let bars: LineModel[] = LineComponent.convertToBars(input);
    bars = LineComponent.sortBars(bars);

    let data: number[] = [];

    const labels = LineComponent.writeLabels(bars);
    if (bars.length > 0) {
      data = bars.map(bar => bar.value);
    }

    chart = new Chart(
      chartName,
      {
        type: this.chartType,
        data: {
          labels: labels.map(label => label.toISOString()),
          datasets: [
            {
              data: data,
              borderWidth: 1,
              borderColor: this.getRandomColor(),
              fill: false,
              pointRadius: 0,
              lineTension: 0
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'linear',
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    chart.update(1);
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
