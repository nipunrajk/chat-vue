import { io } from 'socket.io-client'
console.log()
export default class SocketioService {
  socket
  constructor() {}
  setupSocketConnection() {
    console.log('import.meta.env.VUE_APP_SOCKET_ENDPOINT', import.meta.env)
    io(import.meta.env.VITE_APP_SOCKET_ENDPOINT)
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
