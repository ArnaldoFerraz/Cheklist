import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

    getAuth,

    signOut,

    onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {

    getFirestore,

    collection,

    addDoc,

    deleteDoc,

    updateDoc,

    doc,

    onSnapshot,

    query,

    where

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ======================================
// CONFIG FIREBASE
// ======================================

const firebaseConfig = {

    apiKey: "AIzaSyCiUrTKuwsOOByAafgDTOp0nSlwh5kuqyU",

    authDomain: "checklist-28b9e.firebaseapp.com",

    projectId: "checklist-28b9e",

    storageBucket: "checklist-28b9e.firebasestorage.app",

    messagingSenderId: "316686063889",

    appId: "1:316686063889:web:2d860616388853c9c754b0",

    measurementId: "G-WQRSKFS084"

};


// ======================================
// INIT FIREBASE
// ======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ======================================
// ELEMENTOS
// ======================================

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

const logoutBtn = document.getElementById("logoutBtn");
const shareBtn = document.getElementById("shareBtn");

const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dateInput = document.getElementById("dateInput");

const searchInput = document.getElementById("searchInput");

const userEmail = document.getElementById("userEmail");
const profilePhoto = document.getElementById("profilePhoto");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");


// ======================================
// FILTRO
// ======================================

let currentFilter = "all";


// ======================================
// TOAST
// ======================================

function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show-toast");

    setTimeout(() => {

        toast.classList.remove("show-toast");

    }, 3000);

}


// ======================================
// AUTH STATE
// ======================================

onAuthStateChanged(auth, (user) => {

    if(!user){

        window.location.href = "login.html";
        return;

    }

    userEmail.textContent = user.email;

    if(user.photoURL){
        profilePhoto.src = user.photoURL;
    }

    carregarTarefas(user);

});


// ======================================
// LOGOUT
// ======================================

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});


// ======================================
// ADD TASK
// ======================================

button.addEventListener("click", addTask);

async function addTask(){

    const user = auth.currentUser;

    const taskText = input.value.trim();

    if(taskText === ""){

        showToast("Digite uma tarefa");
        return;

    }

    await addDoc(collection(db, "tarefas"), {

        texto: taskText,
        categoria: categorySelect.value,
        prioridade: prioritySelect.value,
        data: dateInput.value,
        concluida: false,
        userId: user.uid

    });

    input.value = "";
    showToast("Tarefa adicionada ✅");

}


// ======================================
// CARREGAR TAREFAS
// ======================================

function carregarTarefas(user){

    const q = query(

        collection(db, "tarefas"),
        where("userId", "==", user.uid)

    );

    onSnapshot(q, (snapshot) => {

        list.innerHTML = "";

        let total = 0;
        let completed = 0;

        snapshot.forEach((item) => {

            const tarefa = item.data();

            // PESQUISA
            const pesquisa = searchInput.value.toLowerCase();

            if(!tarefa.texto.toLowerCase().includes(pesquisa)){
                return;
            }

            // FILTROS
            if(currentFilter === "completed" && !tarefa.concluida){
                return;
            }

            if(currentFilter === "pending" && tarefa.concluida){
                return;
            }

            total++;

            if(tarefa.concluida){
                completed++;
            }

            const li = document.createElement("li");

            if(tarefa.concluida){
                li.classList.add("completed");
            }

            li.innerHTML = `

                <div>

                    <strong>${tarefa.texto}</strong>

                    <small class="task-info">
                        ${tarefa.categoria} •
                        ${tarefa.prioridade} •
                        ${tarefa.data}
                    </small>

                </div>

                <div class="task-buttons">

                    <button class="complete-btn">✓</button>

                    <button class="delete-btn">X</button>

                </div>

            `;

            list.appendChild(li);


            // CONCLUIR
            li.querySelector(".complete-btn").addEventListener("click", async () => {

                await updateDoc(doc(db, "tarefas", item.id), {

                    concluida: !tarefa.concluida

                });

            });


            // DELETAR
            li.querySelector(".delete-btn").addEventListener("click", async () => {

                await deleteDoc(doc(db, "tarefas", item.id));

                showToast("Tarefa removida ❌");

            });

        });


        // ESTATÍSTICAS
        totalTasks.textContent = total;
        completedTasks.textContent = completed;
        pendingTasks.textContent = total - completed;

    });

}


// ======================================
// PESQUISA
// ======================================

searchInput.addEventListener("input", () => {

    carregarTarefas(auth.currentUser);

});


// ======================================
// FILTROS
// ======================================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {

    btn.addEventListener("click", () => {

        document.querySelector(".active").classList.remove("active");

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        carregarTarefas(auth.currentUser);

    });

});


// ======================================
// COMPARTILHAR
// ======================================

shareBtn.addEventListener("click", async () => {

    let tasks = [];

    document.querySelectorAll("strong").forEach(task => {

        tasks.push("- " + task.textContent);

    });

    const text = tasks.join("\n");

    if(navigator.share){

        await navigator.share({

            title: "Minha Checklist",

            text: text

        });

    }

});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado"))
    .catch(err => console.log("Erro SW:", err));
}