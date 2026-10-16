const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const lessons = {
  ottoman: {unit:"الوحدة الأولى", title:"مصر تحت الحكم العثماني", description:"دخلت مصر تحت الحكم العثماني سنة 1517م بعد انتصار السلطان سليم الأول على دولة المماليك. تغيّرت الإدارة وأصبحت مصر ولاية تابعة للدولة العثمانية، مع استمرار وجود عناصر محلية في الإدارة وجمع الضرائب.", points:["عام 1517م نقطة أساسية في بداية الحكم العثماني لمصر.","أصبحت مصر ولاية تابعة للدولة العثمانية.","لفهم الفترة، اربط بين نظام الحكم والإدارة والضرائب وأوضاع السكان."], question:1},
  french: {unit:"الوحدة الثانية", title:"الحملة الفرنسية على مصر", description:"بدأت الحملة الفرنسية على مصر سنة 1798م بقيادة نابليون بونابرت. ارتبطت الحملة بأهداف سياسية وعسكرية واقتصادية، كما صاحبتها بعثة علمية تركت مواد مهمة لدراسة مصر، رغم آثار الاحتلال والصراع على البلاد.", points:["بدأت الحملة الفرنسية عام 1798م.","قاد الحملة نابليون بونابرت في بدايتها.","ادرس أسباب الحملة وأحداثها ونتائجها من أكثر من زاوية."], question:0},
  modern: {unit:"الوحدة الثالثة", title:"بناء الدولة الحديثة", description:"تولى محمد علي حكم مصر سنة 1805م، وبدأت في عهده تغييرات في الجيش والإدارة والتعليم والاقتصاد. ساعدت هذه التحولات في تشكيل ملامح الدولة الحديثة، وكان لها أثر واسع في المجتمع المصري.", points:["تولى محمد علي الحكم عام 1805م.","شملت التغييرات الجيش والإدارة والتعليم والاقتصاد.","ميّز بين أهداف الإصلاح ونتائجه على الدولة والمجتمع."], question:2}
};
const questions = [
  {topic:"الحملة الفرنسية", q:"في أي عام بدأت الحملة الفرنسية على مصر؟", options:["1798م","1517م","1805م","1882م"], correct:0, explain:"بدأت الحملة الفرنسية على مصر عام 1798م بقيادة نابليون بونابرت."},
  {topic:"الحكم العثماني", q:"في أي عام أصبحت مصر تحت الحكم العثماني؟", options:["1798م","1517م","1805م","1952م"], correct:1, explain:"دخل العثمانيون مصر عام 1517م في عهد السلطان سليم الأول."},
  {topic:"الدولة الحديثة", q:"في أي عام تولّى محمد علي حكم مصر؟", options:["1798م","1882م","1805م","1517م"], correct:2, explain:"تولى محمد علي حكم مصر عام 1805م."}
];
let currentQuestion = 0, selectedAnswer = null, answered = false;
let completed = new Set(JSON.parse(localStorage.getItem("alqaed-completed") || "[]"));
let lastScore = localStorage.getItem("alqaed-last-score") || "—";
$("#year").textContent = new Date().getFullYear();

