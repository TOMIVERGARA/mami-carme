//View Controller
const toggleBurger = (e) => {
   const navbarMenu = document.querySelector('.navbar-menu');
   const burger = document.querySelector('.navbar-burger');

   if(navbarMenu.classList.contains('is-active')){
       navbarMenu.classList.remove('is-active');
       burger.classList.remove('is-active');
   }else{
       navbarMenu.classList.add('is-active');
       burger.classList.add('is-active');
   }
}

const setDate = () => {
    const dateSpan = document.querySelector('#date');
    const date = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    dateSpan.innerHTML = date;
}

$(document).ready(() => {
    setDate()
})