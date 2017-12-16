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
