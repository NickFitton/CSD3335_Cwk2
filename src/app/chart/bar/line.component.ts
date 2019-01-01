import {Component, Input, OnInit} from '@angular/core';
import {LineModel} from './line.model';
import * as Chart from 'chart.js';
import {DataModel} from '../../model/data.model';

@Component({
  selector: 'app-chartjsline-graph-component',
  templateUrl: './line.component.html'
})
export class LineComponent implements OnInit {

  chartType: string;
  chart: Chart;

  constructor() {
    this.chartType = 'line';
  }

  @Input()
  set dataPoints(data: DataModel[]) {
    this.setDataPoints(data);
  }

  @Input()
  set graphType(type: string) {
    if (type !== undefined) {
      this.chartType = type;
      if (this.chart !== undefined) {
        this.chart.config.type = type;
        this.chart.update();
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

  setDataPoints(input: DataModel[]) {
    if (this.chart !== undefined) {
      this.chart.destroy();
    }

    let bars: LineModel[] = LineComponent.convertToBars(input);
    bars = LineComponent.sortBars(bars);

    let data: number[] = [];

    const labels = LineComponent.writeLabels(bars);
    if (bars.length > 0) {
      data = bars.map(bar => bar.value);
    }

    this.chart = new Chart(
      'canvas',
      {
        type: this.chartType,
        data: {
          labels: labels.map(label => label.toISOString()),
          datasets: [
            {
              data: data,
              borderWidth: 1,
              borderColor: '#ff0000',
              backgroundColor: '#ff7d7d',
              fill: true,
              pointRadius: 0
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
    this.chart.update(1);
  }
}
