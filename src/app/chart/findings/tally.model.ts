export class TallyModel {
  date: Date;
  count: number;

  constructor(date: Date) {
    this.date = date;
    this.count = 1;
  }

  increment(): TallyModel {
    this.count = this.count + 1;
    return this;
  }

  toChart() {
    return {
      x: this.date,
      y: this.count
    };
  }
}
