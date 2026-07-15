/*=========================================
GLOBAL ELEMENTS
=========================================*/

const loginForm=document.getElementById("loginForm");
const emailInput=document.getElementById("loginEmail");
const passwordInput=document.getElementById("loginPassword");
const togglePassword=document.getElementById("togglePassword");

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener("DOMContentLoaded",()=>{

initializeLogin();

});

/*=========================================
LOGIN
=========================================*/

function initializeLogin(){

if(loginForm){

loginForm.addEventListener("submit",loginUser);

}

if(togglePassword){

togglePassword.addEventListener("click",togglePasswordVisibility);

}

}

/*=========================================
LOGIN USER
=========================================*/

function loginUser(event){

event.preventDefault();

const email=emailInput.value.trim();

const password=passwordInput.value.trim();

if(email===""){

showError("emailError","Email is required.");

return;

}

if(password===""){

showError("passwordError","Password is required.");

return;

}

clearErrors();

showToast("Login Successful");

setTimeout(()=>{

window.location.href="index.html";

},1000);

}

/*=========================================
TOGGLE PASSWORD
=========================================*/

function togglePasswordVisibility(){

if(passwordInput.type==="password"){

passwordInput.type="text";

togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

}else{

passwordInput.type="password";

togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';

}

}

/*=========================================
ERRORS
=========================================*/

function showError(id,message){

document.getElementById(id).textContent=message;

}

function clearErrors(){

document.getElementById("emailError").textContent="";

document.getElementById("passwordError").textContent="";

}