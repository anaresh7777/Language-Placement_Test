angular.module('app.about',[])
.controller('aboutCtrl',function(){
    
})
angular.module('app.addQuestion',[])
.controller('addQuestionCtrl',function($scope,$http,$document,$state, $location,$mdToast,heroku){
 var id = sessionStorage.id;
       //var userName = sessionStorage.userName;
        $document.ready(function(){
        //  if(id == "" || id == 'undefined' || id == null){
            if(id !== '56a736e5ecc25fc92b468045'){
              $location.path('/');     
              $state.go('home');
              $scope.isAdmin = false;  
            }
            else if(id == '56a736e5ecc25fc92b468045'){
                $scope.isAdmin = true;
            }
         
     //}
     });
 $scope.question = {};
    $scope.saved = function(){

        console.log($scope.question);
        
        $http.post(heroku +'/addQuestion',$scope.question).success(function(data){
          console.log('Success ' +data.msg);
          $scope.data = data.msg;

         $mdToast.show(
         $mdToast.simple()
        .textContent($scope.data)
        .position("bottom right")
        .hideDelay(3000)
        
       );
         });
         
                  $scope.question = "";
    }   
});
 
angular.module('app.contact',[])
.controller('contactCtrl',function($http,$scope,$mdToast,heroku){
    //var send = 'This is my Name';
    $scope.sendto = {}
    
   $scope.send = function(){
       
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
    $scope.sendto = "";
   }
   
   });


var app = angular.module('app.dash',[]);
app.controller('dashCtrl',function($scope,$document,$http,$state,$rootScope,heroku){
    var that = this;

    var id = sessionStorage.id;
    that.isAdmin = false;
    //var userName = sessionStorage.userName;
    that.users = []
    that.userData = []

        if(id !== '56a736e5ecc25fc92b468045'){

            $state.go('home');
        }
        if(id == '56a736e5ecc25fc92b468045'){
            that.isAdmin = true;
        }
        //$scope.users = 0;

        that.userResults = false;
        $http.post('/findAllUsers').then(function(data){
            console.log("Getting response form Users" ,data);
            for(var i = 0; i < data.data.data.length; i++) {

                that.userData.push(data.data.data[i])

            }

            (function(){
                for(var i = 0; that.userData.length; i++) {
                    if(i === 6) {
                        break;
                    } else {
                        that.users.push(that.userData[i]);
                    }
                }
            })();
            //console.log(that.users);
            that.userID = data.data.data;

            // that.back2users = function(){
            //     that.errShow = false;
            //     that.users = true;
            //     that.userResults = false;
            //     $http.post('/findAllUsers').then(function(data){
            //         console.log("Getting response form Users" ,data);
            //         that.users = data.data.data;
            //     });
            //
            // };
            function pagination(value, data, page) {
                var sorted = [];
                for(var i = value * page - value ; i < value * page; i++ ) {
                    sorted.push(data[i])
                }
                return sorted;
            }
            var pageNo = 1;
            document.addEventListener('scroll', function(event){
                pageNo++
                if(window.scrollY === 81)  {
                    var page = pagination(6,that.userData, pageNo );
                    for(var i = 0; i < page.length; i++) {

                        that.users.push(page[i])
                    }
                    console.log(that.users);

                }
            })

            $scope.showUserResult = function(userID){
                that.users = false;
                that.userResults = true;
                console.log('userID', userID);
                $http.post('/findAllResults',{userID: userID}).then(function(data){
                    console.log("user results " ,data.data.data);

                    if(data.data.data == ""){
                        that.users = false;
                        that.userResults = false;
                        that.errShow = true;
                        that.showError = "There is no Result to Show";
                    }
                    else{
                        that.userResult = data.data.data;
                        that.users = false;
                        that.userResults = true;
                        that.errShow = false;

                    }
                }, function(err){
                    console.log("getting error " ,err);
                })

            };

            //deleting users list
            $scope.deleteUser = function(userID, userName, userMatriculation){
                var userID = userID;
				var userName = userName;
                //var userMatriculation = userMatriculation;
                $http.post('/deleteUserResult/', {userID: userID, userName: userName, userMatriculation: userMatriculation}).then(function(data){
                    console.log("user results " ,data);
					var userList = that.users;
					that.users = removeByAttr(userList, '_id', data.data.data.id);
                    $state.go('dashboard');
                }, function(err){
                    console.log("getting error " ,err);
                });
            };
        }, function(err){
            console.log("Getting Error",err)
        });
		
		var removeByAttr = function(arr, attr, value){
			var i = arr.length;
			while(i--){
			   if( arr[i] 
				   && arr[i].hasOwnProperty(attr) 
				   && (arguments.length > 2 && arr[i][attr] === value ) ){ 
				   arr.splice(i,1);
			   }
			}
			return arr;
		}
});

