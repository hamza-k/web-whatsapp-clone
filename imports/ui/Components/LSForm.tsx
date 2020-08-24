import React from 'react'
import StyledLSForm from '../elements/StyledLSForm'
import FontAwesome from 'react-fontawesome'
import { Meteor } from 'meteor/meteor'

const LSForm = (props:any):JSX.Element => {
    const { type } = props
    const [editable, setEditable] = React.useState<boolean>(false)
    const title:string = type === "actu" ? "Actu" : "Votre nom"
    const value:string = type === "actu" ? Meteor.user().profile.actu : Meteor.user().username
    const [state, setState] = React.useState<string>(value)
    const toggleEditable = ():void => {
        if(!editable) {
            setEditable(true)
        } else {
            if(type === "actu") {
                Meteor.users.update({_id: Meteor.userId()}, {
                    $set : {
                        "profile.actu": state
                    }
                })
            } else {
                Meteor.call('user.username', Meteor.userId(), state)
            }
            setEditable(false)
        }
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const newValue:string = e.target.value
        setState(newValue)
    }

    return (
        <StyledLSForm>
            <span className="LSForm--title">
                {title}
            </span>
            {!editable ? (
            <div className="LSForm--container">
                <input
                    readOnly={true}
                    className="LSForm--input __border"
                    value={state}
                />
                <FontAwesome
                    className="LSForm--icon"
                    name="pen"
                    onClick={toggleEditable}
                />
            </div>
            ) : (
            <div className="LSForm--container">
                <input
                    readOnly={false}
                    className="LSForm--input __border"
                    value={state}
                    onChange={handleChange}
                />
                <FontAwesome
                    className="LSForm--icon"
                    name="check"
                    onClick={toggleEditable}
                />
            </div>
            )}
        </StyledLSForm>
    )
}

export default LSForm