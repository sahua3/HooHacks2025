let questions = [];
let answers = {};

async function loadQuestions() {
  const topic = document.getElementById("topic").value;
  const res = await fetch(`http://localhost:3000/api/questions?topic=${topic}&limit=3`);
  questions = await res.json();

  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.questionText}</p>`;

    q.choices.forEach(choice => {
      const id = `${q._id}-${choice}`;
      qDiv.innerHTML += `
        <label>
          <input type="radio" name="${q._id}" value="${choice}" />
          ${choice}
        </label><br>`;
    });

    container.appendChild(qDiv);
  });

  document.getElementById("submit-quiz").style.display = "block";
}

async function submitQuiz() {
  const userId = document.getElementById("userId").value;
  let score = 0;
  let incorrect = [];

  for (const q of questions) {
    const selected = document.querySelector(`input[name="${q._id}"]:checked`);
    const userAnswer = selected ? selected.value : null;

    const fullQuestion = await fetch(`http://localhost:3000/api/questions?topic=${q.topic}`);
    const questionSet = await fullQuestion.json();
    const real = questionSet.find(item => item._id === q._id);

    const correctAnswer = questions.find(qq => qq._id === q._id).correctAnswer || q.correctAnswer;

    if (userAnswer === correctAnswer) {
      score++;
    } else {
      incorrect.push({
        questionId: q._id,
        question: q.questionText,
        correctAnswer,
        userAnswer
      });
    }
  }

  const submission = {
    userId,
    topic: document.getElementById("topic").value,
    score,
    incorrectQuestions: incorrect
  };

  const res = await fetch("http://localhost:3000/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission)
  });

  const result = await res.json();
  document.getElementById("response").textContent = JSON.stringify(result, null, 2);
}
