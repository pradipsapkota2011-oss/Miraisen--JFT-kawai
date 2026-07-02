let userAnswers = [];
let currentQuestion = 0;
let totalSeconds = 60 * 60;
let submitted = false;

// Listening audio control
let audioPlayCounts = {};
let audioCurrentKey = null;
let audioIsPlayingAttempt = false;
let audioPlayingNow = false;

function setNavigationLock(lock){
  audioPlayingNow = lock;

  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");
  const finishBtn = document.querySelector(".finish");

  if(nextBtn) nextBtn.disabled = lock;
  if(backBtn) backBtn.disabled = lock;
  if(finishBtn) finishBtn.disabled = lock;

  document.querySelectorAll(".qbtn").forEach(btn => {
    btn.style.pointerEvents = lock ? "none" : "auto";
    btn.style.opacity = lock ? "0.5" : "1";
  });
}

function getLanguageEnglish(q){
  if(q.type === "double" && q.question){
    return q.question;
  }
  if(q.instruction){
    return q.instruction;
  }
  if(q.question){
    return q.question;
  }
  return "Look at the question and choose the correct answer.";
}

function getLanguageNepali(text){
  const translations = {
    "Look at the information and answer the following questions": "तल दिइएको जानकारी हेरेर प्रश्नहरूको उत्तर दिनुहोस्।",
    "Read the Passage and Answer the Following Questions": "अनुच्छेद पढेर तलका प्रश्नहरूको उत्तर दिनुहोस्।",
    "Read the passage and answer the following questions.": "अनुच्छेद पढेर तलका प्रश्नहरूको उत्तर दिनुहोस्।",
    "Look at the illustration and choose the correct word": "चित्र हेरेर सही शब्द छान्नुहोस्।",
    "Look at the illustration and choose the correct word.": "चित्र हेरेर सही शब्द छान्नुहोस्।",
    "Read the sentance and choose the word that fits in( )the most.": "वाक्य पढेर खाली ठाउँमा मिल्ने सही शब्द छान्नुहोस्।",
    "Read the sentance and choose the kanji that fits in( )the most.": "वाक्य पढेर खाली ठाउँमा मिल्ने सही कान्जी छान्नुहोस्।",
    "How do you write the underlined kanji word in hiragana?": "रेखांकित कान्जी शब्दलाई हिरागानामा कसरी लेखिन्छ?",
    "How do you write the underlined hiragana word in kanji?": "रेखांकित हिरागाना शब्दलाई कान्जीमा कसरी लेखिन्छ?",
    "Read the dialog and choose the phrase that fits the most.": "संवाद पढेर सबैभन्दा मिल्ने वाक्यांश छान्नुहोस्।",
    "次の会話を聞いて、質問に答えてください。": "अर्को संवाद सुनेर प्रश्नहरूको उत्तर दिनुहोस्।"
  };

  return translations[text] || "यो प्रश्न पढेर सही उत्तर छान्नुहोस्।";
}

function stripHtml(text){
  return String(text || "").replace(/<[^>]*>/g, "");
}


function getSectionName(){
  if(currentQuestion < 12) return "Script and Vocabulary";
  if(currentQuestion < 24) return "Conversation and Expression";
  if(currentQuestion < 33) return "Listening";
  return "Reading";
}

function getSectionStart(){
  if(currentQuestion < 12) return 0;
  if(currentQuestion < 24) return 12;
  if(currentQuestion < 33) return 24;
  return 33;
}

function getSectionEnd(){
  if(currentQuestion < 12) return 12;
  if(currentQuestion < 24) return 24;
  if(currentQuestion < 33) return 33;
  return questions.length;
}

function getSectionQuestionNumber(){
  return currentQuestion - getSectionStart() + 1;
}

function updateSectionHighlight(){
  document.querySelectorAll(".sec").forEach(sec => sec.classList.remove("activeSec"));

  if(currentQuestion < 12) document.getElementById("sec1").classList.add("activeSec");
  else if(currentQuestion < 24) document.getElementById("sec2").classList.add("activeSec");
  else if(currentQuestion < 33) document.getElementById("sec3").classList.add("activeSec");
  else document.getElementById("sec4").classList.add("activeSec");
}

