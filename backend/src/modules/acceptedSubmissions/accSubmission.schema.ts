import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AccSubmissionDocument = HydratedDocument<AccSubmission>;

@Schema()
export class AccSubmission {
  @Prop({ required: true })
  title: string;

  @Prop([String])
  authors: string[];

  @Prop({ required: true })
  journalName: string;

  @Prop({ required: true })
  pubYear: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  DOI: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  claim: string;

  @Prop({ required: true })
  result: string;

  @Prop({ required: true })
  researchType: string;

  @Prop({ required: true })
  abstract: string;
}

export const AccSubmissionSchema = SchemaFactory.createForClass(AccSubmission);