angular.module('app.getQuestion',[])
.controller('getQuizCtrl',function($scope,$rootScope,$http, $document, $location, $timeout, $state,heroku){
    //$scope.quizName = {q_id1: $scope.selectedPaper};
    
         $scope.isLogin = false;
           
        var id = sessionStorage.id;
        var userName = sessionStorage.userName;
        $document.ready(function(){
          if(id == null){
         $scope.isLogin = false;
         $state.go('home');
     }
     else{
         $scope.isLogin = true;
     }
     
    })
    $scope.select = {};
    
    $rootScope.signOut = function(){
         $rootScope.isLogin = false;
         localStorage.clear();
         sessionStorage.clear();
         $state.go('home');
     }


    //$scope.pageClass = 'page-about';
    $scope.counter = 100;
    var stopped;
    $scope.countdown = function() {
        stopped = $timeout(function() {
            //console.log($scope.counter);
            $scope.counter--;
            $scope.countdown();
        }, 1000);
        if($scope.counter == 0){
            //alert("Time End");
            $scope.stop();
        }
    };
    $scope.stop = function(){

        $scope._quiz_start = false;
        $scope.result = true;
        $scope._quiz_start = false;
        $scope.results_result = true;
        $scope.lastResult = true;
        $scope.quiz_box = false;
        $scope.info_box = false;
        //console.log("stop called");
        //document.getElementById("myDialog").showModal();
        $timeout.cancel(stopped);
    }

    $scope.questionArray = [];
    $scope._quiz_start = true;
    //$scope.obj = {};
      $scope.QuestionNo= 0;
      var riteans_perc;
        //$scope.noQuiz = false;    
    $scope.startQuiz = function(){
            $scope.result = false;
            $scope._quiz_start = false;
            $scope.lastResult = false;
        $scope.quiz_box = true;
        $scope.info_box = false;

        
        //console.log("Selected Papervv:",$scope.selectedPaper);
        
        $http.post('/getquizes',{paper:$scope.select.selectedPaper}).then(function(data)
        {
            
             $scope.questionArray = data.data.data;
             console.log('queis array' ,data.data.data);
             if($scope.questionArray == ""){
                 $scope.noQuiz = true;
                 $scope.quiz_box = false;
             }
             var id = data.data._id;
             console.log('get Quiz ID : ', id);
             
             console.log("Papers : ",$scope.questionArray);
            $scope.quiz = $scope.questionArray[$scope.QuestionNo];
            console.log("$scope.quiz" ,$scope.quiz.question);
     
        },function(err)
        {
            console.log("Request not send on server" , err);
        })
    }
    
    $scope.selectedOption = {};

    $scope.correct = 0;
    $scope.percentage = 0;
    $scope.result = false;
    
    
    $scope.nextQuestion = function() {
        console.log("Right Answer ", $scope.quiz.rightAnswer);

      if(($scope.selectedOption.option.toString())=== $scope.quiz.rightAnswer){
             $scope.correct++;

      }

      else{
          $scope.correct;
      }
      
       $scope.QuestionNo++;
       $scope.quiz = $scope.questionArray[$scope.QuestionNo];
       //console.log('seclected option Checkbox', $scope.selectedOption.option);
       //console.log('seclected option ', $scope.selectedOption.option.toString());
        
       $scope.selectedOption = "";
       if(($scope.QuestionNo) == $scope.questionArray.length){
                   $scope.quiz_box = false;
                   $scope.result = true;
                   $scope.results_result = true;
                   console.log($scope.correct);
                    riteans_perc =  $scope.correct/$scope.questionArray.length*100;
                    var per = Math.round(parseInt(riteans_perc)) + "%";
       
                  $scope.percentage =  per;
                  //var paper = $scope.selectedPaper;
                  
                 
                  $http.post( '/saveResult',{userName: userName, quizTopic:$scope.select.selectedPaper, userID: id, riteans_perc: per}).then(function(data){
                      
                      console.log('data from save result ', data.data);
                      
                  },function(err){
                      console.log('Got err from Save Result ' ,err);
                  })
                  
       
       }
       
    }
    
    $scope.lastResult = false;
    $scope.noResult = false;
       $scope.showLastResult = function(){
        $scope.result = false;
        $scope._quiz_start = false;
        $scope.results_result = false;
        
      $http.post('/showResult',{userID:id}).then(function(data){
          console.log("Showing result ", data.data.data);
          
          if(data.data.data == null || data.data.data == ""){
              $scope.userResult = "There is no Result to shown.."
              $scope.noResult = true;
          }
          else{
              $scope.noResult = false;
          $scope.results= data.data.data;
          console.log("Results " ,$scope.results);
          $scope.lastResult = true;

          } },
      function(err){
          console.log('Got Error due to ' ,err);
      })
    
    }
});
angular.module('app.home',[])
.controller('quizCtrl',function($scope,$document,$rootScope,$state){
    

    //$scope.isLogin = false;
    
//     window.onbeforeunload = function(e) {
     
//      return 'Are Sure You Want to Reload this Page??';
//    };
        
    
        $document.ready(function(){
       var id = sessionStorage.id;
           if(id == null){
         $rootScope.isLogin = false;
		 $rootScope.isAdmin = false;
     }

     else{
        $rootScope.isLogin = true; 

     }
  
  
  
    })        
    

   

  $scope.myDate = Date.now();
});
    var app = angular.module('app.signin',[])
    app.controller('loginCtrl',function($scope,$mdToast,$http,$location,$document,$state, $rootScope,heroku){
    
    
         $scope.user2  = {}
		 localStorage.clear();
         sessionStorage.clear();

      //var userName = sessionStorage.userName;
      
      $document.ready(function(){
         $rootScope.isLogin = false;       
         //$scope.isSignup = true;
          $rootScope.isAdmin = false;
         $scope.loading = false;

  
      var id = sessionStorage.id;
      
      if(id == null){
         $rootScope.isLogin = false;
          $rootScope.isAdmin = false;
        // $scope.isSignup = true;
         $state.go('signin');
         
     }
     else{
        $rootScope.isLogin = true;
                 // $scope.isSignup = false;
         $state.go('getquestion');
     }
  
  
  
    })
 
     $scope.login = function(){
         if(($scope.user2.userName == null) || $scope.user2.userPass == null){
          
          
          $mdToast.show(
         $mdToast.simple()
        .textContent('Please Fill all field...')
        .position("bottom right")
        .hideDelay(3000)
        
       );
       
        $rootScope.isLogin = false;

       //alert('Please Fill all field...');
          
          $scope.user2 = "";
         
          
          }
        

       else{
           
        $http.post('/loginUser', $scope.user2).then(function(data){
       
        //console.log('data Recieved : ' +data.message);
        console.log("got Data", data);
        
        if(data.data.success == false){
              
          $mdToast.show(
         $mdToast.simple()
        .textContent('User Name or Password not found...')
        .position("bottom right")
        .hideDelay(3000)
       );
            //alert("userName or Password not found...");
            $scope.user2 = "";
             $rootScope.isLogin = false;
        }
        else{
          var jsonstr = JSON.stringify(data.data.data._id);
          console.log("JSON String is " ,jsonstr); 
          var data1 = data.data;
         var  userID = data1.data._id;

          //userName = data1.data.userName;
         //console.log("Username == " ,userName);
        
        localStorage.setItem("id",userID);
        //sessionStorage.setItem('userName',userName);
      
        
        //console.log('User id is ', userID);
        
       // console.log("data is", JSON.stringify(data));
       
       if(data1.data.userName == "admin"){
           $rootScope.isAdmin = true;
             
        sessionStorage.setItem("id", userID);    
           $mdToast.show(
         $mdToast.simple()
        .textContent('Welcome Admin..')
        .position("bottom right")
        .hideDelay(3000)
       );
         
           //$scope.isSignup = false;
           $rootScope.isLogin = true;
        $state.go('dashboard');   
       }
        else{
            
        sessionStorage.setItem("id", userID);    
        
         $location.path('/');
           $rootScope.isAdmin = false;
           
       
         
       //  $scope.isSignup = false;
         $rootScope.isLogin = true;
        }
        }
       
    },function(err){
        
       // alert("UserName or password not Found..");
        $scope.user2 = "";
        console.log("got err" ,err)
    })
       
    }   
     }
     
     $rootScope.signOut = function(){
         $rootScope.isLogin = false;
         $rootScope.isAdmin = false;
         localStorage.clear();
         sessionStorage.clear();
         $state.go('home');
     }
     
})
 
