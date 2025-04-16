import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/messages';
import { Contacts, ContactsSchema } from 'src/schemas/contacts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Contacts.name, schema: ContactsSchema }
    ])
  ],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
