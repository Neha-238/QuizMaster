const urlParams = new URLSearchParams(window.location.search);
const score = urlParams.get("score");
const total = urlParams.get("total");
const questionsData = JSON.parse(
  decodeURIComponent(urlParams.get("data") || "[]")
);

const scoreEl = document.getElementById("score");
const reviewBtn = document.getElementById("review-btn");
const reviewContainer = document.getElementById("review-container");
const playAgainBtn = document.getElementById("play-again-btn");

const shareWhatsapp = document.getElementById("share-whatsapp");
const shareFacebook = document.getElementById("share-facebook");
const shareInstagram = document.getElementById("share-instagram");

// Display score
scoreEl.innerText = `You scored ${score} out of ${total}`;

// Review questions
reviewBtn.addEventListener("click", () => {
  reviewContainer.innerHTML = "<h3>Review Questions</h3>";
  questionsData.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.style.marginBottom = "15px";
    qDiv.innerHTML = `
      <strong>Q${index + 1}: ${q.question}</strong><br>
      Correct Answer: <span style="color:green">${q.correct}</span><br>
      Your Answer: <span style="color:blue">${
        q.userAnswer || "Not Answered"
      }</span>
    `;
    reviewContainer.appendChild(qDiv);
  });
});

// Play again
playAgainBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Share functions
function getScoreMessage() {
  return `I scored ${score} out of ${total} on QuizMaster! Can you beat me? 🎯`;
}

// WhatsApp
shareWhatsapp.addEventListener("click", () => {
  const text = encodeURIComponent(getScoreMessage());
  const url = `https://wa.me/?text=${text}`;
  window.open(url, "_blank");
});

// Facebook
shareFacebook.addEventListener("click", () => {
  const text = encodeURIComponent(getScoreMessage());
  const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${text}`;
  window.open(url, "_blank");
});

// Instagram
shareInstagram.addEventListener("click", () => {
  alert(
    "Instagram doesn't support direct text sharing. You can copy your score and post it manually!"
  );
  launchConfetti();
});

// Simple confetti effect
function launchConfetti() {
  const confettiContainer = document.createElement("div");
  confettiContainer.style.position = "fixed";
  confettiContainer.style.top = 0;
  confettiContainer.style.left = 0;
  confettiContainer.style.width = "100%";
  confettiContainer.style.height = "100%";
  confettiContainer.style.pointerEvents = "none";
  document.body.appendChild(confettiContainer);

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.top = "0px";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.opacity = 0.7;
    confettiContainer.appendChild(confetti);

    const fall = () => {
      let top = parseFloat(confetti.style.top);
      if (top < window.innerHeight) {
        confetti.style.top = top + 5 + "px";
        requestAnimationFrame(fall);
      } else {
        confetti.remove();
      }
    };
    fall();
  }

  setTimeout(() => confettiContainer.remove(), 5000);
}