/**
 * Created by Naresh Goud on 10/30/2017.
 */

angular.module('app.questionsList',[])
    .controller('questionsListCtrl',function($scope,$document, $http,$state, $location,$mdToast, heroku){
        $scope.questions = [];
        $document.ready(function(){
            $http.post('/getAllquestions/',{}).then(function(data){
                $scope.questions = data.data.data;
                console.log("Question Details : " + data.data.data);
            }, function(err){
                console.log("getting error " ,err);
            });

            $scope.deleteQuestion = function(questionID){
                var questionID = questionID;
                $http.post('/deleteQuestion/', {questionID: questionID}).then(function(data){
                    console.log("question results " ,data);					
					var questionList = $scope.questions;
					$scope.questions = removeByAttr(questionList, '_id', data.data.data.id);
                    $state.go('questionList');
                }, function(err){
                    console.log("getting error " ,err);
                });
            };
			
			var removeByAttr = function(arr, attr, value){
				var i = arr.length;
				while(i--){
				   if( arr[i] 
					   && arr[i].hasOwnProperty(attr) 
					   && (arguments.length > 2 && arr[i][attr] === value ) ){ 
					   arr.splice(i,1);
				   }
				}
				return arr;
			}
        });
    });

angular.module('app.signup',[])
.controller('signupCtrl',function($scope,$http,$state,$mdToast,heroku){
    $scope.user = {};
   $scope.isSignup = true;
   $scope.userName = false;
   $scope.userEmail = false;
   $scope.userPass = false;
    $scope.userMatriculation = false;
  
   $scope.userName1 = function(){
       $scope.userName = true;
       $scope.userEmail = false;

   }
   /* $scope.userMatriculation1 = function(){
        $scope.userMatriculation = true;
        $scope.userName = false;
        //$scope.userEmail = false;

    }*/
   $scope.userEmail1 = function(){
       $scope.userName = false;
       $scope.userEmail = true;

   }
   $scope.userPass1 = function(){
       $scope.userName = false;
       $scope.userEmail = false;
   }
   $scope.userPass2 = function(){
       $scope.userName = false;
       $scope.userEmail = false;
   }

    $scope.submit = function(){
        //console.log($scope.user);
        

        
        $http.post('/registerUser', $scope.user).then(function(data){
            //console.log(data);
           
            if((($scope.user.userName == null) || $scope.user.userEmail == null) ||$scope.user.userPass ==null) {
                
                     
          $mdToast.show(
         $mdToast.simple()
        .textContent('Please fill all fields')
        .position("bottom right")
        .hideDelay(3000)
       );
                //alert('Please fill all fields..');
                $scope.user = "";
            }
  
        else if($scope.user.userPass !== $scope.user.userPass2){
         $mdToast.show(
         $mdToast.simple()
        .textContent('Password Combination Failed..')
        .position("bottom right")
        .hideDelay(3000)
       );
                //alert('Please fill all fields..');
                $scope.user = "";
            }
            //console.log($scope.user.userPass);
            //console.log( $scope.user.userPass2);
         
            else{
            if(data.data.success == false){
                
                 $mdToast.show(
         $mdToast.simple()
        .textContent("User Name or Email Already Taken..")
        .position("bottom right")
        .hideDelay(3000)
       );
            
                //alert(data.data.err.message)
                $scope.user = "";
                //console.log(data.data.err.message);
            }
            else{
                         $mdToast.show(
         $mdToast.simple()
        //.textContent(data.data.err.message)
        .textContent("Success...")
        .position("bottom right")
        .hideDelay(3000)
       );
                
                //alert("Success.....")
              $scope.isSignup = false;
              $state.go('signin');      
            }
            }
        //console.log('data Recieved ',data.data);
        //$state.go('signin');
    },function(err){
      $scope.isSignup = true;
       console.log('got err' ,err);    
    })    
    
    
    }})
