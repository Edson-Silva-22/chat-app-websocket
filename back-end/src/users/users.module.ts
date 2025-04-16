import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user';
import { Contacts, ContactsSchema } from 'src/schemas/contacts';
import { ContactsService } from 'src/contacts/contacts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Contacts.name, schema: ContactsSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, ContactsService],
})
export class UsersModule {}
