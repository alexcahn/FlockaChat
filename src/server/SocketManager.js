const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, LOGOUT, COMMUNITY_CHAT, USER_DISCONNECTED, MESSAGE_RECEIVED, MESSAGE_SENT } = require('../Events')

const { createUser, createMessage, createChat } = require('../Factories')

let connectedUsers = {}

let communityChat = createChat()

let chats = [communityChat]


module.exports = function (socket) {
    console.log('Socket Id ' + socket.id)

    let sendMessageToChatFromUser;

    // verify username
    socket.on(VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({ isUser: true, user: null })
        } else {
            callback({ isUser: false, user: createUser({ name: nickname }) })
        }
    })

    // user connects w/ username
    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user)
        socket.user = user

        sendMessageToChatFromUser = sendMessageToChat(user.name)

        io.emit(USER_CONNECTED, connectedUsers)
        console.log(connectedUsers)
    })

    // user disconnects
    socket.on('disconnect', () => {
        if ('user' in socket) {
            connectedUsers = removeUser(connectedUsers, socket.user.name)

            io.emit(USER_DISCONNECTED, connectedUsers)
            console.log("disconnect", connectedUsers)
        }
    })

    // user logsout
    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(USER_DISCONNECTED, connectedUsers)
        console.log("disconnect", connectedUsers)
    })

    // get community chat
    socket.on(COMMUNITY_CHAT, function (callback) {
        callback(communityChat)
    })

    socket.on(MESSAGE_SENT, ({ chatId, message }) => {
        sendMessageToChatFromUser(chatId, message)
    })

}

function sendMessageToChat(sender) {

    return (chatId, message) => {
        io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }))
    }
}

function addUser(userList, user) {
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}

function removeUser(userList, username) {
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}


function isUser(userList, username) {
    return username in userList
}