export class DatePoint {
  x: Date;
  y: number;
  location: string;
  date: Date;

  constructor(x: Date, y: number, location: string, date: Date) {
    this.x = x;
    this.y = y;
    this.location = location;
    this.date = date;
  }
}
