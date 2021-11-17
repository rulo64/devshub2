
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
    { path: '/login/', url: 'login.html', },  { path: '/login rec/', url: 'login rec.html', }, { path: '/index/', url: 'index.html', }, { path: '/registro/', url: 'registro.html', },
    { path: '/confirmacion/', url: 'confirmacion.html', }, { path: '/confirmacion rec/', url: 'confirmacion rec.html', }, { path: '/errorreg/', url: 'errorreg.html', },
    { path: '/errorlog/', url: 'errorlog.html', }, { path: '/datosperf/', url: 'datosperf.html', }, { path: '/regdev/', url: 'regdev.html', },
    { path: '/regrec/', url: 'regrec.html', }, { path: '/aptitudes/', url: 'aptitudes.html', }, { path: '/aptitudesrec/', url: 'aptitudesrec.html', },
    { path: '/busquedadevs/', url: 'busquedadevs.html', }, { path: '/busquedarecs/', url: 'busquedarecs.html', },
  ]
  // ... other parameters
});
/**GLOBALES*/
var db = firebase.firestore();
var tipoCat = ""; inicio = 0; mostrar = ''; userm = '';
var nombre = ""; apellido = ""; email = "";
/*colecciones*/
var coleccionUsuarios = db.collection("Usuarios");
var coleccionRecruiters = db.collection("Reclutadores");
var coleccionLenguajesd = db.collection("Lenguajesd");
var coleccionLenguajesr = db.collection("Lenguajesr");

var mainView = app.views.create('.view-main');

$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});
$$(document).on('page:init', function (e) {
  console.log(e);
})

$$(document).on('page:init', '.page[data-name="index"]', function (e) { /* console.log('ingreso al index');*/
  /*agregarlenguajes();*/
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

$$(document).on('page:init', '.page[data-name="busquedadevs"]', function (e) {

  



coleccionRecruiters.orderBy("tipoUsuario")
.get()
.then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    if (tipoCat != doc.data().tipoUsuario) {
      mostrar += `              
          <div class="block-title">`+ doc.data().tipoUsuario + `</div>              
          <li>
          <label class="item-radio item-radio-icon-start item-content">
            <input type="radio" name="demo-radio-start"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
            <div class="item-title">${doc.data().nombre}</div>
            </div>
          </label>
        </li>
          `;
      tipoCat = doc.data().tipoUsuario;
    }
    else {
      mostrar += `<label class="item-radio item-radio-icon-start item-content">
            <input type="radio" name="demo-radio-start"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
            <div class="item-title"">${doc.data().nombre}</div>
            </div>
          </label>
        </li>
        `
    }
    console.log(doc.id, " => ", doc.data().tipo, "  /  ", doc.data().nombre);
  });
  $$('#userrec').append(mostrar);
})
.catch((error) => {
  console.log("Error getting documents: ", error);
});




})

$$(document).on('page:init', '.page[data-name="aptitudes"]', function (e) {
  fncargardatos();
  $$('#sumalenguaD').on('click', fnsumateested);

  coleccionLenguajesd.orderBy("categoria")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (tipoCat != doc.data().categoria) {
          mostrar += `              
              <div class="block-title">`+ doc.data().categoria + `</div>              
              <li>
              <label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="demo-radio-start"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                <div id="${doc.data().lenguaje}" class="item-title" onclick="seteaLeng(${doc.data().lenguaje})">${doc.data().lenguaje}</div>
                </div>
              </label>
            </li>
              `;
          tipoCat = doc.data().categoria;
        }
        else {
          mostrar += `<label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="demo-radio-start"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                <div id="${doc.data().lenguaje}" class="item-title" onclick="seteaLeng(${doc.data().lenguaje})">${doc.data().lenguaje}</div>
                </div>
              </label>
            </li>
            `
        }
        console.log(doc.id, " => ", doc.data().tipo, "  /  ", doc.data().lenguaje);
      });
      $$('#listalenguajes').append(mostrar);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
})

$$(document).on('page:init', '.page[data-name="aptitudesrec"]', function (e) {
  fncargardatosrec();
  $$('#sumalenguaR').on('click', fnsumateester);

  coleccionLenguajesr.orderBy("categoria")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (tipoCat != doc.data().categoria) {
          mostrar += `              
              <div class="block-title">`+ doc.data().categoria + `</div>              
              <li>
              <label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="demo-radio-start"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                <div id="${doc.data().lenguaje}" class="item-title" onclick="seteaLengR(${doc.data().lenguaje})">${doc.data().lenguaje}</div>
                </div>
              </label>
            </li>
              `;
          tipoCat = doc.data().categoria;
        }
        else {
          mostrar += `<label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="demo-radio-start"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                <div id="${doc.data().lenguaje}" class="item-title" onclick="seteaLengR(${doc.data().lenguaje})">${doc.data().lenguaje}</div>
                </div>
              </label>
            </li>
            `
        }
        console.log(doc.id, " => ", doc.data().tipo, "  /  ", doc.data().lenguaje);
      });
      $$('#listalenguajesr').append(mostrar);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
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
            mainView.router.navigate('/aptitudes/');
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
            mainView.router.navigate('/aptitudesrec/');
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
/*
function agregarlenguajes() {
 
   id = "1"; datos = { categoria: "lenguajesd", tipo: "dev", lenguaje:"Python", usuarios:[]};  
   coleccionLenguajesd.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "2"; datos = { categoria: "lenguajesd", tipo: "dev", lenguaje:"Java", usuarios:[]};  
   coleccionLenguajesd.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "3"; datos = { categoria: "lenguajesd", tipo: "dev", lenguaje:"php", usuarios:[]};  
   coleccionLenguajesd.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "4"; datos = { categoria: "lenguajesd", tipo: "dev", lenguaje:"Angular", usuarios:[]};  
   coleccionLenguajesd.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "1"; datos = { categoria: "lenguajesr", tipo: "recruiter", lenguaje:"Python", usuarios:[]};  
   coleccionLenguajesr.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "2"; datos = { categoria: "lenguajesr", tipo: "recruiter", lenguaje:"Java", usuarios:[]};  
   coleccionLenguajesr.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "3"; datos = { categoria: "lenguajesr", tipo: "recruiter", lenguaje:"php", usuarios:[]};  
   coleccionLenguajesr.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
   id = "4"; datos = { categoria: "lenguajesr", tipo: "recruiter", lenguaje:"Angular", usuarios:[]};  
   coleccionLenguajesr.doc(id).set(datos)
   .then(function() {
     console.log("nuevo lenguaje");
   })
   .catch(function(error) {
     console.log("Error" + error);
   });
}*/

/**LENGUAJES */

function fncargardatos() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      console.log("Nombre:" + doc.data().nombre);
      $$('#nomperf').html("Nombre:  " + doc.data().nombre);
      $$('#apelperf').html("Apellido:  " + doc.data().apellido);
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

function fncargardatosrec() {

  docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", doc.data());
      console.log("Nombre:" + doc.data().nombre);
      $$('#nomperfrec').html("Nombre:  " + doc.data().nombre);
      $$('#apelperfrec').html("Apellido:  " + doc.data().apellido);
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}

var lenguajeSeteado = "";
function seteaLeng(lenguaje) {
  lenguajeSeteado = lenguaje;
}
function fnsumateested() {
  $$('#nwleng').append(lenguajeSeteado);
}

var lenguajeSeteador = "";
function seteaLengR(lenguaje) {
  lenguajeSeteador = lenguaje;
}
function fnsumateester() {
  $$('#nwlengr').append(lenguajeSeteador);


}


