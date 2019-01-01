export class DataModel {
  id: number;
  value: number;
  location: string;
  sampleDate: Date;
  measure: string;

  constructor(id: number,
              value: number,
              location: string,
              sampleDate: Date,
              measure: string) {
    this.id = id;
    this.value = value;
    this.location = location;
    this.sampleDate = sampleDate;
    this.measure = measure;
  }
}
