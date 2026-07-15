/*=========================================
REGISTER
=========================================*/

const registerForm=document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener("submit",registerUser);

}

function registerUser(event){

event.preventDefault();

const user={

name:document.getElementById("fullName").value.trim(),

email:document.getElementById("registerEmail").value.trim(),

phone:document.getElementById("registerPhone").value.trim(),

password:document.getElementById("registerPassword").value,

confirmPassword:document.getElementById("confirmPassword").value

};

if(user.password!==user.confirmPassword){

showToast("Passwords do not match.");

return;

}

if(!document.getElementById("acceptTerms").checked){

showToast("Accept Terms & Conditions.");

return;

}

localStorage.setItem("demoUser",JSON.stringify(user));

showToast("Account created successfully.");

setTimeout(()=>{

window.location.href="login.html";

},1000);

}
/*=========================================
FORGOT PASSWORD
=========================================*/

const forgotForm=document.getElementById("forgotForm");

if(forgotForm){

forgotForm.addEventListener("submit",forgotPassword);

}

function forgotPassword(event){

event.preventDefault();

const email=document.getElementById("forgotEmail").value.trim();

if(email===""){

showToast("Please enter your email.");

return;

}

showToast("Password reset link sent.");

setTimeout(()=>{

window.location.href="login.html";

},1500);

}