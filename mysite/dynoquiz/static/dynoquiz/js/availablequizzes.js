var availableQuizzes = angular.module('availableQuizzes',[]);

availableQuizzes.config(function($interpolateProvider){
	//allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
availableQuizzes.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


availableQuizzes.controller('AvailableQuizCtrl', function AvailableQuizCtrl($scope, $log, $http){
    //On page load
    $scope.loadPage = function(userId) {
        $scope.curUserId=userId;
        $scope.availableQuizBtnClass = "active";
        getUserQuizzes();
    };


    getUserQuizzes = function(){
        availableQuizzes($scope.curUserId)
            .then(function (response) {
                $scope.availableQuizzes = response.data;
            }, function(error){
                alert("Unable to get user's quizzes " + error.message);
            });
    };

//TODO: Create Service Layer
    //Get available quizzes for the user
    availableQuizzes = function(userId){
        return ($http.get('/dynoquiz/api/user/'+userId+'/availablequiz/'));
    };

    //Get Users
    getUsers = function(){
        return($http.get('/dynoquiz/api/user/'));
    };

}); //End Index controller