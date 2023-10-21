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

    async create(createUserDto: CreateUserDTO) : Promise<{user: User, session: Session}> {
        if(createUserDto === undefined || createUserDto.username === undefined || createUserDto.password === undefined)
            return undefined;

        let user = await this.userModel.findOne({ username: createUserDto.username }).exec();

        if(user)
        {
            return null;
        }

        const salt: string = genSaltSync(10);
        const hash: string = hashSync(createUserDto.password, salt);

        const createdUser = new this.userModel({
            username: createUserDto.username,
            salt: salt,
            passwordHash: hash,
            role: Role.USER
        });

        let session = await this.generateSession(createUserDto.username);

        return {
            user: await createdUser.save(),
            session: session,
        };
    }

    async findByUsername(username: string) : Promise<User> {
        return await this.userModel.findOne({ username: username }).exec();
    }

    async update(username: string, role: Role) : Promise<boolean> {
        let user = await this.userModel.findOne({ username: username }).exec();

        if(user)
        {
            user.role = role;
            await this.userModel.updateOne({ username: username }, user).exec();

            return true;
        }

        return false;
    }

    async delete(username: string) : Promise<boolean> {
        return (await this.userModel.deleteOne({ username: username }).exec()).deletedCount == 1;
    }

    async findBySession(token: string) : Promise<{user: User, session: Session}> {
        let session = await this.sessionModel.findOne({ token: token }).exec();

        if(!session)
        {
            return null;
        }

        let user = await this.userModel.findOne({ username: session.username }).exec();
        return {
            user: user,
            session: session,
        };
    }

    async getAll() : Promise<User[]> {
        return await this.userModel.find();
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

    verify(session: Session) {
        if(session === undefined)
            return null;

        return (new Date().getTime() / 1000) < session.issueTime + session.expiryTime;
    }


  async tokenRoleAuth(token: string, role: Role) : Promise<{success: boolean; user?: User;}> {
    try {
      const userSession = await this.findBySession(token);
      
      if(userSession !== undefined && userSession !== null && this.verify(userSession.session) && userSession.user.role == role)
      {
        return {
          success: true,
          user: userSession.user,
        };
      }
      else
      {
        return {
          success: false,
        };
      }
    } catch (err) {
      return {
        success: false,
      };
    }
  }

}