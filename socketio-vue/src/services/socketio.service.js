import { io } from 'socket.io-client'
// import.meta.env

class SocketioService {
  socket
  constructor() {}

  setupSocketConnection() {
    this.socket = io(import.meta.env.VUE_APP_SOCKET_ENDPOINT)
  }
}

export default new SocketioService()
