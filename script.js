const API_BASE = "https://api.quran.com/api/v4";

let chapters = [];
let juzList = [];

let currentJuzNumber = null;
let currentJuzVerses = [];
let currentSurahSection = null;
let currentLessonVerses = [];

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
    alert("Quran data could not load. Please check your internet connection.");
  }
}

function updateStats() {
  document.getElementById("xp").textContent = xp;
  document.getElementById("streak").textContent = streak;
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
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
  return chapter ? chapter.name_simple : "Surah " + chapterNumber;
}

function getChapterArabicName(chapterNumber) {
  const chapter = chapters.find(ch => ch.id === Number(chapterNumber));
  return chapter ? chapter.name_arabic : "";
}

function getJuzInfo(juzNumber) {
  return juzList.find(juz => juz.juz_number === Number(juzNumber));
}

function getSavedJuzProgress(juzNumber) {
  return Number(localStorage.getItem("juz-progress-" + juzNumber)) || 0;
}

function getSavedSectionProgress(juzNumber, chapterNumber) {
  return Number(localStorage.getItem(`section-progress-${juzNumber}-${chapterNumber}`)) || 0;
}

/* JOURNEY SCREEN */

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

    bubble.className = "juz-bubble open";

    if (progress >= 100) {
      bubble.classList.add("completed");
    } else if (progress > 0) {
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

/* OPEN JUZ */

async function openJuz(juzNumber) {
  currentJuzNumber = juzNumber;

  document.getElementById("juz-title").textContent = "Loading Juz " + juzNumber + "...";
  document.getElementById("juz-subtitle").textContent = "Fetching Quran verses";
  showScreen("juz-detail-screen");

  try {
    currentJuzVerses = await fetchAllVersesByJuz(juzNumber);
    showJuzDetail(juzNumber);
  } catch (error) {
    console.error(error);
    alert("Could not load this Juz. Please try again.");
  }
}

/*
  Quran.com API paginates verses.
  Maximum per_page is 50, so this function keeps fetching until all pages are loaded.
*/
async function fetchAllVersesByJuz(juzNumber) {
  let allVerses = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url =
      `${API_BASE}/verses/by_juz/${juzNumber}` +
      `?language=en&words=false&fields=text_uthmani,verse_key,chapter_id,verse_number,juz_number&page=${page}&per_page=50`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.verses) {
      throw new Error("No verses returned from API.");
    }

    allVerses = allVerses.concat(data.verses);

    if (data.pagination && data.pagination.next_page) {
      page = data.pagination.next_page;
    } else {
      hasNextPage = false;
    }
  }

  return allVerses.map(verse => ({
    key: verse.verse_key,
    arabic: verse.text_uthmani,
    chapterNumber: Number(verse.verse_key.split(":")[0]),
    ayahNumber: Number(verse.verse_key.split(":")[1])
  }));
}

function showJuzDetail(juzNumber) {
  const groupedSections = groupVersesBySurah(currentJuzVerses);
  const juzInfo = getJuzInfo(juzNumber);
  const juzProgress = getSavedJuzProgress(juzNumber);

  document.getElementById("juz-title").textContent = "Juz " + juzNumber;

  document.getElementById("juz-subtitle").textContent =
    `${groupedSections.length} surah section(s) · ${currentJuzVerses.length} ayahs`;

  document.getElementById("juz-progress-fill").style.width = juzProgress + "%";
  document.getElementById("juz-progress-text").textContent = juzProgress + "%";

  const list = document.getElementById("surah-list");
  list.innerHTML = "";

  groupedSections.forEach(section => {
    const progress = getSavedSectionProgress(juzNumber, section.chapterNumber);

    const card = document.createElement("div");
    card.className = "surah-item";

    card.innerHTML = `
      <div>
        <h3>${getChapterName(section.chapterNumber)}</h3>
        <p>${getChapterArabicName(section.chapterNumber)} · Ayahs ${section.startAyah}-${section.endAyah}</p>
      </div>

      <span class="surah-pill">${progress}%</span>
    `;

    card.onclick = () => {
      openSurahSection(section);
    };

    list.appendChild(card);
  });

  if (juzInfo) {
    console.log("Juz API info:", juzInfo);
  }

  showScreen("juz-detail-screen");
}

function groupVersesBySurah(verses) {
  const sections = [];

  verses.forEach(verse => {
    const lastSection = sections[sections.length - 1];

    if (!lastSection || lastSection.chapterNumber !== verse.chapterNumber) {
      sections.push({
        chapterNumber: verse.chapterNumber,
        startAyah: verse.ayahNumber,
        endAyah: verse.ayahNumber,
        verses: [verse]
      });
    } else {
      lastSection.endAyah = verse.ayahNumber;
      lastSection.verses.push(verse);
    }
  });

  return sections;
}

/* SURAH SECTION */

function openSurahSection(section) {
  currentSurahSection = section;
  currentLessonVerses = section.verses;

  const progress = getSavedSectionProgress(
    currentJuzNumber,
    section.chapterNumber
  );

  document.getElementById("surah-title").textContent =
    "Surah " + getChapterName(section.chapterNumber);

  document.getElementById("surah-meta").textContent =
    `${getChapterArabicName(section.chapterNumber)} · Juz ${currentJuzNumber} · Ayahs ${section.startAyah}-${section.endAyah}`;

  document.getElementById("surah-progress-fill").style.width = progress + "%";
  document.getElementById("surah-progress-text").textContent = progress + "%";

  showScreen("surah-detail-screen");
}

function backToJuz() {
  if (currentJuzNumber && currentJuzVerses.length > 0) {
    showJuzDetail(currentJuzNumber);
  } else {
    showJourney();
  }
}

/* LESSON ENGINE */

function startLesson() {
  if (!currentLessonVerses || currentLessonVerses.length === 0) {
    alert("Please open a surah section first.");
    return;
  }

  currentQuestion = 0;
  score = 0;

  totalQuestions = Math.min(5, currentLessonVerses.length);

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

  const randomIndex = Math.floor(Math.random() * currentLessonVerses.length);
  currentVerse = currentLessonVerses[randomIndex];

  document.getElementById("verse").textContent = currentVerse.arabic;

  createChoices();
}

function createChoices() {
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  let choices = [currentVerse.key];

  while (choices.length < 4 && choices.length < currentLessonVerses.length) {
    const randomVerse =
      currentLessonVerses[Math.floor(Math.random() * currentLessonVerses.length)];

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

  if (currentSurahSection) {
    const oldProgress = getSavedSectionProgress(
      currentJuzNumber,
      currentSurahSection.chapterNumber
    );

    const newProgress = Math.min(100, oldProgress + 10);

    localStorage.setItem(
      `section-progress-${currentJuzNumber}-${currentSurahSection.chapterNumber}`,
      newProgress
    );

    updateJuzProgress(currentJuzNumber);
  }

  updateStats();

  document.getElementById("score-summary").textContent =
    "You scored " + score + " / " + totalQuestions;

  showScreen("complete-screen");
}

function updateJuzProgress(juzNumber) {
  const sections = groupVersesBySurah(currentJuzVerses);

  if (sections.length === 0) {
    return;
  }

  let total = 0;

  sections.forEach(section => {
    total += getSavedSectionProgress(juzNumber, section.chapterNumber);
  });

  const average = Math.round(total / sections.length);

  localStorage.setItem("juz-progress-" + juzNumber, average);
}
