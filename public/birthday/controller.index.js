//HTML TEMPLATE LITERALS
const {render, html} = uhtml;

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
})

const setDate = () => {
    const dateSpan = document.querySelector('#date');
    const date = new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    dateSpan.innerHTML = date;
}

const toggleDisplay = (element) => {
    var x = document.getElementById(element);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
}

//Templates
const panelBlockTemplate = (people, documentId) => html.node`
    <div>
      ${people.map(person => html.node`
         <a class="panel-block flex justify-between">
           <div>
              <span>${person.name} - <span class="tag is-primary is-light is-rounded mr-2">${person.class}</span></span>
           </div>
           ${people.length > 1 ?
               html.node`
               <div>
                 <button class="button is-danger is-small is-light" data-document=${documentId} data-name=${person.name} onclick=${deleteSingleByName}><i class="fas fa-trash" aria-hidden="true"></i></button>
               </div>
               ` : ''
           }
         </a>
      `)}
    </div>
`;


//Services
class BirthdayPanel{
    constructor(date){
        this.date = date;
        this.people;
    }

    getBirthday(update){
        $.ajax({
            type:"GET",
            async: true,
            url:"/api/v1/birthday/get_birthday_by_date",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
            },
            data:{
                dateStr: this.date
            },
            success: result => {
                this.people = result.data.document;
                this._id = result.data.id
                if(!update) toggleDisplay('noDateSelectedPanel');
                if(!update) toggleDisplay('mainPanel');
                this.configurePanel()
            },
            error: error => {
                Toast.show('Hubo un error al buscar la fecha 😭');
                console.log(error);
            }
        });
    }

    configurePanel(){
        document.getElementById('panelHeading').innerText = this.date;
        var deleteAllButton = document.getElementById('deleteAll');
        deleteAllButton.style.display = "block";
        if(!this._id){
            toggleDisplay('deleteAll');
            document.getElementById('blocks').innerHTML = '<div class="tile is-5 fullwidth flex justify-center pt-3"><span class="tag is-primary is-light is-rounded">No hay cumpleaños!</span></div>';
        }else{
            deleteAllButton.setAttribute('data-id', this._id);
            document.getElementById('blocks').innerHTML = null;
            document.getElementById('blocks').appendChild(panelBlockTemplate(this.people, this._id));
        }
    }
}

var PanelHandler;
var counter = 0;
const loadCalendar = () => {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        start: 'title', // will normally be on the left. if RTL, will be on the right
        center: '',
        end: 'prev,next' // will normally be on the right. if RTL, will be on the left
      },
      dayRender: function(date, cell){
          var today = $.fullCalendar.moment();
          if (date.get('date') == today.get('date')){ cell.css("background", "#da676f")} ;
      },
      dateClick: date => {
        PanelHandler = null; //DELETES ALL INSTANCS OF THE CLASS
        PanelHandler = new BirthdayPanel(date.dateStr);
        PanelHandler.getBirthday(counter ? true : false);
        counter = 1;
      }
    });
    calendar.render();
}

const deleteSingleByName = (e) => {
    console.log(e.currentTarget.dataset.document)
    if (window.confirm("🧐 Estas seguro que lo queres eliminar?")) {
        $.ajax({
            type:"DELETE",
            url:"/api/v1/birthday/remove_single_by_id",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
            },
            data:{
                documentId: e.currentTarget.dataset.document,
                personName: e.currentTarget.dataset.name
            },
            dataType: 'json',
            success: () => {
                Toast.show('Cumpleaños Eliminado 🥳');
                PanelHandler.getBirthday(true)
            },
            error: error => {
                Toast.show('Hubo un error al eliminar 😭');
                console.log(error);
            }
        });
    }
}

const deleteDocumentById = (e) => {
    if (window.confirm("🧐 Estas seguro de que queres eliminar todos los cumpleaños de esta fecha?")) {
        $.ajax({
            type:"DELETE",
            url:"/api/v1/birthday/remove_document_by_id",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
            },
            data:{
                documentId: e.currentTarget.dataset.id,
            },
            dataType: 'json',
            success: () => {
                Toast.show('Documento Eliminado 🥳');
                PanelHandler.getBirthday(true)
            },
            error: error => {
                Toast.show('Hubo un error al eliminar el documento 😭');
                console.log(error);
            }
        });
    }
}

$(document).ready(() => {
    setDate();
    loadCalendar();
})