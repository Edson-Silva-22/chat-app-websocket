import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
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

  async findAll() {
    try {
      const findUser = await this.userModel.find().select('-password')

      return findUser;
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Devido a um erro interno não foi possível buscar os dados.')
    }
  }

  async findOne(id: string) {
    try {
      const findUser = await this.userModel.find({ _id: id}).select('-password')

      if (findUser.length === 0) throw new BadRequestException('Usuário não encontrado.');

      return findUser[0];
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
