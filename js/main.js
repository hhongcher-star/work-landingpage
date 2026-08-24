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

const animatedItems = document.querySelectorAll(
  ".proof-item, .signal, .trust-card, .chat, .profile-mock, .result-line, .check"
);

animatedItems.forEach((item) => item.classList.add("reveal-on-scroll"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

animatedItems.forEach((item) => revealObserver.observe(item));

const auditModal = document.querySelector("[data-audit-modal]");
const auditTrigger = document.querySelector("[data-audit-trigger]");
const auditForm = document.querySelector("[data-audit-form]");
const auditCloseButtons = document.querySelectorAll("[data-audit-close]");

const openAuditModal = () => {
  if (!auditModal) return;

  auditModal.classList.add("is-open");
  auditModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("audit-modal-open");
  auditModal.querySelector("input, textarea, button")?.focus();
};

const closeAuditModal = () => {
  if (!auditModal) return;

  auditModal.classList.remove("is-open");
  auditModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("audit-modal-open");
  auditTrigger?.focus();
};

auditTrigger?.addEventListener("click", openAuditModal);
auditCloseButtons.forEach((button) => button.addEventListener("click", closeAuditModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && auditModal?.classList.contains("is-open")) {
    closeAuditModal();
  }
});

auditForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(auditForm);
  const name = formData.get("name")?.toString().trim();
  const page = formData.get("page")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  const whatsappMessage = [
    "Hi USPify, I would like to book a free page audit.",
    name ? `Name: ${name}` : "",
    page ? `Social media page: ${page}` : "",
    message ? `Message: ${message}` : ""
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/60102831433?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, "_blank", "noopener");
});

const reelModal = document.querySelector("[data-reel-modal]");
const reelImage = document.querySelector("[data-reel-image]");
const reelTitle = document.querySelector("[data-reel-title]");
const reelViews = document.querySelector("[data-reel-views]");
const reelCloseButtons = document.querySelectorAll("[data-reel-close]");

const closeReelModal = () => {
  if (!reelModal) return;

  reelModal.classList.remove("is-open");
  reelModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("reel-modal-open");
};

const openReelModal = (card) => {
  if (!reelModal || !reelImage || !reelTitle || !reelViews) return;

  const image = card.querySelector("img");
  const title = card.querySelector("p");
  const views = card.querySelector("small");

  reelImage.src = image?.currentSrc || image?.src || "";
  reelImage.alt = title?.textContent?.trim() || "Reel preview";
  reelTitle.textContent = title?.textContent?.trim() || "";
  reelViews.textContent = views ? `${views.textContent.trim()} views` : "";

  reelModal.classList.add("is-open");
  reelModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("reel-modal-open");
  reelModal.querySelector("button")?.focus();
};

const activateReelCard = (card) => {
  if (!card || card.classList.contains("is-flying") || reelModal?.classList.contains("is-open")) return;

  card.classList.add("is-flying");
  window.setTimeout(() => {
    card.classList.remove("is-flying");
    openReelModal(card);
  }, 180);
};

document.addEventListener("click", (event) => {
  const card = event.target.closest(".hero .reel-card");
  if (!card) return;

  activateReelCard(card);
});

document.addEventListener("keydown", (event) => {
  const card = event.target.closest?.(".hero .reel-card");
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;

  event.preventDefault();
  activateReelCard(card);
});

reelCloseButtons.forEach((button) => button.addEventListener("click", closeReelModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && reelModal?.classList.contains("is-open")) {
    closeReelModal();
  }
});

const pillarModal = document.querySelector("[data-pillar-modal]");
const pillarImage = document.querySelector("[data-pillar-image]");
const pillarCategory = document.querySelector("[data-pillar-category]");
const pillarTitle = document.querySelector("[data-pillar-title]");
const pillarCopy = document.querySelector("[data-pillar-copy]");
const pillarCloseButtons = document.querySelectorAll("[data-pillar-close]");