angular.module('app.userprofile',[])
.controller('userprofileCtrl',function($scope,$http,$rootScope,$document,$state){
  var Data;
  
        var id = sessionStorage.id;

        $document.ready(function(){
          if(id == null){
           $rootScope.isLogin = false;  
         //$state.go('home');
     }
     else{
         $rootScope.isLogin = true;
     }
     
    })
  
   //console.log('1st ' ,$rootScope.dData)

  console.log("chekck id " + id)
  $http.post('/userProfile/'+ id).then(function(data){
      Data = data.data.Data;
      $rootScope.dData = Data;
      //console.log("got Data from User Profile" , Data.userName);
       console.log('2nd ', $rootScope.dData);
  
  }, function(err){
      console.log("got Error From User PRofile.." ,err)
  })
  
  
   $scope.showMyResult = function(){
        
      $http.post('/showResult',{userID:id}).then(function(data){
          console.log("Showing result ", data.data);
          if(data.data == null || data.data == ""){
              $scope.userResult = "There is no Result to shown.."
              $scope.noResult = true;
          }
          else{
              $scope.noResult = false;
          $scope.results= data.data;
          console.log("Results " ,$scope.results);
          $scope.lastResult = true;

          } },
      function(err){
          console.log('Got Error due to ' ,err);
      })
    
    }
  

})


