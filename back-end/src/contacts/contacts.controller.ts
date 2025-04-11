import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllMyContacts(@Req() request: Request) {
    return await this.contactsService.findAllMyContacts(request);
  }

  @Get('/contactsRequest')
  @UseGuards(AuthGuard)
  async findMyContactsRequests(@Req() request: Request){
    return await this.contactsService.findMyContactsRequests(request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async removeContact(@Param('id') id: string) {
    return this.contactsService.removeContact(+id);
  }
}
