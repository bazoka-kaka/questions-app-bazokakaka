function checkScore(answers, questions, person) {
  let points = 0;
  questions.forEach((question) => {
    if (answers[question.id]) {
      if (answers[question.id] == question.ans) {
        console.log("correct!");
        ++points;
      } else {
        console.log("false!");
      }
    }
  });
  person.score = points * 10;
  // return person;
}

module.exports = checkScore;
