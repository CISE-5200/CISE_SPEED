export class CreateArticleDTO {
  readonly _ID: string;

  title: string;

  authors: string[];

  journal: string;

  year: string;

  source: string;

  doi: string;

  method: string;

  claim: string;

  result: string;

  researchType: string;

  abstract: string;
}