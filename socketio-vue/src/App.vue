<template>
  <div class="container border rounded ps-0 pe-0 overflow-hidden my-3">
    <!-- Header -->
    <div class="header bg-success bg-gradient p-2 d-flex align-items-center">
      <img
        src="./assets/icons/icons8-technical-support-50.png"
        alt="Socket.io png "
      />
      <span class="h4 text-white">Socket.io live chat</span>
    </div>

    <!-- user login form -->
    <div
      class="login-container p-5 text-center"
      :class="{ 'd-none': loggedIn }"
    >
      <form method="post" class="user-login" @submit.prevent="loginSubmit">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Username"
          autocomplete="off"
          name="username"
          id="username"
          v-model="username"
        />
        <button type="submit" class="btn btn-success">
          <span class="me-1">Join</span
          ><img
            src="./assets/icons/icons8-login-rounded-24.png"
            alt="join-chat"
          />
        </button>
      </form>
    </div>

    <!-- Chat body -->
    <div class="chat-body d-flex" :class="{ 'd-none': !loggedIn }">
      <!-- sidebar -->
      <div class="col-4">
        <!-- user title -->
        <div class="sidebar border-end">
          <div class="title p-2 bg-secondary bg-opacity-50">
            <span id="user-title" v-html="userTitle" class="fw-bold"></span>
          </div>
          <div class="user-title p-2 border-bottom">
            <span
              v-if="showActive"
              v-html="activeText"
              id="users-tagline"
              :class="[showActive ? 'text-success' : 'text-danger']"
            ></span>
          </div>
          <div ref="itemsContainer" class="users">
            <ul>
              <table
                v-if="showTable"
                class="table table-hover"
                v-for="user in temp"
              >
                <tr
                  ref="list"
                  class="socket-users"
                  @click="setActiveUser(user.username, user.userID)"
                >
                  <td>{{ user.username }}</td>
                </tr>
              </table>
            </ul>
          </div>
        </div>
      </div>

      <!-- main -->
      <div class="col-8">
        <div class="chat-container">
          <!-- Active user title -->
          <div class="title p-2 bg-secondary bg-opacity-50">
            <span ref="title" id="active-user" v-html="activeUserTitle"></span>
          </div>

          <!-- Message area -->
          <div
            ref="messages"
            class="messages"
            :class="{ 'd-none': !isChatting }"
          >
            <!-- here -->
            <!-- left -->
            <!-- <div
              class="message bg-secondary bg-opacity-25 rounded m-2 px-2 left"
            >
              <span class="msg-text">Sudeep how are you today?</span>
              <span class="msg-time">10:17 AM </span>
            </div> -->
            <!-- right -->
            <!-- <div
              class="message bg-success bg-opacity-25 rounded m-2 px-2 right"
            >
              <span class="msg-text">Nipun, I'm good!</span>
              <span class="msg-time">10:17 AM </span>
            </div> -->
            <!-- ends -->
          </div>
        </div>

        <!-- Message form -->
        <div
          class="msg-form d-flex justify-content-center border-top align-items-center p-2 bg-secondary bg-opacity-50"
          :class="{ 'd-none': !isChatting }"
        >
          <form method="post" class="msgForm w-100" @submit.prevent="msgForm">
            <div class="d-flex">
              <input
                type="text"
                class="form-control"
                name="message"
                id="message"
                placeholder="enter your message here"
                autocomplete="off"
                ref="message"
              />
              <button type="submit" class="btn btn-link">
                <img
                  src="./assets/icons/icons8-paper-plane-26.png"
                  alt="send"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocketioService from './services/socketio.service.js'

