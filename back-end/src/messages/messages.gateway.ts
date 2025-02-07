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

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    await this.messagesService.create(createMessageDto);
    await this.findAll()
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    const response = await this.messagesService.findAll();
    this.server.emit('messagesList', response);
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }
}
