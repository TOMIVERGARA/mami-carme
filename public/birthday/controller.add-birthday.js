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

//Services
const validateForm = () => {
    const name = document.querySelector('#name');
    const role = document.querySelector('#role');
    const date = document.querySelector('#birthday');
    const classes = document.querySelector('#classes');

    if (!name.value){
        name.classList.add('is-danger');
        document.querySelector('#name_help').innerHTML = 'El nombre es obligatorio.';
        return false;
    }
    if (!role.value){
        role.classList.add('is-danger');
        return false;
    }
    if (!date.value){
        date.classList.add('is-danger');
        return false;
    }
    if (!classes.value){
        classes.classList.add('is-danger');
        return false;
    }
    if (name.value && role.value && date.value && classes.value){
        return {
            name: name.value,
            role: role.value,
            classes: classes.value,
            date: date.value
        };
    }
}

const submitForm = (e) => {
    e.preventDefault();
    const validation = validateForm();
    if(validation){
        $.ajax({
            type:"POST",
            url:"/api/v1/birthday/add_birthday",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
            },
            data:{
                name: validation.name,
                role: validation.role,
                class: validation.classes,
                birthday: validation.date
            },
            dataType: 'json',
            success: () => {
                document.querySelector('#addBirthdayForm').reset();
                start()
                Toast.show('Nuevo cumpleaños añadido 🥳');
            },
            error: error => {
                document.querySelector('#addBirthdayForm').reset();
                start()
                Toast.show('Hubo un error al añadir el cumpleaños 😭');
                console.log(error);
            }
        });
    }
}

const studentsClasses = {
    '1er Año A' : 'Primero A',
    '1er Año B' : 'Primero B',
    '2do Año A' : 'Segundo A',
    '2do Año B' : 'Segundo B',
    '3er Año A' : 'Tercero A',
    '3er Año B' : 'Tercero B',
    '4to Año EYA' : 'Cuarto Economia',
    '4to Año CN' : 'Cuarto Naturales',
    '5to Año EYA' : 'Quinto Economia',
    '5to Año CN' : 'Quinto Naturales',
    '6to Año EYA' : 'Sexto Economia',
    '6to Año CN' : 'Sexto Naturales'
}

const teacherClasses = {
    'Profesores' : 'Profesor',
    'Preceptores' : 'Preceptor',
    'Directivos' : 'Directivo',
    'Administrativos' : 'Administrativo'
}

const setSelectOptions = (role) => {
    document.getElementById('role').value = role;
    let selectedArray = role == 'Student' ? studentsClasses : teacherClasses;
    var classes = document.getElementById('classes');
    classes.options.length = 0;
    for(index in selectedArray) {
        classes.options[classes.options.length] = new Option(selectedArray[index], index);
    }
}

$(document).ready(() => {
    //Sets Input Date to today:
    document.querySelector('#birthday').valueAsDate = new Date();
    //Sets Select to default options
    setSelectOptions('Student');
})