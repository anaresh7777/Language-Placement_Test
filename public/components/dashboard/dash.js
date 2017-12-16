
var app = angular.module('app.dash',[]);
app.controller('dashCtrl',function($scope,$document,$http,$state,$rootScope,heroku){
    var that = this;

    var id = sessionStorage.id;
    that.isAdmin = false;
    //var userName = sessionStorage.userName;
    $document.ready(function(){

        if(id !== '56a736e5ecc25fc92b468045'){

            $state.go('home');
        }
        if(id == '56a736e5ecc25fc92b468045'){
            that.isAdmin = true;
        }
        //$scope.users = 0;
        that.users = true;
        that.userResults = false;
        $http.post('/findAllUsers').then(function(data){
            console.log("Getting response form Users" ,data);
            that.users = data.data.data;
            //console.log(that.users);
            that.userID = data.data.data;

            that.back2users = function(){
                that.errShow = false;
                that.users = true;
                that.userResults = false;
                $http.post('/findAllUsers').then(function(data){
                    console.log("Getting response form Users" ,data);
                    that.users = data.data.data;
                });

            };

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
    })
});
