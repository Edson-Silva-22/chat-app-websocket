import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contacts } from 'src/schemas/contacts';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name) private contactsModel: Model<Contacts>
  ) {}
  async create(createContactDto: CreateContactDto) {
    try {
      const contactExists = await this.contactsModel.find({userId: createContactDto.userId, contactId: createContactDto.contactId});

      if (contactExists.length > 0) throw new BadRequestException('Contato já existe.');

      const createContact = await this.contactsModel.create(createContactDto);

      return createContact;

    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Ocorreu um erro ao salvar o contato.');
    }
  }

  async findAll(request: Request) {
    try {
      const findAllContacts = this.contactsModel.find({userId: request.query.userId});

      return await findAllContacts
      .populate('userId')
      .populate('contactId')
      .exec();

    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido ao um erro interno não foi possível listar os contatos.');
    }
  }

  async findOne(id: number) {
    try {
      const findOneContacts = this.contactsModel.find({})
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido ao um erro interno não foi possível exibir o contato.');
    }
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    try {
      const findContact = await this.contactsModel.find({})      
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido ao um erro interno não foi possível atualizar o contato.');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} contact`;
  }
}
