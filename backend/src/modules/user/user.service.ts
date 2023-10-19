import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role, Session, User } from "./user.schema";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { CreateUserDTO } from "../../dto/user/create-User.dto";
import { nanoid } from "nanoid";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, @InjectModel(Session.name) private sessionModel: Model<Session>) {}

    private async generateSession(username: string) : Promise<Session> {
        let session = await this.sessionModel.findOne({ username: username }).exec();

        const createdSession = new this.sessionModel({
            username: username,
            token: nanoid(64),
            issueTime: new Date().getTime() / 1000,
            expiryTime: 3600,
        });

        if(session)
        {
            createdSession._id = session._id;
            await this.sessionModel.updateOne({ username: username }, createdSession).exec();

            return createdSession;
        }

        return createdSession.save();
    }

    create(createUserDto: CreateUserDTO) : Promise<User> {
        if(createUserDto === undefined || createUserDto.username === undefined || createUserDto.password === undefined)
            return null;

        const salt: string = genSaltSync(10);
        const hash: string = hashSync(createUserDto.password, salt);

        const createdUser = new this.userModel({
            username: createUserDto.username,
            salt: salt,
            passwordHash: hash,
            role: Role.USER,
            session: this.generateSession(createUserDto.username),
        });

        return createdUser.save();
    }

    async findByUsername(username: string) : Promise<User> {
        return await this.userModel.findOne({ username: username }).exec();
    }

    async authenticate(password: string, user: User) : Promise<Session | null> {
        if(user === undefined || password === undefined)
            return null;

        let success = compareSync(password, user.passwordHash);

        if(success)
        {
            return await this.generateSession(user.username);
        }

        return null;
    }

    async verify(username: string, token: string) {
        if(username === undefined || token === undefined)
            return null;

        let session = await this.sessionModel.findOne({ username: username }).exec();
        return session.token === token && (new Date().getTime() / 1000) < session.issueTime + session.expiryTime;
    }
}