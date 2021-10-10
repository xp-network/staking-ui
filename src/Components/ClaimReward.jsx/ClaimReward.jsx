import { useEffect, useState} from 'react'
import { useSelector } from "react-redux"
import { nf } from '../../utils/helper'
import Web3 from "web3"
import { showAvailableRewards } from "../../utils/stake"


export default function ClaimReward() {

    const stakeInfo = useSelector(state => state.data.stakeInfo)
    const rewardsWai = useSelector(state => state.stakeData.availableRewards)
    const rewards = Web3.utils.fromWei(rewardsWai, 'ether');

    // console.log("ClaimReward: ", stakeInfo[1])

    useEffect( async () => {
      // debugger
      if(stakeInfo){
        setInterval(async () => {
            await showAvailableRewards(stakeInfo[1])
                // console.log('hello')
        },5000)
        // await showAvailableRewards(stakeInfo[1])
      }
  }, [stakeInfo])

    return (
        <div className="claim__det claim__reward">
            <div className="claim__capture">Staking Reward</div>
            <div className="claim__text">{nf.format(rewards)} XPNET</div>
        </div>
    )
}
