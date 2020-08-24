import React from 'react'
import FontAwesome from 'react-fontawesome'
import Moment from 'react-moment'

const MessageText = (props:any):JSX.Element => {
    const {id, onClick } = props
    const handleClick = (e:React.MouseEvent, msgId:string, type:string):void => {
        const message = e.currentTarget
        if(message.classList.contains("message--mine")) {
            onClick(msgId, type)
        } else {
            return
        }
    }
    return (
        <div className="messageContainer">
            <div id={`message-${id}`} onClick={(e) => handleClick(e, id, "text")} className={props.msgClass}>
                <p>{props.content}</p>
                <div className="detailsContainer">
                    <span>
                        <Moment format="HH:mm">
                            {props.createdAt}
                        </Moment>
                    </span>
                    {props.ownership === "mine" ?
                        <FontAwesome name="check-double"/> : null
                    }
                </div>
            </div>
        </div>
    )
}
export default MessageText