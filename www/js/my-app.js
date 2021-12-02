
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    { path: '/login/', url: 'login.html', },
    { path: '/login rec/', url: 'login rec.html', },
    { path: '/index/', url: 'index.html', },
    { path: '/registro/', url: 'registro.html', },
    { path: '/confirmacion/', url: 'confirmacion.html', },
    { path: '/confirmacion rec/', url: 'confirmacion rec.html', },
    { path: '/errorreg/', url: 'errorreg.html', },
    { path: '/errorlog/', url: 'errorlog.html', },
    { path: '/regdev/', url: 'regdev.html', },
    { path: '/regrec/', url: 'regrec.html', },
    { path: '/busqueda/', url: 'busqueda.html', },
    { path: '/perfil/', url: 'perfil.html', },
    { path: '/perfilr/', url: 'perfilr.html', },
    { path: '/ofertas/', url: 'ofertas.html', },
    { path: '/nuevaof/', url: 'nuevaof.html', },
  ]
  // ... other parameters
});
/**GLOBALES*/
var db = firebase.firestore();
var nombre = ""; apellido = ""; email = ""; busqueda = "";
var mensaje = ""; titulo = ""; oferta = "";
var nombrenue = ""; apellidonue = "";
var nombrenuer = ""; apellidonuer = "";

/*colecciones*/
var coleccionUsuarios = db.collection("Usuarios");
var coleccionRecruiters = db.collection("Reclutadores");
var coleccionOfertas = db.collection("ofertas");

var mainView = app.views.create('.view-main');

$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});
$$(document).on('page:init', function (e) {
  console.log(e);
})

$$(document).on('page:init', '.page[data-name="index"]', function (e) { /* console.log('ingreso al index');*/
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  console.log(e);
})

$$(document).on('page:init', '.page[data-name="regdev"]', function (e) {
  $$('#regDev').on('click', registroDev)
})

$$(document).on('page:init', '.page[data-name="regrec"]', function (e) {
  $$('#regRec').on('click', registroRec)
})

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#log').on('click', logind);
})
$$(document).on('page:init', '.page[data-name="login rec"]', function (e) {
  $$('#logrec').on('click', loginr);
})

$$(document).on('page:init', '.page[data-name="busqueda"]', function (e) {
  $$('#search').on('click', fnbuscaoferta());
  crearBusqueda();
  fncargardatos();
})
$$(document).on('page:init', '.page[data-name="perfil"]', function (e) {
  fncargardatos();
  $$('#btnGaleria').on('click', fnGaleria);
  $$('#guardarcambiosd').on('click', fnguardarcambiosd);
})
$$(document).on('page:init', '.page[data-name="perfilr"]', function (e) {
  fncargardatosr();
  $$('#btnGaleria').on('click', fnGaleria);
  $$('#guardarcambiosr').on('click', fnguardarcambiosr);
})

$$(document).on('page:init', '.page[data-name="ofertas"]', function (e) {
  fncargardatosr();

  tipoOf = "";
  inicio = 0;
  mostrar = "";

  coleccionOfertas.orderBy("titulo")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (tipoOf != doc.data().ofertas) {
          mostrar += `  
          <ul>
          <li class="accordion-item "><a class="item-content item-link bg-intermedio bordeacord" href="#">
              <div class="item-inner  colorete ">
                <div class="item-title"><strong>${doc.data().titulo}</strong></div>
              </div>
            </a>
            <div class="accordion-item-content bg-terciario">
              <div class="block">
                <p>${doc.data().mensaje}</p>
              </div>
            </div> `;
          tipoOf = doc.data().ofertas;
        } else {
          mostrar += `         
          <ul>
          <li class="accordion-item"><a class="item-content item-link bg-intermedio bordeacord" href="#">
              <div class="item-inner colorete">
                <div class="item-title"><strong>${doc.data().titulo}</strong></div>
              </div>
            </a>
            <div class="accordion-item-content bg-terciario">
              <div class="block">
                <p>${doc.data().mensaje}</p>
              </div>
            </div>
         `
          
        }

        console.log(doc.id, " => ", doc.data().titulo);
      });

      mostrar += `
      </li>
      </ul>
    `;


      $$('#lis-mis-of').append(mostrar);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

})

$$(document).on('page:init', '.page[data-name="nuevaof"]', function (e) {
  $$('#crear-nuevaof').on('click', fncrearof);
})



/**REGISTRO */

/*Dev reg*/
function registroDev() {

  email = $$('#regmail').val(); nombre = $$('#regnomb').val(); apellido = $$('#regapell').val(); password = $$('#regcontra').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {      
      var datosDevs = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        tipoUsuario: "Desarrollador"
      }
      coleccionUsuarios.doc(email).set(datosDevs)
        .then(function () {
          console.log("Base de dato ok");
          mainView.router.navigate('/confirmacion/');
        })
        .catch(function (error) {
          console.log("Error" + error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.error(errorCode);
      console.error(errorMessage);
      mainView.router.navigate('/errorreg/');

      if (errorCode == "auth/email-already-in-use") {
        console.error("el mail ya esta usado");
      }
    });
}

/*Dev reg*/
/*recruiter reg*/

function registroRec() {

  email = $$('#regemail').val(); nombre = $$('#regemp').val(); apellido = $$('#regempape').val(); password = $$('#regecontra').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {      
      var datosRecruit = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        tipoUsuario: "Recruiter"
      }
      coleccionRecruiters.doc(email).set(datosRecruit)
        .then(function () {
          console.log("Base de dato ok");
          mainView.router.navigate('/confirmacion rec/');
        })
        .catch(function (error) {
          console.log("Error" + error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.error(errorCode);
      console.error(errorMessage);
      mainView.router.navigate('/errorreg/');

      if (errorCode == "auth/email-already-in-use") {
        console.error("el mail ya esta usado");
      }
    });
}

/*recruiter reg*/
/**REGISTRO */

/**LOGIN */

function logind() {

  var email = $$('#maillog').val(); var password = $$('#contralog').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      docRef = coleccionUsuarios.doc(email)
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          tipoUsuario = doc.data().tipoUsuario;
          if (tipoUsuario == "Desarrollador") {
            console.log("Bienvenid@!!! " + email);
            console.log("anda para Desarrollador");
            mainView.router.navigate('/busqueda/');
          }
        } else {
          console.log("Usuario incorrecto");
        }
      }).catch(function (error) {
        console.log("Error" + error);
      });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.error(errorCode);
    console.error(errorMessage);
    mainView.router.navigate('/errorlog/')
    console.error("mail o password erroneos");    
    });
}

