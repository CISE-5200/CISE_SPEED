import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RejSubmissionDocument = HydratedDocument<RejSubmission>;

@Schema()
export class RejSubmission {
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

export const RejSubmissionSchema = SchemaFactory.createForClass(RejSubmission);
