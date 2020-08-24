import React from 'react'
import StyledMessageBox from '../elements/StyledMessageBox'
import { Meteor } from 'meteor/meteor'
import _ from 'lodash'
import moment from 'moment'
import Day from './Day'
import MessageText from './MessageText'
import FlipMove from 'react-flip-move'
import FABs from './FABs'
import MessageImage from './MessageImage'
import { updateBadges } from '../../api/helpers'

let isEven:boolean = false
const format:string = "D MMMM Y"
let messagesEnd:HTMLDivElement

const MessageBox = (props:any):JSX.Element => {
    const {messages, selectedChat, fabVisible, onInputChange, onFABItemClick} = props
    // messages est un tableau
    messages.forEach(message => {
        if (!message.senderId) {
            message.ownership = !!message.ownership === isEven ? 'mine' : 'other'
            isEven = !isEven
            return message
        } else {
            message.ownership = message.senderId === Meteor.userId() ? 'mine' : 'other'
            return message
        }
    })
    //console.log('Messages avec ownership :', messages)

    // groupedMessages est un objet (dictionnaire)
    const groupedMessages:any = _.groupBy(messages, message => {
        return moment(message.createdAt).format(format)
    })
    const newMessages:any[] = Object.keys(groupedMessages)
                                .map(key => {
                                    return {
                                        date: key,
                                        groupedMessages: groupedMessages[key],
                                        today : moment().format(format) === key
                                    }
                                })

    const renderMessages = (newMessage:any):JSX.Element[] => {

        return newMessage.groupedMessages.map(message => {
            const msgClass:String = `message message--${message.ownership}`
            if(message.type === 'image') {
                const mine:boolean = message.ownership === "mine"
                return (
                    <MessageImage 
                        key={message._id}
                        content={message.content}
                        createdAt={message.createdAt}
                        mine={mine}
                        onImageClick={() => props.onMsgTextClick(message._id, "image")}
                    />
                )
            }
            return (
                <MessageText
                    key={message._id}
                    msgClass={msgClass}
                    content={message.content}
                    ownership={message.ownership}
                    createdAt={message.createdAt}
                    onClick={props.onMsgTextClick}
                    id={message._id}
                />
            )
        })
    }

    const scrollToBottom = ():void => {
         messagesEnd.scrollIntoView({behavior: "smooth"})
    }
    React.useEffect(() => {
        scrollToBottom(),
        updateBadges(selectedChat.participants, selectedChat._id)
    }, [selectedChat, messages])

    const renderDays = ():JSX.Element[] => {
        return newMessages.map((newMessage, index:number) => {
            const dateText:string = newMessage.today ? "Aujourd'hui" : newMessage.date
            return (
                <div key={index}>
                    <Day date={dateText}/>
                    {renderMessages(newMessage)}
                </div>
            )
        })
    }

    return (
        <StyledMessageBox>
            <FABs 
                fabVisible={fabVisible} 
                onInputChange={onInputChange}
                onFABItemClick={onFABItemClick}
            />
            <FlipMove>
                {renderDays()}
            </FlipMove>
            <div
                ref={(el:HTMLDivElement) => messagesEnd = el}
            />
        </StyledMessageBox>
    )
}

export default MessageBox