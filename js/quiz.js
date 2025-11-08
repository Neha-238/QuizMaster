const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category") || 9;
const difficulty = urlParams.get("difficulty") || "easy";
const amount = urlParams.get("amount") || 10;

const quizCard = document.querySelector(".quiz-card");
const questionNumber = document.getElementById("question-number");
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const quitBtn = document.getElementById("quit-btn");
const skipBtn = document.getElementById("skip-btn");

const resultContainer = document.getElementById("result-container");
const scoreEl = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
const TIME_PER_QUESTION = 15;
let timeLeft = TIME_PER_QUESTION;

// Audio for correct/wrong
const correctSound = new Audio(
  "https://www.soundjay.com/buttons/sounds/button-4.mp3"
);
const wrongSound = new Audio(
  "https://www.soundjay.com/buttons/sounds/button-10.mp3"
);

// Fetch questions
async function fetchQuestions() {
  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    const data = await res.json();
    questions = data.results.map((q) => {
      const options = [...q.incorrect_answers, q.correct_answer];
      return {
        question: decodeHTML(q.question),
        options: shuffleArray(options.map(decodeHTML)),
        correct: decodeHTML(q.correct_answer),
        userAnswer: "", // initialize user answer
      };
    });
    showQuestion();
  } catch (err) {
    questionEl.innerText = "Failed to load questions. Try refreshing!";
    console.error(err);
  }
}

// Utility functions
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Display question
function startTimer() {
  clearInterval(timer);
  timeLeft = TIME_PER_QUESTION;
  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextBtn.click();
    }
  }, 1000);
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = TIME_PER_QUESTION;
  nextBtn.disabled = true;

  const q = questions[currentQuestionIndex];
  questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;
  questionEl.innerText = q.question;

  optionsContainer.innerHTML = "";

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.innerText = option;
    btn.addEventListener("click", () => selectAnswer(btn, q.correct));
    optionsContainer.appendChild(btn);
  });

  // Update progress
  progressBar.style.width = `${
    (currentQuestionIndex / questions.length) * 100
  }%`;

  startTimer();
}

// Handle selection
function selectAnswer(button, correctAnswer) {
  clearInterval(timer);
  const buttons = optionsContainer.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));

  // Store user's answer
  questions[currentQuestionIndex].userAnswer = button.innerText;

  if (button.innerText === correctAnswer) {
    button.style.background = "green";
    score++;
    correctSound.play();
  } else {
    button.style.background = "red";
    wrongSound.play();
    buttons.forEach((btn) => {
      if (btn.innerText === correctAnswer) btn.style.background = "green";
    });
  }
  nextBtn.disabled = false;
}

// Next question
nextBtn.addEventListener("click", nextQuestion);

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// Skip button
skipBtn.addEventListener("click", () => {
  clearInterval(timer);
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

// Show result & redirect to score page
function showResult() {
  clearInterval(timer);

  const dataToPass = questions.map((q) => ({
    question: q.question,
    correct: q.correct,
    userAnswer: q.userAnswer || "",
  }));

  const url = `score.html?score=${score}&total=${
    questions.length
  }&data=${encodeURIComponent(JSON.stringify(dataToPass))}`;
  window.location.href = url;
}

// Quit button redirects to score page
quitBtn.addEventListener("click", () => {
  clearInterval(timer);

  const dataToPass = questions.map((q) => ({
    question: q.question,
    correct: q.correct,
    userAnswer: q.userAnswer || "",
  }));

  const url = `score.html?score=${score}&total=${currentQuestionIndex}&data=${encodeURIComponent(
    JSON.stringify(dataToPass)
  )}`;
  window.location.href = url;
});

// Initialize
fetchQuestions();
