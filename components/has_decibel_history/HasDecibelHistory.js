import React from 'react'
import { useSelector } from 'react-redux'
const HasDecibelHistory = () => {
    const userSelector = useSelector(state=>state.user)
  return (
    <h3> has decibel history ? {userSelector?.current?.length > 0 ? "yes" : "no"}</h3>
  )
}

export default HasDecibelHistory