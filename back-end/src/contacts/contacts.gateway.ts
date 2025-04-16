import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common';

@WebSocketGateway(
  {
    namespace: 'contacts',
    cors: {
      origin: '*',
    }
  }
)
export class ContactsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly contactsService: ContactsService) {}
  private logger: Logger = new Logger('ContactsGateway');

  @WebSocketServer() server: Server

  afterInit(server: Server) {
    this.logger.log('ContactsGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    //O usuário entra em uma sala criada com o nome do seu proprio id
    client.join(room);
    console.log('usuário entrou na sala ' + room)
  }

  @SubscribeMessage('createContactRequest')
  async createContactRequest(@MessageBody() createMessageDto: CreateContactDto) {
    const result = await this.contactsService.createContactRequest(createMessageDto);

    if (result) {
      //Envia a solicitação de contato para a sala cujo o nome é o id do usuário que irá receber a solicitação
      this.server.to(createMessageDto.contactId).emit('contactRequest', result);
    }
  }

  @SubscribeMessage('respondContactRequest')
  async respondContactRequest(@MessageBody() createMessageDto: CreateContactDto) {
    const result = await this.contactsService.respondContactRequest(createMessageDto);
    if (result) {
      //Envia a resposta da solicitação de contato para a sala cujo o nome é o id do usuário que enviou a solicitação
      this.server.to(createMessageDto.userId).emit('contactResponse', result);
    }
  }

  // @SubscribeMessage('findAllMessages')
  // async findAll(@MessageBody() data: any) {
  //   const response = await this.contactsService.findAll(data.userId, data.contactId);
  //   this.server.to(data.userId).emit('messagesList', response);
  // }
}
