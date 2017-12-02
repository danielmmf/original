if(!String.prototype.startsWith){
        String.prototype.startsWith = function (str) {
            return !this.indexOf(str);
        }
    }

    /*console.log("#gfp@123ABC-123".startsWith("#gfp")); // true

     var data = "#gfp@123ABC-123";
     var input = '#gfp';
     console.log(data.startsWith(input)); // true*/


    // Initialize the Firebase SDK
    var config = {
       apiKey: "AIzaSyDnsrFKJ00l3vye_AGwVt9womLPJGx51As",
    authDomain: "chatsocket-2626b.firebaseapp.com",
    databaseURL: "https://chatsocket-2626b.firebaseio.com",
    projectId: "chatsocket-2626b",
    storageBucket: "chatsocket-2626b.appspot.com",
    messagingSenderId: "1075121073644"
    };
    firebase.initializeApp(config);


   function testAPI() {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me?access_token='+localStorage.getItem("access_token"), function(response) {
        console.log('Successful login for: ' + response);
        console.log( response);

      });
    }

  function postAPI($scope) {
    FB.api('/me/feed?access_token='+localStorage.getItem("access_token")+"&fields=id,name,description,story,caption,link,object_id,message,comments,attachments{media}&    debug=all&limit=5", function(response) {
        //console.log('Meus posts: ' + response.data.length);
        //console.log('Meus posts: ' + response.data);
        $scope.array_imagens = [];
        var inxerto = "inicio";
        for (var i = 0; i < response.data.length; i++) {
          //if(response.data[i].message){
                    try{
            if(response.data[i].name.startsWith('PlayStation')){
              //console.log( response.data[i]);
              $scope.post_atual = response.data[i];

              $scope.array_imagens.push(response.data[i].attachments.data["0"].media.image.src);
              $.post('processa_imagem_time.php', {"imagem":response.data[i].attachments.data["0"].media.image.src,'object_id':response.data[i].object_id});
              FB.api(
                "/"+response.data[i].object_id+'?access_token='+localStorage.getItem("access_token")+"&fields=name,picture&limit=50",
                function (post) {
                  if (post && !post.error) {
                    /* handle the result */
                   // alert("buscou");
                   try{

                  if(post.name.startsWith('#gfp@player')){  
                  console.log(post);
                  $.post('processa_infos_time.php', {'object_id':post.id,
                  'user_id':$scope.usuario_logado.providerData[0].uid},
                  function(data, status){
                        alert("Data: " + data);


                        $scope.equipe.$add({
      
                      
                      criado : new Date().getTime()
                    });
                    }
                  );
                console.log($scope.post_atual);
                     console.log('post_atual');
                    // console.log(post_atual);
                   // console.log(post);
                   console.log(response.data[i]);
    
                      $scope.imagem = $scope.post_atual.attachments.data["0"].media.image.src;
  
                      $("#fb_img").prepend($("#fb_img").html()+'<img src="'+$scope.post_atual.attachments.data["0"].media.image.src+'">');
                    
                  }

                }catch(error){

                }

                }

                  
                }
            );
              /*FB.api('/'+response.data[i].message+'/attachments?access_token='+localStorage.getItem("access_token"),
                function (response) {
                  if (response && !response.error) {
                    console.log('Meu post: ' + response.data.length);
                  console.log( response);
                  }
                }
            );*/
            
          //  }
          }
          }catch(error){
                  //console.log(error);
                  }
        }
          inxerto += "final";
          console.log(inxerto);
          console.log($scope.array_imagens);
          console.log('https://graph.facebook.com/564585837240489/picture?access_token='+localStorage.getItem("access_token")+'&type=large />');
          console.log(getRealURL('https://graph.facebook.com/564585837240489/picture?access_token='+localStorage.getItem("access_token")+'&type=large'));
          $("#fb_img").append('<img src="https://graph.facebook.com/564585837240489/picture?access_token='+localStorage.getItem("access_token")+'&type=large />');
    });
  }


  var stats = ['controle_bola','cruzamento' , 'dribles' , 'finalização' , 'chute_longe' , 'lancamento','passe_curto', 'força_chute', 'dividida_em_pe' ];

  function getRealURL( smallURL){
        console.log("RealURL1:", smallURL);
     return smallURL;

  }
  //https://graph.facebook.com/564585837240489/picture?fields=picture.width(1000).height(1000)&access_token=EAACAMPVbUXEBAEakEZAeROt3ZAeRZCI5hZB0zntNtH7IcPujLPwa3VC4ZBHdHx3L3ZBilCtVu2M2ZCZBwfzSV0hEsqRFNbJV29s7TUgSf6v95L95sTT4skAMSIX53JZB5q0oO8pW6X9ssHjOGioI6GDsHtVrlFHCSLuTVmMHgN1ZAHUwZDZD

  //https://graph.facebook.com/564585837240489/picture?fields=picture.width(1920).height(1080)&access_token=EAACAMPVbUXEBAEakEZAeROt3ZAeRZCI5hZB0zntNtH7IcPujLPwa3VC4ZBHdHx3L3ZBilCtVu2M2ZCZBwfzSV0hEsqRFNbJV29s7TUgSf6v95L95sTT4skAMSIX53JZB5q0oO8pW6X9ssHjOGioI6GDsHtVrlFHCSLuTVmMHgN1ZAHUwZDZD


  //https://scontent.fgru5-1.fna.fbcdn.net/v/t31.0-8/22459457_564585837240489_2126560550543645776_o.jpg?oh=3c919711e7abfedf1038c61d0579b564&oe=5A7A8148&dl=1

  function getObject(obj) {
      var newObj = {};
      for (var key in obj) {
          if (key.indexOf('$') < 0 && obj.hasOwnProperty(key)) {
              newObj[key] = obj[key];
          };
      }
      return newObj;
  }


  var app = angular.module("gfpApp", ['ui.router',"firebase"]);


  app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('desafios', {
        url: '/desafios',
        templateUrl: 'views/desafios.html',
        controller: 'DesafiosCtrl'
      })
      .state('minha_pagina', {
        url: '/minha_pagina',
        templateUrl: 'views/minha_pagina.html',
        controller: 'MinhaPaginaCtrl'
      })
      .state('minhas_equipes', {
        url: '/minhas_equipes',
        templateUrl: 'views/equipes.html',
        controller: 'MinhasEquipesCtrl'
      })
      .state('equipes', {
        url: '/equipes',
        templateUrl: 'views/equipes.html',
        controller: 'EquipesCtrl'
      })
      .state('equipe', {
        url: '/equipe/:equipeId',
        templateUrl: 'views/equipe.html',
        controller: 'EquipeCtrl'
      })
      .state('jogadores', {
        url: '/jogadores',
        templateUrl: 'views/jogadores.html',
        controller: 'JogadoresCtrl'
      })
      .state('jogador', {
        url: '/jogador',
        templateUrl: 'views/jogador.html',
        controller: 'JogadorCtrl'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'contact.html',
        controller: 'ContactController'
      });

      // Utilizando o HTML5 History API
      $locationProvider.html5Mode(true);
  });

