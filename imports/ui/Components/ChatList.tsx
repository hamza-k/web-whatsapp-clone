import React from 'react'
import StyledChatList from '../elements/StyledChatList'
import {Chat} from '../../api/models'
import ChatItem from './ChatItem'
import {withTracker} from 'meteor/react-meteor-data'

const ChatList = (props:any):JSX.Element => {
    const {chats, onChatClick, selectedChat} = props

    const renderChats = ():JSX.Element[] => {
        if (chats) {
            return chats
            .sort((a:Chat, b:Chat) => {
                return b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
            })
            .map((chat:Chat) => {
                const active:boolean = selectedChat._id === chat._id
                return (
                    <ChatItem
                        key={chat._id}
                        {...chat}
                        onChatClick={onChatClick}
                        active={active}
                    />
                )
            })
        }
    }

    return (
        <StyledChatList>
            {renderChats()}
        </StyledChatList>
    )
}

export default withTracker((props:any) => {
    return {
        chats: props.pattern === "" ? props.chats : props.chats2
    }
})(ChatList)