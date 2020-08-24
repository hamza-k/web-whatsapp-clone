import React from 'react'
import StyledUsersList from '../elements/StyledUsersList'
import {withTracker} from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import { User } from '../../api/models'
import _ from 'lodash'
import UserItem from './UserItem'

const UsersList = (props:any):JSX.Element => {
    const users:User[] = props.users
    const groupedUsers:string[] = _.groupBy(users, (user:User) => {
        return user.username.toUpperCase()[0]
    })
    const newUsers:any[] = Object.keys(groupedUsers).map(letter => {
        return {
            letter,
            groupedUsers: groupedUsers[letter]
        }
    })

    const renderUserItem = (userList:User[]):JSX.Element[] => {
        return userList.map((user, index) => {
            return (
                <UserItem
                    key={index}
                    id={user._id}
                    actu={user.profile.actu}
                    username={user.username}
                    picture={user.profile.picture}
                    onUserItemClick={props.onUserItemClick}
                />
            )
        })
    }

    const renderLetters = ():JSX.Element[] => {
        return newUsers.map((newUser, i:number) => {
            return (
                <React.Fragment key={i}>
                    <div className="letter">
                        {newUser.letter}
                    </div>
                    {renderUserItem(newUser.groupedUsers)}
                </React.Fragment>
            )
        })
    }

    return (
        <StyledUsersList>
            {renderLetters()}
        </StyledUsersList>
    )
}

export default withTracker((props:any) => {
    return {
        users: props.pattern === "" ? Meteor.users.find({_id: {
            $ne : Meteor.userId()
        }}, {
            sort : {
                username : 1
            }
        }).fetch() : props.users2
    }
})(UsersList)