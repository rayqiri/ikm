var app = angular.module('wooshop.services', [])

app.service('wooshopService', function($http, $q){

    var url = "http://nvmplay.com/ikm/index.php/api";
    
    var api = '4PcY4Dku0JA5Gd4aT9evfEPMnG9BGBPi';
    
    this.getIkm =  function() {
        var deferred = $q.defer();
        var data = [];

        // API request to Fetch all categories

        $http({
            method: 'GET',
            url: url+'/ikm/en'
        })

        .then(function(data){
            data = data.data.results;
            window.localStorage.setItem("ikkm", JSON.stringify(data));
            deferred.resolve(data);
        },
        function(data) {
            if(window.localStorage.getItem("ikm") !== undefined) {
                data = JSON.parse(window.localStorage.getItem("ikm"));
            }
            deferred.resolve(data);
        })
        
        return deferred.promise;
    }
    
    this.getItems =  function() {
    
        // API request to  Fetch all Products

        var deferred = $q.defer();
        var data = [];

        $http({
            method: 'GET',
            url: url+'/json/en/'
        })

        .then(function(data){
           
            data = data.data.results;
             
            window.localStorage.setItem("products", JSON.stringify(data));
            deferred.resolve(data);
        },
        function(data) {
            if(window.localStorage.getItem("products") !== undefined) {
                data = JSON.parse(window.localStorage.getItem("products"));
            }
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    
    // API request to  Fetch all Category Products
    
    this.getIkms =  function(ikmId) {

        var deferred = $q.defer();
        var data = [];

        $http({
            method: 'GET',
            url: url+ '/getikm/'+api+'/en/'+ikmId
        })

        .then(function(data){
            data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    
    // API request to  Fetch Single Product
    
    this.getItem =  function(productId) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
            url: url+'/product/en/'+productId
        })
        .then(function(data){
             data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    
    // API request to  Fetch Store Parameters
    
    this.getLiyo =  function(ikmId) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: url+ '/productliyo/'+api+'/en/'+ikmId
        })
        .then(function(data){
             data = data.data;
            
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.postEmail =  function(produk,nama,alamat,email,telp,pesan) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: url+ '/sendmail/'+api+'/en/?id='+produk+'&nama='+nama+'&alamat='+alamat+'&email='+email+'&telp='+telp+'&pesan='+pesan
        })
        .then(function(data){
             data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.getAbout =  function() {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: url+ '/getabout/'+api+'/en/'
        })
        .then(function(data){
            data = data.data.result;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.getKategori =  function() {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: url+'/json/en/?options_hide=false&search={"v_search_option_79":"Produk IKM"}'
        })
        .then(function(data){
            data = data.data.tree_79;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.getKategoris =  function(kategori) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: url+'/json/en/?options_hide=false&search={"v_search_option_79":"Produk IKM - '+kategori+'"}'
        })
        .then(function(data){
            data = data.data.results;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
})
app.service('ikmAuth', function($http, $q){

    var link = "http://nvmplay.com/ikm/index.php/tokenapi";
    var api = '4PcY4Dku0JkuretevfEPMnG9BGBPi';

this.doLogin =  function(username,password) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: link+'/authenticate/?username='+username+'&password='+password+'&key='+api
        })
        .then(function(data){
            data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.getEmail =  function(token,id) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: link+'/email/?token='+token+'&id='+id
        })
        .then(function(data){
            data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.getEmailId =  function(token,id,emailId) {
        var deferred = $q.defer();
        var data = [];
        
        $http({
            method: 'GET',
           url: link+'/emailid/?token='+token+'&id='+id+'&email='+emailId
        })
        .then(function(data){
            data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.userIsLoggedIn =  function() {
        var deferred = $q.defer();
        var data = [];
        var token = localStorage.getItem("token");
        
        $http({
            method: 'GET',
           url: link+'/user/?token='+token
        })
        .then(function(data){
            data = data.data.token_available;
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.prosesProduk =  function(token,id,kategori,nama,keyword,status,deskripsi) {
        var deferred = $q.defer();
        var data = [];
        //var token = JSON.parse(window.localStorage.token || null);
        if(id=="")
        {
        $http({
            method: 'GET',
           url: link+'/submission/?token='+token+'&lang_code=en&input_title='+nama+'&keyword='+keyword+'&kategori='+kategori+'&input_description='+deskripsi+'&input_38='+status
        })
        .then(function(data){
            data = data.data;
            deferred.resolve(data);
        })
    }else{
        $http({
            method: 'GET',
           url: link+'/submission/?token='+token+'&lang_code=en&input_title='+nama+'&keyword='+keyword+'&kategori='+kategori+'&input_description='+deskripsi+'&input_38='+status+'&property_id='+id
        })
        .then(function(data){
            data = data.data;
            deferred.resolve(data);
        })
    }

        return deferred.promise;
    }
    this.getItems =  function() {
    
        // API request to  Fetch all Products
        var token = localStorage.getItem("token");

        var deferred = $q.defer();
        var data = [];

        $http({
            method: 'GET',
            url: link+'/listings/?token='+token+'&lang_code=en'
        })

        .then(function(data){
           
            data = data.data.results;
             
            window.localStorage.setItem("products", JSON.stringify(data));
            deferred.resolve(data);
        },
        function(data) {
            if(window.localStorage.getItem("products") !== undefined) {
                data = JSON.parse(window.localStorage.getItem("products"));
            }
            deferred.resolve(data);
        })

        return deferred.promise;
    }
    this.hapusProduk =  function(produkId) {
    
        // API request to  Fetch all Products
        var token = localStorage.getItem("token");

        var deferred = $q.defer();
        var data = [];

        $http({
            method: 'GET',
            url: link+'/listings//DELETE/?token='+token+'&property_id='+produkId
        })

        .then(function(data){
           
            data = data.data;
            deferred.resolve(data);
        })

        return deferred.promise;
    }

    })

