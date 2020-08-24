import React from 'react'
import StyledOtherProfile from '../elements/StyledOtherProfile'
import FontAwesome from 'react-fontawesome'
import { User } from '../../api/models'
import { findOtherUser } from '../../api/helpers'
import Header from './Header'
import Avatar from './Avatar'
import Actu from './Actu'
import ActuItem from './ActuItem'

const OtherProfile = (props:any):JSX.Element => {
    const { otherUserId, onClose, onShowImage } = props

    const icon = [
        {
            name: "",
            func: () => {}
        },
        {
            name: "",
            func: () => {}
        },
        {
            name: "",
            func: () => {}
        }
    ]

    const otherUser:User = findOtherUser(otherUserId)

    const {profile : {phone, picture, actu}, username} = otherUser

    return (
        <StyledOtherProfile>
            {otherUser ? (
                <>
                    <Header iconClass="greyIcon" icons={icon}>
                        <div className="OPH--heading">
                            <FontAwesome
                                name='times'
                                className="iconOtherProfile"
                                onClick={onClose}
                            />
                            <span className="OPH--title">Infos</span>
                        </div>
                    </Header>
                    <div className="__scroll">
                        <div className="OP--imageContainer">
                            <Avatar 
                                onAvatarClick={() => onShowImage(picture)} 
                                big 
                                avatar_url={picture}
                            />
                            <div className="OPIC--txtContainer">
                                <span className="OPIC--title">{username}</span>
                                <span className="OPIC--sbTitle">En ligne</span>
                            </div>
                        </div>
                        <Actu actu={actu} phone={phone}/>
                        <ActuItem iconName="ban" content="Bloquer"/>
                        <ActuItem iconName="thumbs-down" red content="Supprimer le contact"/>
                        <ActuItem iconName="trash" red content="Supprimer la conversation"/>
                    </div>
                </>
            ) : null}
        </StyledOtherProfile>
    )
}

export default OtherProfile