let userAnswers = [];
let currentQuestion = 0;
let totalSeconds = 60 * 60;
let submitted = false;
let timerIntervalId = null;

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


// =========================================================
// MAGARIMAS-STYLE SECTION RESULT + FULL FEEDBACK
// Section boundaries for THIS set:
// 1-12 Script & Vocabulary
// 13-24 Conversation & Expression
// 25-33 Listening
// 34+ Reading
// Double questions count each part separately.
// =========================================================
function getSectionDefinitions(){
  return [
    { name: "Script & Vocabulary", start: 0, end: 12 },
    { name: "Conversation & Expression", start: 12, end: 24 },
    { name: "Listening", start: 24, end: 33 },
    { name: "Reading", start: 33, end: questions.length }
  ];
}

function getSectionWiseStats(){
  return getSectionDefinitions().map(section => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    let total = 0;

    const safeEnd = Math.min(section.end, questions.length);

    for(let index = section.start; index < safeEnd; index++){
      const q = questions[index];
      if(!q) continue;

      if(q.type === "double" && Array.isArray(q.parts)){
        q.parts.forEach((part, partIndex) => {
          total++;
          const selected =
            userAnswers[index] &&
            userAnswers[index][partIndex] !== undefined
              ? userAnswers[index][partIndex]
              : undefined;

          if(selected === undefined || selected === null){
            unanswered++;
          }else if(selected === part.answer){
            correct++;
          }else{
            wrong++;
          }
        });
      }else{
        total++;
        const selected = userAnswers[index];

        if(selected === undefined || selected === null){
          unanswered++;
        }else if(selected === q.answer){
          correct++;
        }else{
          wrong++;
        }
      }
    }

    const percentage = total > 0
      ? Math.round((correct / total) * 100)
      : 0;

    return {
      ...section,
      correct,
      wrong,
      unanswered,
      total,
      percentage
    };
  });
}

function getSectionWisePercentHtml(){
  const stats = getSectionWiseStats();

  let html = `
    <div class="section-performance">
      <h2>Section-wise Performance</h2>
      <div class="section-performance-grid">
  `;

  stats.forEach(section => {
    html += `
      <div class="section-performance-card">
        <div class="section-performance-title">${section.name}</div>
        <div class="section-performance-row">
          <span>${section.correct} / ${section.total} correct</span>
          <strong>${section.percentage}%</strong>
        </div>
        <div class="section-performance-bar">
          <div class="section-performance-fill" style="width:${section.percentage}%"></div>
        </div>
        <div class="section-performance-small">
          Wrong: ${section.wrong} &nbsp; | &nbsp; Unanswered: ${section.unanswered}
        </div>
      </div>
    `;
  });

  html += `</div></div>`;
  return html;
}

function getSectionLabelByIndex(index){
  if(index < 12) return "Script & Vocabulary";
  if(index < 24) return "Conversation & Expression";
  if(index < 33) return "Listening";
  return "Reading";
}

function getFeedbackAnswerHtml(options, selectedIndex){
  if(selectedIndex === undefined || selectedIndex === null){
    return `<span class="feedback-unanswered">Unanswered</span>`;
  }

  if(!Array.isArray(options) || options[selectedIndex] === undefined){
    return `<span class="feedback-unanswered">Unanswered</span>`;
  }

  const item = options[selectedIndex];

  if(typeof item === "string"){
    return item;
  }

  let html = "";

  if(item && item.image){
    html += `<img src="${item.image}" class="feedback-answer-img" alt="">`;
  }

  if(item && item.text){
    html += `<div>${item.text}</div>`;
  }

  return html || "";
}

function getFeedbackRowsData(){
  const rows = [];
  let displayNo = 1;

  questions.forEach((q, index) => {
    if(q.type === "double" && Array.isArray(q.parts)){
      q.parts.forEach((part, partIndex) => {
        const selected =
          userAnswers[index] &&
          userAnswers[index][partIndex] !== undefined
            ? userAnswers[index][partIndex]
            : undefined;

        rows.push({
          no: displayNo++,
          section: getSectionLabelByIndex(index),
          result: selected === part.answer,
          selected: getFeedbackAnswerHtml(part.options, selected),
          correct: getFeedbackAnswerHtml(part.options, part.answer)
        });
      });
    }else{
      const selected = userAnswers[index];

      rows.push({
        no: displayNo++,
        section: getSectionLabelByIndex(index),
        result: selected === q.answer,
        selected: getFeedbackAnswerHtml(q.options, selected),
        correct: getFeedbackAnswerHtml(q.options, q.answer)
      });
    }
  });

  return rows;
}

