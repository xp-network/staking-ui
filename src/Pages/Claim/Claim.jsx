import React, { useState } from 'react'
import Web3 from "web3"
import "./Claim.css"
import unlock from "../../assets/unlock.png"
import bigart from "../../assets/bigart.png"
import { useEffect } from 'react'
import { balanceOf, showAvailableRewards, claimXpNet, getStakeById, withrow } from "../../utils/stake"
import { useSelector } from "react-redux"
import { useHistory } from 'react-router'
import NFT from '../../Components/NFT/NFT'
import ClaimReward from './Parts/ClaimReward.jsx/ClaimReward'
import ClaimAmount from './Parts/ClaimAmount/ClaimAmount'
import ClaimAPY from './Parts/ClaimAPY/ClaimAPY'
import ClaimStart from './Parts/ClaimStart/ClaimStart'
import ProgressBar from './Parts/ProgressBar/ProgressBar'
import End from './Parts/End/End'
import NFTAdres from './Parts/NFTAdres/NFTAdres'
import ClaimButton from './Parts/ClaimButton/ClaimButton'
import UnStakeButton from './Parts/UnStakeButton/UnStakeButton'
import Loader from '../../Components/Loader/Loader'
import Widget from './Parts/Widget/Widget'
 
export default function Claim() {
    const balance = useSelector(state => state.data.balance)
    const address = useSelector(state => state.data.account)
    const tokens = useSelector(state => state.data.tokenIDs)
    const tokensArr = useSelector(state => state.stakeData.tokensArray)
    // console.log("Claim: ", tokens)
    const stakeInfo = useSelector(state => state.data.stakeInfo)
    // console.log(stakeInfo)
    const stakedAmount = useSelector(state => state.stakeData.amount)
    const period = useSelector(state => state.stakeData.duration)
    const startTime = useSelector(state => state.stakeData.startTime)
    const startDate = useSelector(state => state.stakeData.startDate)
    const rewardsWai = useSelector(state => state.stakeData.availableRewards)
    const currentToken = useSelector(state => state.stakeData.index)
    let history = useHistory();
    // console.log("start date: ", startDate)
    // console.log("start time: ", startTime)
    // console.log("period :", period)
    // console.log("token ids: ",tokens)
    // console.log("account: ", address, typeof address)
    // console.log("staker:", stakeInfo[5], typeof stakeInfo[5])
    const stakedAmountEther = Web3.utils.fromWei(stakedAmount, 'ether');
    const showTokens = () => {
        // debugger
        if(tokensArr){
            return tokensArr.map((tokenID, i) => { return <NFT tokenID={tokenID} i={i} key={i}/> })
        }
    }

    useEffect(async() => {
        debugger
        
        if(!address || !balance){
            history.push("/stake")
        }
        if(!stakeInfo){
            console.log("hello", tokensArr)
            if(tokensArr){
            debugger
            await getStakeById(tokensArr[currentToken], currentToken)
            // setLoader(false)
            }
        }
        else{
            console.log("hello", tokensArr)
            if(tokensArr){
            debugger
            await getStakeById(tokensArr[currentToken], currentToken)
            // setLoader(false)
            }
        }
    }, [tokensArr, currentToken])

    // useEffect( async () => {
    //     debugger
    //     if(!stakeInfo){
    //         console.log("hello", tokensArr)
    //         if(tokensArr){
    //         debugger
    //         await getStakeById(tokensArr[currentToken], currentToken)
    //         // setLoader(false)
    //         }
    //     }  
    // }, [currentToken])

    useEffect(() => {
        // Rerender the component when stakiInfo change.
    }, [stakeInfo])    

        if(tokensArr){
            return (
                <div className="claim__container">
                    <div className="claim">
                        
                        <div className="claim__title">Staking Reward</div>
                        <div className="line"></div>
                        <div className="claim__details">
                            <ClaimAmount stakedAmount={stakedAmount} stakedAmountEther={stakedAmountEther}/>
                            <ClaimAPY period={period} />
                            <ClaimReward />
                            <ClaimStart startTime={startTime} />
                            <End startTime={startTime} period={period} startDate={startDate} />
                            <ProgressBar period={period} startTime={startTime} />
                            <ClaimButton stakeInfo={stakeInfo[1]} rewardsWai={rewardsWai} address={address} />
                            <UnStakeButton stakeInfo={stakeInfo[1]} address={address} stakerAddress={stakeInfo[5]} />
                        </div>
                    </div>
                    <div className="nft__wrapper">
                        <div className="nft">
                            
                            <div className="nft__title">NFT</div>
                            <div className="line"></div>
                            <div className="nft__content">
                                <Widget tokens={tokensArr} />
                                <NFTAdres address={address}/>
                            </div>
                        </div>
                        <div className="nfts__toggler">
                            { showTokens() }
                        </div>  
                    </div>
                </div>
            )
        }
        else{
            return <Loader />
        }
   
}