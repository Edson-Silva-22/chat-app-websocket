import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ){}
  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userModel.find({name: createUserDto.name})

      if (userExists.length > 0) throw new BadRequestException('Usuário já existe.');

      const createUsre = await this.userModel.create(createUserDto)

      return createUsre;
    
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestException) throw error
      throw new InternalServerErrorException('Devido a um erro interno não foi possível realizar o cadastro.')
    }
  }

  async findAll() {
    try {
      const findUser = await this.userModel.find()

      return findUser;
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Devido a um erro interno não foi possível buscar os dados.')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
