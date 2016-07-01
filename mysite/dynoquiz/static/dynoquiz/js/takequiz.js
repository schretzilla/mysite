var takeQuiz = angular.module('takeQuiz',[]);

takeQuiz.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
takeQuiz.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


takeQuiz.controller('TakeQuizCtrl', function TakeQuizCtrl($scope, $log, $http){

    //Load Question List
    //TODO this doesnt need to be scope
    /*$scope.loadQuestions = function() {
        getQuestions($scope.quizId)
            .then(function (response) {
                $scope.questions=response.data;
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };*


    /*
    * Service Layer
    */
    // Get Questions List
    /*getQuestions = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/question') );
    };
    /*
    *End Service Layer
    */


    $scope.formInvalid = function(numQuestions){

        //return true;
    };

    /*$scope.loadPage = function(curQuizId) {
        //save persistant variables
        $scope.loadQuestions();
    };*/


});