const getTime = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getUTCDate();
  const hours = new Date().getHours();
  let minuets = new Date().getMinutes().toString();
  if (minuets.length === 1) {
    minuets = `0${minuets}`;
  }
  return `${year}-${month}-${day}T${hours}:${minuets}`;
};
export default getTime;
