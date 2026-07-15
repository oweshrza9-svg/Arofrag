/*=========================================
GLOBAL ELEMENTS
=========================================*/

const faqItems=document.querySelectorAll(".faq-item");
const faqSearch=document.getElementById("faqSearch");

/*=========================================
INITIALIZE
=========================================*/

document.addEventListener("DOMContentLoaded",()=>{

initializeFAQ();

});

/*=========================================
FAQ
=========================================*/

function initializeFAQ(){

faqItems.forEach(item=>{

const button=item.querySelector(".faq-question");

button.addEventListener("click",()=>{

faqItems.forEach(faq=>{

if(faq!==item){

faq.classList.remove("active");

}

});

item.classList.toggle("active");

});

});

}

/*=========================================
SEARCH
=========================================*/

if(faqSearch){

faqSearch.addEventListener("keyup",()=>{

const keyword=faqSearch.value.toLowerCase();

faqItems.forEach(item=>{

const text=item.textContent.toLowerCase();

item.style.display=text.includes(keyword)?"block":"none";

});

});

}