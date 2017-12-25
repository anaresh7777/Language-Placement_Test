

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
                    controllerAs: "vm",
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
       .state('courseA1', {
               url: "/courseA1",
               templateUrl: "../components/courseA1/courseA1.html",
               controller: "courseA1Ctrl",
                loginCompulosry : true
           }
       )
       .state('courseA2', {
               url: "/courseA2",
               templateUrl: "../components/courseA2/courseA2.html",
               controller: "courseA2Ctrl",
                loginCompulosry : true
           }
       )
       .state('courseB1', {
               url: "/courseB1",
               templateUrl: "../components/courseB1/courseB1.html",
               controller: "courseB1Ctrl",
                loginCompulosry : true
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