function getFeedbackRowsHtml(){
  return getFeedbackRowsData().map(row => `
    <tr>
      <td class="feedback-no-cell">${row.no}</td>
      <td>${row.section}</td>
      <td class="feedback-result-cell ${row.result ? "correct-mark" : "wrong-mark"}">
        ${row.result ? "○" : "×"}
      </td>
      <td>${row.selected}</td>
      <td>${row.correct}</td>
    </tr>
  `).join("");
}

function getOverallFeedbackSummaryHtml(){
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let total = 0;

  getFeedbackRowsData().forEach(row => {
    total++;
    if(row.selected.includes("feedback-unanswered")){
      unanswered++;
    }else if(row.result){
      correct++;
    }else{
      wrong++;
    }
  });

  const score = total > 0 ? Math.round((correct / total) * 250) : 0;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const status = score >= 200 ? "PASS" : "FAIL";

  return `
    <span>Total Score: ${score} / 250</span>
    <span>Correct: ${correct} / ${total}</span>
    <span>Wrong: ${wrong}</span>
    <span>Unanswered: ${unanswered}</span>
    <span>Percentage: ${percent}%</span>
    <span class="${status === "PASS" ? "pass-text" : "fail-text"}">Result: ${status}</span>
  `;
}

function getSectionWiseFeedbackSummaryHtml(){
  return `
    <div class="feedback-section-summary">
      <strong>Section-wise Performance</strong>
      <div class="feedback-section-summary-list">
        ${getSectionWiseStats().map(section => `
          <span>${section.name}: ${section.correct}/${section.total} (${section.percentage}%)</span>
        `).join("")}
      </div>
    </div>
  `;
}

