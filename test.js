import { mockFetch } from "./mockApi.js"; /// take this out in main

document.addEventListener("DOMContentLoaded", () => {

const fetchFn = true ? mockFetch : fetch; /// take this out in main

  // ---------------- REGISTER ----------------
  const registerForm = document.getElementById("registresanas");
  if (registerForm) {
    registerForm.onsubmit = async (e) => {
      e.preventDefault();

      const vards = document.getElementById("vards");
      const lietotajvards = document.getElementById("lietotajvards");
      const parole = document.getElementById("parole");
      const e_pasts = document.getElementById("e_pasts");

      const response = await fetchFN("/register", { ///remove Fn
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

      const response = await fetchFn("/log_in", { ///removeFn
        method: "POST",
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
      } else {
        alert(result.error);
      }
    };
  }
  

  // ---------------- LOGOUT ----------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const response = await fetchFn("/log_out", { method: "POST" }); ///remove Fn
      const result = await response.json();

      if (result.ok) {
        alert("Logged out successfully!");
      } else {
        alert("Logout failed");
      }
    });
  }

  // ---------------- CHANGE PASSWORD ----------------
  const changeForm = document.getElementById("change_password");
  if (changeForm) {
    changeForm.onsubmit = async (e) => {
      e.preventDefault();

      const old_password = document.getElementById("parole_old");
      const new_password = document.getElementById("parole_new");

      const response = await fetchFn("/change_password", { /// remove Fn
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

  // ---------------- SEND RESULT ----------------
  //if (rezultatsForm) {
    //rezultatsForm.onsubmit = async (e) => {
      //e.preventDefault();

      //const rezultats = document.getElementById("rezultats");

      //const response = await fetch("/send_result", {
        //method: "POST",
        //headers: { "Content-Type": "application/json" },
        //body: JSON.stringify({
          //rezultats: rezultats?.value
        //})
      //});

      //const result = await response.json();

      //if (response.ok) {
        //alert("Rezultāts saglabāts!");
      //} else {
        //alert(result.error);
      //}
    //};
  //}
  // ---------------- SHOW RESULTS ----------------
  const paraditBtn = document.getElementById("paradit_rez");
  
  if (paraditBtn) {
    paraditBtn.addEventListener("click", async () => {
      const response = await fetchFn("/paradit_rez",{method: "GET", ////remove Fn
      credentials: "include"});

      const result = await response.json();

      if (!result.ok) {
        alert(result.error);
      }

      if (result.ok) {
       const tbody = document.querySelector("#results-table tbody");
tbody.innerHTML = "";

result.rezultati.forEach(r => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${r[0]}%</td>
    <td>${r[1]}</td>
    <td>${r[2]}</td>
  `;

  tbody.appendChild(row);
});
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

      const procenti = Math.round(score / bones.length * 100);
      const response = await fetchFn("/send_result", { /// remove Fn
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rezultats: procenti
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

      gameContainer.querySelectorAll('.dot').forEach(d => d.remove());

      bones.forEach((bone) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        const BASE_WIDTH = 600;
const BASE_HEIGHT = BASE_WIDTH * (2000 / 1414); // adjust slightly if needed

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
    }

    // EVENTS
    startBtn.addEventListener('click', startGame);
    studyBtn.addEventListener('click', startStudy);
    endStudyBtn.addEventListener('click', endStudy);
    exitBtn.addEventListener('click', exitGame);
  }

});
///hides stuff at login page
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetchFn("/check_login"); /// removeFn
    const result = await response.json();

  const logoutBtn = document.getElementById("logoutBtn");
  const changeForm = document.getElementById("change_password");
  const loginForm = document.getElementById("log_in");

  if (result.ok) {
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
