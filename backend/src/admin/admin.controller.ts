import { Controller } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Controller('admin')
export class AdminController 
{
    constructor() {}
}