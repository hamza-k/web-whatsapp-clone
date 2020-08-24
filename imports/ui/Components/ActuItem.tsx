import React from 'react'
import StyledActuItem from '../elements/StyledActuItem'
import FontAwesome from 'react-fontawesome'

const ActuItem = (props:any):JSX.Element => {
    const { red, iconName, content } = props
    return (
        <StyledActuItem red={red}>
            <FontAwesome
                className="AI--icon"
                name={iconName}
            />
            <span>{content}</span>
        </StyledActuItem>
    )
}

export default ActuItem