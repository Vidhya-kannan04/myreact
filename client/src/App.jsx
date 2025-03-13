import { useEffect,useState } from 'react'

import axios from "axios";
import './App.css'



function App() {
  const [users,setUsers]=useState([]);
  const [filterUsers, setfilterUsers] = useState([]);
  const [isModelopen, setisModelopen] = useState(false);
  const [userData,setuserData]=useState({name:"",age:"",city:""});
  const [isEdit,setisEdit]=useState(false);


   async function getUsers() {
    try {
      const response = await axios.get('http://localhost:8000/users/');
      console.log(response.data);
      setUsers(response.data);
      setfilterUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      // Detailed Error Handling (same as above)
      if (error.response) {
        console.error("Server responded with status code:", error.response.status);
        console.error("Response data:", error.response.data); // Log the response data
        // User-friendly message (don't expose raw details in production)
        if (error.response.status === 404) {
          alert("Users not found!");
        } else if (error.response.status === 500) {
          alert("A server error occurred. Please try again later.");
        } else {
          alert("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received (network error)
        console.error("No response received from the server. Check your network connection.");
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
        alert("A network error occurred.");
      }
    }
  }

  useEffect(()=>{
    getUsers();
   },[])

   //searchfunction

   const handleserachchange=(e)=>{
    const searchText=e.target.value.toLowerCase();
    const filteredUsers=users.filter((user)=>
      user.name.toLowerCase().includes(searchText) 
    || user.city.toLowerCase().includes(searchText));
    setfilterUsers(filteredUsers);
   }
   //delete function
const handledelete=async(id)=>{
  const isConfimred=window.confirm("Are you sure you want to delete this record");
  if(isConfimred){
   
      const response = await axios.delete(`http://localhost:8000/users/${id}`);
      setUsers(response.data);
      setfilterUsers(response.data);
      getUsers();
  }
}
  //add record
  const handleAddRecord=()=>{
    setuserData({name:"",age:"",city:""});
    setisModelopen(true);
  }

  const closeModal=()=>{
    setisModelopen(false);
    getUsers();
  }
  const handleData=(e)=>{
    setuserData({...userData,[e.target.name]:e.target.value});
  }

  //submit record

  const handleSubmit= async(e)=>{
    e.preventDefault();
    if(userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res)=>{
        console.log(res);
      })

    }else{
    await axios.post('http://localhost:8000/users/',userData).then((res)=>{
      console.log(res);
    })
  }
  closeModal();
  setuserData({name:"",age:"",city:""});
  }

  //update record
  const handleUpdateRecord=(user)=>{
    setuserData(user);
      setisModelopen(true);
  }

  return (
    <>
     <div className="container">
        <h3>CURD My React</h3>
        <div className="input-search">
          <input type="search" placeholder='Enter the serach here' onChange={handleserachchange}/>
          <button className="btn green" onClick={handleAddRecord}>Add Record</button>
          </div>
          <div>
            <table className='table'>
              <thead>
                <tr><th>S.No</th>
                <th>Name</th>
                <th>Age</th>
                <th>Place</th>
                <th>Edit</th>
                <th>Delete</th>
                </tr>
                </thead>
<tbody>
  {filterUsers && filterUsers.map((user, index) => (
    <tr key={user.id}>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{user.age}</td>
      <td>{user.city}</td>
      <td><button  className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
      <td><button onClick={()=>handledelete(user.id)} className='btn red'>Delete</button></td>
    </tr>
  ))}
</tbody>

            </table>
           {isModelopen && (
<div className='modal'>
  <div className='modal-content'>
  
    <span className='close' onClick={closeModal}>X</span>
    <h2>Add Record</h2>
    <div className='input-group'>
      <label htmlFor='Name'>Name</label>
      <input type='text' name="name" id="name" placeholder='Enter the name' value={userData.name} onChange={handleData} />
       </div>

       <div className='input-group'>
      <label htmlFor='age'>Age</label>
      <input type='number' name="age" id="age" placeholder='Enter the age' value={userData.age} onChange={handleData} />
       </div>

       <div className='input-group'>
      <label htmlFor='city'>City</label>
      <input type='text' name="city" id="city" placeholder='Enter the city' value={userData.city} onChange={handleData} />
       </div>
<button className='btn green' onClick={handleSubmit}>Submit</button>
    </div>
</div>
           )}
          </div>
          
        </div>
      
      
    </>
  )
}


export default App