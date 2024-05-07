let table = document.getElementById("table");

async function getData() {
  let response = await fetch("/getList");
  let data = await response.json();
  console.log(data);
  data.forEach((row) => {
    table.innerHTML += `<tr>
    <td>${row.task}</td>
    <td>update</td>
    <td>delete</td>
    </tr>`;
  });
}
getData();
