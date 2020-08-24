import React from 'react'
import StyledImageViewer from '../elements/StyledImageViewer'
import FontAwesome from 'react-fontawesome'

const ImageViewer = (props:any):JSX.Element => {
    const { imageUrl, onClose } = props
    return (
        <StyledImageViewer>
            <div className="IV--close">
                <FontAwesome
                    className="IV--icon"
                    name="times"
                    onClick={onClose}
                />
            </div>
            <div className="IV--imageContainer">
                <img
                    src={imageUrl}
                    alt="image"
                    className="IV--image"
                />
            </div>
        </StyledImageViewer>
    )
}

export default ImageViewer