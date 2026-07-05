const API_BASE = "https://api.quran.com/api/v4";

let chapters = [];
let juzList = [];
let currentJuz = null;
let currentSurah = null;
let currentVerses = [];

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;

let currentQuestion = 0;
let score = 0;
let currentVerse = null;
let totalQuestions = 5;

updateStats();
initApp();

async function initApp() {
  showScreen("home-screen");

  try {
    await loadChapters();
    await loadJuzList();
  } catch (error) {
    console.error(error);
    alert("Could not load Quran data. Please check your internet connection.");
  }
}

function updateStats() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = streak;
}

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");

  screens.forEach(screen => {
    screen.classList.add("hidden");
  });

  document.getElementById(screenId).classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function goHome() {
  updateStats();
  showScreen("home-screen");
}

async function loadChapters() {
  const response = await fetch(`${API_BASE}/chapters?language=en`);
  const data = await response.json();
  chapters = data.chapters;
}

async function loadJuzList() {
  const response = await fetch(`${API_BASE}/juzs`);
  const data = await response.json();
  juzList = data.juzs;
}

function getChapterName(chapterNumber) {
  const chapter = chapters.find(ch => ch.id === Number(chapterNumber));

  if (!chapter) {
    return "Surah " + chapterNumber;
  }

  return chapter.name_simple;
}

function getChapterArabicName(chapterNumber) {
  const chapter = chapters.find(ch => ch.id === Number(chapterNumber));

  if (!chapter) {
    return "";
  }

  return chapter.name_arabic;
}

function getSavedJuzProgress(juzNumber) {
  return Number(localStorage.getItem("juz-progress-" + juzNumber)) || 0;
}

function getSavedSurahProgress(juzNumber, chapterNumber) {
  return Number(localStorage.getItem(`surah-progress-${juzNumber}-${chapterNumber}`)) || 0;
}

function showJourney() {
  renderJuzMap();
  showScreen("journey-screen");
}

function renderJuzMap() {
  const map = document.getElementById("juz-map");
  map.innerHTML = "";

  for (let i = 1; i <= 30; i++) {
    const progress = getSavedJuzProgress(i);

    const bubble = document.createElement("button");
    bubble.className = "juz-bubble";

    if (progress >= 100) {
      bubble.classList.add("completed");
    } else if (i === 30 || progress > 0) {
      bubble.classList.add("current");
    }

    bubble.innerHTML = `
      <span class="juz-number">${i}</span>
      <span class="juz-progress">${progress}%</span>
    `;

    bubble.onclick = async () => {
      await openJuz(i);
    };

    map.appendChild(bubble);
  }
}

async function openJuz(juzNumber) {
  try {
    const response = await fetch(`${API_BASE}/juzs/${juzNumber}`);
    const data = await response.json();

    currentJuz = data.juz;

    showJuzDetail(currentJuz);
  } catch (error) {
    console.error(error);
    alert("Could not load this Juz. Please try again.");
  }
}

function showJuzDetail(juz) {
  document.getElementById("juz-title").textContent = "Juz " + juz.juz_number;

  document.getElementById("juz-subtitle").textContent =
    `${Object.keys(juz.verse_mapping).length} surah section(s) · ${juz.verses_count} ayahs`;

  const juzProgress = getSavedJuzProgress(juz.juz_number);

  document.getElementById("juz-progress-fill").style.width = juzProgress + "%";
  document.getElementById("juz-progress-text").textContent = juzProgress + "%";

  const list = document.getElementById("surah-list");
  list.innerHTML = "";

  Object.entries(juz.verse_mapping).forEach(([chapterNumber, verseRange]) => {
    const progress = getSavedSurahProgress(juz.juz_number, chapterNumber);

    const card = document.createElement("div");
    card.className = "surah-item";

    card.innerHTML = `
      <div>
        <h3>${getChapterName(chapterNumber)}</h3>
        <p>${getChapterArabicName(chapterNumber)} · Ayahs ${verseRange}</p>
      </div>

      <span class="surah-pill">${progress}%</span>
    `;

    card.onclick = async () => {
      await openSurahSection(juz.juz_number, chapterNumber, verseRange);
    };

    list.appendChild(card);
  });

  showScreen("juz-detail-screen");
}

