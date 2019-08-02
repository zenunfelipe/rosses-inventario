app = {
  rest:  "http://186.67.74.115:8085/bodega"
};

angular.module('andes', ['ionic', 'andes.controllers','ngStorage','peanuthub-custom-keyboard'])

.run(function($ionicPlatform, $rootScope, $ionicHistory, $timeout, $state, $localStorage, $ionicPopup, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.cordova) {
      console.log('Welcome cordova');
      window.cordova.plugins.honeywell.selectDevice('dcs.scanner.imager', () => {
        console.info('dcs.scanner.imager codebar device connected');
        window.cordova.plugins.honeywell.claim(() => { 
          console.info('claim success');
          window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled'));
          window.cordova.plugins.honeywell.register(function(event) {
            var $body = angular.element(document.body);            // 1
            var $rootScope = $body.injector().get('$rootScope');   // 2b
            $rootScope.$broadcast("scanner", { data: event });
            $rootScope.$apply();           
          }, function(err) { 
            console.log(err); 
          });
        }, (err) => {
          console.info(err);
        });
      }, (err) => { console.info(err); });
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.custom_qty = "1";
  $rootScope.calculator = function() {
    //$rootScope.$broadcast("calculatorCelebrity", { data: {success: true} });
  };

  $rootScope.showload = function(text) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner><br /><span>'+(text ? text : '')+'</span>'
    }).then(function(){
    });
  };
  $rootScope.hideload = function(){
    $ionicLoading.hide().then(function(){
    });
  };
 
  $state.go("main.selector");
 

  $rootScope.err = function(msg, cb) {
     var alertPopup = $ionicPopup.alert({
       title: 'Error',
       template: (msg ? msg : 'Error al consultar el servicio. Intente más tarde'),
       buttons: [{
        text: 'Aceptar',
        type: 'button-assertive'
        }]
     });

     alertPopup.then(function(res) {
       $("body").removeClass("modal-open");
       if (cb) {
        cb();
       }
     });
  };
  $rootScope.ok = function(msg, title, callback, aceptarBtn) {
     var alertPopup = $ionicPopup.alert({
       title: (title ? title : 'Listo'),
       template: (msg ? msg : 'Operación realizada'),
       buttons: [{
        text: (aceptarBtn ? aceptarBtn : 'Aceptar'),
        type: 'button-assertive'
        }]
     });

     alertPopup.then(function(res) {
      $("body").removeClass("modal-open");
      alertPopup.close();
      if (callback) { 
        callback();
      }
     });

     if (callback) {
      return alertPopup;
     }
  };
  $rootScope.confirmar = function(msg, callback,no) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Confirmar',
     template: (msg ? msg : '¿Desea continuar?'),
     buttons: [
      { 
        text: 'No', 
        type: 'button-dark',
        onTap: function(e) { if (no) { $("body").removeClass("modal-open"); no(); } } 
      },
      {
        text: '<b>Aceptar</b>',
        type: 'button-assertive',
        onTap: function(e) {
          $("body").removeClass("modal-open");
          callback();
        }
      },
     ]
   });
  };

  $rootScope.forHumans = function  ( seconds ) {
      var levels = [
          [Math.floor(seconds / 31536000), 'años'],
          [Math.floor((seconds % 31536000) / 86400), 'dias'],
          [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hrs'],
          [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'mins'],
          [(((seconds % 31536000) % 86400) % 3600) % 60, 'segs'],
      ];
      var returntext = '';

      for (var i = 0, max = levels.length; i < max; i++) {
          if ( levels[i][0] === 0 ) continue;
          returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
      };
      return returntext.trim();
  }

 
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider, $peanuthubCustomKeyboardProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false).text('');

  $peanuthubCustomKeyboardProvider.addCustomKeyboard('CUSTOM_SKU', {
  keys: [
   { type: "CHAR_KEY", value: "1" },
   { type: "CHAR_KEY", value: "2", label: "" },
   { type: "CHAR_KEY", value: "3", label: "" },
   { type: "CHAR_KEY", value: "4" },
   { type: "CHAR_KEY", value: "5" },
   { type: "CHAR_KEY", value: "6" },
   { type: "CHAR_KEY", value: "7" },
   { type: "CHAR_KEY", value: "8" },
   { type: "CHAR_KEY", value: "9" },
   { type: "CHAR_KEY", value: "50" },
   { type: "CHAR_KEY", value: "0" },
   { type: "DELETE_KEY", icon: "ion-backspace-outline" }
  ]});

  $stateProvider

  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })

  .state('main.bpm', {
    url: '/bpm',
    views: {
      'menuContent': {
        templateUrl: 'templates/bpm.html',
        controller: 'BpmCtrl'
      }
    }
  })
  .state('main.bpmubicacion', {
    url: '/bpmubicacion',
    views: {
      'menuContent': {
        templateUrl: 'templates/bpmubicacion.html',
        controller: 'BpmUbicacionCtrl'
      }
    }
  })
  .state('main.bvn', {
    url: '/bvn',
    views: {
      'menuContent': {
        templateUrl: 'templates/bvn.html',
        controller: 'BvnCtrl'
      }
    }
  })
  .state('main.bvnubicacion', {
    url: '/bvnubicacion',
    views: {
      'menuContent': {
        templateUrl: 'templates/bvnubicacion.html',
        controller: 'BvnUbicacionCtrl'
      }
    }
  })
  .state('main.bsrubicacion', {
    url: '/bsrubicacion',
    views: {
      'menuContent': {
        templateUrl: 'templates/bsrubicacion.html',
        controller: 'BsrUbicacionCtrl'
      }
    }
  })
  .state('main.selector', {
    url: '/selector',
    views: {
      'menuContent': {
        templateUrl: 'templates/selector.html',
        controller: 'SelectorCtrl'
      }
    }
  })
  .state('main.conteo', {
    url: '/conteo',
    views: {
      'menuContent': {
        templateUrl: 'templates/conteo.html',
        controller: 'ConteoCtrl'
      }
    },
    params: {
      warehouse: ''
    }
  })
  .state('main.stock', {
    url: '/stock',
    views: {
      'menuContent': {
        templateUrl: 'templates/stock.html',
        controller: 'StockCtrl'
      }
    }
  })

  .state('main.stockbvn', {
    url: '/stockbvn',
    views: {
      'menuContent': {
        templateUrl: 'templates/stockbvn.html',
        controller: 'StockBvnCtrl'
      }
    }
  })

  //$urlRouterProvider.otherwise('/main/home');
})
.filter('price', [
function() { // should be altered to suit your needs
    return function(input) {
      var ret=(input)?input.toString().trim().replace(",",".").toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."):0;
      return ("$ "+ret);
    };
}])
.directive('onDoubleClick', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $elm, $attrs) {

            var clicks = 0;

            $elm.bind('click', function(evt) {
               
                clicks++;
                if (clicks == 1) {
                    $timeout(function() {
                        if (clicks == 1) {
                            //....
                        } else {
                            $scope.$apply(function() {
                               
                                $scope.$eval($attrs.onDoubleClick);
                            });
                        }
                        clicks = 0;
                    }, 300);
                }
            });

        }
    };
});


