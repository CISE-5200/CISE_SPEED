import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type AccSubmissionDocument = HydratedDocument<AccSubmission>;

@Schema()
export class AccSubmission {
  @Prop()
  title: string;
  @Prop()
  authors: string[];
  @Prop()
  date: string;
  @Prop()
  journal: string;
  @Prop()
  volume: number;
  @Prop()
  issue: number;
  @Prop()
  pageRange: [number, number];
  @Prop()
  doi: string;
}

export const AccSubmissionSchema = SchemaFactory.createForClass(AccSubmission);
