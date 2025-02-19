import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/chat-app'), UsersModule, MessagesModule, AuthModule, ContactsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
