//
angular.module('andes.controllers', [])

.controller('BpmCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {

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
        $ionicHistory.goBack();
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
            $ionicHistory.goBack();
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
            $ionicHistory.goBack();
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
            $ionicHistory.goBack();
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
          $rootScope.hideload();
          $scope.pareja.push({
            CodigoBarra: args.data.data
          });
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

  $scope.popCloseable = null;
  $scope.barra = '';
  $scope.modoEscaner = 'leer';
  $scope.enableOp = false;
  $scope.pareja = [];
  $scope.info = {};

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
        $ionicHistory.goBack();
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
              $scope.info = data.info;
              $scope.modoEscaner = 'agregar';
              $scope.pareja = data.pareja;
              
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Error de servidor");
            $ionicHistory.goBack();
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
.controller('MainCtrl', function($scope, $state, $localStorage, $timeout, $interval, $ionicModal, $rootScope, $location, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory) {

  $ionicSideMenuDelegate.canDragContent(false);
  setTimeout(function() {
    if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
  }, 2000);

  $scope.inicio = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.selector');
    $ionicSideMenuDelegate.toggleLeft();
  }

})

.controller('SelectorCtrl', function($scope, $state, $localStorage, $timeout, $interval, $ionicModal, $rootScope, $location, $ionicLoading, $ionicHistory) {

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

  $scope.BPMUbicacion = function() {
    $ionicHistory.nextViewOptions({
        historyRoot: true
    });
    $state.go('main.bpmubicacion');
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