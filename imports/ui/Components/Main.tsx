import React from 'react'
import {Meteor} from 'meteor/meteor'
import {withTracker} from 'meteor/react-meteor-data'
import StyledMain from '../elements/StyledMain'
import Left from './Left'
import Right from './Right'
import { findChats } from '../../api/helpers'
import {Chat} from '../../api/models'
import _ from 'lodash'
import OtherProfile from './OtherProfile'
import {ChatsCollection} from '../../api/chats'
import moment from 'moment'
import BigOverlay from './BigOverlay'
import ImageViewer from './ImageViewer'
import Popup from './Popup'
import {Session} from 'meteor/session'

const initialBigOverlay:any = {
    image: {
        visible: false,
        url: ""
    },
    popup: {
        visible: false,
        title: ''
    }
}

const Main = (props:any):JSX.Element => {
    // const [loading, setLoading] = React.useState<boolean>(true)
    // Tracker.autorun(() => {
    //     const chatsReady:boolean = Meteor.subscribe('chats.mine').ready()
    //     const messagesReady:boolean = Meteor.subscribe('messages.all').ready()
    //     //console.log('chats', findChats())
    //     if (chatsReady && messagesReady) {
    //         setLoading(false)
    //     }
    // })

    const [messageVisible, setMessageVisible] = React.useState<boolean>(false)
    const [selectedChat, setSelectedChat] = React.useState<Chat>({})
    const [OP, setOP] = React.useState<any>({})
    const [BOVisible, setBOVisible] = React.useState<any>(initialBigOverlay)

    const handleChatClick = (_id:string):void => {
        //console.log("Selected chat (before) :", selectedChat)
        if(!messageVisible) {
            setMessageVisible(true)
        }
        const newChat:Chat = _.find(props.chats, {_id})
        //console.log('Selected chat (after) :', newChat)
        if(newChat) {
            setSelectedChat(newChat)
        } else {
            const newChat:Chat = ChatsCollection.findOne(_id)
            setSelectedChat(newChat)
        }
    }

    const handleAvatarClick = (otherId:string):void => {
        setOP({
            visible: true,
            otherId
        })
    }

    const handleClose = ():void => {
        setOP({
            visible: false,
            otherId: ""
        })
    }

    const handleUIClick = (otherUserId:string, username:string, picture:string):void => {
        const chat:Chat = ChatsCollection.findOne({
            participants : {
                $all : [otherUserId, Meteor.userId()]
            }
        })
        console.log('chat', chat)
        if (chat) {
            handleChatClick(chat._id)
        } else {
            const chatId:string = ChatsCollection.insert({
                title: username,
                picture,
                participants: [otherUserId, Meteor.userId()],
                lastMessage : {
                    content: "",
                    createdAt: moment().toDate()
                }
            })
            handleChatClick(chatId)
        }
    }

    const showImage = (imageUrl:string):void => {
        setBOVisible(prevState => {
            return {
                ...prevState,
                image : {
                    visible: true,
                    url : imageUrl
                }
            }
        })
    }

    const handleCloseBO = ():void => {
        setBOVisible(prevState => {
            return {
                ...prevState,
                image : {
                    visible: false,
                    url : ""
                },
                popup : {
                    visible : false,
                    title : ""
                }
            }
        })
    }

    const handleMsgClick = (msgId:string, type: string):void => {
        Session.set('wwc--message__id', msgId)
        setBOVisible(prevState => {
            return {
                ...prevState,
                popup : {
                    visible: true,
                    title : type === 'text' ? "Supprimer le message ?" : "Supprimer l'image ?"
                }
            }
        })
    }

    const handleDeleteMsg = ():void => {
        const msgId:string = Session.get('wwc--message__id')
        Meteor.call('message.delete', msgId, (err, res) => {
            handleCloseBO()
        })
    }

    return(
        <StyledMain>
            {!props.loading ? (
                <React.Fragment>
                    <Left 
                        chats={props.chats} 
                        onChatClick={handleChatClick}
                        selectedChat={selectedChat}
                        OPVisible={OP.visible}
                        onUserItemClick={handleUIClick}
                    />
                    <Right 
                        right 
                        OPVisible={OP.visible}
                        isMessageVisible={messageVisible}
                        selectedChat={selectedChat}
                        onAvatarClick={handleAvatarClick}
                        onMsgTextClick={handleMsgClick}
                    />
                    {BOVisible.popup.visible ? (
                        <BigOverlay>
                            <Popup 
                                title={BOVisible.popup.title}
                                onCancel={handleCloseBO}
                                onDelete={handleDeleteMsg}
                            />
                        </BigOverlay>
                    ) : null}
                    {BOVisible.image.visible ? (
                        <BigOverlay>
                            <ImageViewer
                                imageUrl={BOVisible.image.url}
                                onClose={handleCloseBO}
                            />
                        </BigOverlay>
                    ) : null}
                    {OP.visible ? (
                        <OtherProfile 
                            otherUserId={OP.otherId} 
                            onClose={handleClose}
                            onShowImage={showImage}
                        />
                    ) : null}
                </React.Fragment>
            ) : null}
        </StyledMain>
    )
}
export default withTracker(() => {
    const chatsReady:boolean = Meteor.subscribe('chats.mine').ready()
    const messagesReady:boolean = Meteor.subscribe('messages.all').ready()
    return {
        loading : chatsReady && messagesReady ? false : true,
        chats: findChats()
    }
})(Main)