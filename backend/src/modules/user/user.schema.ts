import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
export type SessionDocument = HydratedDocument<Session>;

export enum Role {
    ADMIN,
    ANALYST,
    MODERATOR,
    USER,
};

@Schema()
export class Session {
    @Prop({ unique: true, index: true, required: true })
    username: string;

    @Prop({ required: true })
    token: string;

    @Prop({ required: true })
    issueTime: number;

    @Prop({ required: true })
    expiryTime: number;
}

@Schema()
export class User {
    @Prop({ unique: true, index: true, required: true })
    username: string;

    @Prop({ required: true })
    salt: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true })
    role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const SessionSchema = SchemaFactory.createForClass(Session);