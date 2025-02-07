import { io, Socket} from "socket.io-client";

class SocketClient {
  private socket: Socket | null = null;

  connect(namespace: string): void {
    if (!this.socket) {
      this.socket = io(`http://localhost:3000/${namespace}`);

      this.socket.on('connect', () => {
        console.log('Conectado ao WebSocket');
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado do WebSocket');
      });
    }
  }
  
  subscribeEvent(eventName: string, callback: (data: any) => void) {
    this.socket?.on(eventName, callback);
  }
  
  emitEvent(eventName: string, data?: any): void {
    this.socket?.emit(eventName, data);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}

export default new SocketClient();
