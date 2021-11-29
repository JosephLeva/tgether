import React from 'react'
import ContractWidget from '../components/ContractWidget'
import CreateorJoin from '../components/CreateorJoin'
import Auth from '@aws-amplify/auth';


function Homescreen() {
    const val = null
    var ampUser = null
    Auth.currentAuthenticatedUser().then(user => ampUser = user.username).catch(err => console.log(err));
    // console.log(Auth.currentAuthenticatedUser())
    const amp = ()=>{console.log(ampUser)}
    return (
        <div >
            <div className="card bg-secondary border-light mb-3" style={{ maxWidth: "95%", margin: "auto", marginTop: "8vh" }}>

                <div className="card-body">
                    {val == null ? (
                        <CreateorJoin />

                    ) : (<ContractWidget style={{ opacity: 0 }} />)}
                </div>
            </div>


        </div>
    )
}

export default Homescreen
