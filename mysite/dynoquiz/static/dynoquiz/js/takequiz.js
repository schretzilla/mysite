var quizDetail = angular.module('quizDetail',[]);

quizDetail.config(function($interpolateProvider){
    //allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
quizDetail.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


quizDetail.controller('QuizDetailCtrl', function QuizDetailCtrl($scope, $log, $http){

    //Load Question List
    //TODO this doesnt need to be scope
    $scope.loadQuestions = function() {
        getQuestions($scope.quizId)
            .then(function (response) {
                $scope.questions=response.data;
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };


    /*
    * Service Layer
    */
    // Get Questions List
    getQuestions = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/question') );
    };
    /*
    *End Service Layer
    */


    $scope.loadPage = function(curQuizId) {
        //save persistant variables
        $scope.loadQuestions();
    };


});