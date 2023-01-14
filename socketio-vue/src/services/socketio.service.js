import { io } from 'socket.io-client'
console.log()
export default class SocketioService {
  socket
  constructor() {}
  setupSocketConnection() {
    console.log('import.meta.env.VUE_APP_SOCKET_ENDPOINT', import.meta.env)
    this.socket = io(import.meta.env.VITE_APP_SOCKET_ENDPOINT, {
      auth: {
        token: 'abc',
      },
    })

    this.socket.emit('my-message', 'Hello there from vue')

    this.socket.on('my broadcast', (data) => {
      console.log(data)
    })
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
