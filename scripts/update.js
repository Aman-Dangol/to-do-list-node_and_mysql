let id = document.URL.split("?id=")[1];
let inputField = document.getElementById("input");
let taskID = document.getElementById("taskID");
console.log(taskID);
async function dataToUpdate(id) {
  let response = await fetch(`/getUpdateData?id=${id}`);
  let data = await response.json();
  console.log(data);
  inputField.value = data[0].task;
  taskID.value = data[0].id;
  console.log(taskID);
}

dataToUpdate(id);
