import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// CreateUserDto にある email, password, name, title を
// 全て「あってもなくても良い（?）」状態で引き継ぐ
export class UpdateUserDto extends PartialType(CreateUserDto) {}
