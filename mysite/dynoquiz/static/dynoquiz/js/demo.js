//Another day edit this and make login async
var login = angular.module('login',[]);

login.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

login.controller('LoginCtrl', function LoginCtrl($scope, $log, $http){

$scope.registerFormValid = function() {
    var t = this.registerEmailValid()
    var s = this.registerPasswordValid()
    var v = this.registerPasswordValid()
   return(this.registerEmailValid() && this.registerUsernameValid() && this.registerPasswordValid())
};

$scope.registerEmailValid = function(){
    return($scope.registerForm.registerEmail.$valid);
};

$scope.registerUsernameValid = function(){
  return($scope.registerForm.registerUsername.$valid );
};

$scope.registerPasswordValid = function(){
    return($scope.registerForm.registerPassword.$valid && $scope.registerPassword == $scope.registerConfirmPassword);
};

$scope.checkUsername = function(){
    getUser($scope.registerUsername)
        .then( function(response){
            $scope.user = response.data;
        }, function(error){
            alert("unable to get user " + error.message);
        });
};

$scope.usernameTaken = function() {
    if($scope.user != null){
        return true;
    }else {
        return false;
    }
};

/*
Service layer
*/
getUser = function(username){
    return($http.get('/dynoquiz/api/user/'+username));
};
}); //End controller
