import React from 'react'
import StyledRight from '../elements/StyledRight'
import RightImg from './RightImg'
import MessageView from './MessageView'

const messageText:String = "Whatsapp se connecte à votre téléphone pour synchroniser les messages. Pour réduire l'utilisation des données, connectez votre téléphone à un réseau Wi-Fi."

const Right = (props:any):JSX.Element => {
    const {right, isMessageVisible, selectedChat, onAvatarClick, OPVisible, onMsgTextClick} = props
    return (
        <StyledRight OPVisible={OPVisible}>
            {isMessageVisible ? (
                <MessageView 
                    onAvatarClick={onAvatarClick} 
                    selectedChat={selectedChat}
                    OPVisible={OPVisible}
                    onMsgTextClick={onMsgTextClick}
                />
            ) : (
                <RightImg right messageText={messageText} />
            )}
        </StyledRight>
    )
}

export default Right