var partJson = {
  particles: {
    number: { value: 160, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: {
      type: "circle",
      stroke: { width: 0, color: "#000000" },
      polygon: { nb_sides: 5 },
      image: { src: "img/github.svg", width: 100, height: 100 },
    },
    opacity: {
      value: 1,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false, speed: 4, size_min: 0.3, sync: false },
    },
    line_linked: {
      enable: false,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 600 },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "bubble" },
      onclick: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 3 },
      repulse: { distance: 400, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
};
var jsonUri = "data:text/plain;base64," + window.btoa(JSON.stringify(partJson));
/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load("particles-js", jsonUri, function () {
  console.log("callback - particles.js config loaded");
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let Toast = new Toasted({
  position : 'top-right',
  duration: 6000,
  action : {
      text : 'Close',
      onClick : (e, successToast) => {
         successToast.delete();
      }
  }
})

//View Controllers
const login = otp => {
   document.querySelector('#pinwrapper').style.display = "none"
   document.querySelector('#loader').style.display = "block"
   $.ajax({
    type:"POST",
    url:"/api/v1/auth/login_with_otp",
    data:{
        otp: otp,
        appVersion: navigator.appVersion
    },
    success: response => {
        console.log(response)
        const jwt = response.data.token;
        var date = new Date();
        var minutes = 30;
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        Cookies.set("login_token", jwt, { expires: date });
        if(urlParams.get('redirect')){
          window.location.href = urlParams.get('redirect');
        }else{
          window.location.href = "/";
        }
    },
    error: error => {
        document.querySelector('#loader').style.display = "none"
        document.querySelector('#errorMsg').style.display = "block"
        console.log(error);
    }
});
}

$(document).ready(() => {
  if(urlParams.get('otp')){
    login(urlParams.get('otp'));
  }
  var pinlogin = $("#pinwrapper").pinlogin({
    fields: 6,
    hideinput: false,
    complete : function(pin){
      login(pin);
    }
  });
})