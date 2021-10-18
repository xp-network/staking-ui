import React, { useEffect } from 'react'
import { stake } from "../../utils/stake"
import { approve } from "../../utils/xpnet"
import lock from "../../assets/lock.svg"
import lockWhite from "../../assets/lockWhite.svg"
import { useSelector } from 'react-redux'
import ButtonLoader from '../Loader/ButtonLoader'
import approved from "../../assets/approved_icon.svg"
import "./Buttons.css"
import { useHistory } from 'react-router'


export function Approvance({ approvance, amount, duration, account }) {
    const approveloader = useSelector(state => state.data.aproveLoader)
    const agreement = useSelector(state => state.data.agreement)
    const allowence = useSelector(state => state.data.allowence)
    const {stakingAmount} = useSelector(s => s.data)

    useEffect(() => {
        
    }, [approveloader, agreement, allowence])
    console.log(amount, 'amoonntt')
    if(approvance){
        return <div className="summary__button approved"><img src={approved} alt=""></img>Approved</div>
    }
    else if(!approvance && agreement && stakingAmount >= 1500){
        return <div onClick={() => approve(account)} className="summary__button button">{approveloader ? <ButtonLoader /> : "Approve"}</div>
    }
    else {
        return <div className="summary__button lock">Approve</div>
    }
}

export function Lock({ approvance, duration, account}){
    const lockloader = useSelector(state => state.data.lockLoader)
    const agreement = useSelector(state => state.data.agreement)
    const amount = useSelector(state => state.data.stakingAmount)
    const history = useHistory()
    if(approvance && agreement && amount >= 1500){
        return (
            <div onClick={() => stake(amount, (duration === 1 ? 12 : duration), account, history)} className={ !lockloader ? "summary__button button" : "summary__button loading button"}>
                {lockloader ? <ButtonLoader /> : <><img src={lockWhite} alt=""/><span>Lock</span></>}
            </div>)
    }
    else{
        return <div className="summary__button lock"><img src={lock} alt=""/><span>Lock</span></div>
    }
}
