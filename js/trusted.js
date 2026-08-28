if (/^https?:$/.test(window.location.protocol) && /\/index\.html$/i.test(window.location.pathname)) {
  const cleanPath = window.location.pathname.replace(/\/index\.html$/i, "/");
  window.history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
}

const heroSlide = document.querySelector('[data-phone-slide="hero"]');
const caseSlide = document.querySelector('[data-phone-slide="case"]');
const heroScreen = document.querySelector(".trust-hero-screen");
const auditModal = document.querySelector("[data-audit-modal]");
const auditTriggers = document.querySelectorAll("[data-audit-trigger]");
const auditForm = document.querySelector("[data-audit-form]");
const auditCloseButtons = document.querySelectorAll("[data-audit-close]");
const auditStatus = document.querySelector("[data-audit-status]");
const requirementChecks = Array.from(document.querySelectorAll("[data-requirement-check]"));
const requirementsForm = document.querySelector("[data-requirements-form]");
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

const revealSections = Array.from(document.querySelectorAll(".trust-page > section:not(.trust-hero-screen)"));

if (revealSections.length) {
  revealSections.forEach((section) => section.classList.add("trust-section-reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12
    });

    revealSections.forEach((section) => revealObserver.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  }
}

if (heroScreen) {
  let heroExitTicking = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const syncHeroExit = () => {
    heroExitTicking = false;

    if (reducedMotion.matches) {
      heroScreen.classList.remove("is-exiting");
      return;
    }

    const exitPoint = window.innerHeight * 0.12;
    heroScreen.classList.toggle("is-exiting", heroScreen.getBoundingClientRect().top < -exitPoint);
  };

  const requestHeroExitSync = () => {
    if (heroExitTicking) return;
    heroExitTicking = true;
    window.requestAnimationFrame(syncHeroExit);
  };

  syncHeroExit();
  window.addEventListener("scroll", requestHeroExitSync, { passive: true });
  window.addEventListener("resize", requestHeroExitSync);
  reducedMotion.addEventListener?.("change", syncHeroExit);
}

const activateNearestCard = (scroller, itemSelector) => {
  const items = Array.from(scroller.querySelectorAll(itemSelector));
  if (!items.length) return;

  const scrollerLeft = scroller.getBoundingClientRect().left;
  const activeItem = items.reduce((nearest, item) => {
    const currentDistance = Math.abs(item.getBoundingClientRect().left - scrollerLeft);
    const nearestDistance = Math.abs(nearest.getBoundingClientRect().left - scrollerLeft);
    return currentDistance < nearestDistance ? item : nearest;
  }, items[0]);

  items.forEach((item) => item.classList.toggle("is-active", item === activeItem));
};

const bindScrollActiveCards = (selector, itemSelector) => {
  document.querySelectorAll(selector).forEach((scroller) => {
    let activeTimer = null;
    const update = () => {
      window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(() => activateNearestCard(scroller, itemSelector), 40);
    };

    activateNearestCard(scroller, itemSelector);
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  });
};

const bindFlyingCardCarousel = (selector, itemSelector, interval = 2000) => {
  document.querySelectorAll(selector).forEach((carousel) => {
    const items = Array.from(carousel.querySelectorAll(itemSelector));
    if (items.length < 2) return;

    let activeIndex = 0;
    let timer = null;
    let exitTimer = null;

    const render = (exitingIndex = null) => {
      items.forEach((item, index) => {
        item.classList.toggle("is-active", index === activeIndex);
        item.classList.toggle("is-exiting", index === exitingIndex);
      });
    };

    const advance = () => {
      const previousIndex = activeIndex;
      activeIndex = (activeIndex + 1) % items.length;
      render(previousIndex);

      window.clearTimeout(exitTimer);
      exitTimer = window.setTimeout(() => render(), 700);
    };

    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(advance, interval);
    };

    render();
    carousel.addEventListener("pointerdown", restart, { passive: true });
    window.addEventListener("resize", restart);
    restart();
  });
};

bindScrollActiveCards(".trust-subsection-track", ".trust-channel-card");
bindScrollActiveCards(".trust-case-posts", "article");
bindScrollActiveCards(".trust-expansion-posts", "article");
bindFlyingCardCarousel(".trust-doctor-compilation", "article", 2000);

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

let requirementsStatusTimer = null;

const clearRequirementsStatus = () => {
  if (!requirementsStatus) return;

  window.clearTimeout(requirementsStatusTimer);
  requirementsForm?.classList.remove("is-blocked");
  requirementsStatus.classList.remove("is-visible", "is-blocked");
  requirementsStatus.textContent = "";
};

const showRequirementsWarning = () => {
  if (!requirementsStatus) return;

  window.clearTimeout(requirementsStatusTimer);
  requirementsForm?.classList.add("is-blocked");
  requirementsStatus.textContent = "Tick all requirements before booking your free page audit.";
  requirementsStatus.classList.add("is-visible", "is-blocked");

  requirementsStatusTimer = window.setTimeout(() => {
    requirementsStatus.classList.remove("is-visible");
    requirementsForm?.classList.remove("is-blocked");

    window.setTimeout(() => {
      requirementsStatus.classList.remove("is-blocked");
      requirementsStatus.textContent = "";
    }, 320);
  }, 3400);
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
      showRequirementsWarning();
      requirementsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    openAuditModal();
  });
});

requirementChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", clearRequirementsStatus);
});

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
