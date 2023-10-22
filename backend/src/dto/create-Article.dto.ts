export class CreateArticleDTO {
  readonly _ID: string;

  title: string;

  authors: string[];

  journalName: string;

  pubYear: string;

  source: string;

  DOI: string;

  method: string;

  claim: string;

  result: string;

  researchType: string;

  abstract: string;
}