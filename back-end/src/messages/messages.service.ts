import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/schemas/messages';
import { Model } from 'mongoose';
import { format } from 'date-fns-tz'
import { Contacts } from 'src/schemas/contacts';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Contacts.name) private readonly contactsModel: Model<Contacts>
  ){}
  async create(createMessageDto: CreateMessageDto) {
    const createdMessage = await this.messageModel.create(createMessageDto)
    
    // Salvando data como fromato e timezone
    const dateInTimezone = {
      createdAt: format(createdMessage.createdAt, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Sao_Paulo'}),
      updatedAt: format(createdMessage.updatedAt, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Sao_Paulo'}),
    }


    return {
      _id: createdMessage._id,
      sender: createdMessage.sender,
      receiver: createdMessage.receiver,
      text: createdMessage.text,
      file: createdMessage.file,
      createdAt: dateInTimezone.createdAt,
      updatedAt: dateInTimezone.updatedAt,
    };
  }

  async findAll() {
    const findAllMessages = await this.messageModel.find();
    return findAllMessages;
  }
}
