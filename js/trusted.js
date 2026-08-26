if (/^https?:$/.test(window.location.protocol) && /\/index\.html$/i.test(window.location.pathname)) {
  const cleanPath = window.location.pathname.replace(/\/index\.html$/i, "/");
  window.history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
}

const heroSlide = document.querySelector('[data-phone-slide="hero"]');
const caseSlide = document.querySelector('[data-phone-slide="case"]');
const auditModal = document.querySelector("[data-audit-modal]");
const auditTriggers = document.querySelectorAll("[data-audit-trigger]");
const auditForm = document.querySelector("[data-audit-form]");
const auditCloseButtons = document.querySelectorAll("[data-audit-close]");
const auditStatus = document.querySelector("[data-audit-status]");
const requirementChecks = Array.from(document.querySelectorAll("[data-requirement-check]"));
const requirementsStatus = document.querySelector("[data-requirements-status]");
const requirementsSection = document.querySelector("#requirements");
// Replace these values with the Google Form formResponse URL and entry IDs.
const googleFormConfig = {
  action: "",
  fields: {
    name: "",
    clinicName: "",
    specialty: "",
    mobileNo: ""
  }
};
const whatsappNumber = "60102831433";

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

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

const openAuditModal = () => {
  if (!auditModal) return;

  auditModal.classList.add("is-open");
  auditModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("audit-modal-open");
  auditModal.querySelector("input, button")?.focus();
};

const allRequirementsChecked = () => {
  return requirementChecks.length > 0 && requirementChecks.every((checkbox) => checkbox.checked);
};

const updateRequirementsStatus = (blocked = false) => {
  if (!requirementsStatus) return;

  requirementsStatus.classList.toggle("is-ready", allRequirementsChecked());
  requirementsStatus.classList.toggle("is-blocked", blocked && !allRequirementsChecked());
  requirementsStatus.textContent = allRequirementsChecked()
    ? "You can now book your free page audit."
    : "Tick all requirements before booking your free page audit.";
};

const closeAuditModal = () => {
  if (!auditModal) return;

  auditModal.classList.remove("is-open");
  auditModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("audit-modal-open");
};

const submitToGoogleForm = (formData) => {
  if (!googleFormConfig.action) return Promise.resolve();

  const googleData = new FormData();
  Object.entries(googleFormConfig.fields).forEach(([fieldName, googleEntry]) => {
    if (!googleEntry) return;
    googleData.append(googleEntry, formData.get(fieldName) || "");
  });

  return fetch(googleFormConfig.action, {
    method: "POST",
    mode: "no-cors",
    body: googleData
  });
};

const buildWhatsappUrl = (formData) => {
  const name = formData.get("name")?.toString().trim();
  const clinicName = formData.get("clinicName")?.toString().trim();
  const specialty = formData.get("specialty")?.toString().trim();
  const mobileNo = formData.get("mobileNo")?.toString().trim();

  const message = [
    "Hi USPify, I would like to book a free social media page audit.",
    name ? `Name: ${name}` : "",
    clinicName ? `Clinic Name: ${clinicName}` : "",
    specialty ? `Specialty: ${specialty}` : "",
    mobileNo ? `Mobile No.: ${mobileNo}` : ""
  ].filter(Boolean).join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

auditTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!allRequirementsChecked()) {
      updateRequirementsStatus(true);
      requirementsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    openAuditModal();
  });
});

requirementChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", () => updateRequirementsStatus(false));
});

updateRequirementsStatus(false);

auditCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAuditModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && auditModal?.classList.contains("is-open")) {
    closeAuditModal();
  }
});

auditForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = auditForm.querySelector('button[type="submit"]');
  const formData = new FormData(auditForm);
  if (submitButton) submitButton.disabled = true;
  if (auditStatus) auditStatus.textContent = "Submitting...";

  try {
    await submitToGoogleForm(formData);
    window.location.href = buildWhatsappUrl(formData);
  } catch (error) {
    if (auditStatus) {
      auditStatus.textContent = "Could not submit automatically. Please try again.";
    }
    if (submitButton) submitButton.disabled = false;
  }
});