angular.module("quizApp")
.config(function($stateProvider,$urlRouterProvider,$locationProvider){
    
   $stateProvider.state('home', {
                url: "/",
                templateUrl: "../components/home/home.html",
                controller: "quizCtrl"
            }
            )
            .state('signin', {
                    url: "/signin",
                    templateUrl: "../components/login/login.html",
                    controller: "loginCtrl"
                    
                }
            )
            .state('signup', {
                    url: "/signup",
                    templateUrl: "../components/signup/signup.html",
                    controller: "signupCtrl"
                }
            )
            
            
            .state('dashboard', {
                    url: "/dashboard",
                    templateUrl: "../components/dashboard/dash.html",
                    controller: "dashCtrl",
                    controllerAs: "dash",
                    loginCompulsory: true
                }
            )
           .state('getquestion', {
                    url: "/getquestion",
                    templateUrl: "../components/getQuestion/getquestion.html",
                    controller: "getQuizCtrl",
                    loginCompulsory: true
                }
            ) 
            .state('addquestion', {
                    url: "/addquestion",
                    templateUrl: "../components/addQuestion/addQuestion.html",
                    controller: "addQuestionCtrl",
                    loginCompulsory: true
                }
            )
       .state('questionsList', {
               url: "/questionsList",
               templateUrl: "../components/questionsList/questionsList.html",
               controller: "questionsListCtrl",
               loginCompulsory: true
           }
       )
            .state('aboutus', {
                    url: "/about",
                    templateUrl: "../components/about/about.html",
                    controller: "aboutCtrl",
                    loginCompulsory: true
                }
            )
            .state('contact', {
                    url: "/contact",
                    templateUrl: "../components/contact/contact.html",
                    controller: "contactCtrl"
                }
            )
            .state('userprofile', {
                    url: "/userprofile",
                    templateUrl: "../components/userprofile/userprofile.html",
                    controller: "userprofileCtrl",
                    loginCompulosry : true
                }
            );

        $urlRouterProvider.otherwise('/')
      $locationProvider.html5Mode({
         enabled: true,
         requireBase: false
});


})

.constant('heroku','https://quiz-app.herokuapp.com')

.run(function($rootScope,$state){
    $rootScope.$on("$stateChangeStart",function(event, toState){
       // var token = localStorage.getItem('id');
        var session = sessionStorage.id;
        if(toState.loginCompulsory && session){
            event.preventDefault();
               $state.go('home');
        }
    })
    
})




angular.module('quizApp',['ui.router',"checklist-model",'ngMaterial','app.home','app.contact','app.signin','app.signup','app.dash','app.about','app.getQuestion',"app.addQuestion","app.questionsList",'app.userprofile'])


// app.controller('quizCtrl',function($scope,$http){
//     $scope.user = {};
    
//     $scope.submit = function(){
//         console.log($scope.user);
//     $http.post('/registerUser', $scope.user).success(function(data){
//         console.log('data Recieved '+data);
       
//     })    
//     }
    
//     $scope.user2  = {}
//      $scope.login = function(){
//         console.log($scope.user2);
//     $http.post('/loginUser', $scope.user2).success(function(data){
       
//         console.log('data Recieved : ' +data.message);
//         console.log("data is", JSON.stringify(data));
       
       
//     })
       
//     }
    
//     $scope.question = {}
//     $scope.saved = function(){
        
//         console.log($scope.question)
        
//         $http.post('/addQuestion',$scope.question).success(function(data){
//           console.log('Success ' +data.msg);
//           $scope.data = data.msg;
//          }).config(function($mdThemingProvider) {
  
//     }
    
    
//    // $scope.quizName = {q_id1: $scope.selectedPaper};
    
    
//     $scope.questionArray = [];
//     //$scope.obj = {};
//       $scope.QuestionNo= 0;
//     $scope.startQuiz = function(){
        
//         $scope.quiz_box = true;
//         $scope.info_box = false;    
        
//         //console.log("Selected Papervv:",$scope.selectedPaper);
        
