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
  year: number;
  @Prop()
  journal: string;
  @Prop()
  method: string;
  @Prop()
  claim: string;
  @Prop()
  result: string;
  @Prop()
  researchType: string;
  @Prop()
  participant: string;
  @Prop()
  status: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
