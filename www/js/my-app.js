
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
    { path: '/errorreg/', url: 'errorreg.html', },
    { path: '/regdev/', url: 'regdev.html', },
    { path: '/regrec/', url: 'regrec.html', },
    { path: '/busqueda/', url: 'busqueda.html', },
    { path: '/perfil/', url: 'perfil.html', },
    { path: '/ofertas/', url: 'ofertas.html', },
    { path: '/nuevaof/', url: 'nuevaof.html', },
  ]
  // ... other parameters
});
/**GLOBALES*/
var db = firebase.firestore();
var nombre = ""; apellido = ""; email = ""; mostrar = "";
var mensaje = ""; titulo = ""; oferta = ""; tipoOf = "";

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

$$(document).on('page:init', '.page[data-name="ofertas"]', function (e) {
  $$('#l-of').on('click', fnlistaof);
  $$('#cerrarpop').on('click', fncerrarpop);

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
      mainView.router.navigate('/confirmacion/');
      var datosDevs = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        tipoUsuario: "Desarrollador"
      }
      coleccionUsuarios.doc(email).set(datosDevs)
        .then(function () {
          console.log("Base de dato ok");
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
      mainView.router.navigate('/confirmacion rec/');
      var datosRecruit = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        tipoUsuario: "Recruiter"
      }
      coleccionRecruiters.doc(email).set(datosRecruit)
        .then(function () {
          console.log("Base de dato ok");
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
          mainView.router.navigate('/errorlog/');
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
        console.error(errorCode);
        console.error(errorMessage);
        mainView.router.navigate('/errorlog/');
      });
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
          mainView.router.navigate('/errorlog/');
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
        console.error(errorCode);
        console.error(errorMessage);
        mainView.router.navigate('/errorlog/');
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
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

}

function fnlistaof() {

coleccionOfertas.orderBy("titulo")
.get()
.then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    if (tipoOf != doc.data().ofertas) {
      mostrar += `  
      <ul>          
      <li>
      <a href="#" class="item-link item-content">
        <div class="item-inner">
          <div class="item-title-row">
            <div class="item-title">${doc.data().titulo}</div>
          </div>
          <div class="item-text">${doc.data().mensaje}</div>
        </div>
      </a>
    </li>
    </ul>
          `;
    }
    console.log(doc.data().titulo);
  });
  $$('#lis-mis-of').append(mostrar);
})
.catch((error) => {
  console.log("Error getting documents: ", error);
});

}

function fncerrarpop(){
  mainView.router.navigate('/ofertas/');
}