//         $http.post('/getQuestion',{paper:$scope.selectedPaper}).then(function(data)
//         {
            
//              $scope.questionArray = data.data;
//              console.log("Papers : ",$scope.questionArray);
//             $scope.quiz = $scope.questionArray[$scope.QuestionNo];

           
       
            
            
             
//             // console.log(JSON.stringify(data.data));
//              //$scope.obj = data.data.question;
//              //console.log("Run ",$scope.obj);
//           // console.log(data.data[0].question);
            
          
//         },function(err)
//         {
//             console.log("Request not send on server");
//         })
//     }
    
//     $scope.selectedOption = {};

//     $scope.correct = 0;
//     $scope.percentage = 0;
//     $scope.result = false;
//     $scope.nextQuestion = function() {
//         console.log("Right Answer ", $scope.quiz.rightAnswer);

//       if(($scope.selectedOption.option)=== $scope.quiz.rightAnswer){
//              $scope.correct++;

//       }
//       else{
//           $scope.correct;
//       }
      
//        $scope.QuestionNo++;
//        $scope.quiz = $scope.questionArray[$scope.QuestionNo];
//        console.log('seclected option ', $scope.selectedOption.option)
        
//        $scope.selectedOption = "";
//        if(($scope.QuestionNo) ==$scope.questionArray.length){
//                    $scope.quiz_box = false;
//                    $scope.result = true;
//                    console.log($scope.correct);
//                    $scope.percentage =  $scope.correct/$scope.questionArray.length*100 + "%";
//        }
       
//     }
  
    
// })

var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');
var nodemailer = require('nodemailer');
//var MongoClient = require('mongodb').MongoClient;
//var assert = require('assert');
// mongoose.Promise = require('bluebird');
// mongoose.Promise = global.Promise;

/*mongoose.connect('mongodb://ghayyas94:12345@ds047865.mongolab.com:47865/quizapp', { useMongoClient: true }, function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }
    var db = mongoose.connection;
});*/


//mongoose.Promise = require('q').Promise;
mongoose.connect('mongodb://ghayyas94:12345@ds047865.mongolab.com:47865/quizapp', { useMongoClient: true });  //mongodb://naresh:naresh@ds249025.mlab.com:49025/languageapp
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Use bluebird
mongoose.Promise = require('bluebird');
//mongoose.Promise = require('q').Promise;
db.on('connect', function(err) {
    if (err) {
        console.log('Not connected to the database: ' + err);
    } else {
        console.log('Successfully connected to MongoDB');
    }; });

/*var url = 'mongodb://ghayyas94:12345@ds047865.mongolab.com:47865/quizapp';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
});*/

var userSchema = new mongoose.Schema({
    userName: { type: String, required: true, index: true, unique: true },
    //userMatriculation: { type: Number, required: true, index: true, unique: true },
    userEmail: { type: String, required: true, index: true, unique: true },
    userPass: { type: String, required: true },
    Date: { type: String, default: Date.now() },
    userResult: String
});
var questionSchema = new mongoose.Schema({
    question: { type: String, unique: true },
    op1: String,
    op2: String,
    op3: String,
    op4: String,
    rightAnswer: String,
    questionType: String,
    questionID: String,
    quizTopic: String,
    CreatedAt: { type: String, default: Date.now() }
});
var resultSchema = new mongoose.Schema({
    userID: String,
    userName: String,
    userMatriculation: String,
    userEmail: String,
    quizTopic: String,
    userResult: String,
    date: { type: String, default: Date.now() }
});
userSchema.plugin(validator);
var User = mongoose.model('Users', userSchema);
var Question = mongoose.model('Questions', questionSchema);
var Result = mongoose.model('Results', resultSchema);

