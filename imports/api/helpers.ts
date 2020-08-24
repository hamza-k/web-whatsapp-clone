import { User, Chat, Message } from './models'
import { Accounts } from 'meteor/accounts-base'
import { ChatsCollection } from './chats'
import { MessagesCollection } from './messages'
import { Meteor } from 'meteor/meteor'
import { ImagesCollection } from './images'
import { Session } from 'meteor/session'

export const createDummyUsers = (users:User[]):void => {
    users.forEach(user => {
        const {username, profile, password} = user
        Accounts.createUser({
            username,
            password,
            profile
        })
    })
}

export const createDummyChats = (chats: Chat[]):void => {
    chats.forEach(chat => {
        ChatsCollection.insert(chat)
    })
}

export const createDummyMessages = (messages:Message[]):void => {
    messages.forEach(message => {
        MessagesCollection.insert(message)
    })
}

export const findChats = ():Chat[] => {
    return ChatsCollection.find().fetch()
        .map(chatCollection => {
            const otherUserId:string = findOtherId(chatCollection.participants)
            const {username, profile} = findOtherUser(otherUserId)
            const lastMessage:Message = findLastMessage(chatCollection._id)
            return {
                ...chatCollection,
                title: username,
                picture: profile.picture,
                lastMessage : {
                    ...lastMessage
                }
            }
        })
}

export const findOtherUser = (_id:string):User => {
    return Meteor.users.findOne({_id})
}

export const findOtherId = (participants: string[]):string => {
    const myId:string = Meteor.userId()
    let otherUserId:string;
    if(myId === participants[0]){
        otherUserId = participants[1]
    } else {
        otherUserId = participants[0]
    }
    return otherUserId
}

const findLastMessage = (chatId:string):Message => {
    const Msg:Message[] = MessagesCollection.find({chatId}, {
        sort : { createdAt: -1}
    }).fetch()
    if (!Msg[0]) {
        return ChatsCollection.findOne(chatId).lastMessage
    } 
    return Msg[0]
}

export const uploadFile = (file:any, isMessage:boolean):void => {
    const fileUpload = ImagesCollection.insert({
        file,
        streams: "dynamic",
        chunkSize: "dynamic",
        allowWebWorkers: true
    }, false)
    fileUpload.on('start', () => {
        console.log('start')
    })
    fileUpload.on('end', (err, fileObj) => {
        console.log('end', fileObj)
        if(err){
            console.log('Error upload', err)
        } else {
            const _id:string = fileObj._id
            if (isMessage) {
                Meteor.call('images.url', _id, (err, url) => {
                    if (err) {
                        console.log('Error :', err)
                    } else {
                        console.log("URL :", url)
                        Session.set('wwc__imageUrl', url)
                    }
                })
            } else {
                Meteor.call('user.picture', _id, (err, url) => {
                    if (err) {
                        console.log('Error :', err)
                    } else {
                        console.log("URL :", url)
                    }
                })
            }
        }
    })
    fileUpload.on('err', (err, fileObj) => {
        console.log('error :', err)
    })
    fileUpload.on('progress', (progress, fileObj) => {
        console.log('progress', progress)
    })
    fileUpload.start()
}

export const getBadges = (chatId:string):number => {
    const participants:string[] = ChatsCollection.findOne(chatId).participants
    const otherId:string = findOtherId(participants)
    const badge:number = MessagesCollection.find({chatId, senderId: otherId, read: false}).count()
    return badge
}

export const updateBadges = (participants:string[], chatId:string):void => {
    const otherId:string = findOtherId(participants)
    Meteor.call("message.update.badges", chatId, otherId, (err, res) => {
        if (err) {
            console.error('Error :', err)
        } else {
            console.log("Success :", res)
        }
    })
}