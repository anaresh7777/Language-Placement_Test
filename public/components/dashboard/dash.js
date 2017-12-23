var dashApp  = angular.module('app.dash', ['infinite-scroll']);

dashApp.controller("dashCtrl", dashCtrl);
dashCtrl.$inject = ['heroku', '$http', '$window', '$state'];

function dashCtrl(heroku, $http, $window, $state) {
    var vm = this ;
    vm.users = [];
    vm.userData = [];
    vm.input = '';
		vm.isAdmin = false ;
		vm.endText = '';
		var id = sessionStorage.id;
		
    if(id !== '56a736e5ecc25fc92b468045'){

        $state.go('home');
    }
    if(id == '56a736e5ecc25fc92b468045'){
        vm.isAdmin = true;
		}
		
		vm.addData = function() {
			for(var i = 0; vm.userData.length; i++) {
				if(i === 7) {
						break;
				} else {
				vm.users.push(vm.userData[i]);
				}
		}
    }

    $http.post('/findAllUsers').then(function(data){
        console.log("Getting response form Users" ,data);
        for(var i = 0; i < data.data.data.length; i++) {
	        vm.userData.push(data.data.data[i])

				}
				vm.addData();
		})

		vm.back2users = function(){
			//alert("back2user clicked")
			     vm.errShow = false;
			     vm.users = true;
			     vm.userResults = false;
			     $http.post('/findAllUsers').then(function(data){
			         console.log("Getting response from Users" ,data);
			         vm.users = data.data.data;
			     });
			
			 };
		
		function pagination(value, data, page) {
			var sorted = [];
			for(var i = value * page - value ; i < value * page; i++ ) {
					sorted.push(data[i])
			}
			return sorted;
	}
	var pageNo = 1;


	vm.scrollPage = function() {

		pageNo++
		var page = pagination(6,vm.userData, pageNo );
		for(var i = 0; i < page.length; i++) {
			if(page[i] == undefined) {
				vm.endText = "No more data to load"; 
				break;
			} else {
				vm.users.push(page[i])
				
			}
		}
	}

	vm.showUserResult = function(userID){
		vm.users = false;
		vm.userResults = true;
		console.log('userID', userID);
		$http.post('/findAllResults',{userID: userID}).then(function(data){
				console.log("user results " ,data.data.data);

				if(data.data.data == ""){
						vm.users = false;
						vm.userResults = false;
						vm.errShow = true;
						vm.showError = "There is no Result to Show";
				}
				else{
						vm.userResult = data.data.data;
						vm.users = false;
						vm.userResults = true;
						vm.errShow = false;

				}
		}, function(err){
				console.log("getting error " ,err);
		})

};

//deleting users list
vm.deleteUser = function(userID, userName, userMatriculation){
		var userID = userID;
var userName = userName;
		//var userMatriculation = userMatriculation;
		$http.post('/deleteUserResult/', {userID: userID, userName: userName}).then(function(data){
				console.log("user results " ,data);
var userList = vm.users;
vm.users = removeByAttr(userList, '_id', data.data.data.id);
				$state.go('dashboard');
		}, function(err){
				console.log("getting error " ,err);
		});
}, function(err){
console.log("Getting Error",err)
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

}