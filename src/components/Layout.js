import React, { Component } from 'react'
import io from 'socket.io-client'
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../Events'
import LoginForm from './LoginForm'
import ChatContainer from './chats/ChatContainer'

// const socketURL = "http://localhost:3231"

const socketURL = "/"

export default class Layout extends Component {

    constructor(props) {
        super(props)

        this.state = {
            socket: null,
            user: null
        }
    }

    componentWillMount() {
        this.initSocket()
    }

    initSocket = () => {
        const socket = io(socketURL)
        socket.on('connect', () => {
            if (this.state.user) {
                this.reconnect(socket)
            } else {
                console.log("connected")
            }
        })
        this.setState({ socket })
    }

    reconnect = (socket) => {
        socket.emit(VERIFY_USER, this.state.user.name, ({ isUser, user }) => {
            if (isUser) {
                this.setState({ user: null })
            } else {
                this.setUser(user)
            }
        })
    }

    setUser = (user) => {
        const { socket } = this.state
        socket.emit(USER_CONNECTED, user)
        this.setState({ user })
    }

    logout = () => {
        const { socket } = this.state
        socket.emit(LOGOUT)
        this.setState({ user: null })
    }

    render() {
        const { title } = this.props
        const { socket, user } = this.state
        return (
            <div className='container'>
                {
                    !user ?
                        <LoginForm socket={socket} setUser={this.setUser} />
                        :
                        <ChatContainer socket={socket} user={user} logout={this.logout} />
                }
            </div>
        )
    }
}