import React from 'react'
import RightImg from './RightImg'
import FormLogin from './FormLogin'
import { Meteor } from 'meteor/meteor'

const messageText:string = "Connectez vous afin de lancer une conversation"

const Login = (props:any):JSX.Element => {
    const handleLogin = (state:any):void => {
        const {password, username} = state
        Meteor.call('user.login', state, (err, res) => {
            if (err) {
                console.error('Error :', err)
            } else {
                Meteor.loginWithPassword(username, password, (err) => {
                    if (err) {
                        console.error('Error :', err)
                    } else {
                        console.log('Success :', res)
                        props.history.push('/chats')
                    }
                })
            }
        })
    }

    return(
            <RightImg messageText={messageText}>
                <FormLogin onLogin={handleLogin}/>
            </RightImg>
    )
}
export default Login