document.addEventListener("offline", function() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  /*
  $rootScope.nowifi();
  if (window.cordova) { $rootScope.wifiread(); }
  if (window.cordova && $rootScope.viendoDetalle == 1) {
    window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled'));
  }
  $rootScope.$apply();
  */
}, false);

document.addEventListener("online", function() {
  var $body = angular.element(document.body);
  var $rootScope = $body.injector().get('$rootScope');
  /*
  if (window.cordova && $rootScope.viendoDetalle == 1) {
    window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled'));
  }
  */
  $rootScope.$apply();
}, false);

function codigo() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  $rootScope.$broadcast("scanner", { data: {success: true, data: "I00000001776200100" } });
  $rootScope.$apply();
}

function bvn() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  $rootScope.$broadcast("scanner", { data: {success: true, data: "I0000000S56062" } });
  $rootScope.$apply();
}
function ubvn() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  $rootScope.$broadcast("scanner", { data: {success: true, data: "04A0201" } });
  $rootScope.$apply();
}
/*
function fakeScan2() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  $rootScope.$broadcast("scanner", { data: {success: true, data: "I0000000s56013" } });
  $rootScope.$apply();
}

function fakeScan666() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  $rootScope.$broadcast("scanner", { data: {success: true, data: "123" } });
  $rootScope.$apply();
}
*/
function ubicacion() {
  var $body = angular.element(document.body);            // 1
  var $rootScope = $body.injector().get('$rootScope');   // 2b
  $rootScope.$broadcast("scanner", { data: {success: true, data: "SUR5000103" } });
  $rootScope.$apply();
}


jQuery.ajaxSetup({
  type: 'POST',
  timeout: 3000,
  error: function(xhr) {
    console.log('AjaxSetup Error');
    
    var $body = angular.element(document.body);            // 1
    var $rootScope = $body.injector().get('$rootScope');   // 2b
    $rootScope.refreshing = 0;
    $rootScope.hideload();
    $rootScope.err("Problema de conexion intente denuevo");
    $rootScope.$apply();   
    //var event = new CustomEvent("offline", { "detail": "Example" });
    //document.dispatchEvent(event);
  }
});

