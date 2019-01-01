export class LineModel {
  time: Date;
  value: number;

  constructor(time: Date, count: number) {
    this.time = time;
    this.value = count;
  }
}
