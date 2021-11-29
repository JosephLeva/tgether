import React, { useState, useRef, useEffect } from 'react';
import { render } from 'react-dom';
import Axios from 'axios'
import { useLocation } from 'react-router-dom';
import Auth from '@aws-amplify/auth';


function CIWItems(join) {
    var [adding, setAdding] = useState(false);
    var [newitem, setnewItem] = useState("");
    var [newamount, setnewAmount] = useState("");
    const location = useLocation();
    var[items, setItems] = useState({"items":[


    ]})

    var [userid, setUserid]= useState()

    Auth.currentAuthenticatedUser().then((user) => {
        setUserid(user.username)
           }
        ).catch(err => console.log(err))


    useEffect(() => {
        fetchItems();


        const interval = setInterval(() => {
            fetchItems();



        }, 1000000);
        return () => clearInterval(interval);
    }, [])


    const fetchItems = async () => {
        console.log(join)

        const response = await Axios('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/getitems?joinid='+join.join);
        setItems(response.data)
        console.log(response.data)
    }

    



    




    const updateadd=()=>{

        if(adding === true){
            setAdding(false)
        }else if (adding === false){
            setAdding(true)
        }
    }
    


    const save = async ()=>{
        if(!isNaN(parseFloat(newamount))) {
            console.log(join.join,"hi")
            var j = join.join
            const data = {"joinid": j, "itemname": newitem, "itemprice":newamount }
            console.log(data)
            const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/additem', data);
            const respitemname = response.data.itemname
            const respitemamount = response.data.itemamount
            console.log(response)  
            fetchItems() 

        }else{
            alert("Your Amount Is Not A Number")
        }


    }

    const addItemUser = async (e)=>{
            const data = {"userid": userid, "itemid": e }
            console.log(data)
            const response = await Axios.post('https://chyami5bx6.execute-api.us-east-1.amazonaws.com/prod/additemuser', data);
            const Status = response.data.Status
            console.log(response)  
            fetchItems() 


    }




    return (
        <div>
                                  <table className="table table-hover" style={{ maxWidth: "80%", margin: "auto", position: "relative" }}>
                            <thead>
                                <tr>
                                    <th scope="col"style={{textAlign:"center"}}>Item  

                                    <button type="button" className="btn btn-outline-dark btn-sm" style={{marginLeft:"3px"}}onClick={updateadd}><i className="fas fa-plus"></i></button> 
                                    
                                    
                                    </th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"style={{textAlign:"center"}} >Amount</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    <th scope="col"style={{textAlign:"center"}}>Who's In?</th>



                                </tr>
                            </thead>
                            <tbody>

                                {
                                items.items.map((itemobj)=>(
                                    <tr className="table-primary">
                                    <th scope="row"style={{textAlign:"center"}}>{itemobj.itemname}</th>
                                    <td></td>
                                    <td></td>
                                    <td style={{textAlign:"center"}}>
                                       {itemobj.itemprice}
                                    </td>
                                    <td></td>
                                    <td>   <button type="button" style={{marginRight:"7px"}}class="btn btn-outline-warning btn-sm" onClick={()=>{addItemUser(itemobj.itemid)}}>Add Me!</button>
</td>
                                    <td style={{textAlign:"center"}}>
                                    {itemobj.users.map((user, index)=>(<span>{(index ? ', ':'')+user}</span>))}

                                    </td>
                                

                                </tr>
                                    
                                    
                                    ))}

                               
                                { adding== true ?                            
                                (<tr className="table-primary">
                                    <td style={{textAlign:"center"}}>
                                    <input type="text" className="form-control" placeholder="Enter Item Name" id="inputDefault" style={{ maxWidth: "200px" }} wtx-context="9A05EF30-5D9B-43D3-84B6-C9091F898755" onChange={e=>{setnewItem(e.target.value)}} />
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td style={{textAlign:"center"}}>
                                    <input type="number" className="form-control" placeholder="Enter Price" id="inputDefault" style={{ maxWidth: "200px" }} wtx-context="9A05EF30-5D9B-43D3-84B6-C9091F898755" onChange={e=>{setnewAmount(e.target.value)}} />
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td style={{textAlign:"center"}}>
                                    <button type="button" class="btn btn-outline-warning btn-sm" onClick={save}>Save!</button>

                                    </td>
                                

                                </tr>
                                ) :(null) }

                            </tbody>


                        </table>

            
        </div>
    )
}

export default CIWItems
