import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      
    ])
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
