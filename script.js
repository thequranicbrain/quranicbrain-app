const juzData = [
  { number: 1, progress: 20, status: "current", surahs: ["Al-Fatihah", "Al-Baqarah"] },
  { number: 2, progress: 0, status: "locked", surahs: ["Al-Baqarah"] },
  { number: 3, progress: 0, status: "locked", surahs: ["Al-Baqarah", "Ali 'Imran"] },
  { number: 4, progress: 0, status: "locked", surahs: ["Ali 'Imran", "An-Nisa"] },
  { number: 5, progress: 0, status: "locked", surahs: ["An-Nisa"] },
  { number: 6, progress: 0, status: "locked", surahs: ["An-Nisa", "Al-Ma'idah"] },
  { number: 7, progress: 0, status: "locked", surahs: ["Al-Ma'idah", "Al-An'am"] },
  { number: 8, progress: 0, status: "locked", surahs: ["Al-An'am", "Al-A'raf"] },
  { number: 9, progress: 0, status: "locked", surahs: ["Al-A'raf", "Al-Anfal"] },
  { number: 10, progress: 0, status: "locked", surahs: ["Al-Anfal", "At-Tawbah"] },
  { number: 11, progress: 0, status: "locked", surahs: ["At-Tawbah", "Yunus", "Hud"] },
  { number: 12, progress: 0, status: "locked", surahs: ["Hud", "Yusuf"] },
  { number: 13, progress: 0, status: "locked", surahs: ["Yusuf", "Ar-Ra'd", "Ibrahim"] },
  { number: 14, progress: 0, status: "locked", surahs: ["Al-Hijr", "An-Nahl"] },
  { number: 15, progress: 0, status: "locked", surahs: ["Al-Isra", "Al-Kahf"] },
  { number: 16, progress: 0, status: "locked", surahs: ["Al-Kahf", "Maryam", "Ta-Ha"] },
  { number: 17, progress: 0, status: "locked", surahs: ["Al-Anbiya", "Al-Hajj"] },
  { number: 18, progress: 0, status: "locked", surahs: ["Al-Mu'minun", "An-Nur", "Al-Furqan"] },
  { number: 19, progress: 0, status: "locked", surahs: ["Al-Furqan", "Ash-Shu'ara", "An-Naml"] },
  { number: 20, progress: 0, status: "locked", surahs: ["An-Naml", "Al-Qasas", "Al-Ankabut"] },
  { number: 21, progress: 0, status: "locked", surahs: ["Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab"] },
  { number: 22, progress: 0, status: "locked", surahs: ["Al-Ahzab", "Saba", "Fatir", "Ya-Sin"] },
  { number: 23, progress: 0, status: "locked", surahs: ["Ya-Sin", "As-Saffat", "Sad", "Az-Zumar"] },
  { number: 24, progress: 0, status: "locked", surahs: ["Az-Zumar", "Ghafir", "Fussilat"] },
  { number: 25, progress: 0, status: "locked", surahs: ["Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah"] },
  { number: 26, progress: 0, status: "locked", surahs: ["Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat"] },
  { number: 27, progress: 0, status: "locked", surahs: ["Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid"] },
  { number: 28, progress: 0, status: "locked", surahs: ["Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim"] },
  { number: 29, progress: 0, status: "locked", surahs: ["Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat"] },
  { number: 30, progress: 0, status: "locked", surahs: ["An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"] }
];

const verses = [
  { key: "1:1", surahName: "Al-Fatihah", arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" },
  { key: "1:2", surahName: "Al-Fatihah", arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ" },
  { key: "1:3", surahName: "Al-Fatihah", arabic: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" },
  { key: "1:4", surahName: "Al-Fatihah", arabic: "مَـٰلِكِ يَوْمِ ٱلدِّينِ" },
  { key: "1:5", surahName: "Al-Fatihah", arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
  { key: "1:6", surahName: "Al-Fatihah", arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ" },
  { key: "1:7", surahName: "Al-Fatihah", arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ" }
];

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;

let currentJuz = null;
let currentSurah = null;
let currentQuestion = 0;
let score = 0;
let currentVerse = null;
let totalQuestions = 5;

document.getElementById("xp").textContent = xp;
document.getElementById("streak").textContent = streak;

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(screen => screen.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");
}

function goHome() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = streak;
  showScreen("home-screen");
}

function showJourney() {
  renderJuzMap();
  showScreen("journey-screen");
}

function renderJuzMap() {
  const map = document.getElementById("juz-map");
  map.innerHTML = "";

  juzData.forEach(juz => {
    const bubble = document.createElement("button");
    bubble.className = "juz-bubble " + juz.status;
    bubble.innerHTML = `Juz ${juz.number}<br>${juz.progress}%`;

    bubble.onclick = () => {
      currentJuz = juz;
      showJuzDetail(juz);
    };

    map.appendChild(bubble);
  });
}

function showJuzDetail(juz) {
  document.getElementById("juz-title").textContent = "Juz " + juz.number;
  document.getElementById("juz-subtitle").textContent =
    juz.surahs.length + " surah section(s)";

  document.getElementById("juz-progress-fill").style.width = juz.progress + "%";
  document.getElementById("juz-progress-text").textContent = juz.progress + "% complete";

  const list = document.getElementById("surah-list");
  list.innerHTML = "";

  juz.surahs.forEach(name => {
    const card = document.createElement("div");
    card.className = "surah-card";
    card.innerHTML = `
      <h3>${name}</h3>
      <p>Progress: 0%</p>
      <button>Open Surah</button>
    `;

    card.querySelector("button").onclick = () => showSurahDetail(name);
    list.appendChild(card);
  });

  showScreen("juz-detail-screen");
}

function showSurahDetail(name) {
  currentSurah = name;

  document.getElementById("surah-title").textContent = "Surah " + name;
  document.getElementById("surah-meta").textContent =
    name === "Al-Fatihah" ? "7 ayahs" : "Coming soon";

  document.getElementById("surah-progress-fill").style.width =
    name === "Al-Fatihah" ? "20%" : "0%";

  document.getElementById("surah-progress-text").textContent =
    name === "Al-Fatihah" ? "20% complete" : "0% complete";

  showScreen("surah-detail-screen");
}

function backToJuz() {
  if (currentJuz) {
    showJuzDetail(currentJuz);
  } else {
    showJourney();
  }
}

function startLesson() {
  currentQuestion = 0;
  score = 0;
  showScreen("lesson-screen");
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

  document.getElementById("score-summary").textContent =
    "You scored " + score + " / " + totalQuestions;

  showScreen("complete-screen");
}

showScreen("home-screen");