exports.registerUser = function (req, res) {
    var userName = req.body.userName;
    //var userMatriculation = req.body.userMatriculation;
    var userEmail = req.body.userEmail;
    var userPass = req.body.userPass;
    var userInfo = new User({
        userName: userName,
       // userMatriculation: userMatriculation,
        userEmail: userEmail,
        userPass: userPass
    });
    userInfo.save(function (err, data) {
        if (err) {
            res.json({ success: false, 'message': "Cant register to this user Name", err: err });
            console.log('got Err :' + err);
        }
        else {
            console.log('Data Recieved', data);
            res.json({ success: true, "message": "Registered", 'data is': data });
        }
        console.log("data Saved");
    });
};
exports.loginUser = function (req, res) {
    //var userMatriculation = req.body.userMatriculation;
    var userName = req.body.userName;
    //let userEmail = req.body.userEmail;
    var userPass = req.body.userPass;
    User.findOne({ userName: userName, userPass: userPass }, function (err, data) {
        if (err) {
            console.log('An error has occurred');
            res.send('An error has occurred' + err);
        }
        else {
            if (!data) {
                console.log('record not found');
                res.json({ success: false, "message": "user Not Found" });
            }
            else {
                console.log("user ID is :", data._id);
                res.json({ success: true, "data": data });
                console.log("data posted " + data);
            } //else  for data forward
        } //Main else
    }); //FindOne funtionx
};
exports.addQuestion = function (req, res) {
    var data = req.body;
    var question_info = new Question({
        question: data.ques,
        op1: data.op1,
        op2: data.op2,
        op3: data.op3,
        op4: data.op4,
        rightAnswer: data.rightAnswer,
        questionType: data.questionType,
        quizTopic: data.quizName
    });
    Question.findOne({ question: req.body.ques }, function (err, data) {
        if (!data) {
            console.log("data Doesnt exists..");
            res.json({ success: true, "msg": "Data Saved.." });
            question_info.save(function (err, success) {
                if (err) {
                    console.log('Error got ' + err);
                    res.json({ success: false, data: err });
                }
                else {
                    console.log("Request got " + success);
                    res.json({ success: true, data: success });
                }
            });
        }
        else {
            console.log('Data Already exists');
            res.json({ success: false, "msg": "This Question Already Exists.." });
        }
    });
};
exports.getquizes = function (req, res) {
    //let quizName = req.body.paper;
    console.log('getquizes');
    console.log(req.body.paper);
    //quizName = quizName.toLowerCase();
    //    console.log("Selected paper :",req.body.q_id1);
    Question.find({ quizTopic: req.body.paper }, function (err, data) {
        console.log('find: ' + req.body.paper);
        console.log(err);
        console.log(data);
        if (err) {
            console.log('got Error ' + err);
            res.json({ result: false, data: null });
        }
        else {
            console.log('Got Data ', data);
            res.json({ result: true, data: data });
        }
    });
    // console.log("Data come :",req.body);
};

exports.getAllquestions = function (req, res) {
    console.log('Get all the questions');
    Question.find({}, function (err, data) {
        if (err) {
            console.log('Error while fetching the questions ' + err);
            res.json({ result: false, data: null });
        }
        else {
            console.log('The Question List is ', data);
            res.json({ result: true, data: data });
        }
    });
    // console.log("Data come :",req.body);
};

exports.saveResult = function (req, res) {
    var user_result = req.body.riteans_perc;
    var userID = req.body.userID;
    var quizTopic = req.body.quizTopic;
    var userName = req.body.userName;
    var userMatriculation = req.body.userMatriculation;
    console.log(userID + "==" + user_result);
    var myDate = new Date();
    var result_info = new Result({
        userID: userID,
        quizTopic: quizTopic,
        userName: userName,
        userMatriculation: userMatriculation,
        userResult: user_result,
        date: myDate
    });
    result_info.save(function (err, data) {
        if (err) {
            console.log("Saving Result Failed.." + err);
            res.json({ success: false, data: err });
        }
        else {
            console.log("Result is Saved..", data, "quizName");
            res.json({ success: true, data: data });
        }
        console.log("Result Recived.", data);
        //res.send("Result Recived.")
    });
};
exports.showResult = function (req, res) {
    var userName = req.body.userName;
    Result.find({ userName: userName }, function (err, data) {
        if (err) {
            console.log("Got Error on Find Results");
            res.json({ success: false, data: err });
        }
        else {
            if (!data) {
                console.log("record Not found");
                res.json({ success: false, data: "Record not Found" });
            }
            else {
                res.json({ success: true, data: data });
            }
        }
    });
};
exports.userProfile = function (req, res) {
    //let UserID = req.body.UserID;
    var UserID = req.params.uid;
    console.log(UserID);
    User.findById(UserID, function (err, data) {
        if (err) {
            console.log("got error from User Profile", err);
            res.json({ success: false, "Error": err });
        }
        else {
            console.log("got Data from user Profile ", data);
            res.json({ success: true, "Data": data });
        }
    });
};
// Finding all users


exports.findAllUsers = function (req, res) {
    User.find(function (err, data) {
        if (err) {
            console.log("Users not Find.." + err);
            res.json({ success: false, "data": err });
        }
        else {
            console.log("Users Finds.. " + data);
            res.json({ success: true, "data": data });
        }
    });
};


