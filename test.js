document.addEventListener("DOMContentLoaded", () => {

  // ---------------- REGISTER ----------------
  const registerForm = document.getElementById("registresanas");
  if (registerForm) {
    registerForm.onsubmit = async (e) => {
      e.preventDefault();

      const vards = document.getElementById("vards");
      const lietotajvards = document.getElementById("lietotajvards");
      const parole = document.getElementById("parole");
      const e_pasts = document.getElementById("e_pasts");

      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vards: vards?.value,
          lietotajvards: lietotajvards?.value,
          parole: parole?.value,
          e_pasts: e_pasts?.value
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        vards.value = "";
        lietotajvards.value = "";
        parole.value = "";
        e_pasts.value = "";
      } else {
        alert(result.error);
      }
    };
  }

  // ---------------- LOGIN ----------------
  const loginForm = document.getElementById("log_in");
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();

      const lietotajvards_log = document.getElementById("lietotajvards_log");
      const parole_log = document.getElementById("parole_log");

      const response = await fetch("/log_in", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lietotajvards: lietotajvards_log?.value,
          parole: parole_log?.value,
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(lietotajvards_log.value + " login successful!");
        lietotajvards_log.value = "";
        parole_log.value = "";
        location.reload();
      } else {
        alert(result.error);
      }
    };
  }

  // ---------------- LOGOUT ----------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const response = await fetch("/log_out", 
        { method: "POST", credentials: "include" });
      const result = await response.json();

      if (result.ok) {
        alert("Logged out successfully!");
        location.reload();
      } else {
        alert("Logout failed");
      }});}

  // ---------------- CHANGE PASSWORD ----------------
  const changeForm = document.getElementById("change_password");
  if (changeForm) {
    changeForm.onsubmit = async (e) => {
      e.preventDefault();

      const old_password = document.getElementById("parole_old");
      const new_password = document.getElementById("parole_new");

      const response = await fetch("/change_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: old_password?.value,
          new_password: new_password?.value,
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password changed!");
        old_password.value = "";
        new_password.value = "";
      } else {
        alert(result.error);
      }
    };
  }

  // ---------------- SHOW RESULTS ----------------
  const paraditBtn = document.getElementById("paradit_rez");
  
  if (paraditBtn) {
    paraditBtn.addEventListener("click", async () => {
      const response = await fetch("/paradit_rez",{method: "GET",
      credentials: "include"});

      const result = await response.json();

      if (!result.ok) {
        alert(result.error);
      }

      if (result.ok) {
        let text = "";
        result.rezultati.forEach(r => {
          text += `
            <div>
              Spēle: ${r[1]} <br>
              Mēģinājums: ${r[2]} <br>
              Rezultāts: ${r[0]}%
            </div><br>
          `;
        });

        const output = document.getElementById("paradit_button");
        if (output) output.innerHTML = text;
      }
    });
  }

  // ---------------- GAME ----------------
  const startBtn = document.getElementById('start-btn');
  const studyBtn = document.getElementById('study-btn');
  const endStudyBtn = document.getElementById('end-study-btn');
  const exitBtn = document.getElementById('exit-btn');
  const boneNameDiv = document.getElementById('bone-name');
  const gameContainer = document.getElementById('game-container');
  const scoreDiv = document.getElementById('score');

  if (startBtn && studyBtn && gameContainer) {

    const bones = [
      {name: "Pieres kauls", latin: "Os frontale", x: 270, y: 45},
      {name: "Paura kauls", latin: "Os parietale", x: 270, y: 15},
      {name: "Deniņu kauls", latin: "Os temporale", x: 240, y: 70},
      {name: "Lemesis", latin: "Vomer", x: 270, y: 75},
      {name: "Atslēgas kauls", latin: "Clavicula", x: 230, y: 140},
      {name: "Lāpstiņa", latin: "Scapula", x: 200, y: 160},
      {name: "Krūšu kauls", latin: "Sternum", x: 273, y: 165},
      {name: "Ribas", latin: "Costa", x: 320, y: 200},
      {name: "Krustu kauls", latin: "Os sacrum", x: 290, y: 340},
      {name: "Augšdelma kauls", latin: "Humerus", x: 180, y: 210},
      {name: "Spieķkauls", latin: "Radius", x: 160, y: 320},
      {name: "Elkoņa kauls", latin: "Ulna", x: 160, y: 290},
      {name: "Rokas pirkstu falangas", latin: "Phalanges manus", x: 140, y: 440},
      {name: "Gūžas kauls", latin: "Os coxae", x: 220, y: 390},
      {name: "Augšstilba kauls", latin: "Femur", x: 215, y: 460},
      {name: "Ceļa kauls", latin: "Patella", x: 232, y: 565},
      {name: "Lielais lielakauls", latin: "Tibia", x: 295, y: 650},
      {name: "Mazais lielakauls", latin: "Fibula", x: 315, y: 670}
    ];

    let currentBoneIndex = 0;
    let score = 0;
    let studyMode = false;

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function startGame() {
      studyMode = false;
      shuffleArray(bones);
      currentBoneIndex = 0;
      score = 0;
      scoreDiv.textContent = '';
      startBtn.style.display = 'none';
      studyBtn.style.display = 'none';
      exitBtn.style.display = 'inline-block';
      scoreDiv.style.display = "none";//newwwwwwwww
      showBone();
    }
      
    function showBone() {
      const bone = bones[currentBoneIndex];
      boneNameDiv.textContent = `${bone.name} — ${bone.latin}`;

      gameContainer.querySelectorAll('.dot').forEach(d => d.remove());

      bones.forEach((bone, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        const BASE_WIDTH = 600;
        const BASE_HEIGHT =BASE_WIDTH * (2000 / 1414); // adjust slightly if needed
        dot.style.left = (bone.x / BASE_WIDTH * 100) + '%';
        dot.style.top = (bone.y / BASE_HEIGHT * 100) + '%';
        dot.addEventListener('click', () => checkAnswer(dot, index));
        gameContainer.appendChild(dot);
      });
    }

    function checkAnswer(dot, index) {
      if (studyMode) return;

      const correctIndex = currentBoneIndex;
      if (index === correctIndex) {
        dot.classList.add('correct');
        score++;
      } else {
        dot.classList.add('wrong');
        gameContainer.querySelectorAll('.dot')[correctIndex].classList.add('correct');
      }

      setTimeout(() => {
        currentBoneIndex++;
        if (currentBoneIndex < bones.length) {
          showBone();
        } else {
          showScore();
        }
      }, 800);
    }

    async function showScore() {
      boneNameDiv.textContent = '';
      scoreDiv.textContent = `Tavs rezultāts: ${score}/${bones.length} (${Math.round(score/bones.length*100)}%)`;
      scoreDiv.style.display = "block";//newwwwwwwwwwwwwwwww
      scoreDiv.classList.add("show");//newwwwwwwwwwwwwwwwww
      const procenti = Math.round(score / bones.length * 100);
      const response = await fetch("/send_result", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rezultats: procenti,
          spele: "Kauli",
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Rezultāts saglabāts!");
      } else {
        alert(result.error);
      }

      startBtn.textContent = "Sākt spēli no sākuma";
      startBtn.style.display = 'inline-block';
      studyBtn.style.display = 'inline-block';
      exitBtn.style.display = 'none';
    };

    // STUDY MODE
    function startStudy() {
      studyMode = true;
      boneNameDiv.textContent = "Nospied uz punkta, lai redzētu kaulu";
      scoreDiv.textContent = '';
      startBtn.style.display = 'none';
      studyBtn.style.display = 'none';
      endStudyBtn.style.display = 'inline-block';
      exitBtn.style.display = 'none';
      scoreDiv.style.display = "none";//newwwwwwwwwwwwww
      gameContainer.querySelectorAll('.dot').forEach(d => d.remove());

      bones.forEach((bone) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        const BASE_WIDTH = 600;
        const BASE_HEIGHT =BASE_WIDTH * (2000 / 1414); // adjust slightly if needed
        dot.style.left = (bone.x / BASE_WIDTH * 100) + '%';
        dot.style.top = (bone.y / BASE_HEIGHT * 100) + '%';

        dot.addEventListener('click', () => {
          boneNameDiv.textContent = `${bone.name} — ${bone.latin}`;
        });

        gameContainer.appendChild(dot);
      });
    }

    function endStudy() {
      studyMode = false;
      resetToMenu();
    }

    // EXIT GAME
    function exitGame() {
      studyMode = false;
      resetToMenu();
    }

    // RESET
    function resetToMenu() {
      boneNameDiv.textContent = '';
      scoreDiv.textContent = '';
      gameContainer.querySelectorAll('.dot').forEach(d => d.remove());

      startBtn.style.display = 'inline-block';
      studyBtn.style.display = 'inline-block';
      endStudyBtn.style.display = 'none';
      exitBtn.style.display = 'none';
      scoreDiv.style.display = "none";//newwwwwwwwwwwwwwwwwwww
    }

    // EVENTS
    startBtn.addEventListener('click', startGame);
    studyBtn.addEventListener('click', startStudy);
    endStudyBtn.addEventListener('click', endStudy);
    exitBtn.addEventListener('click', exitGame);
  }

});

