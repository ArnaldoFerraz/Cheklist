const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const shareBtn = document.getElementById("shareBtn");

button.addEventListener("click", addTask);

input.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        addTask();
    }

});

function addTask(){

    const taskText = input.value.trim();

    if(taskText === ""){
        return;
    }

    const li = document.createElement("li");

    li.innerHTML = `
        <div class="task-content">
            <span class="check">✓</span>
            <span class="task-text">${taskText}</span>
        </div>

        <button class="delete-btn">
            X
        </button>
    `;

    list.appendChild(li);

    input.value = "";

    li.querySelector(".task-content").addEventListener("click", () => {

        li.classList.toggle("completed");

    });

    li.querySelector(".delete-btn").addEventListener("click", () => {

        li.remove();

    });
}

shareBtn.addEventListener("click", async () => {

    let tasks = [];

    document.querySelectorAll(".task-text").forEach(task => {

        tasks.push("- " + task.textContent);

    });

    const text = tasks.join("\n");

    if(navigator.share){

        await navigator.share({
            title: "Minha Checklist",
            text: text
        });

    } else {

        alert(text);

    }

});