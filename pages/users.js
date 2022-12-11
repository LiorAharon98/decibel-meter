import React, { useEffect } from "react";
import { useDataProvider } from "../context/Data";

const Users = () => {
  const { allUsers } = useDataProvider();

  const getUsers = async()=>{
    const users = await allUsers()

  }
  useEffect(() => {
    getUsers()
  }, []);

  return <></>;
};

export default Users;
