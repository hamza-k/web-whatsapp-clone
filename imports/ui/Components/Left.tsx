import React from 'react'
import StyledLeft from '../elements/StyledLeft'
import Header from './Header'
import Avatar from './Avatar'
import Status from './Status'
import {Meteor} from 'meteor/meteor'
import Searchbar from './Searchbar'
import ChatList from './ChatList'
import LeftSide from './LeftSide'
import LSHeader from './LSHeader'
import LSForm from './LSForm'
import {withTracker} from 'meteor/react-meteor-data'
import UsersList from './UsersList'
import {User} from '../../api/models'

const Left = (props:any):JSX.Element => {

    const icons:any[] = [
        {
            name: "circle-notch",
            func: () => {}
        }, {
            name: "comment-alt",
            func: () => {showUList()}
        }, {
            name: "ellipsis-v",
            func: () => {}
        }
    ]

    const {chats, onChatClick, selectedChat, OPVisible, picture, onUserItemClick} = props
    const [LSVisible, setLSVisible] = React.useState<boolean>(false)
    const [UListVisible, setUListVisible] = React.useState<boolean>(false)
    const [pattern, setPattern] = React.useState<string>('')
    const [pattern2, setPattern2] = React.useState<string>('')
    const [users2, setUsers2] = React.useState<User[]>([])
    const [chats2, setChats2] = React.useState<User[]>([])

    const showUList = ():void => {
        setLSVisible(true)
        setUListVisible(true)
    }

    const userItemClick = (_id:string, username:string, picture:string):void => {
        toggleLS()
        props.onUserItemClick(_id, username, picture)
    }

    const handleUSearch = (pattern:string):void => {
        setPattern(pattern)
        setUsers2(Meteor.users.find({
            _id: {$ne: Meteor.userId()},
            username: {$regex: pattern, $options: 'i'}
        }, {
            sort: {
                username: 1
            }
        }).fetch())
    }

    const handleCSearch = (pattern:string):void => {
        setPattern2(pattern)
        let chats2 = chats.filter(chat =>  chat.title.toLowerCase().indexOf(pattern.toLowerCase()) !== -1)
        setChats2(chats2)
    }

    const renderLSComponents = ():JSX.Element => {
        if(UListVisible) {
            return (
                <>
                    <LSHeader title="Nouvelle discussion" onLSClose={toggleLS}/>
                    <Searchbar 
                        placeholder="Chercher contact"
                        onSearch={handleUSearch}
                    />
                    <UsersList 
                        onUserItemClick={userItemClick}
                        pattern={pattern}
                        users2={users2}
                    />
                </>
            )
        }
        return (
            <>
                <LSHeader title="Nouvelle discussion" onLSClose={toggleLS}/>
                <div className="LS--avatar">
                    <Avatar big avatar_url={picture} inLS/>
                </div>
                <LSForm type="username"/>
                <div className="LS--desc">
                    <span>Ce n'est pas votre nom d'utilisateur, ni votre code pin. Ce nom sera visible auprès de vos contacts WhatsApp.</span>
                </div>
                <LSForm type="actu"/>
            </>
        )
    }

    const toggleLS = ():void => {
        if(!LSVisible) {
            setLSVisible(true)
        } else {
            setLSVisible(false)
            setUListVisible(false)
        }
    }

    return (
        <StyledLeft OPVisible={OPVisible} >
            {!LSVisible ? (
                <>
                    <Header icons={icons} iconClass="greyIcon">
                        <Avatar avatar_url={picture} onAvatarClick={toggleLS}/>
                    </Header>
                    <Status/>
                    <Searchbar 
                        placeholder="Rechercher ou démarrer une discussion"
                        onSearch={handleCSearch}
                    />
                    <ChatList 
                        chats={chats} 
                        chats2={chats2} 
                        onChatClick={onChatClick} 
                        selectedChat={selectedChat}
                        pattern={pattern2}
                    />
                </>
            ) : (
                <LeftSide>
                    {renderLSComponents()}
                </LeftSide>
            )}
        </StyledLeft>
    )
}

export default withTracker(() => {
    return {
        picture : Meteor.user().profile.picture
    }
})(Left)