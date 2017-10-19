angular.module('wooshop', ['ionic', 'wooshop.controllers', 'wooshop.services','wooshop.directives','ngCordova','angularMoment','cera.ionicSuperPopup'])

.run(function($rootScope, $ionicPlatform, $ionicLoading, $ionicPopup, $ionicHistory,$state,ikmAuth) {
  $ionicPlatform.ready(function() {
     
   
    // $ionicConfigProvider.views.maxCache(0);


    // Check for network connection
    if(window.Connection) {

      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: 'No Internet Connection',
          content: 'No Internet connectivity detected. Please reconnect and try again.'
        })
        .then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        });
      }
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate){
       ikmAuth.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {
      // User isn’t authenticated
      $state.transitionTo("app.home");
      event.preventDefault();
      }
      }); 
    }
  });
  $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }

    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101);
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider,$ionicConfigProvider) {
  // $ionicConfigProvider.views.maxCache(0); 
  $stateProvider
  
  .state('app', {
   cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'template/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.ikm', {
    cache: false,
    url: '/ikm',
    views: {
      'menuContent': {
        templateUrl: 'template/ikm.html',
        controller: 'IkmCtrl'
      }
    }
  })
  .state('app.products', {
    cache: false,
      url: '/products',
      views: {
        'menuContent': {
          templateUrl: 'template/products.html',
          controller: 'ProductsCtrl'
        }
      }
    })
  .state('app.home', {
   //cache: false,
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'template/home.html',
          controller: 'ProductsCtrl'
        }
      }
    })
   .state('app.kategori', {
    cache: false,
      url: '/kategori',
      views: {
        'menuContent': {
          templateUrl: 'template/kategori.html',
          controller: 'KategoriCtrl'
        }
      }
    })
   .state('app.kategoris', {
    cache: false,
      url: '/kategoris/:kategoriId',
      views: {
        'menuContent': {
          templateUrl: 'template/kategoris.html',
          controller: 'KategorisCtrl'
        }
      }
    })

  .state('app.product', {
    cache: false,
    url: '/products/:productId',
    views: {
      'menuContent': {
        templateUrl: 'template/product.html',
        controller: 'ProductCtrl'

      }
    }
  })
  .state('app.ikms', {
    cache: false,
		url: "/ikms/:ikmId",
		views: {
		  'menuContent': {
			templateUrl: "template/ikms.html",
			controller: 'IkmsCtrl'
		  }
		}
  })
  .state('app.email', {
    cache: false,
    url: "/email",
    authenticate: true,
    views: {
      'menuContent': {
      templateUrl: "template/email.html",
      
      controller: 'EmailCtrl'
      }
    }
  })
  .state('app.emailid', {
    cache: false,
    url: "/emailid/:emailId",
    authenticate: true,
    views: {
      'menuContent': {
      templateUrl: "template/emailid.html",
      controller: 'EmailidCtrl'
      }
    }
  })
  .state('app.tambahproduk', {
    cache: false,
    url: "/tambahproduk",
    authenticate: true,
    views: {
      'menuContent': {
      templateUrl: "template/tambahProduk.html",
      controller: 'TambahCtrl'
      }
    }
  })
  .state('app.produkikm', {
    cache: false,
    url: "/produkikm",
    authenticate: true,
    views: {
      'menuContent': {
      templateUrl: "template/produkIkm.html",
      controller: 'ProdukIkmCtrl'
      }
    }
  });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
    
})
