import Auth from '@aws-amplify/auth';
import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios'
import { Link } from 'react-router-dom'
function CreateorJoin() {
    var [userid, setUserid] = useState(null);
    Auth.currentAuthenticatedUser().then(user => setUserid(user.username)).catch(err => console.log(err));
    

    const createContract = async () =>{
        const data={"userid":userid}
        const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/makecontract', data);
        const contractid=(response.data.contractId)
        const joinid=(response.data.joinId)
        window.location.href = "/contract/"+contractid+"?joinid="+joinid;




    }


    return (
        <div>
            <div className="card text-white border-primary bg-dark mb-3" style={{ maxWidth: "98%", margin: "auto" }}>
                <div className="card-body ">
                    <h1 style={{ margin: "auto", textAlign: "center" }}>What Would You Like to Do?</h1>
                    <div class="d-grid gap-2">
                        <button class="btn btn-lg  btn-outline-primary" style={{ marginTop: "3vh" }} type="button" onClick={()=>{createContract()}}>Create A Contract</button>
                        <h3 style={{ margin: "auto", padding: "20px" }}>Or</h3>
                        <Link to="/join">
                            <button class="btn btn-lg btn-outline-primary" style={{ marginBottom: "3vh", width:"100%" }} type="button">Join A Contract</button>
                            </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateorJoin
