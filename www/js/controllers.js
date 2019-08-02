//
angular.module('andes.controllers', [])
.controller('BpmCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = [];

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {

    }
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = [];
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = [];
  }); 

  $scope.agregarEmparejado  = function() {
    $scope.modoEscaner = 'agregar';
    $scope.popCloseable = $rootScope.ok("Lea el código a agregar","Agregar Emparejado", function() {
      $scope.modoEscaner = 'leer';
    }, "Cancelar");
  };
  $scope.reubicar  = function() {
    $scope.modoEscaner = 'reubicar';
    $scope.popCloseable = $rootScope.ok("Lea el código de la ubicación","Reubicar", function() {
      $scope.modoEscaner = 'leer';
    }, "Cancelar");
  };
  $scope.borrarPareja = function (IdArticulo, CodigoBarra) {
    $rootScope.confirmar('Seguro?', function() {
      $rootScope.showload();
      jQuery.post(app.rest+"/mayor.php?op=borrarEmparejado", { 
        barra: $scope.barra, 
        borrar: CodigoBarra, 
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.info = data.data.InfoBPMArticulo;
          if (data.data.hasOwnProperty("CodigosEmparejados")) {
            $scope.pareja = data.data.CodigosEmparejados;  
          } else {
            $scope.pareja = [];
          }
        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("No es accesible");

      });
    });
  };

  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      
      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }

      if ($scope.modoEscaner == 'leer') {
        if (args.data.data.length == 18) {

          if ($scope.popCloseable!=null) {
            $scope.popCloseable.close();
          }
          $rootScope.showload();
          jQuery.post(app.rest+"/mayor.php?op=consultarCodigo", { 
            barra: args.data.data
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.barra = args.data.data;
              $scope.enableOp = true;
              $scope.info = data.data.InfoBPMArticulo;
              if (data.data.hasOwnProperty("CodigosEmparejados")) {
                $scope.pareja = data.data.CodigosEmparejados;  
              } else {
                $scope.pareja = [];
              }
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });

        } else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.err("CODIGO DE PRODUCTO O BULTO INVALIDO EN BODEGA MAYOR");
        }
      }

      else if ($scope.modoEscaner == 'reubicar') {
        $scope.modoEscaner = 'leer';
        if (args.data.data.length == 10) {
          $scope.popCloseable.close();
          $rootScope.showload();
          $scope.barra = args.data.data;
          jQuery.post(app.rest+"/mayor.php?op=reubicarCodigo", { 
            barra: $scope.barra,
            ubica: args.data.data
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.info = data.data.InfoBPMArticulo;
              if (data.data.hasOwnProperty("CodigosEmparejados")) {
                $scope.pareja = data.data.CodigosEmparejados;  
              } else {
                $scope.pareja = [];
              }
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");

          });
        } else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("CODIGO INVALIDO PARA REUBICAR");
        }
      }

      else if ($scope.modoEscaner == 'agregar') {
        $scope.popCloseable.close();
        $scope.modoEscaner = 'leer';
        $rootScope.showload();
        $scope.barra = args.data.data;
        jQuery.post(app.rest+"/mayor.php?op=agregarCodigo", { 
          barra: $scope.barra,
          agregar: args.data.data
        }, function(data) {
          $rootScope.hideload();
          if (data.res == "ERR") {
            if (window.cordova) { navigator.notification.beep(1); }
            $rootScope.err(data.msg, function() {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            });
          }
          else {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $scope.info = data.data.InfoBPMArticulo;
            if (data.data.hasOwnProperty("CodigosEmparejados")) {
              $scope.pareja = data.data.CodigosEmparejados;  
            } else {
              $scope.pareja = [];
            }

          }
        },"json").fail(function() {
          $rootScope.hideload();
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("Error de servidor");
        });

      }


    }
  });
})
.controller('BvnCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = [];

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {

    }
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = [];
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = [];
  }); 

  $scope.agregarEmparejado  = function() {
    $scope.modoEscaner = 'agregar';
    $scope.popCloseable = $rootScope.ok("Lea el código a agregar","Agregar Emparejado", function() {
      $scope.modoEscaner = 'leer';
    }, "Cancelar");
  };

  $scope.borrarPareja = function (IdArticulo, CodigoBarra) {
    $rootScope.confirmar('Seguro?', function() {
      $rootScope.showload();
      if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }


      jQuery.post(app.rest+"/index.php?action=eliminar", { 
        andes: $scope.barra,
        ean: CodigoBarra
      }, function(data) {
        $rootScope.hideload();
        var index = null;
        for (var i =0; i < $scope.pareja.length;i++) {
          if ($scope.pareja[i].CodigoBarra == CodigoBarra) {
            index = i;
          }
        }
        if (index != null) {
          $scope.pareja.splice(index,1);    
        }
      },"json").fail(function() {
        $rootScope.hideload();
        $rootScope.err("Error de servidor");
      });
    });
  };

  $scope.$on('scanner', function(event, args) {
    console.log('scanner fire: accion ',$scope.modoEscaner,' - en memoria: ',$scope.barra,' - leido: ',args.data.data);
    if (args.hasOwnProperty("data") && args.data.success == true) {

      
      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }

      if ($scope.modoEscaner == 'leer') {

        if (args.data.data.length != 14) {
          $rootScope.err("CODIGO LEIDO NO ES VALIDO");
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        }
        else {

          if ($scope.popCloseable!=null) {
            $scope.popCloseable.close();
          }
          $rootScope.showload();
          jQuery.post(app.rest+"/index.php?action=sku", { 
            codigo: args.data.data
          }, function(data) {
            $rootScope.hideload();
            console.log(data);
            if (data.data2[0].msgResult == "ER") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.data2[0].msgError, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.barra = args.data.data;
              $scope.enableOp = true;
              $scope.info = data.data2;
              $scope.pareja = data.pos;
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");

          });

        }

      }

      else if ($scope.modoEscaner == 'agregar') {
        $scope.modoEscaner = 'leer';

        $scope.popCloseable.close();
        $rootScope.showload();
        jQuery.post(app.rest+"/index.php?action=asociar", { 
          andes: $scope.barra,
          ean: args.data.data
        }, function(data) {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }

          jQuery.post(app.rest+"/index.php?action=sku", { 
            codigo: $scope.barra
          }, function(data) {
            $rootScope.hideload();
            console.log(data);
            if (data.data2[0].msgResult == "ER") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.data2[0].msgError, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.barra = args.data.data;
              $scope.enableOp = true;
              $scope.info = data.data2;
              $scope.pareja = data.pos;
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");

          });
          /*
          $rootScope.hideload();
          $scope.pareja.push({
            CodigoBarra: args.data.data
          });
          */

        },"json").fail(function() {
          $rootScope.hideload();
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("Error de servidor");
        });
      }


    }
  });
})
.controller('BpmUbicacionCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = {};
  $scope.grupo = localStorage.getItem('ocip');

  $scope.$on('$ionicView.enter', function(obj, viewData){
  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {
      $scope.popCloseable = null;
      $scope.barra = '';
      $scope.modoEscaner = 'leer';
      $scope.enableOp = false;
      $scope.pareja = [];
      $scope.info = {};
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }); 

  $scope.cancelar = function() {
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }
  $scope.borrar = function (IdArticulo) {
    $rootScope.confirmar('Desea limpiar la ubicación del articulo '+IdArticulo+'?', function() {
      $rootScope.showload();
      jQuery.post(app.rest+"/mayor.php?op=borrarUbicacion", { 
        barra: $scope.barra, 
        borrar: IdArticulo, 
        grupo: $scope.grupo
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          for (var i =0;i < $scope.pareja.length; i++) {
            if ($scope.pareja[i].IDArticulo == IdArticulo) {
              $scope.splice(i, 1);
              break;
            }
          }
        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("No es accesible");

      });
    });
  };



  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }

      if ($scope.modoEscaner == 'leer') {
        if (args.data.data.length == 10) {
          $rootScope.showload();
          jQuery.post(app.rest+"/mayor.php?op=consultarUbicacion", { 
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.barra = args.data.data;
              $scope.enableOp = true;
              $scope.info = data.info;
              $scope.modoEscaner = 'agregar';
              $scope.pareja = data.pareja;
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });

        } else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.err("CODIGO DE UBICACION INVALIDO EN BODEGA MAYOR");
        }
      }

      else if ($scope.modoEscaner == 'agregar') {
        if (args.data.data.length == 18) {
          $rootScope.showload();
          jQuery.post(app.rest+"/mayor.php?op=reubicarValidando", { 
            ubica: $scope.barra,
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "PROMPT") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.confirmar(data.msg, function() {
                $rootScope.showload();
                jQuery.post(app.rest+"/mayor.php?op=reubicarValidando", { 
                  ubica: $scope.barra,
                  barra: args.data.data,
                  secure: '1',
                  grupo: $scope.grupo
                }, function(data2) {
                  $rootScope.hideload();
                  $scope.pareja = data2.pareja;
                  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
                },"json").fail(function() {
                  $rootScope.hideload();
                  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
                  $rootScope.err("Error de servidor");
                });

              }, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else if (data.res == "ERR") {
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.pareja = data.pareja;
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("CODIGO INVALIDO PARA AGREGAR");
        }
      }


    }
  });
})
.controller('BvnUbicacionCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = {};
  $scope.grupo = localStorage.getItem('ocip');

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {
      $scope.popCloseable = null;
      $scope.barra = '';
      $scope.modoEscaner = 'leer';
      $scope.enableOp = false;
      $scope.pareja = [];
      $scope.info = {};
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }); 

  $scope.cancelar = function() {
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }
  $scope.borrar = function (IdArticulo) {
    $rootScope.confirmar('Desea limpiar la ubicación del articulo '+IdArticulo+'?', function() {
      $rootScope.showload();
      jQuery.post(app.rest+"/bvn.php?op=borrarUbicacion", { 
        barra: $scope.barra, 
        borrar: IdArticulo, 
        grupo: $scope.grupo
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          for (var i =0;i < $scope.pareja.length; i++) {
            if ($scope.pareja[i].IDArticulo == IdArticulo) {
              $scope.splice(i, 1);
              break;
            }
          }
        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("No es accesible");

      });
    });
  };



  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }

      if ($scope.modoEscaner == 'leer') {
        if (args.data.data.length == 7) {
          $rootScope.showload();
          jQuery.post(app.rest+"/bvn.php?op=consultarUbicacion", { 
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.barra = args.data.data;
              $scope.enableOp = true;
              $scope.modoEscaner = 'agregar';
              $scope.pareja = data.pareja;

              $scope.pasillo = data.info.pasillo;
              $scope.lado = data.info.lado;
              $scope.fila = data.info.fila;
              $scope.columna = data.info.columna;
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });

        } else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.err("CODIGO DE UBICACION INVALIDO EN BODEGA VENTAS");
        }
      }

      else if ($scope.modoEscaner == 'agregar') {
        if (args.data.data.length >= 12 && args.data.data.length <= 15 ) {
          $rootScope.showload();
          jQuery.post(app.rest+"/bvn.php?op=reubicarValidando", { 
            ubica: $scope.barra,
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "PROMPT") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.confirmar(data.msg, function() {
                $rootScope.showload();
                jQuery.post(app.rest+"/bvn.php?op=reubicarValidando", { 
                  ubica: $scope.barra,
                  barra: args.data.data,
                  secure: '1',
                  grupo: $scope.grupo
                }, function(data2) {
                  $rootScope.hideload();
                  $scope.pareja = data2.pareja;
                  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
                },"json").fail(function() {
                  $rootScope.hideload();
                  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
                  $rootScope.err("Error de servidor");
                });

              }, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else if (data.res == "ERR") {
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.pareja = data.pareja;
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("CODIGO INVALIDO PARA AGREGAR");
        }
      }


    }
  });
})
.controller('BsrUbicacionCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.pasillo = "";
  $scope.lado = "";
  $scope.fila = "";
  $scope.columna = "";

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {
      $scope.popCloseable = null;
      $scope.barra = '';
      $scope.modoEscaner = 'leer';
      $scope.enableOp = false;
      $scope.pareja = [];
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
  }); 

  $scope.cancelar = function() {
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    /*
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.selector');
    */
  }
  $scope.borrar = function (IdArticulo) {
    $rootScope.confirmar('Desea limpiar la ubicación del articulo '+IdArticulo+'?', function() {
      $rootScope.showload();
      jQuery.post(app.rest+"/bsr.php?action=borrar", { 
        pasillo: $scope.pasillo,
        lado: $scope.lado,
        columna: $scope.columna,
        fila: $scope.fila,
        codigo: IdArticulo, 
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.pareja = data.data;
        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("No es accesible");

      });
    });
  };
  


  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }

      if ($scope.modoEscaner == 'leer') {
        if (args.data.data.length == 7) {
          $scope.pasillo = args.data.data.substring(0,2);
          $scope.lado = args.data.data.substring(2,3);
          $scope.fila = args.data.data.substring(3,5)
          $scope.columna = args.data.data.substring(5,7);

          $rootScope.showload();
          jQuery.post(app.rest+"/bsr.php?action=buscar", { 
            barra: args.data.data,
            pasillo: $scope.pasillo,
            lado: $scope.lado,
            columna: $scope.columna,
            fila: $scope.fila
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {

              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.barra = args.data.data;
              $scope.enableOp = true;
              $scope.modoEscaner = 'agregar';
              $scope.pareja = data.data;
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });

        } else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.err("CODIGO DE UBICACION INVALIDO EN BODEGA VENTAS");
        }
      }

      else if ($scope.modoEscaner == 'agregar') {
        if (args.data.data.length >= 12 && args.data.data.length <= 15 ) {
          $rootScope.showload();
          jQuery.post(app.rest+"/bsr.php?action=agrega", { 
            ubica: $scope.barra,
            codigo: args.data.data,
            pasillo: $scope.pasillo,
            lado: $scope.lado,
            columna: $scope.columna, 
            fila: $scope.fila
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "PROMPT") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.confirmar(data.msg, function() {
                $rootScope.showload();
                jQuery.post(app.rest+"/bsr.php?action=reubicarValidando", { 
                  ubica: $scope.barra,
                  barra: args.data.data,
                  secure: '1'
                }, function(data2) {
                  $rootScope.hideload();
                  $scope.pareja = data2.pareja;
                  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
                },"json").fail(function() {
                  $rootScope.hideload();
                  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
                  $rootScope.err("Error de servidor");
                });

              }, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else if (data.res == "ERR") {
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.pareja = data.data;
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("CODIGO INVALIDO PARA AGREGAR");
        }
      }


    }
  });
})
.controller('ConteoCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup, $ionicHistory, $stateParams, $ionicPlatform) {
  $rootScope.enInicio = 0;
  var deregisterFirst = $ionicPlatform.registerBackButtonAction(
    function() {
      $ionicHistory.nextViewOptions({
          historyRoot: true
      });
      $state.go('main.selector');
    }, 100
  );
  $scope.$on('$destroy', deregisterFirst);

  $scope.warehouse = $stateParams.warehouse;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = {};
  $scope.conteo = 0;
  $scope.custom_c = 1;

  $scope.grupo = localStorage.getItem('ocip');

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {
      $scope.popCloseable = null;
      $scope.barra = '';
      $scope.modoEscaner = 'leer';
      $scope.enableOp = false;
      $scope.pareja = [];
      $scope.info = {};
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }); 

  $scope.cancelar = function() {
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }
  $scope.borrar = function (IdArticulo,bulto) {
    $rootScope.confirmar('Desea reiniciar el conteo del artículo código: '+IdArticulo+'?', function() {
      $rootScope.showload();
      jQuery.post(app.rest+"/conteo.php?op=rebootConteo", { 
        ubica: $scope.barra, 
        barra: IdArticulo, 
        bulto: bulto,
        grupo: $scope.grupo
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.info = data.data;
          $scope.pareja = [];
          for (var i = 0; i < $scope.info.ConteoInventario.length; i++) {
            //console.log('idarticulo: '+  $scope.info.ConteoInventario[i].IDArticulo + ' uni - '+$scope.info.ConteoInventario[i].UnidadxBulto+' - estado: '+$scope.info.ConteoInventario[i]['IDEstadoConteo'+$scope.conteo]+" - conteo: "+$scope.conteo);
            if (
              $scope.conteo == 3 && $scope.info.ConteoInventario[i]['IDEstadoConteo'+$scope.conteo] == 0 && 
              ($scope.info.ConteoInventario[i]['CantidadConteo1'] > 0 || $scope.info.ConteoInventario[i]['CantidadConteo2'] > 0)  
             ) {
              //console.log('IN OK');
              $scope.pareja.push({
                Descripcion: $scope.info.ConteoInventario[i].Nombre,
                IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                Cantidad: $scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo]
              });
            }
            else if ($scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo] > 0 && $scope.conteo < 3) {
              $scope.pareja.push({
                Descripcion: $scope.info.ConteoInventario[i].Nombre,
                IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                Cantidad: $scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo]
              });
            }
          }

        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("No es accesible");
      });
    });
  };



  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }

      if ($scope.modoEscaner == 'leer') {
        if ( ($scope.warehouse == 'BPM' && args.data.data.length == 10) || ($scope.warehouse == 'BVN' && args.data.data.length == 7) || ($scope.warehouse == 'BSR' && args.data.data.length == 9) )  {
          $rootScope.showload();
          jQuery.post(app.rest+"/conteo.php?op=consultarUbicacion", { 
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              //if (data.data.InfoUbicacion[0].CantidadConteo == 0) {
              //  $scope.conteo = 1;
              //}
              $rootScope.custom_qty=1;
              $scope.conteo = data.data.InfoUbicacion[0].NroConteo;
              if ($scope.conteo == 3 && data.data.InfoUbicacion[0].IDEstadoConteo == 1) {
                $scope.conteo = 0;
                if (window.cordova) { navigator.notification.beep(1); }
                $rootScope.err("Conteo de la ubicación está finalizado. No puede contar esta ubicación");
              }
              else {
                $scope.barra = args.data.data;
                $scope.enableOp = true;
                $scope.info = data.data;
                $scope.modoEscaner = 'agregar';
                //$scope.pareja = data.pareja;
                $scope.pareja = [];
                for (var i = 0; i < $scope.info.ConteoInventario.length; i++) {
                  //console.log('idarticulo: '+  $scope.info.ConteoInventario[i].IDArticulo + ' uni - '+$scope.info.ConteoInventario[i].UnidadxBulto+' - estado: '+$scope.info.ConteoInventario[i]['IDEstadoConteo'+$scope.conteo]+" - conteo: "+$scope.conteo);
                  if ($scope.conteo == 3 && $scope.info.ConteoInventario[i]['IDEstadoConteo'+$scope.conteo] == 0 && 
                    ($scope.info.ConteoInventario[i]['CantidadConteo1'] > 0 || $scope.info.ConteoInventario[i]['CantidadConteo2'] > 0)  
                   ) {
                    //console.log('IN OK');
                    $scope.pareja.push({
                      Descripcion: $scope.info.ConteoInventario[i].Nombre,
                      IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                      Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                      Cantidad: $scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo]
                    });
                  }
                  else if ($scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo] > 0 && $scope.conteo < 3) {
                    $scope.pareja.push({
                      Descripcion: $scope.info.ConteoInventario[i].Nombre,
                      IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                      Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                      Cantidad: $scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo]
                    });
                  }
                }
                $scope.$broadcast('scroll.resize');
              }
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });

        } else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.err("CODIGO DE UBICACION INVALIDO EN BODEGA "+$scope.warehouse);
        }
      }

      else if ($scope.modoEscaner == 'agregar') {
        //if (args.data.data.length == 18) {
          $rootScope.showload();
          jQuery.post(app.rest+"/conteo.php?op=agregarConteo", { 
            ubica: $scope.barra,
            barra: args.data.data,
            conteo: $rootScope.custom_qty,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              $rootScope.custom_qty=1;
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              $scope.info = data.data;
              $scope.pareja = [];
              for (var i = 0; i < $scope.info.ConteoInventario.length; i++) {
                //console.log('idarticulo: '+  $scope.info.ConteoInventario[i].IDArticulo + ' uni - '+$scope.info.ConteoInventario[i].UnidadxBulto+' - estado: '+$scope.info.ConteoInventario[i]['IDEstadoConteo'+$scope.conteo]+" - conteo: "+$scope.conteo);
                if ($scope.conteo == 3 && $scope.info.ConteoInventario[i]['IDEstadoConteo'+$scope.conteo] == 0 && 
                  ($scope.info.ConteoInventario[i]['CantidadConteo1'] > 0 || $scope.info.ConteoInventario[i]['CantidadConteo2'] > 0)  
                ) {
                  //console.log('IN OK');
                  $scope.pareja.push({
                    Descripcion: $scope.info.ConteoInventario[i].Nombre,
                    IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                    Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                    Cantidad: $scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo]
                  });
                }
                else if ($scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo] > 0 && $scope.conteo < 3) {
                  $scope.pareja.push({
                    Descripcion: $scope.info.ConteoInventario[i].Nombre,
                    IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                    Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                    Cantidad: $scope.info.ConteoInventario[i]['CantidadConteo'+$scope.conteo]
                  });
                }
              }
              $scope.$broadcast('scroll.resize');
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });
        //}
        //else {
        //  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        //  $rootScope.err("CODIGO INVALIDO PARA AGREGAR");
        //}
      }
    }
  });

  $scope.finishConteo = function() {
    if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
    $rootScope.confirmar("Finalizar conteo?", function() {
      $rootScope.showload();
      jQuery.post(app.rest+"/conteo.php?op=finalizar", { 
        ubica: $scope.barra,
        grupo: $scope.grupo
      }, function(data2) {
        $rootScope.hideload();
        if (data2.res == "OK") {
          $rootScope.ok("Conteo finalizado");       
          $ionicHistory.nextViewOptions({
              historyRoot: true
          });
          $state.go('main.selector');
          $rootScope.custom_qty=1;
        }
        else {
          $rootScope.err(data2.msg);
        }
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("Error de servidor");
      });

    }, function() {
      if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    });
  }
  $scope.cancelarConteo = function() {
    if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
    $rootScope.confirmar("Continuar despues?", function() {
        
      $ionicHistory.nextViewOptions({
          historyRoot: true
      });
      $state.go('main.selector');

      if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    }, function() {
      if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    });
  }
})
.controller('StockCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup, $ionicHistory) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = {};
  $scope.conteo = 0;
  $scope.custom_c = 1;

  $scope.grupo = localStorage.getItem('ocip');

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {
      $scope.popCloseable = null;
      $scope.barra = '';
      $scope.modoEscaner = 'leer';
      $scope.enableOp = false;
      $scope.pareja = [];
      $scope.info = {};
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }); 

  $scope.cancelar = function() {
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }

  $scope.cancelarConteo = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.selector');
  }
 
  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
      
      if ($scope.modoEscaner == 'leer') {
          $rootScope.showload();
          jQuery.post(app.rest+"/conteo.php?op=consultaStock", { 
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              $scope.enableOp = true;
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              console.log('ok', data.data);
              $scope.info = data.data;
              $scope.pareja = [];
              for (var i = 0; i < $scope.info.ConteoInventario.length; i++) {
               //console.log('IN OK');
                $scope.pareja.push({
                  Descripcion: $scope.info.ConteoInventario[i].Nombre,
                  IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                  Bulto: $scope.info.ConteoInventario[i].UnidadxBulto,
                  Cantidad: $scope.info.ConteoInventario[i].StockActualBodega
                });

              }
              $scope.$broadcast('scroll.resize');
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });
        //}
        //else {
        //  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        //  $rootScope.err("CODIGO INVALIDO PARA AGREGAR");
        //}
      }
    }
  });
})

