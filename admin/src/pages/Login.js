import {useState} from 'react';
import axios from 'axios' ;
import {apiBaseUrl} from '../config'

export default function Login() {

    const [email,setEmail ]=useState("")
    const [password,setPassword ]=useState("")
    const [errMsg,setErrMsg ]=useState("")

async function Login(e){
    e.preventDefault();
    
    if(!email || !password){
        setErrMsg("Please Enter value");
    }else{
       
    }

  }

    return (
        <>
            <div className=" p-5 text-center bg-primary text-white">
                <h1>Admin Panel</h1>
                <p>Login Details</p>
            </div>
            <div className="container my-5" >
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        {/* forms */}
                        <form onSubmit={Login }>
                            <div className="mb-3">
                                <label  className="form-label">
                                    Email address
                                    </label>
                                <input type="email" 
                                       className="form-control" 
                                       id="exampleInputEmail1" 
                                       aria-describedby="emailHelp"
                                       onChange={(e)=>setEmail(e.target.value)}
                                />
                                    <div id="emailHelp" className="form-text">
                                        We'll never share your email with anyone else.
                                        </div>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Password</label>
                                <input type="password" 
                                       className="form-control" 
                                       id="exampleInputPassword1"
                                       onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>
                             {
                                errMsg?<h5 className='text-danger'>{errMsg}</h5>:""
                             }            
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
            </div>
        </>
    )
}
