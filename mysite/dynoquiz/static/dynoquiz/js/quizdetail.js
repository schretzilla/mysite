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


quizDetail.controller('QuizDetailCtrl', function QuizDetailCtrl($scope, $timeout, $log, $http){

//TODO: separate angular code with custom directives
    /*
    * Add new question and its choices to the DB
    */
    $scope.addQuestion = function(){
        question = questionObj($scope.quizId, $scope.questionText);

        postQuestion(question)
            .then(function (response) {
                //Append to question list
                newQuestion = response.data;
                //TODO: Change this to questionList or change choiceList to choices
                $scope.questions.push(newQuestion);

                //Post Choices
                angular.forEach($scope.choiceList, function(choice, key){
                    postNewChoice(newQuestion, choice);
                });

                //clean form
                $scope.questionText = "";
                $scope.choiceList=[nullChoice()];
                $scope.selectedAnswer="";
            }, function(error) {
                alert ("Unable to post question" + error.message);
            });

    };

    //Returns a blank choice object
    nullChoice = function() {
        return(choiceObj(1,"",0))
    };

    /*
    * Post new choice if text is not null
    */
    postNewChoice = function(question, choice) {

        //Only post non empty choices
        if (choice.choice_text != ""){

            //Set choice question
            choice.question = question.id;
            postChoice(choice)
                .then(function (response) {
                    //Append choice to questions list
                    newChoice = response.data;
                    question.choices.push(newChoice);
                    //Update question if choice is selected answer
                    if (choice.correct == true){
                        $scope.setAnswer(question, newChoice.id);
                    }
                }, function(error) {
                    alert("Unable to post choice " + error.message);
                });
        }
    };

    // Add new choice btn
    $scope.addChoice = function(question, choiceText) {
        choice = choiceObj(0, choiceText, question.id)
        postNewChoice(question, choice);
        //clear new choice input
        question.newChoice = "";
    };

    //Delete choice and update choice list
    $scope.removeChoice = function(choiceIndex, choice, choices) {
        deleteChoice(choice)
            .then(function (response) {
                //remove choice from choice list
                choices.splice(choiceIndex,1);
            }, function(error) {
                alert("Unable to delete choice " + error.message);
            });
    };


    //Save focused text's value before it changes
    $scope.persistCurText = function(curText) {
        //TODO: rename curText if it doesn't make sense
        $scope.curText = curText;
    };

    /*
    * Update Choice on deselect
    */
    $scope.updateChoice = function(choice) {
        statusSaving()
        //For existing choices detect if choice has been edited
        if (choice.choice_text != "" && choice.choice_text != $scope.curText)
        {
            updateChoice(choice)
                .then( function (response) {
                    $scope.curText=choice.choice_text;
                    statusSaved()
                });
        }
    };

    /*
    * Update Question on deselect
    */
    //TODO: Can probably consolidate this function with update choice fn
    $scope.updateQuestion = function(question){
        //Detect if question has been edited
        statusSaving();

        if (question.question_text != "" && question.question_text != $scope.curText)
        {
            updateQuestion(question)
                .then( function (response) {
                    $scope.curText=question.question_text;
                    statusSaved();
                }, function(error) {
                    alert("Unable to update question " + error.message);
                });
        }
    };

    //Set status to saving and display
    statusSaving = function() {
        $scope.formStatus = "Saving"
        $scope.startFade = false;
        $scope.hideStatus = false;
    };

    //Set status to saved and fade
    statusSaved = function () {
        $scope.formStatus = "Saved!";

        $scope.startFade = true;
        $timeout(function(){
            $scope.hideStatus = true;
        }, 3000);
    };

    /**
    DELETE
    */
    //TODO: can just pass in the question as well with the funciton instead of searching for it
    $scope.removeQuestion = function(questionIndex) {
        //TODO add confirm
        question = $scope.questions[questionIndex];
        deleteQuestion(question.id)
            .then(function (response) {
                //reload question list... might not be needed
                $scope.questions.splice(questionIndex,1);
            }, function(error) {
                alert("Unable to delete question "  + error.message);
            });
    };

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

    loadQuiz = function(quizId) {
        getQuiz(quizId)
            .then( function (response) {
                $scope.curQuiz = response.data;
            }, function(error) {
                alert("Unable to load quiz " + error.message);
            });
    };

    /*
    * Service Layer
    */
    //Get Quiz
    getQuiz = function(quizId) {
        return ( $http.get('/quiztro/api/quiz/'+quizId+'/'));
    };

    // Question Post
    postQuestion = function(question) {
        return ( $http.post('/quiztro/api/quiz/'+question.quiz+'/question/', question) );
    };

    // Choice Post
    postChoice = function(choice) {
        return ( $http.post('/quiztro/api/question/'+choice.question+'/choice/', choice) );
    };

    // Update Choice
    updateChoice = function(choice) {
        return ( $http.put('/quiztro/api/question/'+choice.question+'/choice/'+choice.id+'/', choice) );
    };

    // Delete Choice
    deleteChoice = function(choice) {
        return ( $http.delete('/quiztro/api/question/'+choice.question+'/choice/'+choice.id + '/') );
    };

    // Get Questions List
    getQuestions = function(quizId) {
        return ( $http.get('/quiztro/api/quiz/'+quizId+'/question') );
    };

    // Delete Question
    deleteQuestion = function(questionId) {
        return ( $http.delete('/quiztro/api/quiz/'+$scope.quizId+'/question/'+questionId + '/') );
    };

    // Update Question
    updateQuestion = function(question) {
        return ( $http.put('/quiztro/api/quiz/'+ question.quiz +'/question/'+question.id+'/', question) );
    };

    /*
    *End Service Layer
    */

    /*
    * Model Layer
    */
/*    //New Choice for new question
    choiceObj = function(id, text) {
        return{
           'id':id,
           'choice_text':text,
           'new':true,
           'votes':0,
        };
    };*/

    //TODO: Edit to remove question id also id isnt necessary other than to make it unique
    //New Choice for existing question
    choiceObj = function(id, text, questionId) {
        return{
           'id':id,
           'choice_text':text,
           'question':questionId,
           'new':true,
           'votes':0,
           'correct':false,
        };
    };

    //New Question Model
     questionObj = function(id, text){
        return {
            'quiz':id,
            'question_text':text,
            'choices':[],
            'date_created':new Date(),
        };
     };

        //TODO: Can we consolidate model functions with diff arg numbers
     //New Question Model
     questionObj = function(id, text, choice){
        return {
            'quiz':id,
            'question_text':text,
            'choices':[],
            'answer':choice,
            'date_created':new Date(),
        };

     };

    /*
    *End Model Layer
    */

    //Set answer to existing question choice
    $scope.setAnswer = function(question, choiceId) {
        statusSaving();
        question.answer = choiceId;
        updateQuestion(question)
            .then (function (response) {
                statusSaved();
            }, function(error) {
                alert("Unable to save new answer " + error);
            });
    };

    $scope.updateQuestionText = function(question) {
        alert("changed from " + $scope.curText);
    };
    //Erase input fields when a question has been canceled
    $scope.cancelQuestion = function() {
        $scope.choiceList=[nullChoice()];
        $scope.questionText = "";
    };


    $scope.loadPage = function(curQuizId) {
        //save persistant variables
        $scope.quizId = curQuizId;
        $scope.loadQuestions();
        $scope.choiceList=[nullChoice()];
        loadQuiz(curQuizId);
    };

    //Validates that the question form is complete
    $scope.questionValid = function() {
        return ($scope.choiceList.length > 1 && $scope.questionText != null )
    };

    /**
    * dynamicList: Appends to objectList if specified attribute of last element is not null
    * Args:
    *   objectList: list of objects you are building
    *   attr: Attribute used to determine if list should be appended
    */
    $scope.dynamicList = function(objectList, attr) {
        //Add new input if input above has been used
        listLength = objectList.length;
        attribute = objectList[(listLength-1)][attr];
        if ( attribute != ""){
           newObject = {
                 id:objectList.length,
                 new:true,
           };
           newObject[attr] = "";
           objectList.push(newObject);
        } else if (objectList[(listLength-2)][attr] == ""){
            //Drop last object if 2nd to last object attr is ""
            objectList.pop();
        }
    };


});