//muskuļi spēle
document.addEventListener("DOMContentLoaded", async () => {
const musclesList = [
  { name: "Košļāšanas muskulis",                    latin: "m. masseter",                        x: 311.23, y: 129.45 },
  { name: "Galvas grozītājmuskulis",                latin: "m. sternocleidomastoideus",          x: 281.19, y: 155.45 },
  { name: "Trapecveida muskulis",                   latin: "m. trapezius",                       x: 345.65, y: 170.08 },
  { name: "Delta muskulis",                         latin: "m. deltoideus",                      x: 390.85, y: 200.01 },
  { name: "Lielais krūšu muskulis",                 latin: "m. pectoralis major",                x: 328.86, y: 221.60 },
  { name: "Augšdelma divgalvainais muskulis",       latin: "m. biceps brachii",                  x: 392.57, y: 271.10 },
  { name: "Spieķkaula muskulis",                    latin: "m. brachioradialis",                 x: 408.18, y: 340.96 },
  { name: "Taisnais vēdera muskulis",               latin: "m. rectus abdominis",                x: 277.19, y: 285.21 },
  { name: "Vēdera ārējais slīpais muskulis",        latin: "m. obliquus externus abdominis",     x: 346.35, y: 314.92 },
  { name: "Taisnais augšstilba muskulis",           latin: "m. rectus femoris",                  x: 341.23, y: 457.29 },
  { name: "Priekšējais lielakaula muskulis",        latin: "m. tibialis anterior",               x: 346.35, y: 613.84 },
  { name: "Mazā lielakaula muskulis",               latin: "m. fibularis longus",                x: 231.65, y: 612.94 }
];


    let currentMuscleIndex = 0;
    let scoreMuscles = 0;
    let studyModeMuscles = false;

    const musclesStartBtn    = document.getElementById('muscles-start-btn');
    const musclesStudyBtn    = document.getElementById('muscles-study-btn');
    const musclesEndStudyBtn = document.getElementById('muscles-end-study-btn');
    const musclesExitBtn     = document.getElementById('muscles-exit-btn');
    const musclesNameDiv     = document.getElementById('muscles-name');
    const musclesGameContainer = document.getElementById('muscles-game-container');
    const musclesScoreDiv    = document.getElementById('muscles-score');

    function shuffleMuscles(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function startMusclesGame() {
      studyModeMuscles = false;
      shuffleMuscles(musclesList);
      currentMuscleIndex = 0;
      scoreMuscles = 0;
      musclesScoreDiv.textContent = '';
      musclesStartBtn.style.display    = 'none';
      musclesStudyBtn.style.display    = 'none';
      musclesEndStudyBtn.style.display = 'none';
      musclesExitBtn.style.display     = 'inline-block';
      showMuscle();
    }

    function showMuscle() {
      const muscle = musclesList[currentMuscleIndex];
      musclesNameDiv.textContent = `${muscle.name} — ${muscle.latin}`;
      musclesGameContainer.querySelectorAll('.muscles-dot').forEach(d => d.remove());

      musclesList.forEach((m, index) => {
        const dot = document.createElement('div');
        dot.classList.add('muscles-dot');
        //change hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      const BASE_WIDTH = 600;
      const BASE_HEIGHT = 791 * (600 / 559);

       dot.style.left = (m.x / BASE_WIDTH * 100) + '%';
       dot.style.top  = (m.y / BASE_HEIGHT * 100) + '%';
        dot.addEventListener('click', () => checkMuscleAnswer(dot, index));
        musclesGameContainer.appendChild(dot);
      });
    }

    function checkMuscleAnswer(dot, index) {
      if (studyModeMuscles) return;
      const correctIndex = currentMuscleIndex;
      if (index === correctIndex) {
        dot.classList.add('correct');
        scoreMuscles++;
      } else {
        dot.classList.add('wrong');
        musclesGameContainer.querySelectorAll('.muscles-dot')[correctIndex].classList.add('correct');
      }
      setTimeout(() => {
        currentMuscleIndex++;
        if (currentMuscleIndex < musclesList.length) {
          showMuscle();
        } else {
          showMusclesScore();
        }
      }, 800);
    }

    async function showMusclesScore() {
      musclesNameDiv.textContent = '';
      //change hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      musclesScoreDiv.style.display = "block";
      musclesScoreDiv.classList.add("show");
      musclesScoreDiv.textContent =
        `Tavs rezultāts: ${scoreMuscles}/${musclesList.length} (${Math.round(scoreMuscles / musclesList.length * 100)}%)`;
      const procenti_1 = Math.round(scoreMuscles / musclesList.length * 100);
      try {
        const response = await fetch("/send_result", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rezultats: procenti_1,
            spele: "Muskuļi",
          })

        });
        const result = await response.json();

        if (!response.ok) {
          alert("Failed to save result: " + result.error);
        }
      } catch (err) {
        console.error("Failed to send result:", err);
      }
      //brrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
     
      musclesStartBtn.style.display   = 'none';
      musclesStudyBtn.style.display   = 'none';
      musclesExitBtn.style.display    = 'inline-block';
      musclesGameContainer.querySelectorAll('.muscles-dot').forEach(d => d.remove());
    }

    function startMusclesStudy() {
      studyModeMuscles = true;
      musclesNameDiv.textContent  = 'Nospied uz punkta, lai redzētu muskuli';
      musclesScoreDiv.textContent = '';
      musclesStartBtn.style.display    = 'none';
      musclesStudyBtn.style.display    = 'none';
      musclesEndStudyBtn.style.display = 'inline-block';
      musclesExitBtn.style.display     = 'none';
      musclesGameContainer.querySelectorAll('.muscles-dot').forEach(d => d.remove());

      musclesList.forEach((m) => {
        const dot = document.createElement('div');
        dot.classList.add('muscles-dot');
        //change hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
       const BASE_WIDTH = 600;
       const BASE_HEIGHT = 791 * (600 / 559);
        dot.style.left = (m.x / BASE_WIDTH * 100) + '%';
        dot.style.top  = (m.y / BASE_HEIGHT * 100) + '%';
        dot.addEventListener('click', () => {
          musclesNameDiv.textContent = `${m.name} — ${m.latin}`;
        });
        musclesGameContainer.appendChild(dot);
      });
    }

    function endMusclesStudy() {
      studyModeMuscles = false;
      resetMusclesMenu();
    }

    function exitMusclesGame() {
      studyModeMuscles = false;
      resetMusclesMenu();
    }

    function resetMusclesMenu() {
      musclesNameDiv.textContent  = '';
      musclesScoreDiv.textContent = '';
      musclesGameContainer.querySelectorAll('.muscles-dot').forEach(d => d.remove());
      musclesStartBtn.style.display    = 'inline-block';
      musclesStudyBtn.style.display    = 'inline-block';
      musclesEndStudyBtn.style.display = 'none';
      musclesExitBtn.style.display     = 'none';
      musclesScoreDiv.style.display = "none";
      //brrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
      musclesScoreDiv.classList.remove("show");
      musclesScoreDiv.textContent = '';
    }

    musclesStartBtn.addEventListener('click', startMusclesGame);
    musclesStudyBtn.addEventListener('click', startMusclesStudy);
    musclesEndStudyBtn.addEventListener('click', endMusclesStudy);
    musclesExitBtn.addEventListener('click', exitMusclesGame);
  });







  // Orgānu spēle
  document.addEventListener("DOMContentLoaded", async () => {
const organsData = [
  {name: "Smadzenes", latin: "Encephalon", x: 192, y: 28},
  {name: "Traheja", latin: "Trachea", x: 188, y: 118},
  {name: "Labā plauša", latin: "Pulmo dexter", x: 158, y: 230},
  {name: "Sirds", latin: "Cor", x: 192, y: 240},
  {name: "Akna", latin: "Hepar", x: 162, y: 300},
  {name: "Kuņģis", latin: "Gaster", x: 225, y: 300},
  {name: "Labā niere", latin: "Ren dexter", x: 160, y: 330},
  {name: "Tievā zarna", latin: "Intestinum tenue", x: 193, y: 410},
  {name: "Resnā zarna", latin: "Intestinum crassum", x: 240, y: 418},
  {name: "Urīnpūslis", latin: "Vesica urinaria", x: 188, y: 450}
];

let currentOrganIndexOrgans = 0;
let scoreOrgans = 0;
let studyModeOrgans = false;

const startBtnOrgans = document.getElementById('start-btn-organs');
const studyBtnOrgans = document.getElementById('study-btn-organs');
const endStudyBtnOrgans = document.getElementById('end-study-btn-organs');
const exitBtnOrgans = document.getElementById('exit-btn-organs');
const organNameDivOrgans = document.getElementById('organ-name');
const gameContainerOrgans = document.getElementById('game-container-organs');
const scoreDivOrgans = document.getElementById('score-organs');

// Shuffle function
function shuffleArrayOrgans(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startGameOrgans() {
  studyModeOrgans = false;

  shuffleArrayOrgans(organsData);

  currentOrganIndexOrgans = 0;
  scoreOrgans = 0;

  scoreDivOrgans.textContent = '';

  startBtnOrgans.style.display = 'none';
  studyBtnOrgans.style.display = 'none';
  endStudyBtnOrgans.style.display = 'none';
  exitBtnOrgans.style.display = 'inline-block';

  showOrganOrgans();
}

function showOrganOrgans() {
  const organ = organsData[currentOrganIndexOrgans];
  organNameDivOrgans.textContent = `${organ.name} — ${organ.latin}`;

  gameContainerOrgans.querySelectorAll('.dot-organs').forEach(dot => dot.remove());

  organsData.forEach((organ, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot-organs');

    dot.style.left = organ.x + 'px';
    dot.style.top = organ.y + 'px';

    dot.addEventListener('click', () => checkAnswerOrgans(dot, index));

    gameContainerOrgans.appendChild(dot);
  });
}

function checkAnswerOrgans(dot, index) {
  if (studyModeOrgans) return;

  const correctIndex = currentOrganIndexOrgans;

  if (index === correctIndex) {
    dot.classList.add('correct');
    scoreOrgans++;
  } else {
    dot.classList.add('wrong');
    gameContainerOrgans.querySelectorAll('.dot-organs')[correctIndex].classList.add('correct');
  }

  setTimeout(() => {
    currentOrganIndexOrgans++;

    if (currentOrganIndexOrgans < organsData.length) {
      showOrganOrgans();
    } else {
      showScoreOrgans();
    }
  }, 800);
}

async function showScoreOrgans() {
  organNameDivOrgans.textContent = '';
  //rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
  scoreDivOrgans.style.display = "block";
  scoreDivOrgans.classList.add("show");
  scoreDivOrgans.textContent =
    `Tavs rezultāts: ${scoreOrgans}/${organsData.length} (${Math.round(scoreOrgans / organsData.length * 100)}%)`;
      const procenti_2 = Math.round(scoreOrgans / organsData.length * 100);
      try {
        const response = await fetch("/send_result", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rezultats: procenti_2,
            spele: "Orgāni",
          })

        });
        const result = await response.json();

        if (!response.ok) {
          alert("Failed to save result: " + result.error);
        }
      } catch (err) {
        console.error("Failed to send result:", err);
      }
  startBtnOrgans.textContent = "Sākt spēli no sākuma";

  startBtnOrgans.style.display = 'inline-block';
  studyBtnOrgans.style.display = 'inline-block';
  exitBtnOrgans.style.display = 'none';
}