export default {
  name: 'App',
  data() {
    return {
      username: '',
      loggedIn: false,
      sessUsername: '',
      sessUserID: '',
      data: {},
      userTitle: '',
      activeUserTitle: '',
      activeUserList: [],
      showTable: false,
      showActive: false,
      activeText: 'online user',
      isChatting: false,
      from: '',
      socket: {},
      userTable: [],
      temp: [],
    }
  },

  components: {},
  mounted() {
    this.socket.on('message-to-user', ({ message, time }) => {
      console.log('recived')

      this.appendMessage({
        message,
        time,
        background: 'bg-secondary',
        position: 'left',
      })
    })
  },
  methods: {
    async createSession(username) {
      // socket
      const SocketioServiceChat = new SocketioService()
      console.log(SocketioServiceChat.socket)
      const socket = SocketioServiceChat.socket

      const data = {
        username,
      }
      let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
      try {
        const response = await fetch('http://localhost:3000/session', options)
        const data = await response.json()

        // set localstorage for session
        localStorage.setItem('session-username', data.username)
        localStorage.setItem('session-userID', data.userID)

        // connecting new user
        socket.auth = { username: data.username, userID: data.userID }
        socket.connect()
        this.userTitle = data.username
      } catch (e) {
        console.log('error:', e.message)
      }
    },
    loginSubmit() {
      this.createSession(this.username.toLowerCase())
      this.loggedIn = true
      this.userTitle = this.username
    },
    listActiveUsers(data) {
      console.log('here', data)
      function toArray(users) {
        let arr = []
        for (let key in users) {
          arr.push(users[key])
        }
        return arr
      }
      const listUsers = toArray(data)
      this.temp = listUsers
    },

    setActiveUser(username, userID) {
      console.log('activeUser', username, userID)
      this.activeUserTitle = username
      this.$refs.title.setAttribute('userID', userID)

      // user list active and inactive class event handler
      for (let i = 0; i < this.$refs.list; i++) {
        this.$refs.list[i].remove('table-active')
      }
      event.currentTarget.classList.add('table-active')

      // display message area after selecting user
      this.isChatting = true
      this.$refs.messages.innerHTML = ''
    },
    msgForm() {
      const to = this.$refs.title.getAttribute('userID')
      let time = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
      // set new message payload
      let payload = {
        from: this.from,
        to,
        message: this.$refs.message.value,
        time,
      }
      console.log('inmess', this.socket)

      // emit message to server
      this.socket.emit('message-to-server', payload)
      this.appendMessage({
        ...payload,
        background: 'bg-success',
        position: 'right',
      })
      this.$refs.message.value = ''
      this.$refs.message.focus()
    },
    appendMessage({ message, time, background, position }) {
      let div = document.createElement('div')
      div.classList.add(
        'message',
        'bg-opacity-25',
        'rounded',
        'm-2',
        'px-2',
        'py-1',
        background,
        position
      )
      div.innerHTML = `<span class="msg-text">${message}</span><span class="msg-time">${time}</span>`
      this.$refs.messages.append(div)
      this.$refs.messages.scrollTo(0, this.$refs.messages.scrollHeight)
    },
  },
  created() {
    const SocketioServiceChat = new SocketioService()
    SocketioServiceChat.setupSocketConnection()
    const socket = SocketioServiceChat.socket
    console.log('socket', socket)
    this.socket = socket
    // retriving localstorage for session
    this.sessUsername = localStorage.getItem('session-username')
    this.sessUserID = localStorage.getItem('session-userID')
    if (this.sessUsername && this.sessUserID) {
      socket.auth = { username: this.sessUsername, userID: this.sessUserID }
      socket.connect()
      this.loggedIn = true
      this.userTitle = this.sessUsername
    }

    socket.on('users', ({ users }) => {
      this.from = socket.id
      // removing self users
      const index = users.findIndex((user) => user.userID === socket.id)
      if (index > -1) {
        users.splice(index, 1)
      }

      this.activeUserList = users
      this.listActiveUsers(this.activeUserList)
      if (users.length > 0) {
        this.showTable = true
        this.showActive = true
      } else {
        this.showTable = false
        this.showActive = false
      }
    })

    // socket.on('message-to-user', ({ message, time }) => {
    //   console.log('recived')

    //   this.appendMessage({
    //     message,
    //     time,
    //     background: 'bg-secondary',
    //     position: 'left',
    //   })
    // })
  },
  computed: {},
  beforeCreate() {
    this.userTable = []
  },
}
</script>
<style></style>
