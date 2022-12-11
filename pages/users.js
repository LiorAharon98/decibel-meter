const { allUsers } = useDataProvider();

const users = await allUsers();

return users;
