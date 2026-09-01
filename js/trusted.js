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
const requirementsForm = document.querySelector("[data-requirements-form]");
const requirementsStatus = document.querySelector("[data-requirements-status]");
const requirementsSection = document.querySelector("#requirements");
// Replace this with the Google Apps Script Web App URL connected to your Google Sheet.
const googleSheetConfig = {
  action: "https://script.google.com/macros/s/AKfycbx_ztAQOWLYxf3lUhOIcrqGF0f7NZn-AmJqbqfu4nmoiiqZJ-lCh7HjCsutj7C-It8t/exec"
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

const bindTapToPlayVideos = (selector) => {
  const cards = Array.from(document.querySelectorAll(selector));
  if (!cards.length) return;

  const stopControlEvent = (event) => event.stopPropagation();

  const pauseVideo = (card) => {
    const video = card.querySelector("video");
    if (!video) return;

    video.pause();
    card.classList.remove("is-playing");
  };

  const toggleVideo = (card) => {
    const video = card.querySelector("video");
    if (!video) return;

    if (video.paused) {
      cards.forEach((item) => {
        if (item !== card) pauseVideo(item);
      });

      video.play()
        .then(() => card.classList.add("is-playing"))
        .catch(() => card.classList.remove("is-playing"));
    } else {
      pauseVideo(card);
    }
  };

  cards.forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    if (card.querySelector(".trust-video-controls")) return;

    const controls = document.createElement("div");
    controls.className = "trust-video-controls";

    const progress = document.createElement("input");
    progress.className = "trust-video-progress";
    progress.type = "range";
    progress.min = "0";
    progress.max = "1000";
    progress.step = "1";
    progress.value = "0";
    progress.setAttribute("aria-label", "Video progress");
    progress.disabled = true;

    const expandButton = document.createElement("button");
    expandButton.className = "trust-video-expand";
    expandButton.type = "button";
    expandButton.setAttribute("aria-label", "Expand video");

    controls.append(progress, expandButton);
    card.append(controls);

    const updateProgress = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      progress.disabled = false;
      progress.value = String(Math.round((video.currentTime / video.duration) * 1000));
    };

    card.tabIndex = 0;
    card.setAttribute("aria-label", `${video.getAttribute("aria-label") || "Video"}: tap to play or pause`);

    card.addEventListener("click", (event) => {
      if (event.target.closest(".trust-video-controls")) return;
      toggleVideo(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest(".trust-video-controls")) return;

      event.preventDefault();
      toggleVideo(card);
    });

    controls.addEventListener("click", stopControlEvent);
    controls.addEventListener("pointerdown", stopControlEvent);

    progress.addEventListener("input", (event) => {
      event.stopPropagation();
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      video.currentTime = (Number(progress.value) / 1000) * video.duration;
      updateProgress();
    });

    expandButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
        return;
      }

      video.controls = true;

      if (video.requestFullscreen) {
        video.requestFullscreen().catch(() => {
          video.controls = false;
        });
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else {
        video.controls = false;
      }
    });

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement !== video) {
        video.controls = false;
      }
    });

    video.addEventListener("webkitendfullscreen", () => {
      video.controls = false;
    });
    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("pause", () => card.classList.remove("is-playing"));
    video.addEventListener("play", () => card.classList.add("is-playing"));
    video.addEventListener("ended", () => {
      card.classList.remove("is-playing");
      updateProgress();
    });
  });
};

const bindAutoImageCarousels = (selector) => {
  document.querySelectorAll(selector).forEach((card) => {
    const carousel = card.querySelector(".trust-image-carousel");
    const slides = Array.from(card.querySelectorAll(".trust-image-carousel img"));
    if (!carousel || slides.length < 2) return;
    if (card.querySelector(".trust-carousel-controls")) return;

    const interval = Number(card.dataset.carouselInterval) || 3000;
    let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let isPlaying = card.classList.contains("is-playing");
    let startedAt = performance.now();
    let pausedAt = 0;
    let frameId = null;

    const controls = document.createElement("div");
    controls.className = "trust-carousel-controls";

    const progress = document.createElement("div");
    progress.className = "trust-carousel-progress";
    progress.setAttribute("aria-hidden", "true");

    const progressBar = document.createElement("span");
    progress.append(progressBar);

    const previousButton = document.createElement("button");
    previousButton.className = "trust-carousel-nav trust-carousel-nav-prev";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Previous carousel slide");

    const nextButton = document.createElement("button");
    nextButton.className = "trust-carousel-nav trust-carousel-nav-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Next carousel slide");

    const expandButton = document.createElement("button");
    expandButton.className = "trust-video-expand trust-carousel-expand";
    expandButton.type = "button";
    expandButton.setAttribute("aria-label", "Expand carousel");

    controls.append(progress, expandButton);
    carousel.append(previousButton, nextButton);
    carousel.append(controls);

    const renderSlide = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeIndex);
      });
      card.setAttribute("aria-label", `Trust building carousel: slide ${activeIndex + 1} of ${slides.length}`);
    };

    const updateProgress = (now) => {
      const elapsed = isPlaying ? now - startedAt : pausedAt;
      const progressRatio = Math.min(elapsed / interval, 1);
      progressBar.style.transform = `scaleX(${progressRatio})`;
    };

    const nextSlide = (now) => {
      activeIndex = (activeIndex + 1) % slides.length;
      startedAt = now;
      pausedAt = 0;
      renderSlide();
    };

    const showSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      startedAt = performance.now();
      pausedAt = 0;
      updateProgress(startedAt);
      renderSlide();
    };

    const tick = (now) => {
      if (isPlaying && now - startedAt >= interval) {
        nextSlide(now);
      }

      updateProgress(now);
      frameId = window.requestAnimationFrame(tick);
    };

    const play = () => {
      if (isPlaying) return;

      isPlaying = true;
      startedAt = performance.now() - pausedAt;
      card.classList.add("is-playing");
    };

    const pause = () => {
      if (!isPlaying) return;

      pausedAt = performance.now() - startedAt;
      isPlaying = false;
      card.classList.remove("is-playing");
    };

    const toggle = () => {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    };

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.classList.toggle("is-playing", isPlaying);
    renderSlide();
    updateProgress(performance.now());

    card.addEventListener("click", (event) => {
      if (event.target.closest(".trust-carousel-controls")) return;
      toggle();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.target.closest(".trust-carousel-controls")) return;

      event.preventDefault();
      toggle();
    });

    controls.addEventListener("click", (event) => event.stopPropagation());
    controls.addEventListener("pointerdown", (event) => event.stopPropagation());

    [previousButton, nextButton].forEach((button) => {
      button.addEventListener("click", (event) => event.stopPropagation());
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
    });

    previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
    nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

    expandButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
        return;
      }

      if (carousel.requestFullscreen) {
        carousel.requestFullscreen();
      }
    });

    document.addEventListener("fullscreenchange", () => {
      card.classList.toggle("is-fullscreen", document.fullscreenElement === carousel);
    });

    frameId = window.requestAnimationFrame(tick);
    window.addEventListener("beforeunload", () => window.cancelAnimationFrame(frameId));
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
bindTapToPlayVideos(".trust-video-card");
bindAutoImageCarousels(".trust-image-carousel-card");
bindFlyingCardCarousel(".trust-doctor-compilation", "article", 2000);

