import React from 'react'
import Login from '../components/Login'
import Register from '../components/Register'
const Credential = () => {
  return (
    <div className='flex justify-around align-center gap-10'>
    <Register />
    <Login />
    </div>
  )
}

export default Credential