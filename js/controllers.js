  

  app.controller("MainCtrl", function($scope , $firebaseAuth ,$firebaseArray ,$firebaseObject, $state) {
    $scope.logado = false;
    $scope.logado = localStorage.getItem("logado");
    if($scope.logado){
      $scope.usuario = localStorage.getItem("usuario");
      $scope.access_token = localStorage.getItem("access_token");
      $scope.usuario_logado = JSON.parse($scope.usuario);
      $scope.usuario_uid = $scope.usuario_logado.providerData[0].uid;
      $scope.foto_logado = localStorage.getItem("foto");
      $scope.nome_logado = $scope.usuario_logado.displayName;
    }

    $scope.jogador_stats = ['Partidas Disputadas', 'Gols' , 'Assistencias' ,'', 'Tentativas de Passe' , 'Melhor em Campo', 'Classificação Media'];

    var url = "equipes";
    console.log(url);
    //alert(url);
    $scope.equipes_sistema = $firebaseArray(firebase.database().ref(url));

      $scope.minhas_equipes = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_uid+"/equipes"));
      $scope.minhas_equipes.$loaded(function() {
        console.log($scope.minhas_equipes);
        console.log($scope.minhas_equipes[0]);
        if($scope.minhas_equipes[0] != ""){
          console.log($scope.minha_equipe_sistema);
          try{
            $scope.minha_equipe_sistema = $firebaseObject(firebase.database().ref("equipes/"+$scope.minhas_equipes[0].equipe_key));
          }catch(error){
            console.log("Acho que nao temos equipe nesse estagio");
          }
        }

      });

      $scope.stats = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_uid+"/stats"));
      $scope.stats.$loaded(function() {
        console.log($scope.stats);
       // alert($scope.stats.length);
      });


      $scope.jogadores = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_uid+"/jogadores"));
      $scope.jogadores.$loaded(function() {
        console.log($scope.jogadores);
       // alert($scope.stats.length);
      });



    $scope.logoff = function(){
      localStorage.setItem("logado",false);
      localStorage.setItem("usuario" ,{});
      localStorage.setItem("foto", "");
      localStorage.clear();
      $scope.logado = false;
      $scope.foto_logado = '';
      $scope.nome_logado = "visitante";
      var auth = $firebaseAuth();
      auth.$signOut();
      $state.go("/");
    }

    $scope.login = function(){
      var auth = $firebaseAuth();
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("public_profile");
      //provider.addScope("age_range");
      provider.addScope("user_location");
      provider.addScope('user_photos');
      provider.addScope('user_friends');
      provider.addScope('user_posts');
      provider.addScope('publish_actions');
      auth.$signInWithPopup(provider).then(function(firebaseUser) {
        $scope.usuario_logado = firebaseUser.user;
        console.log("Logado como :", firebaseUser.user.displayName);
        console.log(firebaseUser);
        localStorage.setItem("usuario" , JSON.stringify(firebaseUser.user));
        localStorage.setItem("foto" , firebaseUser.user.photoURL);
        localStorage.setItem("access_token" , firebaseUser.credential.accessToken);
        $scope.foto_logado = firebaseUser.user.photoURL;
        $scope.nome_logado = firebaseUser.user.displayName;
        localStorage.setItem("logado" , true);
        $scope.logado = true;
        console.log($scope.usuario_logado);
        var meu_profile = firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid);
       var profile = $firebaseArray(meu_profile);

              $scope.profile = profile;

              $scope.profile.$loaded(function() {
                if($scope.profile.length == 0){
                    $scope.profile.$add({
                      nome : firebaseUser.user.displayName,
                      firebase_uid:firebaseUser.user.uid,
                      fb_uid:$scope.usuario_logado.providerData[0].uid,
                      equipe:{},
                      manager:0,
                      criado : new Date().getTime()
                    });
                }else{
                  alert("Bem vindo de Volta !");
                }
                 
              });

      }).catch(function(error) {
        console.log("Authentication failed:", error);
      });

    }


  });

  app.controller("MinhaPaginaCtrl", function($scope,$firebaseArray, $firebaseObject,$http) {


    $scope.avatar = 'avatar_'+$scope.usuario_logado.providerData[0].uid+'.jpg';
    $scope.brasao = 'brasao_'+$scope.usuario_logado.providerData[0].uid+'.jpg';



    $scope.get_infos = function(){
      alert("vai");

        FB.api('/me/feed?access_token='+localStorage.getItem("access_token")+"&fields=id,name,description,story,caption,link,object_id,message,comments,attachments{media}&limit=50&width=1000&height=1000", function(response) {
        console.log('Meus posts: ' + response.data.length);
        console.log('Meus posts: ' + response.data);
        $scope.array_imagens = [];
        var inxerto = "inicio";
        for (var i = 0; i < response.data.length; i++) {
          //if(response.data[i].message){
            try{
            if(response.data[i].name.startsWith('PlayStation')){
              //console.log( response.data[i]);
              $scope.post_atual = response.data[i];
              console.log($scope.post_atual.story);
                  var story = $scope.post_atual.story;
                  story = story.split("added");
                  console.log(story);
                  //alert("Nome do PSN é "+story[0]);
                  $scope.nome_psn = story[0];

            //  $scope.array_imagens.push(response.data[i].attachments.data["0"].media.image.src);
              $.post('processa_imagem_time.php', {"imagem":response.data[i].attachments.data["0"].media.image.src,'object_id':response.data[i].object_id});
              FB.api(
                "/"+response.data[i].object_id+'?access_token='+localStorage.getItem("access_token")+"&fields=name,picture&limit=50",
                function (post) {
                  if (post && !post.error) {
                    /* handle the result */
                    console.log(post);
                   try{

                  if(post.name.startsWith('#gfp@')){ 
                 //   alert("buscou");
                  console.log(post);

                  $.post('processa_infos_time.php', {'object_id':post.id,
                  'user_id':$scope.usuario_logado.providerData[0].uid},
                  function(data, status){
                        console.log(data);
                        console.log(data);



                       // $scope.minhas_equipes = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/equipes"));
                       

                      // alert($scope.minhas_equipes[0].$id);
                       
                       if($scope.minhas_equipes.length == 0){
                          $scope.equipes = $firebaseArray(firebase.database().ref().child("equipes"));

                          var nova_equipe = {
                            nome : data[2].nome.nome["0"],
                            criador_uid:$scope.usuario_logado.providerData[0].uid,
                            criador_nome:$scope.nome_logado,
                            manager_uid:$scope.usuario_logado.providerData[0].uid,
                            manager_nome:$scope.nome_logado,
                            criado : new Date().getTime()
                          };

                          $scope.equipes.$add(nova_equipe).then(function(essa_equipe) {
                            nova_equipe.equipe_key = essa_equipe.key;
                           
                          $scope.minhas_equipes.$add(nova_equipe).then(function(ref) {
                            console.log("added record with id " + ref.key);
                            console.log(ref);
                            console.log(nova_equipe.equipe_key);
     

                           if($scope.jogadores.length == 0){
                            $scope.jogadores.$add({
                                  nome : $scope.nome_psn,
                                  criador_uid:$scope.usuario_logado.providerData[0].uid,
                                  equipe_nome:data[2].nome.nome["0"],
                                  criador_nome:$scope.nome_logado,
                                  criado : new Date().getTime()
                              });
                            $scope.jogador = $firebaseArray(firebase.database().ref().child("jogadores"));
                            $scope.jogador.$add({
                              nome : $scope.nome_psn,
                              criador_uid:$scope.usuario_logado.providerData[0].uid,
                              equipe_nome:data[2].nome.nome["0"],
                              criador_nome:$scope.nome_logado,
                              criado : new Date().getTime()
                            });

                            $scope.jogador_equipe = $firebaseArray(firebase.database().ref().child("equipes/"+nova_equipe.equipe_key+"/jogadores"));
                            $scope.jogador_equipe.$add({
                              nome : $scope.nome_psn,
                              criador_uid:$scope.usuario_logado.providerData[0].uid,
                              equipe_nome:data[2].nome.nome["0"],
                              criador_nome:$scope.nome_logado,
                              criado : new Date().getTime()
                            });

                          }
                          //ps -o pid= -u username | xargs sudo kill -9.


                        });
                        });

                        }else{

                            alert("ja tem time apague");




                        }
                       
                      //  $scope.minhas_stats = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/stats"));
                     // if($scope.stats.length == 0){
                          $scope.stats.$add({
                            points : data[0].stats.stats,
                            criador_uid:$scope.usuario_logado.providerData[0].uid,
                            criador_nome:$scope.nome_logado,
                            criado : new Date().getTime()
                          });
                     // }


                     

                         
                      /*   $scope.minhas_equipes.$add({"jogador":{
                              nome : $scope.nome_psn,
                              criador_uid:$scope.usuario_logado.providerData[0].uid,
                              equipe_nome:data[2].nome.nome["0"],
                              criador_nome:$scope.nome_logado,
                              criado : new Date().getTime()
                          }});*/

                        $scope.avatar = 'avatar_'+$scope.usuario_logado.providerData[0].uid+'.jpg';
                        $scope.brasao = 'brasao_'+$scope.usuario_logado.providerData[0].uid+'.jpg';



                    }
                  );
          /*      console.log($scope.post_atual);
                     console.log('post_atual');
                    // console.log(post_atual);
                   // console.log(post);
                   console.log(response.data[i]);
    
                    $scope.imagem = $scope.post_atual.attachments.data["0"].media.image.src;

                    $("#fb_img").prepend($("#fb_img").html()+'<img src="'+$scope.post_atual.attachments.data["0"].media.image.src+'">');*/
                    
                  }

                }catch(error){
                  console.log(error);
                }

                }
                }
            );
          }
          }catch(error){
                console.log(error);
          }
        }
          inxerto += "final";
          console.log(inxerto);
          console.log($scope.array_imagens);
          console.log('https://graph.facebook.com/564585837240489/picture?access_token='+localStorage.getItem("access_token")+'&type=normal />');
          console.log(getRealURL('https://graph.facebook.com/564585837240489/picture?access_token='+localStorage.getItem("access_token")+'&type=normal'));
          $("#fb_img").append('<img src="https://graph.facebook.com/564585837240489/picture?access_token='+localStorage.getItem("access_token")+'&type=normal />');
    });
    }


     $scope.get_infos_sem_time = function(){

        $.post('processa_infos_time_fake.php', {'object_id':00,
                  'user_id':$scope.usuario_logado.providerData[0].uid},
                  function(data, status){
                        console.log(data);
                        console.log(data);
                       
                       if($scope.minhas_equipes.length == 0){
                          $scope.equipes = $firebaseArray(firebase.database().ref().child("equipes"));

                          var nova_equipe = {
                            nome : data[2].nome.nome["0"],
                            criador_uid:$scope.usuario_logado.providerData[0].uid,
                            criador_nome:$scope.nome_logado,
                            manager_uid:$scope.usuario_logado.providerData[0].uid,
                            manager_nome:$scope.nome_logado,
                            criado : new Date().getTime()
                          };

                          $scope.equipes.$add(nova_equipe).then(function(essa_equipe) {
                            nova_equipe.equipe_key = essa_equipe.key;
                           
                            $scope.minhas_equipes.$add(nova_equipe).then(function(ref) { 
                              console.log("added record with id " + ref.key);
                              console.log(ref);
                              console.log(nova_equipe.equipe_key);
       

                               if($scope.jogadores.length == 0){
                                  $scope.jogadores.$add({
                                        nome : $scope.nome_psn,
                                        criador_uid:$scope.usuario_logado.providerData[0].uid,
                                        equipe_nome:data[2].nome.nome["0"],
                                        criador_nome:$scope.nome_logado,
                                        criado : new Date().getTime()
                                  });
                                  $scope.jogador = $firebaseArray(firebase.database().ref().child("jogadores"));
                                  $scope.jogador.$add({
                                    nome : $scope.nome_psn,
                                    criador_uid:$scope.usuario_logado.providerData[0].uid,
                                    equipe_nome:data[2].nome.nome["0"],
                                    criador_nome:$scope.nome_logado,
                                    criado : new Date().getTime()
                                  });

                                  $scope.jogador_equipe = $firebaseArray(firebase.database().ref().child("equipes/"+nova_equipe.equipe_key+"/jogadores"));
                                  $scope.jogador_equipe.$add({
                                    nome : $scope.nome_psn,
                                    criador_uid:$scope.usuario_logado.providerData[0].uid,
                                    equipe_nome:data[2].nome.nome["0"],
                                    criador_nome:$scope.nome_logado,
                                    criado : new Date().getTime()
                                  });
                              }
                            //ps -o pid= -u username | xargs sudo kill -9.
                          });
                        });

                    }else{
                      alert("ja tem time apague");
                    }
                       
                      //  $scope.minhas_stats = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/stats"));
                     // if($scope.stats.length == 0){
                      $scope.stats.$add({
                        points : data[0].stats.stats,
                        criador_uid:$scope.usuario_logado.providerData[0].uid,
                        criador_nome:$scope.nome_logado,
                        criado : new Date().getTime()
                      });
                     // }

                        $scope.avatar = 'avatar_'+$scope.usuario_logado.providerData[0].uid+'.jpg';
                        $scope.brasao = 'brasao_'+$scope.usuario_logado.providerData[0].uid+'.jpg';
                })

            };
 
 });
  app.controller("DesafiosCtrl", function($scope , $firebaseAuth,$firebaseArray) {

    alert("desafios");
    var url = "desafios";
    console.log(url);
    $scope.desafios = $firebaseArray(firebase.database().ref(url));

  });

  app.controller("JogadorCtrl", function($scope , $firebaseAuth,$firebaseArray, $firebaseObject,$http) {



  function buscaJogador($scope , $http) {

  // Note: The call will only work if you accept the permission request

  FB.api('/me/feed?access_token='+localStorage.getItem("access_token")+"&fields=id,object_id,message,link,full_picture,attachments{media}&limit=50", function(response) {
      console.log('Meus posts: ' + response.data.length);



      var inxerto = "";
      for (var i = 0; i < response.data.length; i++) {
            console.log( response.data[i]);
        if(response.data[i].message){
          if(response.data[i].message.startsWith('#gfp@psn:')){
            FB.api(
              "/"+response.data[i].id+"/attachments?access_token="+localStorage.getItem("access_token")+"&fields=size{large}",
              function (response) {
                if (response && !response.error) {
                  /* handle the result */
                  console.log("aqui");
                  console.log(response);
                }
              }
          );

          inxerto+='<img src="'+response.data[i].attachments.data["0"].media.image.src+'">';


          $http.post('processa_jogador.php', {'imagem':response.data[i].attachments.data["0"].media.image.src , 'nome_jogador':"pafuncio"}).then(function(ref) {

            var psn_user = "zezinhosp";
            var posicao = "ataque";
            //alert(ref);
            console.log(ref);
            var dados_jogador = '{';
            for (var i = 0; i < stats.length; i++) {
              dados_jogador +='"'+ stats[i]+'":';
              dados_jogador +='"'+ ref.data.dados[i]+'",';
            }
            dados_jogador = dados_jogador.substring(0, dados_jogador.length - 1);
            dados_jogador +='}';

            var json_stats = JSON.parse(dados_jogador);

            var ref_jogadores = firebase.database().ref("profile/"+$scope.usuario_logado.providerData[0].uid+"/jogadores/"+psn_user+"/"+posicao+"/");
              var jogadores = $firebaseArray(ref_jogadores);
              $scope.jogadores = jogadores;
              $scope.jogadores.$add({
                descricao: 'frdiashoduhduasd2',
                nome :  'pafuncio2',
                equipe_id :  '0',
                stats: json_stats ,
                criado : new Date().getTime()
              }).then(function(ref) {
                console.log("added record with id " + ref.key);
                $("#fb_img").html('Jogador inserido com sucesso');
            });

          });
          }
        }
        $("#fb_img").html(inxerto);
      }

  });
  }

  $scope.adicionar_jogador = function() {
      //alert("jogador");
      buscaJogador($scope , $http);
    };


    var ref_meus_jogadores = firebase.database().ref("profile/"+$scope.usuario_logado.providerData[0].uid+"/jogadores");
    var meus_jogadores = $firebaseArray(ref_meus_jogadores);
    $scope.meus_jogadores = meus_jogadores;


  });

  app.controller("MinhasEquipesCtrl",function($scope,$firebaseArray) {
    $scope.logado = localStorage.getItem("logado");
    $scope.pagina_minhas_equipes = true;
    if($scope.logado){
      $scope.usuario = localStorage.getItem("usuario");
      $scope.usuario_logado = JSON.parse($scope.usuario);
      console.log($scope.usuario_logado);
      $scope.foto_logado = localStorage.getItem("foto");
      $scope.nome_logado = $scope.usuario_logado.displayName;
    }
    testAPI();
    $scope.get_infos = function(){

      postAPI($scope);
    }

   /* var ref = firebase.database().ref().child("profile/equipes/"+$scope.usuario_logado.providerData[0].uid);
    // create a synchronized array
    $scope.equipes = $firebaseArray(ref);

    console.log($scope.equipes.length);
    console.log($scope.equipes);*/
     var ref_equipe = firebase.database().ref().child("equipes");
       var equipe = $firebaseArray(ref_equipe);
         

            $scope.equipe = equipe;


     var ref_minhas_equipes = firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/equipes");
     var minhas_equipes = $firebaseArray(ref_minhas_equipes);
            $scope.equipes = minhas_equipes;


    $scope.addMessage = function() {
      $scope.equipe.$add({
        descricao: $scope.descricao,
        nome : $scope.nome,
        criador_uid:$scope.usuario_logado.providerData[0].uid,
        criador_nome:$scope.nome_logado,
        manager_uid:$scope.usuario_logado.providerData[0].uid,
        manager_nome:$scope.nome_logado,
        criado : new Date().getTime()
      }).then(function(ref) {
        console.log("added record with id " + ref.key);
        $scope.equipes.$add({
          descricao: $scope.descricao,
          nome : $scope.nome,
          criador_uid:$scope.usuario_logado.providerData[0].uid,
          criador_nome:$scope.nome_logado,
          manager_uid:$scope.usuario_logado.providerData[0].uid,
          manager_nome:$scope.nome_logado,
          equipe_key:ref.key,
          criado : new Date().getTime()
        });
    });

      $scope.tem_equipes++;
    };
  });

