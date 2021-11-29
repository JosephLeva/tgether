
import Web3 from 'web3';
import  {abi}  from './web3'
const contractaddress= '0x5B41b99Cc4009aea4C38a4CC8426dA9B3c241339'
const jobid = '09a767c5cf7f4e96b79b92e2fcafe4ee'
const oracleid = '0x7CbeF9F1C57b13d412D7651D8a1cFb898600952C'
const nodeurl= "https://kovan.infura.io/v3/5151d65eb73d4178ba4e1cb71aeae8dc"
let selectedaccount; 
let TgetherPayment;
let isinitialized= false;

export const init =  async ()=>{
let provider = window.ethereum;
if (typeof provider != 'undefined'){
    provider.request({
        method:'eth_requestAccounts'
    }).then((accounts) => {
        selectedaccount= accounts[0]
        console.log(accounts)  
        console.log(accounts[0])  
    }).catch((err)=>{console.log(err)
    return})
    const web3 = new Web3(nodeurl)

    window.ethereum.on('accountsChanged', function(accounts){console.log(accounts)})
}
    const web3 = new Web3(provider);
    const TgetherPayment = new web3.eth.Contract(abi, contractaddress)
    isinitialized= true

}




export const makepayment = async (userid, value)=>{
    console.log(userid,value)
    if(!isinitialized){
        await init()
        console.log("waited")
    }
    return TgetherPayment.methods.TgetherPay(selectedaccount).send(
       {
           from: selectedaccount,
           data:(oracleid,jobid, userid),
           value: value

       }
   )

}