function loadQuestion(){
  const q = questions[currentQuestion];

  document.getElementById("questionInfo").innerHTML =
    `<b>Question: ${getSectionQuestionNumber()}</b><br><b>Section: ${getSectionName()}</b>`;

  let html = "";

  if(q.instruction){
    html += `<div class="instruction">${q.instruction}</div>`;
  }

  if(q.subtitle){
    html += `<div class="subtitle">${q.subtitle}</div>`;
  }

  // Normal question: show main question here
  if(q.question && q.type !== "dialog" && q.type !== "double"){
    html += `<div class="mainQuestion">${q.question}</div>`;
  }

  // Double question: show instruction/title only here
  if(q.type === "double" && q.question){
    html += `<div class="instruction">${q.question}</div>`;
  }

  document.getElementById("questionText").innerHTML = html;

  const imgBox = document.querySelector(".image");
  const img = document.getElementById("questionImage");

  if(q.image && q.type !== "dialog"){
    img.src = q.image;
    imgBox.style.display = "block";
  }else{
    img.src = "";
    imgBox.style.display = "none";
  }

  const audioBox = document.getElementById("audioBox");
  const audioPlayer = document.getElementById("audioPlayer");
  const audioSource = document.getElementById("audioSource");

  if(q.audio){
    audioCurrentKey = String(currentQuestion);
    audioIsPlayingAttempt = false;
    setNavigationLock(false);

    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioSource.src = q.audio;
    audioPlayer.load();
    audioBox.style.display = "block";

    const oldMsg = document.getElementById("audioLimitMsg");
    if(oldMsg) oldMsg.remove();

    const played = audioPlayCounts[audioCurrentKey] || 0;

    if(played >= 2){
      audioPlayer.controls = false;

      const msg = document.createElement("div");
      msg.id = "audioLimitMsg";
      msg.innerHTML = "<b style='color:red;font-size:16px;'>Audio can be played only 2 times.</b>";
      audioBox.appendChild(msg);
    }else{
      audioPlayer.controls = true;

      const msg = document.createElement("div");
      msg.id = "audioLimitMsg";
      msg.innerHTML = "<span style='font-size:14px;color:#555;'>Audio plays left: " + (2 - played) + "</span>";
      audioBox.appendChild(msg);
    }

  }else{
    audioCurrentKey = null;
    audioIsPlayingAttempt = false;
    setNavigationLock(false);

    audioPlayer.pause();
    audioSource.src = "";
    audioPlayer.load();
    audioBox.style.display = "none";

    const oldMsg = document.getElementById("audioLimitMsg");
    if(oldMsg) oldMsg.remove();
  }

  const speakerBox = document.getElementById("speakerBox");
  const speakerImg = document.getElementById("speakerImg");

  if(q.speakerImage){
    speakerImg.src = q.speakerImage;
    speakerBox.style.display = "block";
  }else{
    speakerImg.src = "";
    speakerBox.style.display = "none";
  }

  if(q.type === "dialog"){
    loadDialogQuestion(q);
  }else if(q.type === "double"){
    loadDoubleQuestion(q);
  }else{
    loadSingleQuestion(q);
  }

  updateSectionHighlight();
  makePalette();
}

function loadSingleQuestion(q){
  const container = document.getElementById("optionContainer");
  container.innerHTML = "";

  const hasImageOptions = q.options.some(item => typeof item === "object" && item.image);

  if(hasImageOptions){
    container.className = "imageOptions";
  }else{
    container.className = "";
  }

  q.options.forEach((item, index) => {
    const option = document.createElement("div");
    option.className = hasImageOptions ? "option imageOption" : "option";

    if(typeof item === "string"){
      option.innerText = item;
    }else{
      if(item.image){
        option.innerHTML += `<img src="${item.image}" alt="">`;
      }

      if(item.text){
        option.innerHTML += `<div style="text-align:center;">${item.text}</div>`;
      }
    }

    if(userAnswers[currentQuestion] === index){
      option.classList.add("selected");
    }

    option.onclick = function(){
      selectSingleAnswer(index);
    };

    container.appendChild(option);
  });
}

function loadDialogQuestion(q){
  const container = document.getElementById("optionContainer");
  container.innerHTML = "";
  container.className = "";

  const dialogWrap = document.createElement("div");
  dialogWrap.className = "dialogWrap";

  const dialogText = document.createElement("div");
  dialogText.className = "dialogText";
  dialogText.innerHTML = q.dialog || "";
  dialogText.style.whiteSpace = "pre-line";
  dialogText.style.lineHeight = "1.4";
  dialogWrap.appendChild(dialogText);

  if(q.sideImage){
    const sideImg = document.createElement("img");
    sideImg.className = "dialogImage";
    sideImg.src = q.sideImage;
    sideImg.alt = "";
    dialogWrap.appendChild(sideImg);
  }

  container.appendChild(dialogWrap);

  q.options.forEach((item, index) => {
    const option = document.createElement("div");
    option.className = "option";

    if(typeof item === "string"){
      option.innerText = item;
    }else{
      if(item.image){
        option.innerHTML += `<img src="${item.image}" alt="">`;
      }

      if(item.text){
        option.innerHTML += `<div style="text-align:center;">${item.text}</div>`;
      }
    }

    if(userAnswers[currentQuestion] === index){
      option.classList.add("selected");
    }

    option.onclick = function(){
      selectSingleAnswer(index);
    };

    container.appendChild(option);
  });
}

