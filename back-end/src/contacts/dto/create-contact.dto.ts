import { IsNotEmpty, IsString } from "class-validator";

export class CreateContactDto {
  @IsNotEmpty({message: 'O userId deve ser informado.'})
  @IsString({message: 'O userid deve ser uma string.'})
  userId: string;

  @IsNotEmpty({message: 'O contactId deve ser informado.'})
  @IsString({message: 'O contactId deve ser uma string.'})
  contactId: string;
}
