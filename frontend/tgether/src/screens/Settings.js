import React, { useState, useRef, useEffect } from 'react';
import Auth from '@aws-amplify/auth';
import Axios from 'axios'

function Settings() {
    var [address, setAddress] = useState('');
    var [isjoin, setisJoin] = useState(true);
    var [userid, setUserid]= useState()

    Auth.currentAuthenticatedUser().then((user) => {
        setUserid(user.username)
           }
        ).catch(err => console.log(err))

    useEffect(() => {
        fetchSettings(userid)

      }, [userid]);
      console.log(userid)

      const fetchSettings = async (e) => {
          if (e != null){
        console.log('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/getsettings?userid='+e)
        const response = await Axios('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/getsettings?userid='+e);
        setAddress(response.data.address)
        setisJoin(response.data.isjoin)
        console.log(response.data)}
    }


    const updatecheck= ()=>{
        setisJoin(!isjoin)
    }

    const updateSettings = async ()=>{
        console.log(address)
        const data={"userid":userid, "address":address, "isjoin":isjoin}
        const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/addsettings', data);
        setAddress(response.data.address)
        setisJoin(response.data.isjoin)

    }
    const handleInput = event => {
        setAddress(event.target.value);
      };


    return (
        <div >
            <div className="card bg-secondary border-light mb-3" style={{ maxWidth: "95%", margin: "auto", marginTop: "8vh" }}>

                <div className="card-body">
                <div className="card text-white border-primary bg-dark mb-3" style={{ maxWidth: "98%", margin: "auto" }}>
                <div className="card-body ">
                    <h1 style={{ margin: "auto", textAlign: "center" }}>Settings</h1>

                    <div className="input-group ml-20" style={{marginTop:"5vh"}}>

                        <h6 style={{marginRight:"15px", marginTop:"7px"}}>Default Recipent Address: </h6>

                        <input type="text" className="form-control" placeholder="Enter An Address"style={{ maxWidth: "95%" }}  onChange={handleInput} aria-label="Recipient's username" aria-describedby="button-addon2" wtx-context="268DF588-CE13-4D87-8DD4-0E8E8CD1D4BF"  defaultValue={address}/>

                        </div>

                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group" style= {{marginTop:"5vh"}}>
                        <h6 style={{marginRight:"25px" , marginTop:"7px"}}>Is this a recipient only account? </h6>
     

                        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={!isjoin} onClick={updatecheck}/>
                        <label className="btn btn-outline-primary" for="btnradio1">Yes</label>
                        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked={isjoin}  onClick={updatecheck}/>
                        <label className="btn btn-outline-primary" for="btnradio2">No</label>

                        </div>

                        <div style={{marginTop:"5vh",  marginBottom: "10vh", alignItems:"center", position:"relative"}}>
                        <button style={{position:"absolute", top:"50%", left:"50%", msTransform:"translate(-50%, -50%)", transform:"translate(-50%, -50%)"}} type="button" class="btn btn-secondary" onClick={()=>{updateSettings()}}>Update</button>
                            </div>
                </div>
            </div>

                </div>
            </div>


        </div>
    )
}

export default Settings
