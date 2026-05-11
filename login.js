import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

    getAuth,

    signInWithEmailAndPassword,

    createUserWithEmailAndPassword,

    GoogleAuthProvider,

    signInWithPopup,

    sendPasswordResetEmail,

    setPersistence,

    browserLocalPersistence

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyCiUrTKuwsOOByAafgDTOp0nSlwh5kuqyU",

    authDomain: "checklist-28b9e.firebaseapp.com",

    projectId: "checklist-28b9e",

    storageBucket: "checklist-28b9e.firebasestorage.app",

    messagingSenderId: "316686063889",

    appId: "1:316686063889:web:2d860616388853c9c754b0",

    measurementId: "G-WQRSKFS084"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

await setPersistence(auth, browserLocalPersistence);

const loginForm =
document.getElementById("loginForm");

const registerBtn =
document.getElementById("registerBtn");

const googleLogin =
document.getElementById("googleLogin");

const resetPassword =
document.getElementById("resetPassword");

const message =
document.getElementById("message");

loginForm.addEventListener("submit",

async (e) => {

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href =
        "index.html";

    }

    catch(error){

        console.log(error);

        message.innerText =
        "Email ou senha inválidos";

    }

});

registerBtn.addEventListener("click",

async () => {

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        message.innerText =
        "Conta criada ✅";

    }

    catch(error){

        message.innerText =
        error.message;

    }

});

googleLogin.addEventListener("click",

async () => {

    try {

        const provider =
        new GoogleAuthProvider();

        await signInWithPopup(
            auth,
            provider
        );

        window.location.href =
        "index.html";

    }

    catch(error){

        message.innerText =
        error.message;

    }

});

resetPassword.addEventListener("click",

async () => {

    const email =
    document.getElementById("email").value;

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        message.innerText =
        "Email enviado ✅";

    }

    catch(error){

        message.innerText =
        error.message;

    }

});