app.controller("EquipeCtrl",function($scope,$firebaseArray, $firebaseObject, $stateParams) {
    $scope.logado = localStorage.getItem("logado");
    console.log("profile/"+$scope.usuario_logado.providerData[0].uid+"/equipes");

            $scope.minhas_equipes = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/equipes"));
    ///alert($stateParams.equipeId);
    if($scope.logado){
      $scope.usuario = localStorage.getItem("usuario");
      $scope.usuario_logado = JSON.parse($scope.usuario);
      console.log($scope.usuario_logado);
      $scope.foto_logado = localStorage.getItem("foto");
      $scope.nome_logado = $scope.usuario_logado.displayName;
    }

    $scope.get_infos = function(){

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
                        console.log(data);
                        console.log(data);



                        $scope.minhas_equipes = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/equipes"));
                        $scope.equipes = $firebaseArray(firebase.database().ref().child("equipes"));
                        $scope.minhas_stats = $firebaseArray(firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/stats"));
                        var nova_equipe = {
                      nome : data[2].nome.nome["0"],
                      criador_uid:$scope.usuario_logado.providerData[0].uid,
                          criador_nome:$scope.nome_logado,
                          manager_uid:$scope.usuario_logado.providerData[0].uid,
                          manager_nome:$scope.nome_logado,
                      criado : new Date().getTime()
                    };

                        $scope.minhas_equipes.$add(nova_equipe);
                        $scope.equipes.$add(nova_equipe);
                        $scope.minhas_stats.$add({
                      points : data[0].stats.stats,
                      criador_uid:$scope.usuario_logado.providerData[0].uid,
                        criador_nome:$scope.nome_logado,
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


      var ref_equipe = firebase.database().ref("equipes/"+$stateParams.equipeId);
        var equipe = $firebaseObject(ref_equipe);
   
        $scope.equipe = equipe;

        $scope.equipe.$loaded(function() {
          reload_tabs();
            console.log($scope.equipe.length);
            $scope.tem_equipes = $scope.equipe.length;
            var equipes = [];
            $scope.equipes = [];
            for (var i = 0; i < $scope.equipe.length; i++) {
              console.log($scope.equipe[i]);

           
            }
            $scope.equipes = equipes ;

          var ref_solicitacoes = firebase.database().ref().child("solicitacoes/"+$scope.equipe.manager_uid);
          var solicitacoes = $firebaseArray(ref_solicitacoes);
     
          $scope.solicitacoes = solicitacoes;

          var ref_solicitacoes_equipe = firebase.database().ref("equipes/"+$stateParams.equipeId+"/solicitacoes");
          var solicitacoes_equipe = $firebaseArray(ref_solicitacoes_equipe);
     
          $scope.solicitacoes_equipe = solicitacoes_equipe;

           var ref_solicitacoes_jogador = firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/solicitacoes");
          var solicitacoes_jogador = $firebaseArray(ref_solicitacoes_jogador);
     
          $scope.solicitacoes_jogador = solicitacoes_jogador;

          console.log($scope.solicitacoes);

        });

    $scope.addMessage = function() {
      $scope.equipe.$add({
        descricao: $scope.descricao,
        nome : $scope.nome,
        criador_uid:$scope.usuario_logado.providerData[0].uid,
        manager_uid:$scope.usuario_logado.providerData[0].uid,
        criado : new Date().getTime()
      });
      $scope.tem_equipes++;
    };


    $scope.solicitacao = function() {
      try {
        console.log($scope.equipe.$id);
        return $scope.solicitacoes_jogador.$add({ 
          nome : $scope.equipe.nome,  
          status : 0 ,
          criado:new Date().getTime()
          }).then(function(solicitacao_jogador) {
            console.log("Solicitacao geral adicionada" + solicitacao_jogador.key);
            $scope.solicitacoes_equipe.$add({ 
              nome : $scope.nome_logado,  
              solicitacao_jogador_key : solicitacao_jogador.key,
              status : 0 ,
              solicitante_uid:$scope.usuario_logado.providerData[0].uid,
              criado:new Date().getTime()
            }).then(function(solicitacao_equipe) {
              console.log("Solicitacao de equipe " + solicitacao_equipe.key);
              console.log(solicitacao_equipe);
              $scope.solicitacoes.$add({  
                nome : $scope.nome_logado,  
                solicitante_uid:$scope.usuario_logado.providerData[0].uid,
                status : 0 ,
                solicitacao_equipe_key : solicitacao_equipe.key,
             equipe_key : $scope.equipe.$id,
                criado:new Date().getTime()
              });
        });
      });
        alert("Solicitacao enviada , o manager vai receber a sua solicitacao");
    }
    catch(err) {
       alert("Não foi possivel solicitar no momento , tente novamente mais tarde "+err.message);
    }
    };



  $scope.aceitar = function(solicitacao){
    var url = "solicitacoes/"+$scope.equipe.manager_uid+"/"+solicitacao.$id;
      $scope.solicitacao = $firebaseObject(firebase.database().ref(url));
      $scope.solicitacao.$loaded(function() {
      console.log($scope.solicitacao);
      var url = "equipes/"+$scope.solicitacao.equipe_key+"/solicitacoes/"+$scope.solicitacao.solicitacao_equipe_key;
          $scope.solicitacao_equipe = $firebaseObject(firebase.database().ref(url));
          $scope.solicitacao_equipe.$loaded(function() {

        console.log($scope.solicitacao_equipe);
        $scope.solicitacao_equipe.status = 1;

        var url = "profile/"+$scope.solicitacao_equipe.solicitante_uid+"/solicitacoes/"+$scope.solicitacao_equipe.solicitacao_jogador_key;
          $scope.solicitacao_jogador = $firebaseObject(firebase.database().ref(url));
          $scope.solicitacao_jogador.$loaded(function() {
            console.log($scope.solicitacao_jogador);

          var url = "equipes/"+$scope.solicitacao.equipe_key+"/jogadores";
          console.log(url);
          $scope.novo_jogador = $firebaseArray(firebase.database().ref(url));

          var url = "profile/"+$scope.solicitacao_equipe.solicitante_uid;
          console.log(url);
          $scope.jogador_aceito = $firebaseObject(firebase.database().ref(url));
            $scope.jogador_aceito.$loaded(function() {

              $scope.jogador_salvar = getObject($scope.jogador_aceito);

              $scope.jogador_salvar['criado'] = null;
              $scope.jogador_salvar['jogadores'] = null;
              $scope.jogador_salvar['equipes'] = null;
              $scope.jogador_salvar['solicitacoes'] = null;

              $scope.novo_jogador.$add($scope.jogador_salvar).then(function(novo_jogador) {
                alert("adicionou");
                $scope.solicitacao_jogador['status'] = 1;
                $scope.solicitacao_jogador.$save().then(function(success) {
                  $scope.solicitacao_equipe['status'] = 1;
                  $scope.solicitacao_equipe.$save().then(function(success) {
                  //  alert("salvou");
                  $scope.solicitacao.$remove();
                  }, function(error) {
                    console.log("there was an error! " + error);
                  });
                }, function(error) {
                  console.log("there was an error! " + error);
                });

              });

            });

          });
      });
    });
  };//termina aceitar



  $scope.recusar = function(solicitacao){
    var url = "solicitacoes/"+$scope.equipe.manager_uid+"/"+solicitacao.$id;
      $scope.solicitacao = $firebaseObject(firebase.database().ref(url));
      $scope.solicitacao.$loaded(function() {
      console.log($scope.solicitacao);
      var url = "equipes/"+$scope.solicitacao.equipe_key+"/solicitacoes/"+$scope.solicitacao.solicitacao_equipe_key;
          $scope.solicitacao_equipe = $firebaseObject(firebase.database().ref(url));
          $scope.solicitacao_equipe.$loaded(function() {

          console.log($scope.solicitacao_equipe);
          $scope.solicitacao_equipe.status = 1;

          var url = "profile/"+$scope.solicitacao_equipe.solicitante_uid+"/solicitacoes/"+$scope.solicitacao_equipe.solicitacao_jogador_key;
            $scope.solicitacao_jogador = $firebaseObject(firebase.database().ref(url));
            $scope.solicitacao_jogador.$loaded(function() {
              console.log($scope.solicitacao_jogador);

              alert("recusar");
              $scope.solicitacao_jogador['status'] = 3;
            $scope.solicitacao_jogador.$save().then(function(success) {
              $scope.solicitacao_equipe['status'] = 3;
              $scope.solicitacao_equipe.$save().then(function(success) {
                $scope.solicitacao.$remove();
                  }, function(error) {
                      console.log("there was an error! " + error);
                  });
                }, function(error) {
                    console.log("there was an error! " + error);
                });

            });

          });

        
      });
  
  };//termina recusar


  $scope.jogar = function(){
    
    var url = "desafios/"+$scope.equipe.$id;
      $scope.desafio = $firebaseArray(firebase.database().ref(url));

      $scope.desafio.$add({
        descricao: 'desafio',
        nome : $scope.equipe.nome,
        $id : $scope.equipe.$id,
        criador_uid:$scope.usuario_logado.providerData[0].uid,
        desafiador_uid:$scope.usuario_logado.providerData[0].uid,
        valor:200,
        criado : new Date().getTime()
      }).then(function(desafio) {
                alert("Vai colocar o time na fila de jogos em aberto pro mesmo nivel");
                console.log(desafio);
      });

  };

  $scope.campanha = function(){
    alert("Você não tem coins suficiente para iniciar uma campanha, campanha aumenta o valor das suas partidas e traz melhores jogadores ao seu time !!!");
  };


});

  app.controller("EquipesCtrl",function($scope,$firebaseArray) {
    $scope.logado = localStorage.getItem("logado");
    if($scope.logado){
      $scope.usuario = localStorage.getItem("usuario");
      $scope.usuario_logado = JSON.parse($scope.usuario);
      console.log($scope.usuario_logado);
      $scope.foto_logado = localStorage.getItem("foto");
      $scope.nome_logado = $scope.usuario_logado.displayName;
    }
    testAPI();
    $scope.get_infos = function(){
      postAPI($scope);
    }

    var ref_equipe = firebase.database().ref().child("equipes");
    var equipe = $firebaseArray(ref_equipe);

    $scope.equipe = equipe;

    $scope.equipe.$loaded(function() {
      console.log($scope.equipe.length);
      $scope.tem_equipes = $scope.equipe.length;
      var equipes = [];
      $scope.equipes = [];
      for (var i = 0; i < $scope.equipe.length; i++) {
        console.log($scope.equipe[i]);
        equipes.push($scope.equipe[i]);

      }
      $scope.equipes = equipes ;
      console.log($scope.equipes);
      console.log($scope.tem_equipes);
    });


        var ref_minhas_equipes = firebase.database().ref().child("profile/"+$scope.usuario_logado.providerData[0].uid+"/equipes");
      var minhas_equipes = $firebaseArray(ref_minhas_equipes);
            $scope.minhas_equipes = minhas_equipes;

    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.addMessage = function() {
      $scope.equipe.$add({
        descricao: $scope.descricao,
        nome : $scope.nome,
        criador_uid:$scope.usuario_logado.providerData[0].uid,
        criador_nome:$scope.nome_logado,
        manager_uid:$scope.usuario_logado.providerData[0].uid,
        manager_nome:$scope.nome_logado,
        criado : new Date().getTime()
      }).then(function(ref) {
        console.log("added record with id " + ref.key);
        $scope.minhas_equipes.$add({
          descricao: $scope.descricao,
          nome : $scope.nome,
          criador_uid:$scope.usuario_logado.providerData[0].uid,
          criador_nome:$scope.nome_logado,
          manager_uid:$scope.usuario_logado.providerData[0].uid,
          manager_nome:$scope.nome_logado,
          equipe_key:ref.key,
          criado : new Date().getTime()
        });
    });
      
      $scope.tem_equipes++;
    };
  });