function loadDoubleQuestion(q){
  const container = document.getElementById("optionContainer");
  container.innerHTML = "";
  container.className = "";

  if(!userAnswers[currentQuestion]){
    userAnswers[currentQuestion] = {};
  }

  // Passage appears under "Your Language" and above (a)
  // Reading passage font-size is controlled here.
  if(q.passage){
    const passageBox = document.createElement("div");
    passageBox.className = "readingPassage";
    passageBox.style.fontSize = "24px";
    passageBox.style.lineHeight = "1.7";
    passageBox.style.fontWeight = "500";
    passageBox.style.marginBottom = "20px";
    passageBox.style.whiteSpace = "pre-wrap";
    passageBox.style.textAlign = "left";
    passageBox.innerHTML = q.passage;
    container.appendChild(passageBox);
  }

  q.parts.forEach((part, partIndex) => {
    const partBox = document.createElement("div");
    partBox.className = "partBox";

    const title = document.createElement("div");
    title.className = "partTitle";
    title.innerHTML = part.title || part.question || "";
    partBox.appendChild(title);

    const row = document.createElement("div");
    const hasImageOption = part.options.some(item => typeof item === "object" && item.image);

    if(hasImageOption){
      row.className = "doubleOptionRow";
    }else{
      row.className = "doubleOptionRow verticalOptions";
    }

    part.options.forEach((item, optionIndex) => {
      const option = document.createElement("div");
      option.className = "option doubleOption";

      if(typeof item === "string"){
        option.innerHTML = item;
      }else{
        if(item.image){
          option.innerHTML += `<img src="${item.image}" alt="">`;
        }

        if(item.text){
          option.innerHTML += `<div style="text-align:center;">${item.text}</div>`;
        }
      }

      if(userAnswers[currentQuestion][partIndex] === optionIndex){
        option.classList.add("selected");
      }

      option.onclick = function(){
        selectDoubleAnswer(partIndex, optionIndex);
      };

      row.appendChild(option);
    });

    partBox.appendChild(row);
    container.appendChild(partBox);
  });
}

function selectSingleAnswer(index){
  userAnswers[currentQuestion] = index;
  loadQuestion();
}

function selectDoubleAnswer(partIndex, optionIndex){
  if(!userAnswers[currentQuestion]){
    userAnswers[currentQuestion] = {};
  }

  userAnswers[currentQuestion][partIndex] = optionIndex;
  loadQuestion();
}

function makePalette(){
  const palette = document.getElementById("palette");
  palette.innerHTML = "";

  let start = getSectionStart();
  let end = getSectionEnd();

  for(let i = start; i < end; i++){
    const btn = document.createElement("div");
    btn.className = "qbtn";
    btn.innerText = i - start + 1;

    if(i === currentQuestion) btn.classList.add("active");

    btn.onclick = function(){
      if(audioPlayingNow) return;
      currentQuestion = i;
      loadQuestion();
    };

    palette.appendChild(btn);
  }
}

function submitTest(){
  if(submitted) return;
  closeSubmitConfirm();
  submitted = true;

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let totalMarks = 0;

  for(let i = 0; i < questions.length; i++){
    const q = questions[i];

    if(q.type === "double"){
      q.parts.forEach((part, partIndex) => {
        totalMarks++;

        if(!userAnswers[i] || userAnswers[i][partIndex] === undefined){
          unanswered++;
        }else if(userAnswers[i][partIndex] === part.answer){
          correct++;
        }else{
          wrong++;
        }
      });
    }else{
      totalMarks++;

      if(userAnswers[i] === undefined){
        unanswered++;
      }else if(userAnswers[i] === q.answer){
        correct++;
      }else{
        wrong++;
      }
    }
  }
  let finalScore = Math.round((correct / totalMarks) * 250);
let status = finalScore >= 200 ? "PASS" : "FAIL";
  let percent = Math.round((correct / totalMarks) * 100);

  document.getElementById("scoreText").innerHTML =
  `<b>Total Score:</b> ${finalScore} / 250`;

document.getElementById("correctText").innerHTML =
  `<b>Correct:</b> ${correct} / ${totalMarks}`;

document.getElementById("wrongText").innerHTML =
  `<b>Wrong:</b> ${wrong}`;

document.getElementById("unansweredText").innerHTML =
  `<b>Unanswered:</b> ${unanswered}`;

document.getElementById("percentText").innerHTML =
  `<b>Percentage:</b> ${percent}%<br><br>
   <b>Result:</b>
   <span style="font-size:30px;font-weight:bold;color:${status === "PASS" ? "green" : "red"}">
     ${status}
   </span>`;

 // Hide Test Screen
document.querySelector(".top").style.display = "none";
document.querySelector(".green").style.display = "none";
document.querySelector(".main").style.display = "none";
document.querySelector(".footer").style.display = "none";

// Show Result Screen
document.getElementById("resultPage").style.display = "block";
}

