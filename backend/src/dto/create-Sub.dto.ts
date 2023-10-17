export class CreateSubDTO {
  title: string;
  authors: string[];
  date: string;
  journal: string;
  volume: number;
  issue: number;
  pageRange: [number, number];
  doi: string;
}
