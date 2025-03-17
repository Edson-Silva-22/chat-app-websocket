import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateContactDto {
  @IsNotEmpty({message: 'O userId deve ser informado.'})
  @IsString({message: 'O userid deve ser uma string.'})
  userId: string;

  @IsNotEmpty({message: 'O contactId deve ser informado.'})
  @IsString({message: 'O contactId deve ser uma string.'})
  contactId: string;

  @IsOptional()
  @IsString({message: 'O status deve ser uma string.'})
  @IsEnum(["established" , "refused" , "waiting"], { message: 'Status inválido.' })
  status?: "established" | "refused" | "waiting";

  @IsOptional()
  @IsString({message: 'A solicitação de contato deve ser uma string.'})
  contactRequestId?: string;
}
