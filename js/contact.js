/*=========================================
CONTACT FORM
=========================================*/

const contactForm=document.getElementById("contactForm");

if(contactForm){

contactForm.addEventListener("submit",sendMessage);

}

function sendMessage(event){

event.preventDefault();

showToast("Message sent successfully.");

contactForm.reset();

}