alert("JavaScript carregado!");

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", () => {

    if (input.value === "") {
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <span>${input.value}</span>
        <button class="delete-btn">
            X
        </button>
    `;

    list.appendChild(li);

    input.value = "";

    li.querySelector("span").addEventListener("click", () => {
        li.classList.toggle("completed");
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
    });

});