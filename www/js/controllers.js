var app = angular.module('wooshop.controllers', ['wooshop.services','wooshop.directives'])

app.controller('AppCtrl', function(ionicSuperPopup,$location,$ionicHistory, $window,$scope, ikmAuth, $ionicLoading, $ionicModal, $timeout, $state,$cordovaInAppBrowser) {
      ikmAuth.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {

          $scope.status=false;
        }else{
          $scope.status=true;
           $scope.username=localStorage.getItem("username");
     $scope.nama = localStorage.getItem("nama");
      $scope.foto=localStorage.getItem("foto");
       $scope.id=localStorage.getItem("id");
       $scope.token=localStorage.getItem("token");
        }
        });
     $scope.total=0;
    var token = localStorage.getItem("token");
    var id = localStorage.getItem("id");
    $scope.buka = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="dots" class="spinner-calm"></ion-spinner> <br>Proses...'
    });
  };
  $scope.tutup = function(){
    $ionicLoading.hide();
  };
$scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('template/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
$scope.sukses = function (pesan) {
ionicSuperPopup.show("Success!", pesan, "success");
};
$scope.error = function (pesan) {
ionicSuperPopup.show("Error!", pesan, "error");
};
  $scope.doLogin = function(){
    $scope.buka();
    ikmAuth.doLogin($scope.loginData.username,$scope.loginData.password).then(function (data){
      //console.log(data);
      if (data.message == 'Results available'){
     localStorage.setItem("id", data.user_data.id);
     localStorage.setItem("username", data.user_data.username);
     localStorage.setItem("nama", data.user_data.name_surname);
     localStorage.setItem("foto", data.user_data.profile_image);
     localStorage.setItem("token", data.token);
     $scope.token=localStorage.getItem("token");
     $scope.foto=localStorage.getItem("foto");
     $scope.id=localStorage.getItem("id");
     $scope.username=localStorage.getItem("username");
     $scope.nama = localStorage.getItem("nama");
     // console.log($scope.token);
     
     $scope.status=true;
     $scope.loginData = {};
      $scope.tutup();
     var suk = "Anda Berhasil Login";
      //success
      $scope.sukses(suk);
       $scope.closeLogin();
      //$state.go('app.home');
    }else{
      //err     
      var err = "Username / Password Salah";
      $scope.error(err);
       $scope.closeLogin();
       $scope.tutup();
    }
    })
  };

 ikmAuth.getEmail(token,id).then(function (data){
     // console.log(data);
     localStorage.setItem("email", data.total);
     $scope.total=data.total;
     // $scope.total=data.total;
      // $scope.status=true;
    })


  $scope.doLogout = function(){
    ionicSuperPopup.show({
     title: "Logout",
     text: "Apakah anda yakin ingin Logout?",
     type: "warning",
     showCancelButton: true,
     confirmButtonColor: "#DD6B55",
     confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
     closeOnConfirm: false},
  function(isConfirm){
     if (isConfirm) {
      localStorage.setItem("id",'');
  localStorage.setItem("token",'');
  localStorage.setItem("foto",'');
  localStorage.setItem("username",'');
  localStorage.setItem("nama",'');
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
      $location.path("/home");
     $scope.status=false;
     ionicSuperPopup.show("Berhasil!", "Anda sudah berhasil Logout", "success");
     } else {
        ionicSuperPopup.show("Gagal!", "Anda Gagal Logout", "error");
     }
  });
    //$scope.buka();
  

     //$scope.tutup();
 };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

    $scope.show = function() {
		$ionicLoading.show({
			template: '<ion-spinner class="base-spinner" icon="android"></ion-spinner><br>Proses...'
		});
	};
  


	$scope.hide = function(){
		$ionicLoading.hide();
	};
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };
/*$scope.login = function(url){
      $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
}*/
    
})

