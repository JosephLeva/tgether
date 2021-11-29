import React, { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'
import CIWItems from './CIWItems'
import CIWUsers from './CIWUsers'
import Axios from 'axios'
import { useLocation } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import Web3 from 'web3';
import { abi } from '../web3/web3'
import { InjectedConnector } from '@web3-react/injected-connector'
import { init, makepayment } from '../web3/web3client';

function ContractItemsWidget() {

    var [type, setType] = useState("Item");
    var [info, setInfo] = useState({"contractid":"", "recipient":"","amount":"" });
    var [joinid, setJoinid] = useState('');
    var [contractid, setSetcontractid] = useState('');

    const location = useLocation();
    var [recuserid, setRecuserid]= useState()
    var [buttonable, Setbuttonable]= useState(false)
    var [userid, setUserid]= useState()
    var[readydata, setreadyData]= useState()

    var[pay, setPay]= useState(false)

    const paying = (userid, value)=>{
        makepayment(userid, value).then(
            (tx) => {
                console.log(tx)
                setPay(true)

            }).catch((err)=>(console.log(err))
        )



    }




    const contractaddress= '0x5B41b99Cc4009aea4C38a4CC8426dA9B3c241339'
    const jobid = '09a767c5cf7f4e96b79b92e2fcafe4ee'
    const oracleid = '0x7CbeF9F1C57b13d412D7651D8a1cFb898600952C'
    const nodeurl= "https://kovan.infura.io/v3/5151d65eb73d4178ba4e1cb71aeae8dc"
    



    Auth.currentAuthenticatedUser().then((user) => {
        setUserid(user.username)
           }
        ).catch(err => console.log(err))




    useEffect(() => {
        init()




        initialjoinid();
        fetchInfo();


        const interval = setInterval(() => {
            fetchInfo();
            fetchuserpays();



        }, 100000);
        return () => clearInterval(interval);
    }, [joinid])
    


    const fetchInfo = async () => {
        console.log(joinid)
        if (joinid!= ""){ 
        const response = await Axios('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/getcontractinfo?joinid='+joinid);
        setInfo(response.data)
        setSetcontractid(response.data.contractid)
        console.log(contractid)
        console.log(response.data)
        }
    }

    const fetchuserpays = async () => {
        console.log(joinid)
        if (joinid!= ""){ 
        const response = await Axios('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/checkready?joinid='+joinid);
        const r = response.data
        console.log(r)
        setreadyData(r)
      

        }
    }

    const updateRD = (e)=>{
        for (let i in e) {
            setreadyData(readydata.push(e[i]))

            
          }
          console.log(readydata)

    }






    const initialjoinid= ()=>{
        const search = location.search.split(["="])
        var joinidval = search[1]
        setJoinid(joinidval)

    }

    const getjoinid=()=>{
        console.log(joinid,"hello")
        return joinid.toString()
    }

    const addRecipeint= async ()=>{
        console.log(joinid,"hi")
        var j = joinid
        const data = {"joinid": j, "userid": recuserid}
        console.log(data)
        const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/addrecpient', data);
        const joinidval = response.data.joinid
        const useridval = response.data.userid
        console.log(response)
        fetchInfo();


    }

    const updateRec = event =>{

        setRecuserid(event.target.value)
    }

    const agree = async()=>{
        console.log(joinid,"hi")
        var j = joinid
        const data = {"joinid": j, "userid": userid}
        console.log(data)
        const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/agree', data);
        const isready = response.data.response
        console.log("agreeing")
        console.log(isready)

        if (isready == "Ready"){
            fetchuserpays()
            console.log("fetchpays")
        }

    }


    // const ethEnabled = async () => {
    //     ethereum
    //     .request({ method: 'eth_requestAccounts' })
    //     .then(handleAccountsChanged)
    // }




    return (
        <div>
            <div className="card text-white border-primary bg-dark mb-3" style={{ maxWidth: "98%", margin: "auto" }}>
                <div className="card-body ">
                    <Row style={{ marginBottom: "3vh" }}>
                        <h1 style={{ textAlign: "center" }}> JoinId: {joinid}</h1>
                    </Row>
                    <Row>

                        <Col>
                            <div className="input-group ml-20" >

                                <input type="text" className="form-control" onChange={updateRec} placeholder="Enter Recipent Username"style={{ maxWidth: "95%" }} aria-label="Recipient's username" aria-describedby="button-addon2" wtx-context="268DF588-CE13-4D87-8DD4-0E8E8CD1D4BF" defaultValue={info.recpient != "" ? info.recipient: null}  />
                                <button type="button" className="btn btn-primary btn-sm" onClick={()=>{addRecipeint()}} disabled={buttonable}><i className="fas fa-plus"></i>

                                </button>


                            </div>



                        </Col>
                        <Col>

                            <div className="form-group">
                                <div className="input-group mb-3">
                                    <span className="input-group-text">$</span>
                                    <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" wtx-context="A5177AFF-6A2A-4352-A199-7D1A52EAE472" placeholder={info.amount}/>
                                    <button type="button" className="btn btn-primary btn-sm"><i className="fa fa-calendar" aria-hidden="true"></i></button>
                                </div>
                            </div>




                        </Col>
                    </Row>
                    <Row>
                        {type === "Item" & joinid != "" ?( <CIWItems join={joinid} />) : ( <CIWUsers  join={joinid} /> )}
                        
  

                    </Row>
                    <Row>
                        {/* <Col></Col><Col><h6 className="text-danger">Amount Outstanding: $3.99</h6></Col> */}
                        <div class="btn-group" role="group" aria-label="Basic example" style={{marginTop:"5vh"}}>
                        <button type="button" class="btn  btn-outline-light" onClick={()=>{setType("Item")}}>Items</button>
                        <button type="button" class="btn  btn-outline-light"onClick={()=>{setType("User")}}>Users</button>
                        </div>


                    </Row>
                    <Row>

                        <button type="button" className="btn btn-secondary" style={{ maxWidth: "20vw", margin: "auto", marginTop: "3vh" }} onClick={()=>{agree()}}>Agree</button>
                        {/* <button type="button" className="btn btn-secondary" style={{ maxWidth: "20vw", margin: "auto", marginTop: "3vh" }} onClick={()=>{ethEnabled()}}>Agree</button> */}

                        
                    </Row>
                    <Row>
                        {readydata !=null ? (readydata.response.map( (data)=>{
                            if(data.userid=== userid){
                                // ethEnabled()
                                // handleSet(data.amtETH)
                                paying(userid, data.amtETH )




                                console.log(data.userid)

                                return(
                                <div>
                                <h2>{data.amtUSD}</h2>
                                <h2>{data.amtETH}</h2>
                                </div>)}


                            })) :(null)
                        
                        
                        
                        }

                    
        

                        </Row>


                </div>
            </div>

        </div>
    )
                    }


export default ContractItemsWidget