function closeResult(){
  document.getElementById("resultBox").style.display = "none";
}

function openLanguage1(){
  const q = questions[currentQuestion];
  const english = stripHtml(getLanguageEnglish(q));
  const nepali = getLanguageNepali(english);

  const modal = document.getElementById("langModal1");
  const table = modal.querySelector("table");

  if(table){
    table.innerHTML = `
      <tr>
        <td><b>English</b></td>
        <td>${english}</td>
      </tr>
      <tr>
        <td><b>Nepali</b></td>
        <td>${nepali}</td>
      </tr>
    `;
  }

  modal.style.display = "block";
}

function closeLanguage1(){
  document.getElementById("langModal1").style.display = "none";
}

document.getElementById("nextBtn").onclick = function(){
  if(audioPlayingNow) return;

  if(currentQuestion < questions.length - 1){
    currentQuestion++;
    loadQuestion();
  }else{
    openSubmitConfirm();
  }
};

function openSubmitConfirm(){
  const box = document.getElementById("submitConfirmBox");
  if(box){
    box.style.display = "block";
  }else{
    submitTest();
  }
}

function closeSubmitConfirm(){
  const box = document.getElementById("submitConfirmBox");
  if(box){
    box.style.display = "none";
  }
}
function isListeningQuestion(index){
  return questions[index] && questions[index].section === "Listening";
}

document.getElementById("backBtn").onclick = function(){

  // Listening section bhitra back jana namilne
  if(isListeningQuestion(currentQuestion)){
    return;
  }

  // Reading bata Listening ma back jana pani namilne
  if(isListeningQuestion(currentQuestion - 1)){
    return;
  }

  if(currentQuestion > 0){
    currentQuestion--;
    loadQuestion();
  }
};

document.querySelector(".finish").onclick = function(){
  if(audioPlayingNow) return;
  submitTest();
};

function updateTimer(){
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  document.getElementById("time").innerText =
    String(minutes).padStart(2,"0") + ":" +
    String(seconds).padStart(2,"0");

  if(totalSeconds > 0){
    totalSeconds--;
  }else{
    submitTest();
  }
}


// Audio play limit + full lock while playing
const limitedAudioPlayer = document.getElementById("audioPlayer");

limitedAudioPlayer.addEventListener("play", function(){
  if(audioCurrentKey === null) return;

  const played = audioPlayCounts[audioCurrentKey] || 0;

  if(played >= 2){
    limitedAudioPlayer.pause();
    limitedAudioPlayer.currentTime = 0;
    limitedAudioPlayer.controls = false;
    setNavigationLock(false);
    alert("Audio can be played only 2 times.");
    return;
  }

  // Lock navigation and hide audio controls while audio is playing.
  // This stops students from pausing, replaying, seeking, or pressing buttons.
  setNavigationLock(true);
  limitedAudioPlayer.controls = false;

  if(!audioIsPlayingAttempt){
    audioPlayCounts[audioCurrentKey] = played + 1;
    audioIsPlayingAttempt = true;

    const msg = document.getElementById("audioLimitMsg");
    if(msg){
      const left = 2 - audioPlayCounts[audioCurrentKey];
      msg.innerHTML = "<b style='color:#333;font-size:15px;'>Audio is playing. Please wait...</b><br><span style='font-size:14px;color:#555;'>Audio plays left after this: " + left + "</span>";
    }
  }
});

limitedAudioPlayer.addEventListener("ended", function(){
  audioIsPlayingAttempt = false;
  setNavigationLock(false);

  if(audioCurrentKey === null) return;

  const played = audioPlayCounts[audioCurrentKey] || 0;
  const msg = document.getElementById("audioLimitMsg");

  if(played >= 2){
    limitedAudioPlayer.controls = false;
    if(msg){
      msg.innerHTML = "<b style='color:red;font-size:16px;'>Audio can be played only 2 times.</b>";
    }
  }else{
    limitedAudioPlayer.controls = true;
    if(msg){
      msg.innerHTML = "<span style='font-size:14px;color:#555;'>Audio plays left: " + (2 - played) + "</span>";
    }
  }
});

// Prevent seeking/dragging audio progress
limitedAudioPlayer.addEventListener("seeking", function(){
  if(audioPlayingNow){
    limitedAudioPlayer.currentTime = limitedAudioPlayer.currentTime;
  }
});

loadQuestion();
updateTimer();
setInterval(updateTimer, 1000);