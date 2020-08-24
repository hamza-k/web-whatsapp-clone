import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {Chat} from './models'
import moment from 'moment'

export const ChatsCollection = new Mongo.Collection<Chat>('Chats')

export const dummyChats:Chat[] = [
    {
        title : "",
        picture : "",
        participants : ["emn2sup6gZ6BkocwN", "EgjKcixMtebvqTWuH"],
        lastMessage : {
            content: "Salut, ça va ?",
            createdAt : moment()
                        .toDate()
        }
    },
    {
        title : "",
        picture : "",
        participants : ["WbZWi6K6k2keJaDKu", "emn2sup6gZ6BkocwN"],
        lastMessage : {
            content: "Salut, comment tu vas ?",
            createdAt : moment()
            .subtract(1, "days")
                        .toDate()
        }
    }, {
        title : "",
        picture : "",
        participants : ["EgjKcixMtebvqTWuH", "WbZWi6K6k2keJaDKu"],
        lastMessage : {
            content: "Hello !!!",
            createdAt : moment()
                        .subtract(2, "days")
                        .toDate()
        }
    }
]

if(Meteor.isServer){
    Meteor.publish('chats.all', function(){
        return ChatsCollection.find()
    })
    
    Meteor.publish('chats.mine', function(){
        return ChatsCollection.find({
            participants: {
                $in : [this.userId]
            }
        })
    })
}