// STUDY MODE
function startStudyOrgans() {
  studyModeOrgans = true;

  organNameDivOrgans.textContent = "Nospied uz punkta, lai redzētu orgānu";
  scoreDivOrgans.textContent = '';

  startBtnOrgans.style.display = 'none';
  studyBtnOrgans.style.display = 'none';
  endStudyBtnOrgans.style.display = 'inline-block';
  exitBtnOrgans.style.display = 'none';

  gameContainerOrgans.querySelectorAll('.dot-organs').forEach(dot => dot.remove());

  organsData.forEach((organ) => {
    const dot = document.createElement('div');
    dot.classList.add('dot-organs');

    dot.style.left = organ.x + 'px';
    dot.style.top = organ.y + 'px';

    dot.addEventListener('click', () => {
      organNameDivOrgans.textContent = `${organ.name} — ${organ.latin}`;
    });

    gameContainerOrgans.appendChild(dot);
  });
}

function endStudyOrgans() {
  studyModeOrgans = false;
  resetToMenuOrgans();
}

// EXIT GAME
function exitGameOrgans() {
  studyModeOrgans = false;
  resetToMenuOrgans();
}

// RESET
function resetToMenuOrgans() {
  organNameDivOrgans.textContent = '';
  scoreDivOrgans.textContent = '';

  gameContainerOrgans.querySelectorAll('.dot-organs').forEach(dot => dot.remove());

  startBtnOrgans.style.display = 'inline-block';
  studyBtnOrgans.style.display = 'inline-block';
  endStudyBtnOrgans.style.display = 'none';
  exitBtnOrgans.style.display = 'none';
}

// EVENTS
startBtnOrgans.addEventListener('click', startGameOrgans);
studyBtnOrgans.addEventListener('click', startStudyOrgans);
endStudyBtnOrgans.addEventListener('click', endStudyOrgans);
exitBtnOrgans.addEventListener('click', exitGameOrgans);
  });






///hides stuff at login page
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/check_login",{
    
      credentials: "include"
    }); 
    const result = await response.json();

  const logoutBtn = document.getElementById("logoutBtn");
  const changeForm = document.getElementById("change_password");
  const loginForm = document.getElementById("log_in");

  if (result.loggedIn) {
    // ✅ Logged in
    if (logoutBtn) logoutBtn.style.display = "block";
    if (changeForm) changeForm.style.display = "block";
    if (loginForm) loginForm.style.display = "none";
  } else {
    // ❌ Not logged in
    if (logoutBtn) logoutBtn.style.display = "none";
    if (changeForm) changeForm.style.display = "none";
    if (loginForm) loginForm.style.display = "block";
  }
});
