import Web3 from "web3"
import stakeABI from "../ABI/XpNetStaker.json"
import { store } from "../redux/store"
import { updateStakeInfo, updateAproveLockLoader } from "../redux/counterSlice"
import { updateImage, updateAmount, addLoader, updateWithdrawed, updateDuration, updateAvailableRewards ,updateStartTime, updateNftTokenId, updateNftTokenIndex, updateTokensArray, updateTokensAmount, updateTokensAmountFlag, updateIsUnlocked } from "../redux/stakeSlice"
import axios from "axios"



export let stakeAddress = '0xFCeEa514CD2da9Bc109F7C2693735C2Ea6965F9A'
const W3 = new Web3(window.ethereum)

// Create staker smart contract.
const stakeContract = async () => {
    try{
        const Contract = await new W3.eth.Contract(stakeABI, stakeAddress)
        return Contract
    }
    catch(error){
        console.log(error)
    }
}

// Log the contract.
export const logStakeContract = async () => {
    const Contract = await stakeContract()
    console.log(Contract)
    }

// Lock the XPNet.
export const stake = async (amount, duration, account) => {
    console.log(amount, duration ,'heloaska')
    const weiValue = Web3.utils.toWei(amount.toString(), 'ether');
    let durInSec
    if(duration!==12){
         durInSec = 60*60*24*(duration * 30)
    }
    else{
         durInSec = 86400 * 365 
    }
    try{
        store.dispatch(updateAproveLockLoader(true))
        const Contract = await stakeContract()
        Contract.methods.stake(weiValue, durInSec).send({from:account})
        .once('receipt', async function(receipt){
            store.dispatch(updateAproveLockLoader(false))
            await getAmountOfTokens(account)
        })
        .on('error',() => {
            store.dispatch(updateAproveLockLoader(false))
        })
    }
    catch(error){
        store.dispatch(updateAproveLockLoader(false))
        console.log(console.error())
    }
}

// Take owner addres and get amount of tokens on owner. APP
export const getAmountOfTokens = async (owner) => {
    const Contract = await stakeContract()
    if(owner){
        try{
            const tokensAmount = await Contract.methods.balanceOf(owner).call()
            store.dispatch(updateTokensAmount(tokensAmount))
            }
            catch(error){
                console.log(error)
            }
    }
}


// Take the amount of tokens, open loop. In each iteraction take owner addres and index, push token to array.
export const tokenOfOwnerByIndex = async (flag, tokenAmount, owner) => {
    let tokenArr = []
    if(flag === false){
        if(tokenAmount){
            const num = parseInt(tokenAmount)
            const Contract = await stakeContract()
            for (let i = 0; i < num; i++) {
                try{
                    // debugger
                    const token = await Contract.methods.tokenOfOwnerByIndex(owner,i).call()
                    tokenArr.push(token)
                    store.dispatch(addLoader({id:token, loader:false}))
                    console.log(token, 'hello get')
                     // Get picture for NFT
                    const res = await axios.get(`https://staking-api.xp.network/staking-nfts/${token}/image`)
                    if(res) {
                        // debugger
                        const { image } = res.data
                        console.log({ url: image, token }, 'hello get l')
                        store.dispatch(updateImage({ url: image, token }))
                    }
                }
                catch(error){
                    console.log(error)
                }
            }
            store.dispatch(updateTokensArray(tokenArr))
            store.dispatch(updateTokensAmountFlag(true))
        
        }
    }
}

// Get token by id.
export const getStakeById = async (id, index) => {
    const Contract = await stakeContract()
    try{
        const info = await Contract.methods.stakes(id).call()
        store.dispatch(updateNftTokenIndex(index))
        store.dispatch(updateStakeInfo(Object.values(info)))
        store.dispatch(updateAmount(info.amount))
        store.dispatch(updateDuration(info.lockInPeriod))
        store.dispatch(updateStartTime(info.startTime))
        store.dispatch(updateNftTokenId(info.nftTokenId))
    }
    catch(error){
        console.log(error)
    }
}



export const showAvailableRewards = async (nftId) => {
    const Contract = await stakeContract()
    try{
    const available = await Contract.methods.showAvailableRewards(nftId).call()

    store.dispatch(updateAvailableRewards(available))
    return available
    }
    catch(error){
        console.log(error)
    }
}

// Claim the rewards of chosen token.
export const claimXpNet = async (nftId,rewards, account) => {
    // store.dispatch(updateWithdrawed(true))
    const Contract = await stakeContract()
    try{
        await Contract.methods.withdrawRewards(nftId, rewards).send({from:account})
        .once('receipt', () => {
            store.dispatch(updateWithdrawed(false))
        })
        .on('error', () => {
            store.dispatch(updateWithdrawed(false))
        })
    }
    catch(error){
        console.log(error)
    }
}

// Withdrow token and rewards. 
export const withrow = async ( nftId, adress ) => {
    const Contract = await stakeContract()
    try{
        const result = await Contract.methods.withdraw(nftId).send({from:adress})
    }
    catch(error){
        console.log(error)
    }
} 


export const checkIsUnLocked = async (id) => {
    const Contract = await stakeContract()
    try{
        const isUnlocked = await Contract.methods.checkIsUnlocked(id).call()
        store.dispatch(updateIsUnlocked(isUnlocked))
    }
    catch(error){
        console.log(error)
    }
}