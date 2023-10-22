export class CreateArticleDTO {
  readonly _ID: string;

  title: string;

  authors: string[];
  year: number;
  journal: string;
  method: string;
  claim: string;
  result: string;
  researchType: string;
  participant: string;
  status: string;
  abstract: string;
  type: string;
}