app.controller('IkmsCtrl', function($stateParams,$rootScope, $scope, wooshopService,$ionicSlideBoxDelegate,$sce,$cordovaInAppBrowser) {
     $scope.show();
     var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    $scope.inApp = function(url){
      $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {
        console.log(event);
      })
      .catch(function(event) {
        // error
      });
}

    
    $scope.trustSrc = function(src) {
    return $sce.trustAsHtml(src);
  }
    wooshopService.getIkms($stateParams.ikmId).then(function (data){
        $scope.products =data.results;
        $scope.ikm = data.result;
        $scope.deskripsi = data.result.description;
        $scope.link = data.result.embed_video_code;
        $scope.hide();
})
    $scope.buttons = [
        { name: 'Produk', class : 'ion-filing' },
        { name: 'Deskripsi', class : 'ion-information' },
        { name: 'Video', class : 'ion-social-youtube' }
    ];

    $scope.slide = function(to) {
        $scope.current = to;
        $ionicSlideBoxDelegate.slide(to);
    }
    
})
app.controller('ProductsCtrl', function($state,$rootScope, $scope, wooshopService,$timeout) {
   $scope.toggle = function() {
    $scope.variable = !$scope.variable
    console.log($scope.variable);
};
    $scope.show();

    wooshopService.getItems().then(function(data) {
        $scope.productsList= function() {
			$scope.products = data;
       $scope.batas=5;
		}
		 $scope.productsList();
        $scope.hide();
    })
 $scope.doInfinite = function() {
        //$state.go($state.current, {}, {reload: true});
        //console.log('Refreshing!');
        $scope.show();
   /* wooshopService.getItems().then(function(data) {
        $scope.productsList= function() {
      $scope.products = data;
    }
     $scope.productsList();
       // 
    })*/
    $scope.batas += 5;
$scope.hide();
        $timeout( function() {
$scope.$broadcast('scroll.infiniteScrollComplete');
          }, 2000);
        $scope.$on('$stateChangeSuccess', function() {
    $scope.doInfinite();
  });
        
    };
    $scope.doRefresh = function() {
        //$state.go($state.current, {}, {reload: true});
        //console.log('Refreshing!');
        //$scope.show();
    wooshopService.getItems().then(function(data) {
        $scope.productsList= function() {
      $scope.products = data;
      $scope.batas = 5;
    }
     $scope.productsList();
    // $scope.hide();
       // 
    })
    

        $timeout( function() {
$scope.$broadcast('scroll.refreshComplete');
          }, 1000);
        
    };
})