heroSlide?.classList.add("is-active");
caseSlide?.classList.remove("is-active");

const animatedCounters = Array.from(document.querySelectorAll("[data-count-sequence]"));
const resultsSection = document.querySelector(".trust-case-results");
const resultsCounterTarget = document.querySelector(".trust-results-grid") || resultsSection;
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

  const stepDelays = [800, 800];
  let stepIndex = 0;
  let timer = null;

  counter.classList.remove("is-final");
  counter.classList.add("is-rolling");
  renderCounterValue(counter, steps[0]);

  const advanceCounter = () => {
    if (runId !== counterAnimationRun) {
      if (timer) window.clearTimeout(timer);
      return;
    }

    const previousValue = steps[stepIndex];
    stepIndex += 1;

    counter.innerHTML = `
      <span class="trust-counter-value is-exiting">${previousValue}</span>
      <span class="trust-counter-value is-entering">${steps[stepIndex]}</span>
    `;

    if (stepIndex === steps.length - 1) {
      window.setTimeout(() => {
        if (runId !== counterAnimationRun) return;

        renderCounterValue(counter, steps[stepIndex]);
        counter.classList.add("is-final");
      }, 300);

      return;
    }

    timer = window.setTimeout(advanceCounter, stepDelays[stepIndex] || 500);
  };

  timer = window.setTimeout(advanceCounter, stepDelays[0]);
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
    counterLoopTimer = window.setInterval(playCounters, 4500);
  };

  const stopCounterLoop = () => {
    if (!counterLoopTimer) return;

    window.clearInterval(counterLoopTimer);
    counterLoopTimer = null;
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
    }, {
      rootMargin: "0px 0px -6% 0px",
      threshold: 0.01
    });

    counterObserver.observe(resultsCounterTarget);
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

const submitToGoogleSheet = (formData) => {
  if (!googleSheetConfig.action) return Promise.resolve();

  const sheetData = new FormData();
  ["name", "clinicName", "specialty", "mobileNo", "crmInterest"].forEach((fieldName) => {
    sheetData.append(fieldName, formData.get(fieldName) || "");
  });

  return fetch(googleSheetConfig.action, {
    method: "POST",
    mode: "no-cors",
    body: sheetData
  });
};

const redirectToWhatsapp = (url) => {
  if (auditStatus) {
    auditStatus.textContent = "You are being redirected to WhatsApp...";
  }

  window.setTimeout(() => {
    window.location.href = url;
  }, 700);
};

const buildWhatsappUrl = (formData) => {
  const name = formData.get("name")?.toString().trim();
  const clinicName = formData.get("clinicName")?.toString().trim();
  const specialty = formData.get("specialty")?.toString().trim();
  const mobileNo = formData.get("mobileNo")?.toString().trim();
  const crmInterest = formData.get("crmInterest")?.toString().trim();

  const message = [
    "Hi USPify, I would like to book a free social media page audit.",
    name ? `Name: ${name}` : "",
    clinicName ? `Clinic Name: ${clinicName}` : "",
    specialty ? `Specialty: ${specialty}` : "",
    mobileNo ? `Mobile No.: ${mobileNo}` : "",
    crmInterest ? `Interested in CRM system: ${crmInterest}` : ""
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
    await submitToGoogleSheet(formData);
    redirectToWhatsapp(buildWhatsappUrl(formData));
  } catch (error) {
    if (auditStatus) {
      auditStatus.textContent = "Could not submit automatically. Please try again.";
    }
    if (submitButton) submitButton.disabled = false;
  }
});