.controller('StockBvnCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup, $ionicHistory) {
  $rootScope.enInicio = 0;
  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = {};
  $scope.conteo = 0;
  $scope.custom_c = 1;

  $scope.grupo = localStorage.getItem('ocip');

  $scope.$on('$ionicView.enter', function(obj, viewData){
    if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
    if (viewData.direction == 'back') {
      $scope.popCloseable = null;
      $scope.barra = '';
      $scope.modoEscaner = 'leer';
      $scope.enableOp = false;
      $scope.pareja = [];
      $scope.info = {};
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }); 

  $scope.cancelar = function() {
    $scope.popCloseable = null;
    $scope.barra = '';
    $scope.modoEscaner = 'leer';
    $scope.enableOp = false;
    $scope.pareja = [];
    $scope.info = {};
  }

  $scope.cancelarConteo = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.selector');
  }
 
  $scope.$on('scanner', function(event, args) {
    
    if (args.hasOwnProperty("data") && args.data.success == true) {

      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
      
      if ($scope.modoEscaner == 'leer') {
          $rootScope.showload();
          jQuery.post(app.rest+"/conteo.php?op=consultaStock", { 
            barra: args.data.data,
            grupo: $scope.grupo
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              $scope.enableOp = true;
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              console.log('ok', data.data);
              $scope.info = data.data;
              $scope.pareja = [];
              for (var i = 0; i < $scope.info.ConteoInventario.length; i++) {
               //console.log('IN OK');
                $scope.pareja.push({
                  Descripcion: $scope.info.ConteoInventario[i].Nombre,
                  IDArticulo: $scope.info.ConteoInventario[i].IDArticulo,
                  Bulto: $scope.info.ConteoInventario[i].StockUnidadxBulto,
                  Cantidad: $scope.info.ConteoInventario[i].StockUnidadxBulto
                });

              }
              console.log('-----------------------------------------------------');
              console.log($scope.info.InfoBPMArticulo[0].StockUnidadxBulto);
              $scope.$broadcast('scroll.resize');
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
          });
        //}
        //else {
        //  if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        //  $rootScope.err("CODIGO INVALIDO PARA AGREGAR");
        //}
      }
    }
  });
})
.controller('MainCtrl', function($scope, $state, $localStorage, $timeout, $interval, $ionicModal, $rootScope, $location, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory) {

  $ionicSideMenuDelegate.canDragContent(false);

  $scope.inicio = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.selector');
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.cambiarGrupo = function() {
    $ionicSideMenuDelegate.toggleLeft();
    $rootScope.$broadcast('cambiarGrupoBroadcast', null);
  }
})
.controller('SelectorCtrl', function($scope, $state, $localStorage, $timeout, $interval, $ionicPopup, $ionicModal, $rootScope, $location, $ionicLoading, $ionicHistory) {

  $scope.modalConfiguracion = null;
  $rootScope.enInicio = 1;
  $ionicModal.fromTemplateUrl('templates/config.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalConfiguracion = modal;
  });

  $scope.start = function(x) {
    if (localStorage.getItem('ocip') == null) {
      setTimeout(function() { 
        $scope.modalConfiguracion.show();
      },500);
    } 
  }

  $scope.start();
  $scope.selg = "";
  $scope.grupo = localStorage.getItem('ocip');

  $scope.setGrupo = function(i) {
    $scope.selg = "grupo"+i;
  }
  $scope.confirmGrupo = function() {
    $rootScope.confirmar('¿Seguro?', function() {
      localStorage.setItem('ocip', $scope.selg);
      $scope.grupo = localStorage.getItem('ocip');
      $scope.modalConfiguracion.hide();
      $scope.start();
    });
    
  }
  $scope.data = { password: "" };

  $scope.$on('cambiarGrupoBroadcast', function(event, message) {
    var myPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="data.password" placeholder="ingresa la clave">',
      cssClass: 'pass-custom-popup',
      title: 'Que usaba Linus',
      subTitle: 'de la serie Darvin del 101',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Aceptar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.password) {
              $rootScope.err("No autorizado");
            } else {
              return $scope.data.password;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
      if (res == "pañito") {
        localStorage.removeItem('ocip');
        $scope.start();
      }
      else {
        $rootScope.err("No autorizado");
      }
    });
  });
  $scope.BVN = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.bvn');
  }

  $scope.BPM = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.bpm');
  }

  $scope.CONTEO = function(warehouse) {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.conteo', { warehouse: warehouse });
  }

  $scope.BPMUbicacion = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.bpmubicacion');
  }

  $scope.BVNUbicacion = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.bvnubicacion');
  }
  $scope.BSRUbicacion = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.bsrubicacion');
  }

  $scope.STOCK = function() {
    $rootScope.showload();
    jQuery.post(app.rest+"/conteo.php?op=puedeStock", { 
      grupo: $scope.grupo
    }, function(data) {
      $rootScope.hideload();
      if (data.res == "OK") {
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $state.go('main.stock');
      }
      else {
        $rootScope.err(data.msg);
      }

    });

  }

  $scope.STOCKBVN = function() {
    $rootScope.showload();
    jQuery.post(app.rest+"/conteo.php?op=puedeStock", { 
      grupo: $scope.grupo
    }, function(data) {
      $rootScope.hideload();
      if (data.res == "OK") {
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        $state.go('main.stockbvn');
      }
      else {
        $rootScope.err(data.msg);
      }

    });

  }
})
String.prototype.toBytes = function() {
    var arr = []
    for (var i=0; i < this.length; i++) {
    arr.push(this[i].charCodeAt(0))
    }
    return arr
}
function miles(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}