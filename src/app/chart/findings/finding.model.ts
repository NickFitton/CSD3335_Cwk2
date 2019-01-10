export class FindingModel {
  title: string;
  summary: string;
  paragraphs: string[];

  constructor(title: string,
              summary: string,
              paragraphs: string[]) {
    this.title = title;
    this.summary = summary;
    this.paragraphs = paragraphs;
  }
}
