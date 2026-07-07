const papers = [];
const topics = ["Nouns","Verbs","Preposition","Pronouns","Genders","Singular/Plural","Tenses","Comprehension"];

// Generate 10 Papers
for(let p=1; p<=10; p++){
  papers.push({
    id: p,
    title: `Paper ${p}`,
    questions: generateQuestions(p)
  });
}

function generateQuestions(paperNo){
  let qs = [];
  // 20 MCQs Grammar
  qs.push({q: `Choose correct Noun: "Honesty is the best policy"`, o:["Honesty","best","policy","is"], a:0, topic:"Nouns"});
  qs.push({q: `Verb form of "Run" in Past`, o:["Running","Ran","Runs","Run"], a:1, topic:"Verbs"});
  qs.push({q: `Correct Preposition: He is good ___ Math`, o:["in","at","on","for"], a:1, topic:"Preposition"});
  qs.push({q: `Pronoun for "Ali and Ahmed"`, o:["He","She","They","It"], a:2, topic:"Pronouns"});
  qs.push({q: `Feminine of "King"`, o:["Queen","Princess","Lady","Girl"], a:0, topic:"Genders"});
  qs.push({q: `Plural of "Child"`, o:["Childs","Children","Childes","Child"], a:1, topic:"Singular/Plural"});
  qs.push({q: `Tense: "I am going to school"`, o:["Past","Present Continuous","Future","Present Perfect"], a:1, topic:"Tenses"});
  
  // Add more to make 20
  for(let i=7; i<20; i++){
    qs.push({q: `MCQ ${i+1} Paper ${paperNo} - ${topics[i%8]}`, o:["Option A","Option B","Option C","Option D"], a:i%4, topic:topics[i%8]});
  }

  // Comprehension Passage
  qs.push({
    type: "passage",
    passage: `The lion is called the king of the jungle. It is a very strong and brave animal. Lions live in groups called prides. A lion can run very fast and hunt other animals.`,
    questions: [
      {q: "Who is called the king of jungle?", o:["Tiger","Lion","Elephant","Monkey"], a:1},
      {q: "Lions live in groups called?", o:["Herd","Flock","Pride","Pack"], a:2},
      {q: "Lions are ___ and brave", o:["Weak","Strong","Small","Lazy"], a:1}
    ]
  });
  return qs;
}

// Load Paper
function loadPaper(){
  let paperId = document.getElementById('paperSelect').value;
  let paper = papers[paperId-1];
  let form = document.getElementById('quizForm');
  form.innerHTML = `<h2>${paper.title}</h2>`;
  let qNo = 1;
  paper.questions.forEach((item, index) => {
    if(item.type == "passage"){
      form.innerHTML += `<div class="comprehension"><h3>Comprehension Passage</h3><p>${item.passage}</p>`;
      item.questions.forEach((cq, ci) => {
        form.innerHTML += renderMCQ(cq, `q${index}_${ci}`, qNo++);
      });
      form.innerHTML += `</div>`;
    } else {
      form.innerHTML += renderMCQ(item, `q${index}`, qNo++);
    }
  });
}

function renderMCQ(item, name, no){
  let html = `<div class="question"><p>${no}. ${item.q} <small>(${item.topic || 'Comprehension'})</small></p><div class="options">`;
  item.o.forEach((opt, i) => {
    html += `<label><input type="radio" name="${name}" value="${i}"> ${opt}</label>`;
  });
  html += `</div></div>`;
  return html;
}

// Submit and Result
function submitPaper(){
  let score = 0, total = 0;
  papers[document.getElementById('paperSelect').value-1].questions.forEach((item, index) => {
    if(item.type == "passage"){
      item.questions.forEach((cq, ci) => {
        total++;
        let ans = document.querySelector(`input[name="q${index}_${ci}"]:checked`);
        if(ans && parseInt(ans.value) == cq.a) score++;
      });
    } else {
      total++;
      let ans = document.querySelector(`input[name="q${index}"]:checked`);
      if(ans && parseInt(ans.value) == item.a) score++;
    }
  });
  let percent = ((score/total)*100).toFixed(2);
  document.getElementById('resultBox').innerHTML = `
    <p><b>Total Questions:</b> ${total}</p>
    <p><b>Correct:</b> <span class="correct">${score}</span></p>
    <p><b>Wrong:</b> <span class="wrong">${total-score}</span></p>
    <p><b>Percentage:</b> ${percent}%</p>
    <p><b>Grade:</b> ${percent>=80?'A+':percent>=70?'A':percent>=60?'B':'Need Improvement'}</p>
  `;
  document.getElementById('resultCard').classList.remove('hide');
  window.resultData = {score, total, percent};
}

function downloadResult(){
  let name = document.getElementById('studentName').value || "Student";
  let d = window.resultData;
  let text = `PECTA Class 8 English Result\nName: ${name}\nScore: ${d.score}/${d.total}\nPercentage: ${d.percent}%`;
  let blob = new Blob([text], {type: 'text/plain'});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}_PECTA_Result.txt`;
  a.click();
}

function shareResult(){
  let d = window.resultData;
  let text = `I scored ${d.score}/${d.total} - ${d.percent}% in Class 8 PECTA English Paper!`;
  if(navigator.share){ navigator.share({title: 'PECTA Result', text: text}); }
  else { alert(text); }
}

// Timer 45 min
let time = 45*60;
setInterval(()=>{
  if(time>0) time--;
  let m = Math.floor(time/60), s = time%60;
  document.querySelector('#timer span').innerText = `${m}:${s<10?'0':''}${s}`;
},1000);

// Init
window.onload = () => {
  let sel = document.getElementById('paperSelect');
  papers.forEach(p => sel.innerHTML += `<option value="${p.id}">${p.title}</option>`);
  loadPaper();
}
