export class PointModel {
  x: number;
  y: number;
  location: string;
  date: Date;

  constructor(x: number, y: number, location: string, date: Date) {
    this.x = x;
    this.y = y;
    this.location = location;
    this.date = date;
  }
}
