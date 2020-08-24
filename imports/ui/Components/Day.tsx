import React from 'react'

const Day = (porps:any):JSX.Element => {
    return (
        <div className="day--container">
            <div className="day--wrapper">
                <span className="day--span">
                    {porps.date}
                </span>
            </div>
        </div>
    )
}

export default Day