import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common';

@WebSocketGateway(
  {
    namespace: 'messages',
    cors: {
      origin: '*',
      
    }
  }
)
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}
  private logger: Logger = new Logger('MessagesGateway');

  @WebSocketServer() server: Server

  afterInit(server: Server) {
    this.logger.log('MessagesGateway initialized');
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
    console.log('usuário entrou na sala')
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const result = await this.messagesService.create(createMessageDto);

    if (result) {
      //Envia a mensagem para a sala cujo o nome é o id do usuário que enviou a mensagem
      this.server.to(createMessageDto.sender).emit('sendNewMessage', result)
      
      //Envia a mensagem para a sala cujo o nome é o id do usuário que irá receber a mensagem
      this.server.to(createMessageDto.receiver).emit('receiveNewMessage', result)
    }
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    const response = await this.messagesService.findAll();
    this.server.emit('messagesList', response);
  }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}
