import React, { useEffect } from 'react'
import { useDataProvider } from '../context/Data'

const Users = () => {
    const {allUsers} = useDataProvider()

    useEffect(()=>{
allUsers()
    },[])

  return (
<>
</>
  )
}

export default Users