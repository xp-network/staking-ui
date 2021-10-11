import React from 'react'
import "./NavButton.css"
import { Link } from "react-router-dom";

export default function NavButton({ location, type, balance }) {
    if(type === 'stake-btn') return (
        <div className={location.pathname === '/stake' || location.pathname === '/' ? `Stake nav__button--active`: `Stake nav__button`}>
            <Link to='/stake'>Stake XPNET</Link>
        </div>
    )
    else if(type === 'claim-btn') {
        if(balance){
            return (
                <div className={location.pathname === '/claim' ?`nav__button--active`:`nav__button`}>
                    <Link to='/claim'>Claim XPNET</Link>
                </div>)
        }
        else {
            return ( 
                <div className="nav__button--disabled">
                    Claim XPNET
                </div> )
        }
    }
}