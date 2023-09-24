import { Expose } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: Role;

  @Expose()
  fullname: string;

  @Expose()
  phonenumber: string;
}
