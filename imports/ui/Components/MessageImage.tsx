import React from 'react'
import StyledMessageImage from "../elements/StyledMessageImage"
import FontAwesome from 'react-fontawesome'
import Moment from 'react-moment'

const MessageImage = (props:any):JSX.Element => {
    const {mine, content, createdAt, onImageClick} = props
    const renderImage = ():JSX.Element => {
        if (!mine) {
            return (
                <>
                    <img
                        className="image"
                        alt="img"
                        src={content}
                    />
                    <div className='image--overlay'>
                        <div className='detailsContainer__date'>
                            <div className="image--date">
                                <Moment format="HH:mm">
                                    {createdAt}
                                </Moment>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <img
                        className="image"
                        alt="img"
                        src={content}
                        onClick={onImageClick}
                    />
                    <div className='image--overlay'>
                        <div className='detailsContainer __date'>
                            <div className="image--date">
                                <Moment format="HH:mm">
                                    {createdAt}
                                </Moment>
                            </div>
                            <FontAwesome
                                style={{color: "white"}}
                                name="check-double"
                            />
                        </div>
                    </div>
                </>
            )
        }
    }
    return (
        <StyledMessageImage mine={mine}>
            {renderImage()}
        </StyledMessageImage>
    )
}

export default MessageImage