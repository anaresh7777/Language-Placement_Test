angular.module('app.contact',[])
.controller('contactCtrl',function($http,$scope,$mdToast,heroku){
    
   $scope.send = function(){

       console.log($scope.sendto);
    $http.post( '/emailSend',$scope.sendto).then(function(data){
        console.log("got data from Email " ,data);
        console.log(data.data);
        $mdToast.show(
         $mdToast.simple()
        .textContent(data.data.msg)
        .position("bottom right")
        .hideDelay(3000)
        
       );
    },function(err){
        console.log("Got error from Email " ,err);
        
        $mdToast.show(
         $mdToast.simple()
        .textContent("500 internal Error")
        .position("bottom right")
        .hideDelay(3000)
        
       );
    })
   }
   
   });
