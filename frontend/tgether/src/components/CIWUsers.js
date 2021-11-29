import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios'

function CIWUsers(join) {
    var[users, setUsers] = useState({"users":[]})
    var [joinid, setJoinid] = useState('');


    useEffect(() => {
        fetchUsers();
        const interval = setInterval(() => {
            fetchUsers();



        }, 10000);
        return () => clearInterval(interval);
    }, [])


    const fetchUsers = async () => {
        if( join.join != ''){
        const response = await Axios('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/getusers?joinid='+ join.join);
        setUsers(response.data)
        console.log(response.data)
        }
    }


    

    return (
        <div>
                                   <table className="table table-hover" style={{ maxWidth: "80%", margin: "auto", position: "relative" }}>
                            <thead>
                                <tr>
                                    <th scope="col"style={{textAlign:"center"}}>Users</th>
                                </tr>
                            </thead>
                            <tbody>

                                {users.users.map((user, index)=>( <tr className="table-primary"><th scope="row"style={{textAlign:"center"}}>{user}</th></tr>))}

                                
                            </tbody>


                        </table>
            
        </div>
    )
}

export default CIWUsers
