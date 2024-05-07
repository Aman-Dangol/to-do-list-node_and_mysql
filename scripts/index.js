async function getData() {
  let response = await fetch("/getList");
  let data = await response.json();
  console.log(data);
}

getData();
