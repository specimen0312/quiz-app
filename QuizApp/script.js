// ---------- Question Bank (MCQ only) ----------
const BANK = {
  se: [
    {
      q: "What is software (as a definition)?",
      choices: [
        "Network protocols between computers",
        "Physical components of a computer system",
        "The process of designing and developing applications",
        "Programs and related operating information used by a computer"
      ],
      answerIndex: 3
    },
    {
      q: "What is the primary focus of software engineering as a discipline?",
      choices: [
        "Only software development",
        "Only software testing",
        "Only software maintenance",
        "All aspects of software production"
      ],
      answerIndex: 3
    },
    {
      q: "Which set best matches key attributes of good software?",
      choices: [
        "Portability, efficiency, dependability, maintainability",
        "Efficiency, scalability, usability, security",
        "Maintainability, acceptability, dependability, security",
        "Maintainability, performance, reliability, usability"
      ],
      answerIndex: 2
    },
    {
      q: "Which is an example of a software product?",
      choices: ["A CPU", "A compiler", "A keyboard", "A motherboard"],
      answerIndex: 1
    },
    {
      q: "What does 'maintenance' typically include?",
      choices: [
        "Only writing new code",
        "Fixing bugs, adapting to changes, improving performance",
        "Buying new hardware",
        "Stopping development completely"
      ],
      answerIndex: 1
    }
  ],

  js: [
    {
      q: "What does 'const' do in JavaScript?",
      choices: ["Creates a constant variable binding", "Creates a loop", "Creates HTML", "Creates a class"],
      answerIndex: 0
    },
    {
      q: "Which one is a correct function declaration?",
      choices: ["function = myFunc() {}", "function myFunc() {}", "func myFunc() {}", "myFunc function() {}"],
      answerIndex: 1
    },
    {
      q: "Which is used to select an element by id?",
      choices: ["document.getElementById()", "document.getElementsByClass()", "document.queryAll()", "document.findById()"],
      answerIndex: 0
    },
    {
      q: "Which value is 'falsey' in JavaScript?",
      choices: ["'hello'", "1", "0", "[]"],
      answerIndex: 2
    }
  ],

  html: [
    {
      q: "What does HTML stand for?",
      choices: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Markup Language", "Home Tool Markup Language"],
      answerIndex: 0
    },
    {
      q: "Which tag is used for a big heading?",
      choices: ["<h6>", "<head>", "<h1>", "<p>"],
      answerIndex: 2
    },
    {
      q: "Which tag makes a line break?",
      choices: ["<br>", "<hr>", "<break>", "<lb>"],
      answerIndex: 0
    }
  ]
};

// ---------- Elements ----------
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const categorySelect = document.getElementById("categorySelect");
const numQuestionsInput = document.getElementById("numQuestions");
const timerMinutesInput = document.getElementById("timerMinutes");
const mcqToggle = document.getElementById("mcqToggle");

const generateBtn = document.getElementById("generateBtn");
const viewBankBtn = document.getElementById("viewBankBtn");

const questionText = document.getElementById("questionText");
const choicesDiv = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");

const qCounter = document.getElementById("qCounter");
const timerBox = document.getElementById("timerBox");
const barFill = document.getElementById("barFill");
const scorePill = document.getElementById("scorePill");

const scoreBig = document.getElementById("scoreBig");
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restartBtn");
const reviewBtn = document.getElementById("reviewBtn");
const reviewList = document.getElementById("reviewList");

// right panel
const panel = document.getElementById("rightPanel");
const closePanelBtn = document.getElementById("closePanelBtn");
const panelQuestions = document.getElementById("panelQuestions");
const panelTimer = document.getElementById("panelTimer");
const panelMcq = document.getElementById("panelMcq");
const startBtn = document.getElementById("startBtn");
const openSettingsFromSidebar = document.getElementById("openSettingsFromSidebar");

// modal
const modalBackdrop = document.getElementById("modalBackdrop");
const modalQuestions = document.getElementById("modalQuestions");
const modalTimer = document.getElementById("modalTimer");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalStartBtn = document.getElementById("modalStartBtn");

// topbar bits
const titleText = document.getElementById("titleText");

// ---------- State ----------
let testQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedIndex = null;
let answers = []; // { chosen, correct }
let timerSeconds = 0;
let timerId = null;

// ---------- Helpers ----------
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

function startTimer() {
  stopTimer();
  if (timerSeconds <= 0) {
    timerBox.innerText = "∞";
    return;
  }
  timerBox.innerText = formatTime(timerSeconds);

  timerId = setInterval(() => {
    timerSeconds--;
    timerBox.innerText = formatTime(timerSeconds);

    if (timerSeconds <= 0) {
      stopTimer();
      endQuiz();
    }
  }, 1000);
}

// ---------- Sync settings between start form, right panel, modal ----------
function syncSettingsToAll() {
  const q = clamp(parseInt(numQuestionsInput.value || "10", 10), 3, 20);
  const t = clamp(parseInt(timerMinutesInput.value || "30", 10), 0, 180);
  const mcq = mcqToggle.checked;

  numQuestionsInput.value = q;
  timerMinutesInput.value = t;
  mcqToggle.checked = mcq;

  panelQuestions.value = q;
  panelTimer.value = t;
  panelMcq.checked = mcq;

  modalQuestions.value = q;
  modalTimer.value = t;
}

function syncFromPanel() {
  numQuestionsInput.value = panelQuestions.value;
  timerMinutesInput.value = panelTimer.value;
  mcqToggle.checked = panelMcq.checked;
  syncSettingsToAll();
}