function loginr() {

  var email = $$('#maillogrec').val(); var password = $$('#contralogrec').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      docRef = coleccionRecruiters.doc(email)
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          tipoUsuario = doc.data().tipoUsuario;
          if (tipoUsuario == "Recruiter") {
            console.log("Bienvenid@!!! " + email);
            console.log("anda para Recruiter");
            mainView.router.navigate('/ofertas/');
          }
        } else {
          console.log("Usuario incorrecto");
        }
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
    
        console.error(errorCode);
        console.error(errorMessage);
        mainView.router.navigate('/errorlog/')
        console.error("mail o password erroneos");    
        });
    });
}

/**LOGIN */



function fncrearof() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      titulo = $$('#titulo-oferta').val();
      mensaje = $$('#desc-oferta').val();
      email = doc.data().email;

      coleccionOfertas.doc(titulo).set({
        titulo: titulo,
        mensaje: mensaje,
        email: email,
      })
        .then(() => {
          console.log("Oferta cargada");
          mainView.router.navigate('/ofertas/');
        })
    } else {
      console.log("No pudo crearse la oferta");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

}

function fnbuscaoferta() {

 

  console.log("busqueda");
  coleccionOfertas
    .orderBy("titulo")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
         var busqueda = 
         `<ul>
         <li class="accordion-item"><a class="item-content item-link bg-intermedio bordeacord" href="#">
             <div class="item-inner  colorete">
               <div class="item-title"><strong>${doc.data().titulo}</strong></div>
             </div>
           </a>
           <div class="accordion-item-content bg-terciario">
             <div class="block">
               <p>${doc.data().mensaje}</p>
               <p><a href="#" id="${doc.data().email}" class="emailc"><strong>Email de contacto:  </strong> ${doc.data().email}</a></p>
             </div>
           </div> `
           ;          
      $$("#busq-ofertas").append(busqueda);
        });

      
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}


function crearBusqueda() {
  console.log('Busco mi oferta');
  searchbar = app.searchbar.create({
    el: ".searchbar",
    searchContainer: ".list",
    searchIn: ".item-title",
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      },
    },
  });
}

function fncargardatos() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      console.log("Nombre:" + doc.data().nombre);
      $$('.nombre-dev').html(doc.data().nombre);
      $$('.apellido-dev').html(doc.data().apellido);
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

function fncargardatosr() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      console.log("Nombre:" + doc.data().nombre);
      $$('.nombre-rec').html(doc.data().nombre);
      $$('.apellido-rec').html(doc.data().apellido);
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

function fnguardarcambiosd() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      nombrenue = $$('#cambio-nombred').val();
      apellidonue = $$('#cambio-apellid').val();
      email = doc.data().email;
      tipoUsuario = doc.data().tipoUsuario;

      coleccionUsuarios.doc(email).set({
        nombre: nombrenue,
        apellido: apellidonue,
        email: email,
        tipoUsuario: tipoUsuario
      })
        .then(() => {
          console.log("datos cambiados");
          mainView.router.navigate('/busqueda/');
        })
    } else {
      console.log("error al cambiar datos");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}


function fnguardarcambiosr() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      nombrenuer = $$('#cambio-nombrer').val();
      apellidonuer = $$('#cambio-apellir').val();
      email = doc.data().email;
      tipoUsuario = doc.data().tipoUsuario;

      coleccionRecruiters.doc(email).set({
        nombre: nombrenuer,
        apellido: apellidonuer,
        email: email,
        tipoUsuario: tipoUsuario
      })
        .then(() => {
          console.log("datos cambiados");
          mainView.router.navigate('/ofertas/');
        })
    } else {
      console.log("error al cambiar datos");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}





function fnGaleria() {
  navigator.camera.getPicture(onSuccessCamara, onErrorCamara,
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });

}

function onSuccessCamara(imageData) {
  var storageRef = firebase.storage().ref();
  var getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  var blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
  };

  var getFileObject = function (filePathOrUrl, cb) {
    getFileBlob(filePathOrUrl, function (blob) {
      cb(blobToFile(blob, 'test.jpg'));
    });
  };




  getFileObject(imageData, function (fileObject) {
    var uploadTask = storageRef.child('images/test.jpg').put(fileObject);

    uploadTask.on('state_changed', function (snapshot) {
      console.log(snapshot);
    }, function (error) {
      console.log(error);
    }, function () {
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log(downloadURL);
      // handle image here
    });
  });

}



function onErrorCamara() {
  console.log('error de camara');
}


