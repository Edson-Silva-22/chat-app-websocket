import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contacts } from 'src/schemas/contacts';
import mongoose, { Model } from 'mongoose';
import { Request } from 'express';
import { format } from 'date-fns-tz'

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name) private contactsModel: Model<Contacts>
  ) {}
  async createContactRequest(createContactDto: CreateContactDto) {
    try {
      const contactExists = await this.contactsModel.find({userId: createContactDto.userId, contactId: createContactDto.contactId});

      if (contactExists.length > 0) throw new BadRequestException('Contato já solicitado.');

      const createContact = await this.contactsModel.create({
        ...createContactDto,
        status: 'waiting',
      });

      return createContact;

    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Ocorreu um erro ao salvar o contato.');
    }
  }

  async respondContactRequest(createContactDto: CreateContactDto) {
    try {
      //Buscando solicitação de contato
      const findContactRequest = await this.contactsModel.find({_id: createContactDto.contactRequestId});

      if (findContactRequest.length === 0) throw new BadRequestException('Solicitação de contato não encontrada.');

      //Atualizando status do contato
      const updateContact = await this.contactsModel.findOneAndUpdate(
        {_id: findContactRequest[0]._id},
        { status: createContactDto.status },
        { new: true }
      )

      //Criando contato inverso (contato do contato para o usuário) caso o usuário aceite a solicitação de contato
      if (createContactDto.status == 'established') {
        const saveContact = await this.contactsModel.create({
          userId: findContactRequest[0].contactId,
          contactId: findContactRequest[0].userId,
          status: 'established',
        })

        return saveContact;
      }

      // Enviando solicitação de contato com status "refused" quando a solicitação for recusada
      return updateContact;      
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Ocorreu um erro ao responder ao contato.');
    }
  }

  async findAllMyContacts(request: Request) {
    try {
      const findAllMyContacts = this.contactsModel.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(request.query.userId.toString()) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId'
          }
        },
        { $unwind: "$userId" }, // Transforma userId de array para objeto
        {
          $lookup: {
            from: 'users',
            localField: 'contactId',
            foreignField: '_id',
            as: 'contactId'
          }
        },
        { $unwind: "$contactId" } // Transforma contactId de array para objeto
      ])

      if (request.query.contactName) {
        findAllMyContacts.append({
          $match: { 'contactId.name': { $regex: request.query.contactName, $options: 'i' } }
        })
      }

      return await findAllMyContacts.exec()

    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido ao um erro interno não foi possível listar os contatos.');
    }
  }

  async removeContact(id: number) {
    try {
      const findContact = await this.contactsModel.find({ _id: id });

      if (findContact.length === 0) throw new BadRequestException('Contato não encontrado.');

      await this.contactsModel.deleteOne({ _id: id });
       
      return "Contato removido.";
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido ao um erro interno não foi possível remover o contato.');
    }
  }
}
