import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ){}

  async signIn(createAuthDto: CreateAuthDto) {
    try {
      const findUser = await this.userModel.find({email: createAuthDto.email});

      if (findUser.length === 0) {
        return {
          message: 'Usuário não encontrado',
          status: 400,
        }
      }

      const passwordIsValid = await bcrypt.compare(createAuthDto.password, findUser[0].password)

      if (!passwordIsValid) throw new BadRequestException('Email ou senha incorretos. Tente novamente.')

      const payload = { sub: findUser[0].id, username: findUser[0].name };

      return {
        //O método signAsync gera o token de acordo com payload do user
        result: await this.jwtService.signAsync(payload),
        status: 200,
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Ocorreu um erro ao tentar fazer login')
    }
  }

  async verifyToken(request: Request) {
    try {
      const getToken = request.headers.authorization.split(' ')

      const validateToken = await this.jwtService.verifyAsync(getToken[1])

      if (validateToken.sub && validateToken.username) {
        const findUser = await this.userModel.find({_id: validateToken.sub}).select('-password')

        return {
          result: {
            user: findUser[0],
            valid: true
          },
          status: 200
        }
      }

    } catch (error) {
      console.error(error)
      return {
        result: {
          valid: false,
          user: {}
        },
        status: 200
      }
    }
  }
}
