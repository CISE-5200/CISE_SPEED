export class CreateArticleDTO {
  title: string;

  authers: string[];

  journalName: string;

  pubYear: string;

  volume: number;

  number: number;

  pages: [number, number];

  DOI: string;

  keywords: string[];

  abstract: string;
}
