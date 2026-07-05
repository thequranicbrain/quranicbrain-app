const verses = [
  {
    key: "1:1",
    surahName: "Al-Fatihah",
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
  },
  {
    key: "1:2",
    surahName: "Al-Fatihah",
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
  },
  {
    key: "1:6",
    surahName: "Al-Fatihah",
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ"
  },
  {
    key: "114:1",
    surahName: "An-Nas",
    arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ"
  },
  {
    key: "114:2",
    surahName: "An-Nas",
    arabic: "مَلِكِ ٱلنَّاسِ"
  }
];

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;

let currentQuestion = 0;
let score = 0;
let currentVerse = null;
let totalQuestions = 5;

document.getElementById("xp").textContent = xp;
document.getElementById("streak").textContent = streak;

function startLesson() {
  currentQuestion = 0;
  score = 0;

  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("complete-screen").classList.add("hidden");
  document.getElementById("lesson-screen").classList.remove("hidden");

  loadQuestion();
}

function loadQuestion() {
  currentQuestion++;

  if (currentQuestion > totalQuestions) {
    finishLesson();
    return;
  }

  document.getElementById("question-count").textContent =
    "Question " + currentQuestion + " / " + totalQuestions;

  document.getElementById("result").textContent = "";

  const randomIndex = Math.floor(Math.random() * verses.length);
  currentVerse = verses[randomIndex];

  document.getElementById("verse").textContent = currentVerse.arabic;

  createChoices();
}

function createChoices() {
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  let choices = [currentVerse.key];

  while (choices.length < 4) {
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    if (!choices.includes(randomVerse.key)) {
      choices.push(randomVerse.key);
    }
  }

  choices = choices.sort(() => Math.random() - 0.5);

  choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice;
    button.className = "choice-btn";
    button.onclick = () => checkAnswer(choice, button);
    choicesDiv.appendChild(button);
  });
}

function checkAnswer(selected, button) {
  const allButtons = document.querySelectorAll(".choice-btn");
  allButtons.forEach(btn => btn.disabled = true);

  if (selected === currentVerse.key) {
    score++;
    xp += 10;
    button.classList.add("correct");
    document.getElementById("result").textContent = "✅ Correct! +10 XP";
  } else {
    button.classList.add("wrong");
    document.getElementById("result").textContent =
      "❌ Correct answer: " + currentVerse.key;
  }

  localStorage.setItem("xp", xp);

  setTimeout(loadQuestion, 1200);
}

function finishLesson() {
  streak++;
  localStorage.setItem("streak", streak);
  localStorage.setItem("xp", xp);

  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = streak;

  document.getElementById("lesson-screen").classList.add("hidden");
  document.getElementById("complete-screen").classList.remove("hidden");

  document.getElementById("score-summary").textContent =
    "You scored " + score + " / " + totalQuestions;
}

function goHome() {
  document.getElementById("complete-screen").classList.add("hidden");
  document.getElementById("home-screen").classList.remove("hidden");

  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = streak;
}
document.getElementById("lesson-screen").classList.add("hidden");
document.getElementById("complete-screen").classList.add("hidden");
document.getElementById("home-screen").classList.remove("hidden");


