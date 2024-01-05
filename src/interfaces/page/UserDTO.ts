import { IsNotEmpty } from 'class-validator';

export class UserDTO {
  id: string;

  // @IsNotEmpty()
  pw: string;

  constructor(id: string, pw: string) {
    this.id = id;
    this.pw = pw;
  }
}
