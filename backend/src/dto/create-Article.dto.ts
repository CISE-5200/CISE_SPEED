export class CreateArticleDTO {
  readonly _ID: string;
  readonly _id?: string;

  title: string;

  authors: string[];

  journal: string;

  year: string;

  source: string;

  doi: string;

  participant: string;

  method: string;

  claim: string;

  result: string;

  researchType: string;

  abstract: string;
  type: string;
}
