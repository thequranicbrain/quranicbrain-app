const verses = [
  {
    key: "1:1",
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
  },
  {
    key: "1:2",
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
  },
  {
    key: "1:6",
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ"
  },
  {
    key: "114:1",
    arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ"
  },
  {
    key: "114:2",
    arabic: "مَلِكِ ٱلنَّاسِ"
  }
];

let currentVerse = null;
let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;

document.getElementById("xp").textContent = xp;
document.getElementById("streak").textContent = streak;

function newQuestion() {
  const randomIndex = Math.floor(Math.random() * verses.length);
  currentVerse = verses[randomIndex];

  document.getElementById("verse").textContent = currentVerse.arabic;
  document.getElementById("answer").value = "";
  document.getElementById("result").textContent = "";
}

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value.trim();

  if (userAnswer === currentVerse.key) {
    xp += 10;
    streak += 1;

    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);

    document.getElementById("xp").textContent = xp;
    document.getElementById("streak").textContent = streak;
    document.getElementById("result").textContent = "✅ Correct! +" + 10 + " XP";
  } else {
    document.getElementById("result").textContent =
      "❌ Try again. Correct answer: " + currentVerse.key;
  }
}

newQuestion();