const closePillarModal = () => {
  if (!pillarModal) return;

  pillarModal.classList.remove("is-open");
  pillarModal.classList.remove("is-image-only");
  pillarModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("reel-modal-open");
};

const openPillarModal = (card) => {
  if (!pillarModal || !pillarImage || !pillarCategory || !pillarTitle || !pillarCopy) return;

  pillarModal.classList.remove("is-image-only");

  const image = card.querySelector("img");
  const category = card.querySelector("span");
  const title = card.querySelector("h3");
  const copy = card.querySelector("p");

  pillarImage.src = image?.currentSrc || image?.src || "";
  pillarImage.alt = title?.textContent?.trim() || "Content pillar preview";
  pillarCategory.textContent = category?.textContent?.trim() || "";
  pillarTitle.textContent = title?.textContent?.trim() || "";
  pillarCopy.textContent = copy?.textContent?.trim() || "";

  pillarModal.classList.add("is-open");
  pillarModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("reel-modal-open");
  pillarModal.querySelector("button")?.focus();
};

const openImagePreview = (image) => {
  if (!pillarModal || !pillarImage || !pillarCategory || !pillarTitle || !pillarCopy) return;

  pillarImage.src = image.currentSrc || image.src || "";
  pillarImage.alt = image.alt || "Image preview";
  pillarCategory.textContent = "";
  pillarTitle.textContent = "";
  pillarCopy.textContent = "";

  pillarModal.classList.add("is-open", "is-image-only");
  pillarModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("reel-modal-open");
  pillarModal.querySelector("button")?.focus();
};

document.addEventListener("click", (event) => {
  const card = event.target.closest(".pillar-card");
  if (!card) return;

  openPillarModal(card);
});

document.addEventListener("click", (event) => {
  const image = event.target.closest(".ig-shot");
  if (!image) return;

  openImagePreview(image);
});

pillarCloseButtons.forEach((button) => button.addEventListener("click", closePillarModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && pillarModal?.classList.contains("is-open")) {
    closePillarModal();
  }
});

