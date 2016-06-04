var login = angular.module('login',[]);

login.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

login.controller('LoginCtrl', function LoginCtrl($scope, $log, $http){

$scope.submit = function(){
    alert("anguler in business " + $scope.username + " " + $scope.password);
};


});