import { io } from 'socket.io-client'
console.log()
export default class SocketioService {
  socket
  constructor() {}
  setupSocketConnection() {
    // console.log('import.meta.env.VUE_APP_SOCKET_ENDPOINT', import.meta.env)
    this.socket = io(import.meta.env.VITE_APP_SOCKET_ENDPOINT, {
      autoConnect: false,
    })

    this.socket.on('users', ({ users }) => {
      // console.log(users)

      // console.log('here from js', this.socket)
      // removing self users
      const index = users.findIndex((user) => user.userID === this.socket.id)
      if (index > -1) {
        users.splice(index, 1)
      }
    })
  }
}
