import { io } from 'socket.io-client'
console.log()
export default class SocketioService {
  socket
  constructor() {}
  setupSocketConnection() {
    console.log('import.meta.env.VUE_APP_SOCKET_ENDPOINT', import.meta.env)
    this.socket = io(import.meta.env.VITE_APP_SOCKET_ENDPOINT)

    this.socket.emit('my-message', 'Hello there from vue')
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
