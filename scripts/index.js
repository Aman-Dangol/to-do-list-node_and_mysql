let table = document.getElementById("table");

async function getData() {
  let response = await fetch("/getList");
  let data = await response.json();
  data.forEach((row) => {
    console.log(row.id);
    table.innerHTML += `<tr>
    <td>${row.task}</td>
    <td><a href="/update?id=${row.id}" class ="btn update">update</a></td>
    <td><a href="/delete?id=${row.id}" class="btn delete">delete</a></td>
    </tr>`;
  });
}
getData();