function syncFromModal() {
  numQuestionsInput.value = modalQuestions.value;
  timerMinutesInput.value = modalTimer.value;
  syncSettingsToAll();
}

// ---------- Generate test ----------
generateBtn.addEventListener("click", () => {
  syncSettingsToAll();

  if (!mcqToggle.checked) {
    alert("MCQ only for now. Keep Multiple choice ON.");
    mcqToggle.checked = true;
    syncSettingsToAll();
    return;
  }

  // show modal like Quizlet
  show(modalBackdrop);
});

modalCloseBtn.addEventListener("click", () => hide(modalBackdrop));
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) hide(modalBackdrop);
});

modalStartBtn.addEventListener("click", () => {
  syncFromModal();
  hide(modalBackdrop);
  buildAndStartTest();
});

startBtn.addEventListener("click", () => {
  syncFromPanel();
  buildAndStartTest();
});

// optional panel open/close
closePanelBtn.addEventListener("click", () => panel.classList.add("hidden"));
openSettingsFromSidebar.addEventListener("click", () => panel.classList.remove("hidden"));

// keep panel in sync when user edits
panelQuestions.addEventListener("input", syncFromPanel);
panelTimer.addEventListener("input", syncFromPanel);
panelMcq.addEventListener("change", syncFromPanel);

// ---------- Build test + start ----------
function buildAndStartTest() {
  const category = categorySelect.value;
  const bank = BANK[category] || [];
  const count = clamp(parseInt(numQuestionsInput.value || "10", 10), 3, 20);
  const minutes = clamp(parseInt(timerMinutesInput.value || "30", 10), 0, 180);

  // If bank is small, repeat shuffle but still pick up to bank size
  const pool = shuffle(bank);
  testQuestions = pool.slice(0, Math.min(count, pool.length));

  // Update title like the screenshots
  if (category === "se") titleText.innerText = "Software Engineering Concepts Practice Test";
  if (category === "js") titleText.innerText = "JavaScript Basics Practice Test";
  if (category === "html") titleText.innerText = "HTML Basics Practice Test";

  currentIndex = 0;
  score = 0;
  selectedIndex = null;
  answers = [];

  timerSeconds = minutes * 60;

  hide(startScreen);
  hide(resultScreen);
  show(quizScreen);

  startTimer();
  loadQuestion();
}

// ---------- Load question ----------
function loadQuestion() {
  selectedIndex = null;
  choicesDiv.innerHTML = "";
  hide(nextBtn);

  const qObj = testQuestions[currentIndex];

  qCounter.innerText = `${currentIndex + 1}/${testQuestions.length}`;
  scorePill.innerText = `Score: ${score}`;
  barFill.style.width = `${(currentIndex / testQuestions.length) * 100}%`;

  questionText.innerText = qObj.q;

  qObj.choices.forEach((text, idx) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.innerText = text;

    btn.addEventListener("click", () => handleChoice(idx));

    choicesDiv.appendChild(btn);
  });
}

// ---------- Handle choice ----------
function handleChoice(idx) {
  if (selectedIndex !== null) return;
  selectedIndex = idx;

  const qObj = testQuestions[currentIndex];
  const buttons = document.querySelectorAll(".choiceBtn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === qObj.answerIndex) btn.classList.add("correct");
    if (i === idx && idx !== qObj.answerIndex) btn.classList.add("wrong");
  });

  const correct = idx === qObj.answerIndex;
  if (correct) score++;

  answers.push({ chosen: idx, correct: qObj.answerIndex });

  scorePill.innerText = `Score: ${score}`;
  barFill.style.width = `${((currentIndex + 1) / testQuestions.length) * 100}%`;

  show(nextBtn);
}

// ---------- Next ----------
nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= testQuestions.length) endQuiz();
  else loadQuestion();
});

// ---------- End ----------
function endQuiz() {
  stopTimer();

  hide(quizScreen);
  show(resultScreen);

  scoreBig.innerText = `${score}/${testQuestions.length}`;
  scoreText.innerText = `You got ${score} correct. Want to review what you missed?`;

  hide(reviewList);
  reviewList.innerHTML = "";
}

// ---------- Restart ----------
restartBtn.addEventListener("click", () => {
  stopTimer();
  hide(resultScreen);
  show(startScreen);
});

// ---------- Review ----------
reviewBtn.addEventListener("click", () => {
  if (!answers.length) return;

  reviewList.innerHTML = "";
  show(reviewList);

  testQuestions.forEach((q, i) => {
    const a = answers[i];
    const you = q.choices[a.chosen];
    const correct = q.choices[a.correct];
    const ok = a.chosen === a.correct;

    const item = document.createElement("div");
    item.className = "reviewItem";
    item.innerHTML = `
      <div><strong>Q${i + 1}:</strong> ${q.q}</div>
      <div class="small">Your answer: <span style="color:${ok ? "rgba(34,197,94,0.95)" : "rgba(239,68,68,0.95)"}">${you}</span></div>
      <div class="small">Correct: <span style="color:rgba(34,197,94,0.95)">${correct}</span></div>
    `;
    reviewList.appendChild(item);
  });
});

// ---------- View bank (simple) ----------
viewBankBtn.addEventListener("click", () => {
  alert("Question bank lives in script.js under BANK.\nNext upgrade: load bank from a JSON file.");
});

// ---------- Initialize settings sync ----------
syncSettingsToAll();
