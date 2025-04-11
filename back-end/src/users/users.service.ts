import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { Request } from 'express';
import { Contacts } from 'src/schemas/contacts';
import { ContactsService } from 'src/contacts/contacts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Contacts.name) private contactsModel: Model<Contacts>,
    private readonly contactsService: ContactsService
  ){}
  async create(createUserDto: CreateUserDto) {
    try {
      const findUser = await this.userModel.find({email: createUserDto.email});
      const findUserNickname = await this.userModel.find({nickname: createUserDto.nickname});

      if (findUser.length > 0) throw new BadRequestException('Usuário já existe.');
      if (findUserNickname.length > 0) throw new BadRequestException('Nickname já existe.');

      const hashingPassword = await bcrypt.hash(createUserDto.password, 10)

      const createUser = await this.userModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashingPassword,
        nickname: createUserDto.nickname,
      })

      return await createUser.save();
    
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido a um erro interno não foi possível realizar o cadastro.')
    }
  }

  async findAll(request: Request) {
    try {
      const queryFindUsers = this.userModel.find().select('-password')

      if (request.query.contactName) {
        queryFindUsers.find().or([
          { name: { $regex: request.query.contactName, $options: 'i' } },
          { nickname: { $regex: request.query.contactName, $options: 'i' } }
        ])
      }
      const findUsers = await queryFindUsers.exec();
      const findAllMyContacts = await this.contactsService.findAllMyContacts(request);
      const findMyContactsRequests = await this.contactsService.findMyContactsRequests(request);

      const result = findUsers.map((user) => {
        const userId = user._id.toString();

        // separa cada contato que esta entre os conatos salvos (findAllMyContacts) usando a variável isContactSaved
        const isContactSaved = findAllMyContacts.some((contact: any) => contact.contactId._id.toString() === userId);

        // separa cada solicitação de cada contato usando a o objeto contactRequest
        const contactRequest = findMyContactsRequests.find((contact: any) => contact.userId._id.toString() === userId || contact.contactId._id.toString() === userId);

        return {
          ...user.toObject(),
          isContactSaved,
          contactRequest: contactRequest
            ? {
                isRequest: true,
                senderId: contactRequest.userId,
                receiverId: contactRequest.contactId
              }
            : undefined
        };
      });

      return result;
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Devido a um erro interno não foi possível buscar os dados.')
    }
  }

  async findOne(id: string, request: Request) {
    try {
      const findUser = await this.userModel.find({ _id: id }).select('-password')
      if (findUser.length === 0) throw new BadRequestException('Usuário não encontrado.');

      const findAllMyContacts = await this.contactsService.findAllMyContacts(request)
      let isContactSaved: boolean;

      if(findAllMyContacts.length > 0){
        // verifica se o contato (findUser) esta entre os contatos salvos (findAllMyContacts)
        isContactSaved = findAllMyContacts.some((contact:any) => contact.contactId._id == findUser[0]._id.toString())
      }

      const findMyContactsRequests = await this.contactsService.findMyContactsRequests(request)
      let contactRequest = {
        isRequest: false,
        senderId: '',
        receiverId: ''
      }

      // pega a solicitação de contato envida ou recebida.6
      if (findMyContactsRequests.length > 0) {
        contactRequest.isRequest = findMyContactsRequests.some((contact:any) => {
          if (contact.userId._id == findUser[0]._id.toString() || contact.contactId._id == findUser[0]._id.toString()) {
            contactRequest.senderId = contact.userId._id
            contactRequest.receiverId =  contact.contactId._id
            return true
          }
        })
      }

      return {
        contact: findUser[0],
        isContactSaved,
        contactRequest
      };
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido a um erro interno não foi possível buscar os dados.')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.userModel.find({ _id: id });

      if (findUser.length === 0) throw new BadRequestException('Usuário não encontrado.');

      const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password')

      return updateUser;
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido a um erro interno não foi possível atualizar os dados.')
    }
  }

  async remove(id: string) {
    try {
      const findUser = await this.userModel.find({ _id: id });

      if (findUser.length === 0) throw new BadRequestException('Usuário não encontrado.');

      await this.userModel.findByIdAndDelete(id);

      return 'Usuário removido.';
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido a um erro interno não foi possível remover o usuário.')
    }
  }
}
