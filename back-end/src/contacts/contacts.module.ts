import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contacts, ContactsSchema } from 'src/schemas/contacts';
import { ContactsGateway } from './contacts.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Contacts.name, schema: ContactsSchema}
    ])
  ],
  controllers: [ContactsController],
  providers: [ContactsService, ContactsGateway],
})
export class ContactsModule {}
