import React from 'react'
import FontAwesome from 'react-fontawesome'
import StyledSearchbar from '../elements/StyledSearchbar'

const Searchbar = (props:any):JSX.Element => {
    const [state, setState] = React.useState<string>('')
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        const pattern:string = e.target.value
        setState(pattern)
        props.onSearch(pattern)
    }
    return (
        <StyledSearchbar>
            <label className="searchbar--label">
                <FontAwesome
                    name='search'
                    className='searchbar--icon'
                />
                <input 
                    className='searchbar--input'
                    placeholder={props.placeholder}
                    value={state}
                    onChange={handleChange}
                />
            </label>
        </StyledSearchbar>
    )
}

export default Searchbar