async function openSurahSection(juzNumber, chapterNumber, verseRange) {
  currentSurah = {
    juzNumber,
    chapterNumber: Number(chapterNumber),
    verseRange
  };

  document.getElementById("surah-title").textContent =
    "Surah " + getChapterName(chapterNumber);

  document.getElementById("surah-meta").textContent =
    `${getChapterArabicName(chapterNumber)} · Ayahs ${verseRange}`;

  const progress = getSavedSurahProgress(juzNumber, chapterNumber);

  document.getElementById("surah-progress-fill").style.width = progress + "%";
  document.getElementById("surah-progress-text").textContent = progress + "%";

  await loadVersesForSurahSection(chapterNumber, verseRange);

  showScreen("surah-detail-screen");
}

async function loadVersesForSurahSection(chapterNumber, verseRange) {
  const [startAyah, endAyah] = verseRange.split("-").map(Number);

  const response = await fetch(
    `${API_BASE}/verses/by_chapter/${chapterNumber}?language=en&words=false&per_page=300&fields=text_uthmani,verse_key`
  );

  const data = await response.json();

  currentVerses = data.verses
    .filter(verse => {
      const ayahNumber = Number(verse.verse_key.split(":")[1]);
      return ayahNumber >= startAyah && ayahNumber <= endAyah;
    })
    .map(verse => ({
      key: verse.verse_key,
      arabic: verse.text_uthmani,
      chapterNumber: Number(chapterNumber)
    }));
}

function backToJuz() {
  if (currentJuz) {
    showJuzDetail(currentJuz);
  } else {
    showJourney();
  }
}

function startLesson() {
  if (!currentVerses || currentVerses.length === 0) {
    alert("No ayahs loaded yet. Please reopen this surah.");
    return;
  }

  currentQuestion = 0;
  score = 0;

  totalQuestions = Math.min(5, currentVerses.length);

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

  const randomIndex = Math.floor(Math.random() * currentVerses.length);
  currentVerse = currentVerses[randomIndex];

  document.getElementById("verse").textContent = currentVerse.arabic;

  createChoices();
}

function createChoices() {
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  let choices = [currentVerse.key];

  while (choices.length < 4 && choices.length < currentVerses.length) {
    const randomVerse =
      currentVerses[Math.floor(Math.random() * currentVerses.length)];

    if (!choices.includes(randomVerse.key)) {
      choices.push(randomVerse.key);
    }
  }

  choices = choices.sort(() => Math.random() - 0.5);

  choices.forEach(choice => {
    const button = document.createElement("button");

    button.textContent = "Ayah " + choice;
    button.className = "choice-btn";

    button.onclick = () => checkAnswer(choice, button);

    choicesDiv.appendChild(button);
  });
}

function checkAnswer(selected, selectedButton) {
  const allButtons = document.querySelectorAll(".choice-btn");

  allButtons.forEach(button => {
    button.disabled = true;

    const ayahKey = button.textContent.replace("Ayah ", "");

    if (ayahKey === currentVerse.key) {
      button.classList.add("correct");
    }
  });

  if (selected === currentVerse.key) {
    score++;
    xp += 10;

    selectedButton.classList.add("correct");

    document.getElementById("result").textContent = "✅ Correct! +10 XP";
  } else {
    selectedButton.classList.add("wrong");

    document.getElementById("result").textContent =
      "❌ Correct answer: Ayah " + currentVerse.key;
  }

  localStorage.setItem("xp", xp);
  updateStats();

  setTimeout(loadQuestion, 1300);
}

function finishLesson() {
  streak++;

  localStorage.setItem("streak", streak);
  localStorage.setItem("xp", xp);

  if (currentSurah) {
    const oldProgress = getSavedSurahProgress(
      currentSurah.juzNumber,
      currentSurah.chapterNumber
    );

    const newProgress = Math.min(100, oldProgress + 10);

    localStorage.setItem(
      `surah-progress-${currentSurah.juzNumber}-${currentSurah.chapterNumber}`,
      newProgress
    );

    updateJuzProgress(currentSurah.juzNumber);
  }

  updateStats();

  document.getElementById("score-summary").textContent =
    "You scored " + score + " / " + totalQuestions;

  showScreen("complete-screen");
}

function updateJuzProgress(juzNumber) {
  const juz = juzList.find(item => item.juz_number === Number(juzNumber));

  if (!juz) {
    return;
  }

  const chapterNumbers = Object.keys(juz.verse_mapping);

  let total = 0;

  chapterNumbers.forEach(chapterNumber => {
    total += getSavedSurahProgress(juzNumber, chapterNumber);
  });

  const averageProgress = Math.round(total / chapterNumbers.length);

  localStorage.setItem("juz-progress-" + juzNumber, averageProgress);
}