/*
var limitOfUserByRequest = 6;

exports.findAllUsers = function(req, res) {
    var data = undefined;
    const query = req.query || {};
    User.find(query)
        .limit(limitOfUserByRequest)
        .sort({ _id: -1 })
        .exec()
        .then( function (_data) {
        data = _data;
    return User.count({ _id:{ $gt:data[data.length - 1]._id } });
})
.then(function (count) {

        if (count) return res.json({
            success: true,
            data: data,
            next:{
                _id:{
                    $gt:data[data.length - 1]._id
                }
            }
        });

    res.json({
        success: true,
        data: data
    });
})
.catch(function(err) {
    res.json({success: false, data: err});
});
};
*/


// deleting users list
exports.deleteResult = function(req, res){
    var userID = req.body.userID;
	var userName = req.body.userName;
    console.log("The UserId is going to Delete : " + userID);
	console.log("The UserName is going to Delete : " + userName);
	
	Result.deleteOne({ userName: userName }, function(err, data){
        if (err) {
            console.log("got err", err);         
        }
        else {
            console.log("Result of User Name " + userName + "is deleted successfully");
        }
    });
	
	console.log("The UserId is going to Delete : " + userID);
    User.deleteOne({ _id: userID }, function(err, data){
        if (err) {
            console.log("got err", err);
            res.json({ success: false, data: err });
        }
        else {
            var response = {
                message: "User is successfully deleted",
                id: userID
            };
            console.log("deleted the User ", response);
            res.json({ success: true, data: response });
        }

    });
};


exports.deleteQuestion = function(req, res){
    var questionID = req.body.questionID;
    console.log("The Question is going to Delete : " + questionID);
    Question.deleteOne({ _id: questionID }, function(err, data){
        if (err) {
            console.log("got err", err);
            res.json({ success: false, data: err });
        }
        else {
            var response = {
                message: "Question is successfully deleted",
                id: questionID
            };
            console.log("deleted the Question ", response);
            res.json({ success: true, data: response });
        }

    });
};

exports.emailSend = function (req, res) {
    var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
            // enter your gmail account
            user: 'anaresh7777@gmail.com',
            // enter your gmail password
            pass: 'anaresh@542'
        }
    });
    // setup e-mail data with unicode symbols
    var mailOptions = {
        // from: req.body.from, // sender address
        to: 'anaresh7777@gmail.com',
        subject: 'Contact Form Message',
        from: "Contact Form Request" + "<" + req.query.from + '>',
        html:  "From: " + req.query.name + "<br>" +
        "User's email: " + req.query.user + "<br>" +     "Message: " + req.query.text
    }
    console.log(mailOptions);
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        }
        else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
};
exports.findAllResults = function (req, res) {
    var userID = req.body.userID;
    console.log(req.body);
    Result.find({ userID: userID }, function (err, data) {
        if (err) {
            console.log("got err", err);
            res.json({ success: false, data: err });
        }
        else {
            console.log("got data admin ", data);
        }
        res.json({ success: true, data: data });
    });
};
/*
 exports.deleteQuestion = (req,res)=>{
 let QuestionID = req.params.uid;
 console.log(QuestionID);

 Question.findByIdAndRemove(QuestionID,(err,data)=>{
 if(err){
 console.log("got error from QuestionID" ,err);
 }
 else{
 console.log("got Success from QuestionID" , data);
 }
 })

 }
 */


var express = require("express");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
//var multer = require('multer');
var nodemailer = require('nodemailer');
var port = process.env.PORT || 3000;
var database = require('./database/database');
var app = express();
var router = express.Router();
//middleware functions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
//router.get('/',database.index)
var Ipublic = path.resolve(__dirname, 'public');
app.use(express.static(Ipublic));

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post('/registerUser', database.registerUser);
app.post('/loginUser', database.loginUser);
app.post('/addQuestion', database.addQuestion);
app.post('/getquizes', database.getquizes);
app.post('/getAllquestions', database.getAllquestions);
app.post("/saveResult", database.saveResult);
app.post('/showResult', database.showResult);
app.post('/userProfile/:uid', database.userProfile);
app.post('/findAllUsers', database.findAllUsers);
app.post('/findAllResults', database.findAllResults);
app.post('/emailSend', database.emailSend);
app.post('/deleteUserResult', database.deleteResult);
app.post('/deleteQuestion',database.deleteQuestion);

app.use(function (req, res) {
    res.sendFile(Ipublic + "/index.html");
});
app.listen(port, function () {
    console.log('Server is starting on port ' + port);
});
