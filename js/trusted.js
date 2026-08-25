const phoneMockup = document.querySelector(".trust-reel-shell");
const heroSlide = document.querySelector('[data-phone-slide="hero"]');
const caseSlide = document.querySelector('[data-phone-slide="case"]');
const caseImage = document.querySelector("[data-case-image]");
const caseKicker = document.querySelector("[data-case-kicker]");
const caseTitle = document.querySelector("[data-case-title]");
const caseCopy = document.querySelector("[data-case-copy]");

const trustCases = [
  {
    image: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=700&q=80",
    kicker: "Case 01",
    title: "From silent page to booked calendar.",
    copy: "A clearer content system helped patients understand the doctor before they booked."
  },
  {
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80",
    kicker: "Case 02",
    title: "Trust built before the first DM.",
    copy: "Educational reels turned common questions into confident appointment requests."
  },
  {
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=80",
    kicker: "Case 03",
    title: "The doctor became the reason to choose.",
    copy: "Personal authority, proof, and consistency made the clinic easier to remember."
  }
];

let activeCaseIndex = -1;

const showCase = () => {
  if (!phoneMockup || !heroSlide || !caseSlide || !caseImage || !caseKicker || !caseTitle || !caseCopy) return;

  activeCaseIndex = (activeCaseIndex + 1) % trustCases.length;
  const currentCase = trustCases[activeCaseIndex];

  phoneMockup.classList.add("is-switching");
  caseSlide.classList.remove("is-active");

  window.setTimeout(() => {
    caseImage.src = currentCase.image;
    caseImage.alt = currentCase.title;
    caseKicker.textContent = currentCase.kicker;
    caseTitle.textContent = currentCase.title;
    caseCopy.textContent = currentCase.copy;

    heroSlide.classList.remove("is-active");
    caseSlide.classList.add("is-active");
  }, 170);

  window.setTimeout(() => {
    phoneMockup.classList.remove("is-switching");
  }, 460);
};

phoneMockup?.addEventListener("click", showCase);

phoneMockup?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  showCase();
});

const subsectionCards = Array.from(document.querySelectorAll("[data-subsection-card]"));
const subsectionPrevButtons = Array.from(document.querySelectorAll("[data-subsection-prev]"));
const subsectionNextButtons = Array.from(document.querySelectorAll("[data-subsection-next]"));
const subsectionCurrent = document.querySelector("[data-subsection-current]");
const subsectionCarousel = document.querySelector("[data-subsection-carousel]");
let activeSubsectionIndex = 0;

const getSubsectionHeight = (card) => {
  if (card.classList.contains("trust-channel-social")) return "clamp(680px, 165vw, 760px)";
  if (card.classList.contains("trust-channel-google")) return "clamp(620px, 145vw, 700px)";
  return "clamp(640px, 150vw, 720px)";
};

const showSubsection = (nextIndex) => {
  if (!subsectionCards.length) return;

  activeSubsectionIndex = (nextIndex + subsectionCards.length) % subsectionCards.length;
  subsectionCards.forEach((card, index) => {
    card.classList.toggle("is-active", index === activeSubsectionIndex);
  });

  if (subsectionCurrent) {
    subsectionCurrent.textContent = String(activeSubsectionIndex + 1).padStart(2, "0");
  }
  if (subsectionCarousel) {
    const progress = ((activeSubsectionIndex + 1) / subsectionCards.length) * 100;
    subsectionCarousel.style.setProperty("--channel-progress", `${progress}%`);
    subsectionCarousel.style.setProperty("--active-channel-height", getSubsectionHeight(subsectionCards[activeSubsectionIndex]));
  }
};

showSubsection(activeSubsectionIndex);

subsectionPrevButtons.forEach((button) => button.addEventListener("click", () => {
  showSubsection(activeSubsectionIndex - 1);
}));

subsectionNextButtons.forEach((button) => button.addEventListener("click", () => {
  showSubsection(activeSubsectionIndex + 1);
}));

const trustSystemSteps = [
  {
    letter: "T",
    title: "Position your difference",
    copy: "Give patients a clear reason why it has to be you."
  },
  {
    letter: "R",
    title: "Make people watch",
    copy: "Turn expertise into relatable content people understand and remember."
  },
  {
    letter: "U",
    title: "Amplify what works",
    copy: "Put winning content in front of more potential patients."
  },
  {
    letter: "S",
    title: "Track what matters",
    copy: "Know what actually creates enquiries, appointments and revenue."
  },
  {
    letter: "T",
    title: "Optimise conversion",
    copy: "Use the data to continuously improve the entire patient journey."
  }
];

const trustCardStage = document.querySelector("[data-trust-card-stage]");
const trustPrev = document.querySelector("[data-trust-prev]");
const trustNext = document.querySelector("[data-trust-next]");
const trustDots = Array.from(document.querySelectorAll("[data-trust-dot]"));
const trustCurrent = document.querySelector("[data-trust-current]");
const trustSystemPanel = document.querySelector("[data-trust-system]");
const trustHeadingLetters = Array.from(document.querySelectorAll("[data-trust-heading-letter]"));
let activeTrustStep = 0;
let isTrustCardAnimating = false;

const createTrustCard = (step, index) => {
  const stepNumber = String(index + 1).padStart(2, "0");

  const card = document.createElement("article");
  card.className = "trust-system-card is-active";
  card.setAttribute("data-trust-card", "");
  card.innerHTML = `
    <div class="trust-system-card-rail">
      <small>${stepNumber}</small>
      <span>${step.letter}</span>
    </div>
    <div class="trust-system-card-content">
      <h3>${step.title}</h3>
      <p>${step.copy}</p>
    </div>
    <strong class="trust-system-card-watermark">${step.letter}</strong>
    <div class="trust-system-card-footer">
      <span>${step.letter} — TRUST</span>
      <span>${stepNumber} / 05</span>
    </div>
  `;
  return card;
};

const showTrustStep = (nextIndex) => {
  if (!trustCardStage || isTrustCardAnimating) return;

  const normalizedIndex = (nextIndex + trustSystemSteps.length) % trustSystemSteps.length;
  if (normalizedIndex === activeTrustStep) return;

  const currentCard = trustCardStage.querySelector("[data-trust-card]");
  const nextCard = createTrustCard(trustSystemSteps[normalizedIndex], normalizedIndex);

  isTrustCardAnimating = true;
  activeTrustStep = normalizedIndex;
  currentCard?.classList.add("is-leaving");
  trustCardStage.appendChild(nextCard);

  trustDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeTrustStep);
  });
  trustHeadingLetters.forEach((letter, index) => {
    letter.classList.toggle("is-active", index === activeTrustStep);
  });
  if (trustCurrent) {
    trustCurrent.textContent = String(activeTrustStep + 1).padStart(2, "0");
  }
  if (trustSystemPanel) {
    const progress = 8 + activeTrustStep * 23;
    trustSystemPanel.style.setProperty("--trust-progress", `${progress}%`);
  }

  window.setTimeout(() => {
    currentCard?.remove();
    isTrustCardAnimating = false;
  }, 380);
};

trustPrev?.addEventListener("click", () => {
  showTrustStep(activeTrustStep - 1);
});

trustNext?.addEventListener("click", () => {
  showTrustStep(activeTrustStep + 1);
});

trustDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const dotIndex = Number(dot.getAttribute("data-trust-dot"));
    showTrustStep(dotIndex);
  });
});
