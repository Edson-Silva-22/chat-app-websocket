import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Request } from 'express';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAllMyContacts(@Req() request: Request) {
    return await this.contactsService.findAllMyContacts(request);
  }

  @Delete(':id')
  async removeContact(@Param('id') id: string) {
    return this.contactsService.removeContact(+id);
  }
}