function showTestFeedbackPage(){
  const rows = getFeedbackRowsData();

  document.documentElement.style.setProperty("height", "auto", "important");
  document.documentElement.style.setProperty("overflow-y", "auto", "important");
  document.body.style.setProperty("height", "auto", "important");
  document.body.style.setProperty("min-height", "100vh", "important");
  document.body.style.setProperty("overflow-y", "auto", "important");
  document.body.style.setProperty("overflow-x", "hidden", "important");

  document.body.innerHTML = `
    <div id="feedbackPage">
      <div class="feedback-top">
        <h2>Test Feedback</h2>
        <button type="button" class="exit-test-btn" onclick="location.reload()">Exit Test</button>
      </div>

      <div class="feedback-green-line"></div>

      <div class="feedback-box">
        <div class="feedback-title">Test Result</div>

        <div class="feedback-score-summary">
          ${getOverallFeedbackSummaryHtml()}
        </div>

        ${getSectionWiseFeedbackSummaryHtml()}

        <div class="feedback-note">
          Showing all ${rows.length} answer items. Double questions are shown as separate items.
        </div>

        <div class="feedback-table-wrap">
          <table class="feedback-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Section</th>
                <th>Result</th>
                <th>Selected Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              ${getFeedbackRowsHtml()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  window.scrollTo(0, 0);
}

function setupResultFinishButton(){
  const resultPage = document.getElementById("resultPage");
  if(!resultPage) return;

  const btn = resultPage.querySelector(".resultFinishBtn");

  if(btn){
    btn.onclick = function(e){
      if(e) e.preventDefault();
      showTestFeedbackPage();
    };
  }
}

function submitTest(){
  if(submitted) return;
  closeSubmitConfirm();
  submitted = true;
  setNavigationLock(true);

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;
  let totalMarks = 0;

  for(let i = 0; i < questions.length; i++){
    const q = questions[i];

    if(q.type === "double" && Array.isArray(q.parts)){
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

  const finalScore = totalMarks > 0
    ? Math.round((correct / totalMarks) * 250)
    : 0;

  const status = finalScore >= 200 ? "PASS" : "FAIL";

  const percent = totalMarks > 0
    ? Math.round((correct / totalMarks) * 100)
    : 0;

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

  const sectionPercentText =
    document.getElementById("sectionPercentText");

  if(sectionPercentText){
    sectionPercentText.innerHTML =
      getSectionWisePercentHtml();
  }

  if(timerIntervalId){
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }

  const top = document.querySelector(".top");
  const green = document.querySelector(".green");
  const main = document.querySelector(".main");
  const footer = document.querySelector(".footer");

  if(top) top.style.display = "none";
  if(green) green.style.display = "none";
  if(main) main.style.display = "none";
  if(footer) footer.style.display = "none";

  const appShell = document.getElementById("appShell");
  const resultPage = document.getElementById("resultPage");

  document.documentElement.style.setProperty("height", "auto", "important");
  document.documentElement.style.setProperty("min-height", "100%", "important");
  document.documentElement.style.setProperty("overflow-y", "auto", "important");
  document.documentElement.style.setProperty("overflow-x", "hidden", "important");

  document.body.style.setProperty("height", "auto", "important");
  document.body.style.setProperty("min-height", "100vh", "important");
  document.body.style.setProperty("max-height", "none", "important");
  document.body.style.setProperty("overflow-y", "auto", "important");
  document.body.style.setProperty("overflow-x", "hidden", "important");
  document.body.style.setProperty("-webkit-overflow-scrolling", "touch", "important");

  if(appShell){
    appShell.style.setProperty("height", "auto", "important");
    appShell.style.setProperty("min-height", "100vh", "important");
    appShell.style.setProperty("max-height", "none", "important");
    appShell.style.setProperty("overflow", "visible", "important");
    appShell.style.setProperty("display", "block", "important");
  }

  if(resultPage){
    resultPage.style.setProperty("display", "block", "important");
    resultPage.style.setProperty("visibility", "visible", "important");
    resultPage.style.setProperty("opacity", "1", "important");
    resultPage.style.setProperty("position", "relative", "important");
    resultPage.style.setProperty("height", "auto", "important");
    resultPage.style.setProperty("min-height", "100vh", "important");
    resultPage.style.setProperty("max-height", "none", "important");
    resultPage.style.setProperty("overflow", "visible", "important");

    const resultBody = resultPage.querySelector(".resultBody");

    if(resultBody){
      resultBody.style.setProperty("height", "auto", "important");
      resultBody.style.setProperty("max-height", "none", "important");
      resultBody.style.setProperty("overflow", "visible", "important");
      resultBody.style.setProperty("padding-bottom", "80px", "important");
    }
  }

  setNavigationLock(false);
  setupResultFinishButton();

  try{
    window.scrollTo(0, 0);
  }catch(_){}
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


// =========================================================
// SECTION CHANGE CONFIRMATION
// =========================================================
function showNextSectionConfirm(onYes){
  const oldBox = document.getElementById("nextSectionConfirmBox");
  if(oldBox) oldBox.remove();

  const overlay = document.createElement("div");
  overlay.id = "nextSectionConfirmBox";
  overlay.className = "section-confirm-overlay";

  const currentSection = getSectionName();
  let nextSection = "";

  if(currentQuestion < 12) nextSection = "Conversation and Expression";
  else if(currentQuestion < 24) nextSection = "Listening";
  else if(currentQuestion < 33) nextSection = "Reading";

  overlay.innerHTML = `
    <div class="section-confirm-card">
      <div class="section-confirm-title">Section Completed</div>
      <div class="section-confirm-text">
        तपाईंले <b>${currentSection}</b> section पूरा गर्नुभयो।
      </div>
      <div class="section-confirm-text">
        के तपाईं अर्को section <b>${nextSection}</b> मा जान चाहनुहुन्छ?
      </div>

      <div class="section-confirm-actions">
        <button id="nextSectionYes" type="button" class="confirmYes">Yes</button>
        <button id="nextSectionNo" type="button" class="confirmNo">No</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("nextSectionYes").onclick = function(){
    overlay.remove();
    if(typeof onYes === "function") onYes();
  };

  document.getElementById("nextSectionNo").onclick = function(){
    overlay.remove();
  };
}

document.getElementById("nextBtn").onclick = function(){
  if(audioPlayingNow) return;

  const sectionEnd = getSectionEnd();

  const isLastQuestionOfSection =
    currentQuestion === sectionEnd - 1 &&
    currentQuestion < questions.length - 1;

  if(isLastQuestionOfSection){
    showNextSectionConfirm(function(){
      currentQuestion++;
      loadQuestion();
    });
    return;
  }

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
timerIntervalId = setInterval(updateTimer, 1000);
