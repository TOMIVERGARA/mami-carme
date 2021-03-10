// View Controller
var toggleBurger = (e) => {
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
});

const toggleModal = (modalId, state) => {
    const modal = document.querySelector(modalId);
    const container = document.querySelector('#mainContainer');
    if(state === 'open'){
       modal.classList.add("is-active");
       container.classList.add("is-clipped");
    }else{
       modal.classList.remove("is-active");
       container.classList.remove("is-clipped");
    }
}

const getClientsReport = () => {
    $.ajax({
        type:"GET",
        async: true,
        url:"/api/v1/client/clients_report",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        success: result => {
            document.querySelector('#newClientsBadge').innerHTML = result.data.report.new_clients
            document.querySelector('#exportClientsBadge').innerHTML = result.data.report.unexported_clients
            document.querySelector('#totalClientsBadge').innerHTML = result.data.report.total_clients
        },
        error: error => {
            Toast.show('Hubo un error al actualizar el reporte 😭');
            console.log(error);
        }
    });
}

const insertNewClient = (e) => {
    e.preventDefault();
    const data = $('#newClientForm').serializeArray();
    $.ajax({
        type:"POST",
        url:"/api/v1/client/add_client",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        data:{
            authType: 'jwtAuth',
            name: data[0].value,
            email: data[1].value,
            phone: data[2].value,
            grade: data[3].value
        },
        dataType: 'json',
        success: () => {
            getClientsReport();
            document.querySelector('#newClientForm').reset();
            toggleModal('#newClientModal', 'close');
            Toast.show('Nuevo cliente creado 🥳');
        },
        error: error => {
            document.querySelector('#newClientForm').reset();
            Toast.show('Hubo un error al añadir la API Key 😭');
            console.log(error);
        }
    });
}

const deleteClient = (e) => {
    e.preventDefault();
    const data = $('#deleteClientForm').serializeArray();
    $.ajax({
        type:"DELETE",
        url:"/api/v1/client/delete_client_by_email",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        data:{
            email: data[0].value
        },
        dataType: 'json',
        success: () => {
            getClientsReport();
            document.querySelector('#deleteClientForm').reset();
            toggleModal('#deleteClientModal', 'close');
            Toast.show('Cliente Eliminado 😵');
        },
        error: error => {
            document.querySelector('#deleteClientForm').reset();
            Toast.show('Hubo un error al eliminar el cliente 😭');
            console.log(error);
        }
    });
}

const exportClients = () => {
    fetch('/api/v1/client/export_clients', {
        headers: new Headers({
            'Authorization': `Bearer ${Cookies.get('login_token')}`
          })
    })
       .then(resp => resp.blob())
       .then(blob => {
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.style.display = 'none';
         a.href = url;
         // the filename you want
         a.download = `newclients-${new Date()}.csv`;
         document.body.appendChild(a);
         a.click();
         window.URL.revokeObjectURL(url);
         Toast.show('Clientes exportados ✨');
       })
       .catch(() => Toast.show('Hubo un error al exportar 😭'));
}

$(document).ready(() => {
    getClientsReport();
})