app.controller('KategorisCtrl', function($stateParams,$state,$rootScope, $scope, wooshopService,$timeout) {
    $scope.show();
    wooshopService.getKategoris($stateParams.kategoriId).then(function(data) {
       $scope.kategori= $stateParams.kategoriId;
      $scope.products = data;
      $scope.batas = 3;
        $scope.hide();
    })
    $scope.doInfinite = function() {
        //$state.go($state.current, {}, {reload: true});
        //console.log('Refreshing!');
        $scope.show();
   /* wooshopService.getItems().then(function(data) {
        $scope.productsList= function() {
      $scope.products = data;
    }
     $scope.productsList();
       // 
    })*/
    $scope.batas += 3;
$scope.hide();
        $timeout( function() {
$scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
        
    };
 $scope.doRefresh = function() {
        //$state.go($state.current, {}, {reload: true});
        //console.log('Refreshing!');
        //$scope.show();
    wooshopService.getKategoris($stateParams.kategoriId).then(function(data) {
        $scope.kategori= $stateParams.kategoriId;
      $scope.products = data;
      $scope.batas = 3;
       // $scope.hide();
    })
        $timeout( function() {
$scope.$broadcast('scroll.refreshComplete');
          }, 1000);
        
    };
})

app.controller('KategoriCtrl', function($state,$rootScope, $scope, wooshopService,$timeout) {
    $scope.show();
    wooshopService.getKategori().then(function(data) {
  
      $scope.kategoris = data.tree;
   
        $scope.hide();
    })
})

app.controller('ProductCtrl', function($ionicModal,$rootScope, $scope, $stateParams, wooshopService,$cordovaInAppBrowser,$sce) {
 $scope.show();
 
 $scope.mail={};
 var data = {};
 $scope.sendMail = function(){
  $scope.buka();
  data = {
      'nama' : $scope.mail.nama,
      'alamat': $scope.mail.alamat,
      'email' : $scope.mail.email,
      'telp' : $scope.mail.telp,
      'pesan' : $scope.mail.pesan,
      'produk' :$scope.id
  };
  wooshopService.postEmail($scope.id,$scope.mail.nama,$scope.mail.alamat,$scope.mail.email,$scope.mail.telp,$scope.mail.pesan).then(function (data){
        $scope.pesan =data.pesan;
       $scope.mail={};
       $scope.sukses('Pesan Berhasil dikirim');
         //console.log($scope.product);
  //console.log(data);       
$scope.tutup();
})
 }
   //$state.go($state.currentState, {}, {reload:true});

    $scope.sms={};
    var options ={
        replaceLineBreaks: false,
        android:{
            intent: 'INTENT'
        }
    }

    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };
    $scope.inApp = function(url){
      $cordovaInAppBrowser.open(url, '_blank', options)
      .then(function(event) {
        
      })
      .catch(function(event) {
        // error
      });
}
  /*  $scope.sendSms=function(){
        console.log($scope.sms.message);

        $cordovaSocialSharing
.shareViaSMS($scope.sms.message, $scope.no_telp)
.then(function(result) {
  console.log(result);
}, function(err) {
  console.log(err)// An error occurred. Show a message to the user
});

    }*/
     $scope.trustSrc = function(src) {
    return $sce.trustAsHtml(src);
  }

    wooshopService.getItem($stateParams.productId).then(function (data){
        $scope.product =data.results[0];
        $scope.deskripsi = data.results[0].listing.json_object.field_8;
        $scope.no_telp = data.results[0].listing.phone;
        $scope.link = data.results[0].listing.json_object.field_12;
        $scope.id = data.results[0].listing.property_id;
         //console.log($scope.product);
         
$scope.hide();

        //
    })
    wooshopService.getLiyo($stateParams.productId).then(function (data){
        $scope.produks =data.results;
         //console.log($scope.product);
         
$scope.hide();

        //
    })

     
});

app.controller('IkmCtrl', function($scope, $stateParams, wooshopService, $stateParams) {
    $scope.show();
    wooshopService.getIkm($stateParams.getCatSlug).then(function(data){
        $scope.productsList= function() {
            $scope.ikms = data;
            //console.log($scope.products);
            $scope.hide();
        }
        $scope.productsList();
        
    })
})
app.controller('EmailCtrl', function($scope, $stateParams, ikmAuth, $stateParams) {
    $scope.show();
    var token = localStorage.getItem("token");
    var id = localStorage.getItem("id");
    ikmAuth.getEmail(token,id).then(function(data){
        
            $scope.emails = data.email;
            $scope.total = data.total;
            //console.log($scope.products);
            $scope.hide();
        
    })
})
app.controller('EmailidCtrl', function($scope, $stateParams, ikmAuth, $stateParams) {
    $scope.show();
    var token = localStorage.getItem("token");
    var id = localStorage.getItem("id");
    ikmAuth.getEmailId(token,id,$stateParams.emailId).then(function(data){
        
            $scope.email = data.email;
            //localStorage.setItem("email",data.total)
            //$scope.total = data.total;
            //console.log($scope.products);
            $scope.hide();
        
    })
})
app.controller('AboutCtrl', function($scope, $stateParams, wooshopService, $stateParams,$sce) {
    $scope.show();
    $scope.trustSrc = function(src) {
    return $sce.trustAsHtml(src);
  }
    wooshopService.getAbout().then(function(data){
       
            $scope.link = data.body;

            //console.log($scope.link);
            $scope.hide();
        
    })
})
app.controller('TambahCtrl', function($scope, $stateParams, ikmAuth, $stateParams, wooshopService,$cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {
  var token=localStorage.getItem("token");
  $scope.produk={};
   wooshopService.getKategori().then(function(data) {
  
      $scope.kategoris = data.tree;
   
        $scope.hide();
    })
//simpan produk
var data = {};
    $scope.produk = {id: ''};
   $scope.simpanProduk = function(){
    $scope.buka();
    var kategori ="Produk IKM - "+$scope.produk.kategori;
    data = {
      'id' : $scope.produk.id,
      'kategori' : kategori,
      'nama' : $scope.produk.nama,
      'keyword' : $scope.produk.keyword,
      'deskripsi' : $scope.produk.deskripsi,
      'status' : $scope.produk.status,
      'gambar' : $scope.produk.file
    };
    console.log(data);
 ikmAuth.prosesProduk(token,$scope.produk.id,kategori,$scope.produk.nama,$scope.produk.keyword,$scope.produk.status,$scope.produk.deskripsi).then(function(data){
        
            $scope.pesan = data.message;
            //localStorage.setItem("email",data.total)
            //$scope.total = data.total;
            //console.log($scope.products);
            $scope.property_id=data.property_id;
            var url = "http://nvmplay.com/ikm/index.php/tokenapi/submission/?token="+token+'&lang_code=en&input_title='+$scope.produk.nama+'&keyword='+$scope.produk.keyword+'&kategori='+kategori+'&input_description='+$scope.produk.deskripsi+'&input_38='+$scope.produk.status+'&property_id='+$scope.property_id;

    // File for Upload
    var targetPath = $scope.pathForImage($scope.image);

    // File name only
    var filename = $scope.image;
if (filename !=''){
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
     $scope.sukses($scope.pesan);// $scope.showAlert('Success', 'Image upload finished.');
    });
            $scope.produk={};
            $scope.image = null;
            $scope.tutup();
          }else{
            $scope.sukses($scope.pesan);
            $scope.tutup();
          }
        
    })
   };
   $scope.image = null;

  // Present Actionsheet for switch beteen Camera / Library
  $scope.loadImage = function() {
    var options = {
      title: 'Select Image Source',
      buttonLabels: ['Load from Library', 'Use Camera'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
    };
    $cordovaActionSheet.show(options).then(function(btnIndex) {
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type);
      }
    });
  };

  // Take image with the camera or from library and store it inside the app folder
  // Image will not be saved to users Library.
  $scope.selectPicture = function(sourceType) {
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imagePath) {
      // Grab the file name of the photo in the temporary directory
      var currentName = imagePath.replace(/^.*[\\\/]/, '');

      //Create a new name for the photo
      var d = new Date();
      n = d.getTime();
      newFileName =  n + ".jpg";

      // If you are trying to load image from the gallery on Android we need special treatment!
      if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        window.FilePath.resolveNativePath(imagePath, function(entry) {
          window.resolveLocalFileSystemURL(entry, success, fail);
          function fail(e) {
            $scope.showAlert('Error', e);
          }

          function success(fileEntry) {
            var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
            // Only copy because of access rights
            $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          };
        }
      );
      } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
          $scope.image = newFileName;
        }, function(error){
          $scope.showAlert('Error', error.exception);
        });
      }
    },
    function(err){
      // Not always an error, maybe cancel was pressed...
    })
  };

  // Returns the local path inside the app for an image
  $scope.pathForImage = function(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  };

  $scope.uploadImage = function() {
    // Destination URL
    // var url = "http://localhost:8888/upload.php";
    var url = "https://devdactic.com/downloads/upload.php";

    // File for Upload
    var targetPath = $scope.pathForImage($scope.image);

    // File name only
    var filename = $scope.image;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
      $scope.showAlert('Success', 'Image upload finished.');
    });
  }

  $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };
  
})
app.controller('ProdukIkmCtrl', function($state,$rootScope, $scope, ikmAuth,$timeout,ionicSuperPopup, $stateParams) {

   $scope.toggle = function() {
    $scope.variable = !$scope.variable
    console.log($scope.variable);
};
    $scope.show();

    ikmAuth.getItems().then(function(data) {
        $scope.productsList= function() {
      $scope.products = data;
       $scope.batas=5;
    }
     $scope.productsList();
        $scope.hide();
    })
 $scope.doInfinite = function() {
        //$state.go($state.current, {}, {reload: true});
        //console.log('Refreshing!');
        $scope.show();
   /* wooshopService.getItems().then(function(data) {
        $scope.productsList= function() {
      $scope.products = data;
    }
     $scope.productsList();
       // 
    })*/
    $scope.batas += 5;
$scope.hide();
        $timeout( function() {
$scope.$broadcast('scroll.infiniteScrollComplete');
          }, 2000);
        $scope.$on('$stateChangeSuccess', function() {
    $scope.doInfinite();
  });
        
    };

$scope.hapus = function(id, produk){
    ionicSuperPopup.show({
     title: "Hapus Produk",
     text: "Apakah anda yakin ingin Menghapus Produk "+produk+"?",
     type: "warning",
     showCancelButton: true,
     confirmButtonColor: "#DD6B55",
     confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
     closeOnConfirm: false},
  function(isConfirm){
     if (isConfirm) {
      ikmAuth.hapusProduk(id).then(function(data) {

     ionicSuperPopup.show("Berhasil!", data.message, "success");
     $state.go($state.current, $stateParams, {reload: true, inherit: false});
   });
     } else {
        ionicSuperPopup.show("Gagal!", "Anda Gagal Dihapus", "error");
     }
  });
    //$scope.buka();
  

     //$scope.tutup();
 };

    $scope.doRefresh = function() {
        //$state.go($state.current, {}, {reload: true});
        //console.log('Refreshing!');
        //$scope.show();
    ikmAuth.getItems().then(function(data) {
        $scope.productsList= function() {
      $scope.products = data;
      $scope.batas = 5;
    }
     $scope.productsList();
    // $scope.hide();
       // 
    })
    

        $timeout( function() {
$scope.$broadcast('scroll.refreshComplete');
          }, 1000);
        
    };
})

;
  
  