const initImpactOpportunityMap = () => {
  const chartElement = document.getElementById("impactOpportunityMap");
  const section = document.querySelector(".global-impact");

  if (
    !chartElement ||
    !section ||
    !window.am5 ||
    !window.am5map ||
    !window.am5geodata_worldLow ||
    !window.am5themes_Animated
  ) {
    return;
  }

  am5.ready(() => {
    const root = am5.Root.new(chartElement);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoOrthographic(),
        panX: "rotateX",
        panY: "rotateY",
        wheelY: "zoom",
        rotationX: -103,
        rotationY: -8,
        homeZoomLevel: 2.95,
        homeGeoPoint: { longitude: 105, latitude: 12 }
      })
    );

    chart.chartContainer.setAll({
      background: am5.Rectangle.new(root, {
        fill: am5.color(0x12062b),
        fillOpacity: 0
      })
    });

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
        valueField: "value",
        calculateAggregates: true
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x291058),
      stroke: am5.color(0x7148b7),
      strokeWidth: 0.65,
      fillOpacity: 0.86,
      interactive: true,
      templateField: "polygonSettings"
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x6d35d9)
    });

    polygonSeries.data.setAll([
      { id: "MY", polygonSettings: { fill: am5.color(0x6d35d9), fillOpacity: 1 } },
      { id: "CN", polygonSettings: { fill: am5.color(0x6d35d9), fillOpacity: 1 } },
      { id: "ID", polygonSettings: { fill: am5.color(0x6d35d9), fillOpacity: 1 } }
    ]);

    const malaysia = [101.6869, 3.139];
    const china = [116.4074, 39.9042];
    const indonesia = [106.8456, -6.2088];

    const lineSeries = chart.series.push(
      am5map.MapLineSeries.new(root, {
        lineType: "curved"
      })
    );

    lineSeries.mapLines.template.setAll({
      stroke: am5.color(0xff9d00),
      strokeWidth: 4,
      strokeOpacity: 0.95,
      lineCap: "round",
      shadowColor: am5.color(0xff9d00),
      shadowBlur: 18,
      shadowOpacity: 0.85
    });

    lineSeries.data.setAll([
      {
        geometry: {
          type: "LineString",
          coordinates: [malaysia, china]
        }
      },
      {
        geometry: {
          type: "LineString",
          coordinates: [malaysia, indonesia]
        }
      }
    ]);

    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude"
      })
    );

    pointSeries.bullets.push((rootRef, series, dataItem) => {
      const data = dataItem?.dataContext || {};
      const marker = am5.Container.new(root, {
        centerX: am5.p50,
        centerY: am5.p50
      });

      const halo = marker.children.push(
        am5.Circle.new(root, {
          radius: 24,
          fill: am5.color(0xff9d00),
          fillOpacity: 0.16,
          stroke: am5.color(0xff9d00),
          strokeOpacity: 0.9,
          strokeWidth: 2,
          shadowColor: am5.color(0xff9d00),
          shadowBlur: 24,
          shadowOpacity: 0.92
        })
      );

      marker.children.push(
        am5.Circle.new(root, {
          radius: 17,
          fill: am5.color(0xff9d00),
          fillOpacity: 0.98,
          stroke: am5.color(0xffd55d),
          strokeWidth: 2,
          shadowColor: am5.color(0xff9d00),
          shadowBlur: 18,
          shadowOpacity: 0.95
        })
      );

      marker.children.push(
        am5.Picture.new(root, {
          src: data.flagSrc,
          width: 30,
          height: 22,
          centerX: am5.p50,
          centerY: am5.p50
        })
      );

      const labelGroup = marker.children.push(
        am5.Container.new(root, {
          x: data.labelX || 22,
          y: data.labelY || 0,
          centerY: am5.p50,
          layout: root.verticalLayout
        })
      );

      labelGroup.children.push(
        am5.Label.new(root, {
          text: data.name,
          fill: am5.color(0xffffff),
          fontFamily: "Poppins, Arial, sans-serif",
          fontSize: 18,
          fontWeight: "900",
          shadowColor: am5.color(0x8f57f4),
          shadowBlur: 14,
          shadowOpacity: 0.88
        })
      );

      labelGroup.children.push(
        am5.Label.new(root, {
          text: data.note,
          fill: am5.color(0xffffff),
          fillOpacity: 0.78,
          fontFamily: "Poppins, Arial, sans-serif",
          fontSize: 12,
          fontWeight: "500",
          lineHeight: 1.3,
          shadowColor: am5.color(0x1b0b3e),
          shadowBlur: 10,
          shadowOpacity: 0.88
        })
      );

      halo.animate({
        key: "scale",
        from: 0.82,
        to: 1.48,
        duration: 1400,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.cubic)
      });

      halo.animate({
        key: "fillOpacity",
        from: 0.25,
        to: 0,
        duration: 1400,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.cubic)
      });

      return am5.Bullet.new(root, {
        sprite: marker
      });
    });

    pointSeries.data.setAll([
      {
        name: "MALAYSIA",
        note: "Strong local presence\nand growing influence",
        latitude: malaysia[1],
        longitude: malaysia[0],
        flagSrc: "https://flagcdn.com/w80/my.png",
        labelX: 24,
        labelY: 12
      },
      {
        name: "CHINA",
        note: "Attracted interest\nfrom distributors",
        latitude: china[1],
        longitude: china[0],
        flagSrc: "https://flagcdn.com/w80/cn.png",
        labelX: 24,
        labelY: -28
      },
      {
        name: "INDONESIA",
        note: "Partnership discussions\nand new opportunities",
        latitude: indonesia[1],
        longitude: indonesia[0],
        flagSrc: "https://flagcdn.com/w80/id.png",
        labelX: 24,
        labelY: -6
      }
    ]);

    const playMapSequence = () => {
      section.classList.add("map-played");
    };

    const mapObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playMapSequence();
            mapObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    mapObserver.observe(section);
    chart.appear(900, 100);
  });
};

initImpactOpportunityMap();
