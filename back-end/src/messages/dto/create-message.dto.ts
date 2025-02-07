export class CreateMessageDto {
  sender: string;
  receiver: string;
  text?: string;
  file?: string;
}
