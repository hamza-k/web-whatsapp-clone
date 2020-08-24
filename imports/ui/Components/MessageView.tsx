import React from 'react'
import StyledMessageView from '../elements/StyledMessageView'
import Header from './Header'
import Avatar from './Avatar'
import {Chat, Message, MessageType} from '../../api/models'
import Footer from './Footer'
import MessageBox from './MessageBox'
import { MessagesCollection } from '../../api/messages'
import moment from 'moment'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Modal from './Modal'
import { uploadFile, findOtherId } from '../../api/helpers'
import {Tracker} from "meteor/tracker"
import {Session} from "meteor/session"

let fileInput:any

const MessageView = (props:any):JSX.Element => {
    const selectedChat:Chat = props.selectedChat

    const icons:any[] = [
        {
            name: "search",
            func: () => {}
        }, {
            name: "paperclip",
            func: () => {handlePaperClick()}
        }, {
            name: "ellipsis-v",
            func: () => {}
        }
    ]

    const [fabVisible, setFabVisible] = React.useState<boolean>(false)
    const [modalVisible, setModalVisible] = React.useState<boolean>(false)
    const [selectedImage, setSelectedImage] = React.useState<any>("")
    const handlePaperClick = ():void => {
        setFabVisible(!fabVisible)
    }

    const handleInputClick = ():void => {
        const myFileInput:HTMLElement = document.getElementById('fileUpload')
        console.log("click oke", myFileInput)
        myFileInput.click()
    }
    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        fileInput=e.target.files[0]
        console.log('fileInput', fileInput)
        if (fileInput) {
            setModalVisible(true)
            const fileReader:FileReader = new FileReader()
            fileReader.readAsDataURL(fileInput)
            fileReader.onload = function(e){
                console.log('image', e.target.result)
                setSelectedImage(e.target.result)
            }
        }
    }

    const handleClose = ():void => {
        setModalVisible(false)
        setFabVisible(false)
    }

    const handleSend = (content:string, type:MessageType):void => {
        const message:Message = {
            chatId : selectedChat._id,
            content,
            createdAt : moment().toDate(),
            senderId: Meteor.userId(),
            type,
            read: false
        }
        if(modalVisible) {
            handleClose()
        }
        Meteor.call('message.insert', message, (err, id) => {
            if (err) {
                console.log('Error while message inserting:', err)
            } else {
                console.log('Success:', id)
                uploadFile(fileInput, true)
                Tracker.autorun(()=> {
                    const imageUrl:string = Session.get('wwc__imageUrl')
                    if(imageUrl && message.type === 'image') {
                        Meteor.call('message.update', id, imageUrl, (err, res) => {
                            if(err) {
                                console.log("Error :", err)
                            } else {
                                console.log('Success :', res)
                            }
                        })
                    }
                })
                
            }
        })
    }

const avatarClick = ():void => {
    const otherId:string = findOtherId(selectedChat.participants)
    props.onAvatarClick(otherId)
}

    return (
        <StyledMessageView>
            <Header OPVisible={props.OPVisible} iconClass="greyIcon" icons={icons}>
                <Avatar 
                    avatar_url={selectedChat.picture} 
                    onAvatarClick={avatarClick}
                />
                <div className="headerMsg--container">
                    <span className="headerMsg--title">{selectedChat.title}</span>
                    <span className="headerMsg--sbTitle">en ligne</span>
                </div>
            </Header>
            { modalVisible ? (
                <Modal 
                    onClose={handleClose}
                    selectedImage={selectedImage}
                    onUpload={handleSend}
                />
            ) : (
                <React.Fragment>
                    <MessageBox 
                        selectedChat={selectedChat} 
                        messages={props.messages}
                        fabVisible={fabVisible}
                        onFABItemClick={handleInputClick}
                        onInputChange={handleInputChange}
                        onMsgTextClick={props.onMsgTextClick}
                    />
                    <Footer onSend={handleSend}/>
                </React.Fragment>
            )}
        </StyledMessageView>
    )
}

export default withTracker(({selectedChat}) => {
    return {
        messages: MessagesCollection.find({chatId: selectedChat._id}).fetch()
    }
})(MessageView)