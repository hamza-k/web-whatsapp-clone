import React, {useState} from 'react'
import StyledFormLogin from '../elements/StyledFormLogin'

const FormLogin = (props:any):JSX.Element => {
    const [state, setState] = React.useState<any>({
        username: '',
        phone: '',
        password: '',
    })
    const {username, phone, password} = state
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const inputValue:string = e.target.value;
        const inputName:string = e.target.name
        setState(prevState => (
            {
                ...prevState,
                [inputName]: inputValue
            }
        ))
    }
    return (
        <StyledFormLogin>
        <label className='label'>
            <input
                className="input"
                name="username"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={handleChange}
            />
        </label>
            <label className='label'>
                <input
                    className="input"
                    name="phone"
                    placeholder="N° de téléphone"
                    value={phone}
                    onChange={handleChange}
                />
            </label>
            <label className='label'>
                <input
                    className="input"
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={handleChange}
                />
            </label>
            <button onClick={() => props.onLogin(state)} className="loginBtn">Connexion</button>
        </StyledFormLogin>
    )
}

export default FormLogin