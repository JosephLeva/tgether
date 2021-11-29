import React, { useState, useRef, useEffect } from 'react';
import Auth from '@aws-amplify/auth';

import Axios from 'axios'

function Join() {
    const[j, setj] = useState('')
    var [userid, setUserid]= useState()

    Auth.currentAuthenticatedUser().then((user) => {
        setUserid(user.username)
           }
        ).catch(err => console.log(err))

    const handleInput = event => {
        setj(event.target.value);
      };
    
    const submit= async ()=>{
        const data={"userid":userid, "joinid":j}
        const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/adduser', data);
        const joinid = response.data.joinId
        const contractid = response.data.contractid
        console.log(contractid)
        console.log(joinid)
        window.location.href = "/contract/"+contractid+"?joinid="+j;

    }
    return (
        <div >
            <div className="card bg-secondary border-light mb-3" style={{ maxWidth: "95%", margin: "auto", marginTop: "8vh" }}>

                <div className="card-body">
                <div className="card text-white border-primary bg-dark mb-3" style={{ maxWidth: "98%", margin: "auto" }}>
                <div className="card-body ">
                <h1 style={{ margin: "auto", textAlign: "center" }}>Enter Join Id:</h1>
                <input type="text" className="form-control" placeholder="Enter Join Id"style={{ maxWidth: "100%", marginTop:"4vh", textAlign:"center" }}  onChange={handleInput} aria-label="Recipient's username" aria-describedby="button-addon2" wtx-context="268DF588-CE13-4D87-8DD4-0E8E8CD1D4BF"  />


                <div style={{marginTop:"5vh",  marginBottom: "10vh", alignItems:"center", position:"relative"}}>
                        <button style={{position:"absolute", top:"50%", left:"50%", msTransform:"translate(-50%, -50%)", transform:"translate(-50%, -50%)"}} type="button" class="btn btn-secondary" onClick={()=>{submit()}}>Submit</button>
                            </div>
                </div>
            </div>

                </div>
            </div>


        </div>
    )
}

export default Join
