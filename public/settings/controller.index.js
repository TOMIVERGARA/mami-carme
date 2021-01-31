//HTML TEMPLATE LITERALS
const {render, html} = uhtml;

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
});

let PersistentToast = new Toasted({
    position : 'top-right',
    action : {
        text : 'Save',
        onClick : (e, saveToast) => {
            location.reload();
        }
    }
});

var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

const changeTab = (evt, cityName) => {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " is-active";
}

//Services
const generateImageList = fileArray => html.node`
    <div class="img-list">
     ${fileArray.map(file => html.node`
        <div class="item">
          <div class="img-tile">
            <button data-filename=${file} data-type='background' onclick=${removeAsset} class="close delete">
               <span>&times;</span>
            </button>
            <img src=${`/api/v1/resources/img/stories/${file}`}>
          </div>
        </div>
     `)}
    </div>
`

const generateFontsList = fileArray => html.node`
    <div>
     ${fileArray.map(file => html.node`
        <a class="panel-block flex justify-between">
          <div>
               <i class="fas fa-font mr-1" aria-hidden="true"></i>
               <span style="${`font-family: '${file}'`}">${file.slice(0, -4)}</span>
          </div>
          <div>
            <button data-filename=${file} data-type='font' onclick=${removeAsset} class="delete">
               <span>&times;</span>
            </button>
          </div>
        </a>
     `)}
    </div>
`

const getImageArray = () => {
    $.ajax({
        type:"GET",
        async: true,
        url:"/api/v1/settings/get_available_backgrounds",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        success: result => {
            render(document.querySelector('#controller'), generateImageList(result.data.files))
        },
        error: error => {
            Toast.show('Hubo un error al buscar la fecha 😭');
            console.log(error);
        }
    });
}

const getFontArray = () => {
    $.ajax({
        type:"GET",
        async: true,
        url:"/api/v1/settings/get_available_fonts",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        success: result => {
            result.data.files.map(font => {
                let newFont = null;
                newFont = new FontFace(font, `url(/api/v1/resources/fonts/${font})`);
                newFont.load()
                   .then(loadedFont => {
                       document.fonts.add(loadedFont);
                   })
            })
            render(document.querySelector('#fonts'), generateFontsList(result.data.files))
        },
        error: error => {
            Toast.show('Hubo un error al buscar la fecha 😭');
            console.log(error);
        }
    });
}

const removeAsset = (e) => {
    console.log("Removing: " + e.currentTarget.dataset.filename)
    const type = e.currentTarget.dataset.type;
    if (window.confirm("🧐 Estas seguro que lo queres eliminar?")) {
        $.ajax({
            type:"DELETE",
            url: type == "font" ? "/api/v1/settings/remove_font_by_name" : "/api/v1/settings/remove_background_by_name",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
            },
            data:{
                filename: e.currentTarget.dataset.filename,
            },
            dataType: 'json',
            success: () => {
                Toast.show('Recurso eliminado 🥳');
                if(type == "font") { getFontArray(); } else { getImageArray(); }
            },
            error: error => {
                Toast.show('Hubo un error al eliminar el recurso 😭');
                console.log(error);
            }
        });
    }
}

const getSettings = () => {
    $.ajax({
        type:"GET",
        async: true,
        url:"/api/v1/settings/get_settings",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        success: response => {
            const settings = response.data.settings
            for (const property in settings) {
                document.getElementById(property).checked = settings[property];
            }
        },
        error: error => {
            Toast.show('Hubo un error al obetener los ajustes 😭');
            console.log(error);
        }
    });
}

const toggleSetting = (e) => {
    $.ajax({
        type:"PUT",
        url: "/api/v1/settings/toggle_setting",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${Cookies.get('login_token')}`);
        },
        data:{
            settingName: e.currentTarget.dataset.name,
        },
        dataType: 'json',
        success: response => {
            console.log(response)
        },
        error: error => {
            Toast.show('Hubo un error al actualizar el ajuste 😭');
            console.log(error);
        }
    });
}

$(document).ready(() => {
    getImageArray();
    getFontArray();
    getSettings();

    // Turn input element into a pond
    const input = document.querySelector('#filepond');
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginImageValidateSize);
    const pond = FilePond.create(input, {
        instantUpload: false,
        imageValidateSizeMinWidth: 1080,
        imageValidateSizeMinHeight: 1920,
        allowMultiple: true,
        server: {
            process: '/api/v1/settings/upload_resources',
            revert: null
        }
    });

    document.querySelector('.filepond--root').addEventListener('FilePond:processfile', e => {
        console.log('File added', e.detail);
        PersistentToast.show('Hay cambios sin guardar 💾')
    });

    var columns = 3;
    var setColumns = () => {
        columns = $( window ).width() > 640 ? 3 : $( window ).width() > 320 ? 2 : 1;
    };
    setColumns();
    $( window ).resize( setColumns );
    $( '#img-list' ).masonry({
        itemSelector: '.item',
        columnWidth: containerWidth => { return containerWidth / columns; }
    });
})