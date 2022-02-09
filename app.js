const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const shuffleArray = require(__dirname + "/custom_modules/shuffleArray");
// const checkScore = require(__dirname + "/custom_modules/checkScore");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

//database
mongoose.connect(
  "mongodb+srv://tsukikagemaikaka1:Tsukikagemaika1@cluster0.ukhyx.mongodb.net/questionsDB?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (!err) {
      console.log("Connected to mongodb");
    } else {
      console.log(err);
    }
  }
);

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
  a: String,
  b: String,
  c: String,
  d: String,
});

const Question = mongoose.model("Question", questionSchema);

const personSchema = new mongoose.Schema({
  name: String,
  score: Number,
});

const Person = mongoose.model("Person", personSchema);
let person;
let found = false;
let questions = [];

app.get("/", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  found = false;
  questions = [];
  person = new Person({
    name: req.body.name,
    score: 0,
  });
  Person.findOne({ name: person.name }, function (err, foundPerson) {
    if (!err) {
      if (!foundPerson) {
        person.save().then(() => {
          console.log("Successfully inserted one person");
        });
        res.redirect("/questions");
      } else {
        found = true;
        console.log("one person found!");
        res.redirect("/questions");
      }
    }
  });
});

app.get("/questions", function (req, res) {
  Question.find(function (err, foundQuestions) {
    if (!err) {
      if (foundQuestions.length === 0) {
        res.send("No question available");
      } else {
        const shuffledQuestions = shuffleArray(foundQuestions);
        shuffledQuestions.forEach((question) => {
          const obj = {
            id: question._id,
            ans: question.answer,
          };
          questions.push(obj);
        });
        res.render("index", {
          questions: shuffledQuestions,
        });
      }
    }
  });
});

app.get("/final-results", function (req, res) {
  Person.find(function (err, foundPeople) {
    foundPeople.sort((a, b) => {
      return b.score - a.score;
    });
    if (!err) {
      res.render("final-results", { peopleItems: foundPeople });
    }
  });
});

function checkScore(answers) {
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
  points = 0;
  questions = [];
  // return person;
}

app.post("/", function (req, res) {
  checkScore(req.body);
  if (found) {
    Person.updateOne(
      { name: person.name },
      { score: person.score },
      function (err) {
        if (!err) {
          console.log("Successfully updated person's score!");
        } else {
          console.log(err);
        }
      }
    );
  } else {
    person.save().then(() => {
      console.log("Successfully added new person's score!");
    });
  }

  res.redirect("/final-results");

  // Person.find(function (err, foundPerson) {
  //   if (!err) {
  //     if (foundPerson.length === 0) {
  //       res.send("Person not found!");
  //     } else {
  //       res.render("final-results", { peopleItems: [person] });
  //     }
  //   }
  // });
});

app.get("/questions", function (req, res) {
  Question.find(function (err, foundQuestions) {
    if (!err) {
      res.send(foundQuestions);
    } else {
      res.send(err);
    }
  });
});

app.post("/questions", function (req, res) {
  const newQuestion = new Question({
    question: req.body.question,
    a: req.body.a,
    b: req.body.b,
    c: req.body.c,
    d: req.body.d,
  });
  newQuestion.save(function (err) {
    if (!err) {
      res.send("Successfully inserted one question!");
    } else {
      res.send(err);
    }
  });
});

const route = process.env.PORT || 3000;

app.listen(route, function () {
  console.log("Server started at port 3000");
});

// app.post("/next", function (req, res) {
//   ++idx;
//   res.redirect("/questions");
// });

// app.post("/prev", function (req, res) {
//   --idx;
//   res.redirect("/questions");
// });

// app.post("/change-question-section", function (req, res) {
//   idx = req.body.idx[0];
//   res.redirect("/questions");
// });

// Question.find(function (err, foundQuestions) {
//   if (!err) {
//     if (foundQuestions.length === 0) {
//       console.log("No question available");
//     } else {
//       totQuestions = foundQuestions.length;
//       let counter = 0;
//       const shuffledQuestions = shuffleArray(foundQuestions);
//       let questionPart = [];
//       shuffledQuestions.forEach((question) => {
//         if (counter++ == 5) {
//           allQuestions.push(questionPart);
//           questionPart = [];
//           ++totParts;
//         }
//         questionPart.push(question);
//       });
//       allQuestions.push(questionPart);
//     }
//   }
// });
