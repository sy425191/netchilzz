import React from 'react'
import Navbar from '../components/Navbar'

export default function Users() {
    return (
        <>
            <Navbar />
            <div className="container my-5" >
                <h2 className='text-center mb-4'>Users</h2>
                <table className="table" id="dt">
                    <thead>
                        <tr>
                            <th >#</th>
                            <th >UserName</th>
                            <th >email</th>
                            <th >statas</th>
                            <th >AddedOn</th>
                            <th >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th >1</th>
                            <td>Mark</td>
                            <td>Otto@gmail.com</td>
                            <td>Active</td>
                            <td>@mdo</td>
                            <td>
                                
                            <button type="button" className="btn btn-danger " >Block</button>
                            
                            <button type="button" className="btn btn-secondary ">Remove</button>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </>
    )
}
