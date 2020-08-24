import React from 'react'
import StyledChatItem from '../elements/StyledChatItem'
import Avatar from './Avatar'
import Moment from 'react-moment'
import moment from 'moment'
import FontAwesome from "react-fontawesome"
import { getBadges, updateBadges } from '../../api/helpers'

const ChatItem = (props:any):JSX.Element => {    
    const { title, picture, lastMessage, _id, onChatClick, active, participants } = props
    const { content, createdAt, type } = lastMessage
    const nowTime:string = moment().format("D/MM/Y")
    const isToday:boolean = nowTime === moment(createdAt).format("D/MM/Y")
    let badge:number = getBadges(_id)

    React.useEffect(() => {
        if(active) {
            updateBadges( participants, _id )
            badge = getBadges(_id)
        }
    }, [lastMessage])

    // console.log("Now :", nowTime)
    // console.log("Created at :", createdAt)
    // console.log("Created (formated) at :", moment(createdAt).format("D/MM/Y"))

    const renderCreatedAt = ():JSX.Element => {
        if (isToday) {
            return (
                <Moment format="HH:mm">
                    {createdAt}
                </Moment>
            )
        } else {
                return (
                    <Moment format="D/MM/Y">
                        {createdAt}
                    </Moment>
                )
        }
    }

    return (
        <StyledChatItem active={active} onClick={() => onChatClick(_id)}>
            <Avatar large avatar_url={picture}/>
            <div className="chat--contentContainer">
                <div className="content--line1">
                    <span className="content--line1__title">
                        {title}
                    </span>
                    <div className="content--line1__date">
                        {renderCreatedAt()}
                    </div>
                </div>
                <div className="content--line1">
                {type === 'text' ? (
                    <span className="content--message">
                        {content}
                    </span>
                ) : (
                    <span className="content--message">
                        <FontAwesome
                            name="camera"
                            style={{"marginRight" : "0.4rem"}}
                        />
                        Image
                    </span>
                )}
                {badge > 0 ? (
                    <div className="chat--badge">{badge}</div>
                ) : null}
                </div>
            </div>
        </StyledChatItem>
    )
}

export default ChatItem