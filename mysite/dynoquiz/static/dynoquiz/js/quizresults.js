var quizResults = angular.module('quizResults',[]);

quizResults.config(function($interpolateProvider){
	//allow django templates and angular to co-exist
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});

//Set CSRF token
quizResults.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


quizResults.controller('QuizResultsCtrl', function QuizResultsCtrl($scope, $log, $http){
    //On page load
    $scope.loadPage = function(userId, quizId) {
        $scope.curUserId=userId;
        $scope.availableQuizBtnClass = "active";
        getQuestionList(quizId);
        getCurQuiz(quizId);
        getQuizScores(quizId, userId);
    };

    getQuizScores = function(quizId, userId){
        getScores(quizId, userId)
            .then( function(response) {
                $scope.scores=response.data;
                $scope.curQuizGuesses = $scope.scores.pop().question_attempts;
            }, function(error){
                alert("unable to get user's scores" + error.message);
            });
    };

    //TODO: This can be optomized to by sorting lists
    //TODO: This should be used to decorate each question object with attributes
    //loop through all the users guesses find the quiz and return if answer is correct
    isCorrect = function(question){
        for(i in $scope.curQuizGuesses){
            guess = $scope.curQuizGuesses[i];
            //question found
            if(guess.question == question.id ){
                question.guessed = guess.choice;
                if(guess.choice == question.answer){
                    question.correct = true;
                    return true;
                }else {
                    question.correct = false;
                    return false;
                }
            }
        }
    };

    getQuestionList = function(quizId) {
        getQuestions(quizId)
            .then( function(response) {
                $scope.questionList = response.data;
                //Loop through all questions and attach attributes correct and chosen
                for( i in $scope.questionList){
                    var curQuestion = $scope.questionList[i];
                    isCorrect(curQuestion);
                }
            }, function(error) {
                alert("Unable to load questions " + error.message);
            });
    };

    getCurQuiz = function(quizId) {
        getQuiz(quizId)
            .then(function(response) {
                $scope.curQuiz= response.data;
            }, function(error) {
                alert("Unable to load quiz " + error.message);
            });

    };

//TODO: Create Service Layer
    //Get available quizzes for the user
    availableQuizzes = function(userId){
        return ($http.get('/dynoquiz/api/user/'+userId+'/availablequiz/'));
    };

    getScores = function(quizId, userId){
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/user/'+userId+'/'))
    };

    getQuiz = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/'));
    };

    //Get Quiz
    getQuiz = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/'));
    };

    // Get Questions List
    getQuestions = function(quizId) {
        return ( $http.get('/dynoquiz/api/quiz/'+quizId+'/question') );
    };



}); //End QuizResults controller