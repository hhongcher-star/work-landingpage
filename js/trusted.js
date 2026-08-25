const heroSlide = document.querySelector('[data-phone-slide="hero"]');
const caseSlide = document.querySelector('[data-phone-slide="case"]');

heroSlide?.classList.add("is-active");
caseSlide?.classList.remove("is-active");

const animatedCounters = Array.from(document.querySelectorAll("[data-count-sequence]"));
const resultsSection = document.querySelector(".trust-case-results");
let counterAnimationRun = 0;
let counterLoopTimer = null;

const getCounterSteps = (counter) => {
  return (counter.getAttribute("data-count-sequence") || "")
    .split("|")
    .map((step) => step.trim())
    .filter(Boolean);
};

const renderCounterValue = (counter, value, state = "current") => {
  counter.innerHTML = `<span class="trust-counter-value is-${state}">${value}</span>`;
};

const resetCounters = () => {
  animatedCounters.forEach((counter) => {
    const steps = getCounterSteps(counter);

    counter.classList.remove("is-final", "is-rolling");
    renderCounterValue(counter, steps[0] || "");
  });
};

const rollCounter = (counter, runId) => {
  const steps = getCounterSteps(counter);
  if (steps.length < 2) return;

  const totalDuration = 5000;
  const stepDelay = totalDuration / (steps.length - 1);
  let stepIndex = 0;

  counter.classList.remove("is-final");
  counter.classList.add("is-rolling");
  renderCounterValue(counter, steps[0]);

  const timer = window.setInterval(() => {
    if (runId !== counterAnimationRun) {
      window.clearInterval(timer);
      return;
    }

    const previousValue = steps[stepIndex];
    stepIndex += 1;

    counter.innerHTML = `
      <span class="trust-counter-value is-exiting">${previousValue}</span>
      <span class="trust-counter-value is-entering">${steps[stepIndex]}</span>
    `;

    if (stepIndex === steps.length - 1) {
      window.clearInterval(timer);
      window.setTimeout(() => {
        if (runId !== counterAnimationRun) return;

        renderCounterValue(counter, steps[stepIndex]);
        counter.classList.add("is-final");
      }, 300);
    }
  }, stepDelay);
};

resetCounters();

if (animatedCounters.length && resultsSection) {
  const playCounters = () => {
    counterAnimationRun += 1;
    resetCounters();
    animatedCounters.forEach((counter) => rollCounter(counter, counterAnimationRun));
  };

  const startCounterLoop = () => {
    if (counterLoopTimer) return;

    playCounters();
    counterLoopTimer = window.setInterval(playCounters, 9300);
  };

  const stopCounterLoop = () => {
    if (!counterLoopTimer) return;

    window.clearInterval(counterLoopTimer);
    counterLoopTimer = null;
    counterAnimationRun += 1;
    resetCounters();
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          stopCounterLoop();
          return;
        }

        startCounterLoop();
      });
    }, { threshold: 0.25 });

    counterObserver.observe(resultsSection);
  } else {
    startCounterLoop();
  }
}
