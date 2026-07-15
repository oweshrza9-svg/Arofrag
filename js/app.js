/*=========================================
GLOBAL VARIABLES
=========================================*/

const header=document.querySelector("header");
const mobileMenu=document.querySelector(".mobile-menu");
const navLinks=document.querySelectorAll(".nav-links a");
const scrollTopBtn=document.querySelector(".scroll-top");

/*=========================================
STICKY HEADER
=========================================*/

window.addEventListener("scroll",()=>{

if(!header) return;

if(window.scrollY>80){

header.classList.add("sticky");

}else{

header.classList.remove("sticky");

}

});

/*=========================================
ACTIVE NAVIGATION
=========================================*/

const currentPage=window.location.pathname.split("/").pop();

navLinks.forEach(link=>{

const href=link.getAttribute("href");

if(href===currentPage){

link.classList.add("active");

}

});

/*=========================================
SMOOTH SCROLL
=========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target=document.querySelector(this.getAttribute("href"));

if(!target) return;

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

});

});

/*=========================================
SCROLL TO TOP BUTTON
=========================================*/

if(scrollTopBtn){

window.addEventListener("scroll",()=>{

if(window.scrollY>400){

scrollTopBtn.classList.add("show");

}else{

scrollTopBtn.classList.remove("show");

}

});

scrollTopBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}