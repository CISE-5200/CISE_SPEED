/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument} from "mongoose";

export type SubmissionDocument = HydratedDocument<Submission>;

@Schema()
export class Submission {
  @Prop()
  title: string;

  @Prop()
  authors: string[];

  @Prop()
  journalName: string;

  @Prop()
  pubYear: string;

  @Prop()
  source: string;

  @Prop()
  DOI: string;

  @Prop()
  method: string;

  @Prop()
  claim: string;

  @Prop()
  result: string;

  @Prop()
  researchType: string;

  @Prop()
  abstract: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
