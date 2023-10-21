import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MethodDocument = HydratedDocument<Method>;

@Schema()
export class Method {
    @Prop()
    id: string;

    @Prop()
    name: string;
}

export const MethodSchema = SchemaFactory.createForClass(Method);