function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function renderProgress() {
  const total = Object.keys(lessons).length, count = completed.size, percent = Math.round(count/total*100);
  $("#progressPercent").textContent = percent + "%";
  $("#overallProgress").style.width = percent + "%";
  $("#progressLessons").textContent = `أنجزت ${count} من ${total} دروس`;
  $("#quizScore").textContent = `نتيجة آخر اختبار: ${lastScore}`;
  const list = $("#progressList"); list.innerHTML = "";
  Object.entries(lessons).forEach(([id, lesson]) => {
    const isDone = completed.has(id);
    const item = document.createElement("div"); item.className = "progress-item" + (isDone ? " complete" : "");
    item.innerHTML = `<span class="checkmark">${isDone ? "✓" : "◈"}</span><span><b>${lesson.title}</b><small>${isDone ? "تمت المراجعة" : "لم يكتمل بعد"}</small></span>`;
    list.appendChild(item);
  });
}
function markComplete(id) {
  completed.add(id); localStorage.setItem("alqaed-completed", JSON.stringify([...completed])); renderProgress();
}
function openLesson(id) {
  const lesson = lessons[id]; if (!lesson) return;
  $("#lessonUnit").textContent = lesson.unit; $("#lessonTitle").textContent = lesson.title;
  $("#lessonBannerTitle").textContent = lesson.title; $("#lessonDescription").textContent = lesson.description;
  const ul = $("#lessonPoints"); ul.innerHTML = "";
  lesson.points.forEach(point => { const li = document.createElement("li"); li.textContent = point; ul.appendChild(li); });
  $("#lessonPanel").classList.remove("hidden"); $("#lessonPanel").dataset.lessonId = id;
  $("#lessonPanel").scrollIntoView({behavior:"smooth", block:"start"});
}
$$(".open-lesson").forEach(btn => btn.addEventListener("click", () => openLesson(btn.dataset.lesson)));
$("#closeLesson").addEventListener("click", () => $("#lessonPanel").classList.add("hidden"));
$("#markComplete").addEventListener("click", () => {
  const id = $("#lessonPanel").dataset.lessonId; if (id) { markComplete(id); showToast("عاش! اتسجل الدرس كمكتمل على الجهاز ده."); }
});
$("#lessonQuizButton").addEventListener("click", () => {
  const id = $("#lessonPanel").dataset.lessonId;
  if (id === "french") currentQuestion = 0;
  else if (id === "ottoman") currentQuestion = 1;
  else currentQuestion = 2;
  renderQuestion(); $("#quiz").scrollIntoView({behavior:"smooth"});
});
$("#courseSearch").addEventListener("input", e => {
  const term = e.target.value.trim().toLocaleLowerCase("ar");
  $$(".course-card").forEach(card => card.classList.toggle("hidden", !card.dataset.title.toLocaleLowerCase("ar").includes(term)));
});
function renderQuestion() {
  const q = questions[currentQuestion]; selectedAnswer = null; answered = false;
  $("#quizTopic").textContent = q.topic; $("#questionText").textContent = q.q;
  $("#questionCount").textContent = `السؤال ${currentQuestion+1} من ${questions.length}`;
  $("#quizProgressBar").style.width = `${(currentQuestion+1)/questions.length*100}%`;
  $("#quizFeedback").className = "quiz-feedback hidden"; $("#quizFeedback").textContent = "";
  $("#checkAnswer").disabled = true; $("#checkAnswer").classList.remove("hidden"); $("#nextQuestion").classList.add("hidden");
  const options = $("#answerOptions"); options.innerHTML = "";
  q.options.forEach((option, i) => {
    const btn = document.createElement("button"); btn.type = "button"; btn.className = "answer-option";
    const letter = document.createElement("span"); letter.className = "option-letter"; letter.textContent = ["أ","ب","ج","د"][i];
    const label = document.createElement("span"); label.textContent = option;
    btn.append(letter, label);
    btn.addEventListener("click", () => {
      if (answered) return;
      selectedAnswer = i; $$(".answer-option", options).forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected"); $("#checkAnswer").disabled = false;
    });
    options.appendChild(btn);
  });
}
$("#checkAnswer").addEventListener("click", () => {
  if (selectedAnswer === null || answered) return;
  answered = true; const q = questions[currentQuestion], correct = selectedAnswer === q.correct;
  const buttons = $$(".answer-option");
  buttons[q.correct].classList.add("correct");
  if (!correct) buttons[selectedAnswer].classList.add("wrong");
  const feedback = $("#quizFeedback"); feedback.className = "quiz-feedback " + (correct ? "good" : "bad");
  feedback.textContent = (correct ? "إجابة صحيحة! " : "مش مشكلة، راجع الإجابة. ") + q.explain;
  $("#checkAnswer").classList.add("hidden");
  if (currentQuestion < questions.length - 1) $("#nextQuestion").classList.remove("hidden");
  else {
    $("#nextQuestion").classList.remove("hidden"); $("#nextQuestion").textContent = "ابدأ من جديد ↻";
    const score = correct ? "إجابة صحيحة" : "تحتاج مراجعة";
    lastScore = score; localStorage.setItem("alqaed-last-score", score); renderProgress();
  }
});
$("#nextQuestion").addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) currentQuestion++;
  else currentQuestion = 0;
  $("#nextQuestion").textContent = "السؤال التالي ←"; renderQuestion();
});
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$('#mainNav a').forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));
renderProgress(); renderQuestion();
