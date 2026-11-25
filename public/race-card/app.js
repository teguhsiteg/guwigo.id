/**
 * PaceCard Pro - White-label Race Card Platform
 * High-performance Client-Side Canvas 1080x1920 Compositor & Wizard
 */
(() => {
  'use strict';

  // --- State & Configurations ---
  const state = {
    // Event Branding
    eventTitle: 'POCARI SWEAT RUN 2026',
    eventSubtitle: 'BANDUNG · GEDUNG SATE',
    currentTheme: 'theme-pocari',
    categories: ['5K', '10K', '21K', '42K'],
    selectedCategory: '21K',
    hashtag: '#PocariRun2026 #BandungLari',

    // Runner & Metrics
    runnerName: 'TEGUH SITEG',
    bibNumber: '21088',
    runningClub: 'GUWIGO RUN CLUB',
    hour: '01',
    min: '48',
    sec: '25',
    pace: '05:08',
    heartRate: '158',
    isPersonalBest: true,

    // Photo Adjustment
    photoImage: null,
    photoUrl: '',
    photoFileName: '',
    zoom: 1.0,
    panX: 0,
    panY: 0,
    coverScale: 1,

    // Wizard
    currentStep: 0,
  };

  // Event Presets for client demo
  const EVENT_PRESETS = {
    pocari: {
      title: 'POCARI SWEAT RUN 2026',
      subtitle: 'BANDUNG · GEDUNG SATE',
      theme: 'theme-pocari',
      categories: ['5K', '10K', '21K', '42K'],
      hashtag: '#PocariRun2026 #BandungLari',
    },
    maybank: {
      title: 'MAYBANK MARATHON 2026',
      subtitle: 'BALI · GIANYAR',
      theme: 'theme-maybank',
      categories: ['10K', '21K', '42K'],
      hashtag: '#MaybankMarathon2026 #PushYourLimit',
    },
    borobudur: {
      title: 'BOROBUDUR MARATHON 2026',
      subtitle: 'MAGELANG · CANDI BOROBUDUR',
      theme: 'theme-borobudur',
      categories: ['10K', '21K', '42K'],
      hashtag: '#BorobudurMarathon #MenembusBatas',
    },
    jakarta: {
      title: 'JAKARTA RUNNING FEST 2026',
      subtitle: 'GBK SENAYAN · JAKARTA',
      theme: 'theme-cyber',
      categories: ['5K', '10K', '21K', '42K'],
      hashtag: '#JRF2026 #JakartaLari',
    },
    sunset: {
      title: 'SUNSET TRAIL RUN 2026',
      subtitle: 'BROMO TENGGER SEMERU',
      theme: 'theme-sunset',
      categories: ['10K', '25K', '50K Ultra'],
      hashtag: '#SunsetTrail2026 #TrailRunIndonesia',
    },
  };

  // DOM Elements
  const $ = (id) => document.getElementById(id);

  const dom = {
    body: document.body,
    // Wizard
    stepBtns: document.querySelectorAll('.step-btn'),
    stepContents: document.querySelectorAll('.step-content'),
    btnPrevStep: $('btnPrevStep'),
    btnNextStep: $('btnNextStep'),

    // Inputs
    runnerNameInput: $('runnerNameInput'),
    categoryButtonGroup: $('categoryButtonGroup'),
    bibNumberInput: $('bibNumberInput'),
    runningClubInput: $('runningClubInput'),
    timeHour: $('timeHour'),
    timeMin: $('timeMin'),
    timeSec: $('timeSec'),
    paceInput: $('paceInput'),
    btnAutoPace: $('btnAutoPace'),
    avgHeartRateInput: $('avgHeartRateInput'),
    pbBadgeToggle: $('pbBadgeToggle'),

    // Photo
    photoDropZone: $('photoDropZone'),
    photoFileInput: $('photoFileInput'),
    photoControlsWrapper: $('photoControlsWrapper'),
    photoFileName: $('photoFileName'),
    btnRemovePhoto: $('btnRemovePhoto'),
    zoomSlider: $('zoomSlider'),
    zoomVal: $('zoomVal'),
    btnRecenter: $('btnRecenter'),
    btnFitCover: $('btnFitCover'),
    photoLayerWrapper: $('photoLayerWrapper'),
    cardUserPhoto: $('cardUserPhoto'),
    photoPlaceholder: $('photoPlaceholder'),

    // Live Preview elements
    raceCardPreview: $('raceCardPreview'),
    cardEventTitle: $('cardEventTitle'),
    cardEventSubtitle: $('cardEventSubtitle'),
    cardCategoryBadge: $('cardCategoryBadge'),
    cardPbBadge: $('cardPbBadge'),
    cardRunnerName: $('cardRunnerName'),
    cardBib: $('cardBib'),
    cardClub: $('cardClub'),
    cardFinishTime: $('cardFinishTime'),
    cardPace: $('cardPace'),
    cardHr: $('cardHr'),
    cardHrBlock: $('cardHrBlock'),
    cardHashtag: $('cardHashtag'),

    // Drawer Customizer
    configDrawer: $('configDrawer'),
    drawerOverlay: $('drawerOverlay'),
    toggleConfigBtn: $('toggleConfigBtn'),
    closeConfigBtn: $('closeConfigBtn'),
    presetEventSelect: $('presetEventSelect'),
    cfgEventTitle: $('cfgEventTitle'),
    cfgEventSubtitle: $('cfgEventSubtitle'),
    cfgCategories: $('cfgCategories'),
    cfgHashtag: $('cfgHashtag'),
    applyConfigBtn: $('applyConfigBtn'),
    themeChips: document.querySelectorAll('.color-chip'),

    // Export Summary & Actions
    sumEventName: $('sumEventName'),
    sumRunnerName: $('sumRunnerName'),
    sumTime: $('sumTime'),
    btnDownloadPNG: $('btnDownloadPNG'),
    btnShareStory: $('btnShareStory'),
    btnExportTemplate: $('btnExportTemplate'),
    exportCanvas: $('exportCanvas'),
    toastNotification: $('toastNotification'),
  };

  // --- Notification Toast ---
  function showToast(message) {
    dom.toastNotification.textContent = message;
    dom.toastNotification.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      dom.toastNotification.classList.remove('show');
    }, 3200);
  }

  // --- Auto Calculate Pace ---
  function calculateAutoPace() {
    const h = parseInt(state.hour, 10) || 0;
    const m = parseInt(state.min, 10) || 0;
    const s = parseInt(state.sec, 10) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    let km = 21.0975; // default 21K
    if (state.selectedCategory === '5K') km = 5.0;
    else if (state.selectedCategory === '10K') km = 10.0;
    else if (state.selectedCategory === '42K') km = 42.195;
    else {
      const match = state.selectedCategory.match(/(\d+(\.\d+)?)/);
      if (match) km = parseFloat(match[1]);
    }

    if (totalSeconds <= 0 || km <= 0) return '05:00';

    const paceSecPerKm = Math.round(totalSeconds / km);
    const paceMin = Math.floor(paceSecPerKm / 60);
    const paceSec = paceSecPerKm % 60;
    return `${String(paceMin).padStart(2, '0')}:${String(paceSec).padStart(2, '0')}`;
  }

  // --- Render Dynamic Preview ---
  function updateLivePreview() {
    // Update Text Content
    dom.cardEventTitle.textContent = state.eventTitle;
    dom.cardEventSubtitle.textContent = state.eventSubtitle;
    dom.cardCategoryBadge.textContent = state.selectedCategory;
    dom.cardRunnerName.textContent = state.runnerName.toUpperCase() || 'RUNNER NAME';
    dom.cardBib.textContent = state.bibNumber ? `BIB ${state.bibNumber}` : 'FINISHER';
    dom.cardClub.textContent = state.runningClub || '';
    dom.cardClub.style.display = state.runningClub ? 'inline' : 'none';

    // Finish Time string
    const timeStr = `${String(state.hour).padStart(2, '0')}:${String(state.min).padStart(2, '0')}:${String(state.sec).padStart(2, '0')}`;
    dom.cardFinishTime.textContent = timeStr;
    dom.cardPace.innerHTML = `${state.pace}<small>/KM</small>`;

    if (state.heartRate) {
      dom.cardHrBlock.style.display = 'flex';
      dom.cardHr.innerHTML = `${state.heartRate}<small>BPM</small>`;
    } else {
      dom.cardHrBlock.style.display = 'none';
    }

    // PB Badge
    dom.cardPbBadge.style.display = state.isPersonalBest ? 'block' : 'none';

    // Hashtag
    dom.cardHashtag.textContent = state.hashtag;

    // Export Summary
    dom.sumEventName.textContent = state.eventTitle;
    dom.sumRunnerName.textContent = state.runnerName || '—';
    dom.sumTime.textContent = `${state.selectedCategory} · ${timeStr} (Pace ${state.pace})`;
  }

  // --- Photo Positioning Logic (Pan & Zoom) ---
  function recalculatePhotoTransform() {
    if (!state.photoImage) return;

    const wrapperRect = dom.photoLayerWrapper.getBoundingClientRect();
    const naturalWidth = state.photoImage.naturalWidth || 1000;
    const naturalHeight = state.photoImage.naturalHeight || 1000;

    // Scale to cover 9:16 container
    state.coverScale = Math.max(wrapperRect.width / naturalWidth, wrapperRect.height / naturalHeight);

    const scaledWidth = naturalWidth * state.coverScale * state.zoom;
    const scaledHeight = naturalHeight * state.coverScale * state.zoom;

    // Clamp Pan
    const maxPanX = Math.max(0, (scaledWidth - wrapperRect.width) / 2);
    const maxPanY = Math.max(0, (scaledHeight - wrapperRect.height) / 2);

    state.panX = Math.max(-maxPanX, Math.min(maxPanX, state.panX));
    state.panY = Math.max(-maxPanY, Math.min(maxPanY, state.panY));

    // Apply CSS transform to preview photo
    dom.cardUserPhoto.style.width = `${naturalWidth}px`;
    dom.cardUserPhoto.style.height = `${naturalHeight}px`;
    dom.cardUserPhoto.style.transform = `translate(-50%, -50%) translate(${state.panX}px, ${state.panY}px) scale(${state.coverScale * state.zoom})`;
    dom.cardUserPhoto.style.top = '50%';
    dom.cardUserPhoto.style.left = '50%';
  }

  // Optimize & Load Image locally (Fast client-side decoding)
  function handlePhotoUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Harap upload file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.photoImage = img;
        state.photoUrl = e.target.result;
        state.photoFileName = file.name;
        state.zoom = 1.0;
        state.panX = 0;
        state.panY = 0;

        dom.cardUserPhoto.src = state.photoUrl;
        dom.cardUserPhoto.style.display = 'block';
        dom.photoPlaceholder.style.display = 'none';

        dom.photoControlsWrapper.classList.remove('hidden');
        dom.photoFileName.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
        dom.zoomSlider.value = 1.0;
        dom.zoomVal.textContent = '1.0x';

        recalculatePhotoTransform();
        showToast('Foto berhasil dimuat! Geser atau atur zoom sesuai keinginan.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // --- Interactive Dragging on Preview ---
  let isDragging = false;
  let startX = 0, startY = 0;

  dom.photoLayerWrapper.addEventListener('pointerdown', (e) => {
    if (!state.photoImage) return;
    isDragging = true;
    startX = e.clientX - state.panX;
    startY = e.clientY - state.panY;
    dom.photoLayerWrapper.setPointerCapture(e.pointerId);
  });

  dom.photoLayerWrapper.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    state.panX = e.clientX - startX;
    state.panY = e.clientY - startY;
    recalculatePhotoTransform();
  });

  ['pointerup', 'pointercancel'].forEach((evt) => {
    dom.photoLayerWrapper.addEventListener(evt, () => {
      isDragging = false;
    });
  });

  // --- Category Buttons Refresh ---
  function renderCategoryButtons() {
    dom.categoryButtonGroup.innerHTML = '';
    state.categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `pill-btn ${cat === state.selectedCategory ? 'active' : ''}`;
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        state.selectedCategory = cat;
        document.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.pace = calculateAutoPace();
        dom.paceInput.value = state.pace;
        updateLivePreview();
      });
      dom.categoryButtonGroup.appendChild(btn);
    });
  }

  // --- Wizard Navigation ---
  function setWizardStep(stepIndex) {
    state.currentStep = Math.max(0, Math.min(3, stepIndex));

    dom.stepBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === state.currentStep);
      btn.classList.toggle('completed', idx < state.currentStep);
    });

    dom.stepContents.forEach((content, idx) => {
      content.classList.toggle('active', idx === state.currentStep);
    });

    dom.btnPrevStep.style.visibility = state.currentStep === 0 ? 'hidden' : 'visible';

    if (state.currentStep === 3) {
      dom.btnNextStep.style.display = 'none';
    } else {
      dom.btnNextStep.style.display = 'inline-flex';
      dom.btnNextStep.innerHTML = `Lanjut ke Tahap Berikutnya <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    }

    updateLivePreview();
  }

  // --- High-Resolution 1080x1920 Canvas Renderer ---
  async function renderHighResCanvas(isTemplateOnly = false) {
    const canvas = dom.exportCanvas;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1920;

    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    // 1. Draw User Photo Layer (if not template-only)
    if (!isTemplateOnly && state.photoImage) {
      const img = state.photoImage;
      const naturalWidth = img.naturalWidth || 1000;
      const naturalHeight = img.naturalHeight || 1000;

      const scale = Math.max(W / naturalWidth, H / naturalHeight) * state.zoom;
      const drawWidth = naturalWidth * scale;
      const drawHeight = naturalHeight * scale;

      // Calculate pan proportional to 1080x1920
      const previewRect = dom.photoLayerWrapper.getBoundingClientRect();
      const ratio = W / previewRect.width;

      const drawX = (W - drawWidth) / 2 + (state.panX * ratio);
      const drawY = (H - drawHeight) / 2 + (state.panY * ratio);

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else if (!isTemplateOnly) {
      // Dark fallback background if no photo
      ctx.fillStyle = '#0a111c';
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Draw Top & Bottom Gradient Vignettes
    // Top Vignette
    const topGradient = ctx.createLinearGradient(0, 0, 0, H * 0.35);
    topGradient.addColorStop(0, 'rgba(0, 0, 0, 0.88)');
    topGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');
    topGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, W, H * 0.35);

    // Bottom Vignette
    const botGradient = ctx.createLinearGradient(0, H * 0.45, 0, H);
    botGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    botGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)');
    botGradient.addColorStop(1, 'rgba(0, 0, 0, 0.96)');
    ctx.fillStyle = botGradient;
    ctx.fillRect(0, H * 0.45, W, H * 0.55);

    // Dynamic Colors based on theme
    const themeStyle = getComputedStyle(dom.body);
    const primaryColor = themeStyle.getPropertyValue('--primary').trim() || '#0056b3';
    const accentColor = themeStyle.getPropertyValue('--accent').trim() || '#00c3ff';

    // 3. Draw Header: Event Name & Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 76px "Teko", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(state.eventTitle.toUpperCase(), 60, 60);

    ctx.fillStyle = accentColor;
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(state.eventSubtitle.toUpperCase(), 62, 142);

    // 4. Draw Category Badge (Top Right)
    ctx.font = '700 56px "Teko", "Arial Black", sans-serif';
    const catText = state.selectedCategory;
    const catWidth = ctx.measureText(catText).width + 48;
    const catHeight = 72;
    const catX = W - 60 - catWidth;
    const catY = 60;

    // Rounded badge background
    ctx.fillStyle = primaryColor;
    roundRect(ctx, catX, catY, catWidth, catHeight, 14);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    roundRect(ctx, catX, catY, catWidth, catHeight, 14);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(catText, catX + catWidth / 2, catY + catHeight / 2 + 2);

    // 5. Draw Personal Best Badge (if enabled)
    if (state.isPersonalBest) {
      ctx.fillStyle = '#f59e0b';
      const pbX = 60;
      const pbY = 210;
      const pbW = 260;
      const pbH = 48;
      roundRect(ctx, pbX, pbY, pbW, pbH, 8);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = '900 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏆 PERSONAL BEST', pbX + pbW / 2, pbY + pbH / 2);
    }

    // 6. Draw Runner Name & Details
    const bottomClusterY = H - 520;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 110px "Teko", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText((state.runnerName || 'RUNNER NAME').toUpperCase(), 60, bottomClusterY);

    // Sub-meta (BIB & Running Club)
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    let metaText = state.bibNumber ? `BIB ${state.bibNumber}` : 'FINISHER';
    if (state.runningClub) metaText += `  ·  ${state.runningClub.toUpperCase()}`;
    ctx.fillText(metaText, 60, bottomClusterY + 45);

    // 7. Draw Metrics Card Container (Finish Time, Pace, Heart Rate)
    const metricsBoxY = bottomClusterY + 80;
    const metricsBoxH = 220;
    const metricsBoxW = W - 120;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    roundRect(ctx, 60, metricsBoxY, metricsBoxW, metricsBoxH, 20);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    roundRect(ctx, 60, metricsBoxY, metricsBoxW, metricsBoxH, 20);
    ctx.stroke();

    // Metric 1: Finish Time
    const timeStr = `${String(state.hour).padStart(2, '0')}:${String(state.min).padStart(2, '0')}:${String(state.sec).padStart(2, '0')}`;
    ctx.fillStyle = accentColor;
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FINISH TIME', 95, metricsBoxY + 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 92px "Teko", "Arial Black", sans-serif';
    ctx.fillText(timeStr, 95, metricsBoxY + 160);

    // Divider line 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(500, metricsBoxY + 30);
    ctx.lineTo(500, metricsBoxY + metricsBoxH - 30);
    ctx.stroke();

    // Metric 2: Avg Pace
    ctx.fillStyle = accentColor;
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('AVG PACE', 535, metricsBoxY + 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 92px "Teko", "Arial Black", sans-serif';
    ctx.fillText(state.pace, 535, metricsBoxY + 160);

    ctx.font = '600 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('/KM', 535 + ctx.measureText(state.pace).width + 10, metricsBoxY + 155);

    // Metric 3: Avg HR (if present)
    if (state.heartRate) {
      // Divider line 2
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(810, metricsBoxY + 30);
      ctx.lineTo(810, metricsBoxY + metricsBoxH - 30);
      ctx.stroke();

      ctx.fillStyle = accentColor;
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('AVG HR', 840, metricsBoxY + 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 92px "Teko", "Arial Black", sans-serif';
      ctx.fillText(state.heartRate, 840, metricsBoxY + 160);

      ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('BPM', 840 + ctx.measureText(state.heartRate).width + 8, metricsBoxY + 155);
    }

    // 8. Footer Strip (Hashtag & Watermark)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(state.hashtag, 60, H - 90);

    ctx.fillStyle = accentColor;
    ctx.textAlign = 'right';
    ctx.fillText('PACECARD.PRO', W - 60, H - 90);

    return canvas;
  }

  // Helper for rounded rectangles
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // --- Download & Share Actions ---
  async function downloadCardImage(isTemplate = false) {
    showToast('Sedang membuat gambar resolusi tinggi 1080 × 1920 px...');
    const canvas = await renderHighResCanvas(isTemplate);
    const link = document.createElement('a');
    const safeName = (state.runnerName || 'finisher').toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `racecard_${safeName}_${state.selectedCategory}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Kartu berhasil diunduh! Siap diposting ke Instagram Stories.');
  }

  async function shareCardStory() {
    if (!navigator.share) {
      downloadCardImage(false);
      return;
    }

    try {
      const canvas = await renderHighResCanvas(false);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'race_card.png', { type: 'image/png' });
        await navigator.share({
          title: `${state.eventTitle} - Race Card`,
          text: `Finisher ${state.selectedCategory} pada ${state.eventTitle}! Catatan waktu: ${state.hour}:${state.min}:${state.sec}`,
          files: [file],
        });
      }, 'image/png');
    } catch (err) {
      if (err.name !== 'AbortError') {
        downloadCardImage(false);
      }
    }
  }

  // --- Event Listeners Setup ---
  function initListeners() {
    // Wizard step clicks
    dom.stepBtns.forEach((btn) => {
      btn.addEventListener('click', () => setWizardStep(parseInt(btn.dataset.step, 10)));
    });

    dom.btnNextStep.addEventListener('click', () => setWizardStep(state.currentStep + 1));
    dom.btnPrevStep.addEventListener('click', () => setWizardStep(state.currentStep - 1));

    // Runner & Metrics inputs
    dom.runnerNameInput.addEventListener('input', (e) => {
      state.runnerName = e.target.value;
      updateLivePreview();
    });

    dom.bibNumberInput.addEventListener('input', (e) => {
      state.bibNumber = e.target.value;
      updateLivePreview();
    });

    dom.runningClubInput.addEventListener('input', (e) => {
      state.runningClub = e.target.value;
      updateLivePreview();
    });

    [dom.timeHour, dom.timeMin, dom.timeSec].forEach((input) => {
      input.addEventListener('input', () => {
        state.hour = dom.timeHour.value;
        state.min = dom.timeMin.value;
        state.sec = dom.timeSec.value;
        state.pace = calculateAutoPace();
        dom.paceInput.value = state.pace;
        updateLivePreview();
      });
    });

    dom.paceInput.addEventListener('input', (e) => {
      state.pace = e.target.value;
      updateLivePreview();
    });

    dom.btnAutoPace.addEventListener('click', () => {
      state.pace = calculateAutoPace();
      dom.paceInput.value = state.pace;
      updateLivePreview();
      showToast('Pace dihitung ulang otomatis.');
    });

    dom.avgHeartRateInput.addEventListener('input', (e) => {
      state.heartRate = e.target.value;
      updateLivePreview();
    });

    dom.pbBadgeToggle.addEventListener('change', (e) => {
      state.isPersonalBest = e.target.checked;
      updateLivePreview();
    });

    // Photo Upload & Drop Zone
    dom.photoDropZone.addEventListener('click', () => dom.photoFileInput.click());
    dom.photoFileInput.addEventListener('change', (e) => handlePhotoUpload(e.target.files[0]));

    ['dragover', 'dragenter'].forEach((type) => {
      dom.photoDropZone.addEventListener(type, (e) => {
        e.preventDefault();
        dom.photoDropZone.classList.add('dragging');
      });
    });

    ['dragleave', 'drop'].forEach((type) => {
      dom.photoDropZone.addEventListener(type, (e) => {
        e.preventDefault();
        dom.photoDropZone.classList.remove('dragging');
      });
    });

    dom.photoDropZone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handlePhotoUpload(e.dataTransfer.files[0]);
      }
    });

    dom.zoomSlider.addEventListener('input', (e) => {
      state.zoom = parseFloat(e.target.value);
      dom.zoomVal.textContent = `${state.zoom.toFixed(1)}x`;
      recalculatePhotoTransform();
    });

    dom.btnRecenter.addEventListener('click', () => {
      state.panX = 0;
      state.panY = 0;
      recalculatePhotoTransform();
    });

    dom.btnFitCover.addEventListener('click', () => {
      state.zoom = 1.0;
      state.panX = 0;
      state.panY = 0;
      dom.zoomSlider.value = 1.0;
      dom.zoomVal.textContent = '1.0x';
      recalculatePhotoTransform();
    });

    dom.btnRemovePhoto.addEventListener('click', () => {
      state.photoImage = null;
      state.photoUrl = '';
      dom.cardUserPhoto.style.display = 'none';
      dom.photoPlaceholder.style.display = 'flex';
      dom.photoControlsWrapper.classList.add('hidden');
      dom.photoFileInput.value = '';
      showToast('Foto dihapus.');
    });

    // Export Buttons
    dom.btnDownloadPNG.addEventListener('click', () => downloadCardImage(false));
    dom.btnShareStory.addEventListener('click', () => shareCardStory());
    dom.btnExportTemplate.addEventListener('click', () => downloadCardImage(true));

    // Customizer Drawer
    dom.toggleConfigBtn.addEventListener('click', () => dom.configDrawer.classList.add('open'));
    dom.closeConfigBtn.addEventListener('click', () => dom.configDrawer.classList.remove('open'));
    dom.drawerOverlay.addEventListener('click', () => dom.configDrawer.classList.remove('open'));

    // Theme Chips
    dom.themeChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        dom.themeChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const theme = chip.dataset.theme;
        state.currentTheme = theme;
        dom.body.className = theme;
      });
    });

    // Preset Selection
    dom.presetEventSelect.addEventListener('change', (e) => {
      const presetKey = e.target.value;
      if (EVENT_PRESETS[presetKey]) {
        const p = EVENT_PRESETS[presetKey];
        dom.cfgEventTitle.value = p.title;
        dom.cfgEventSubtitle.value = p.subtitle;
        dom.cfgCategories.value = p.categories.join(', ');
        dom.cfgHashtag.value = p.hashtag;

        // update theme chip
        dom.themeChips.forEach((chip) => {
          chip.classList.toggle('active', chip.dataset.theme === p.theme);
        });
        state.currentTheme = p.theme;
        dom.body.className = p.theme;
      }
    });

    // Apply Client Config
    dom.applyConfigBtn.addEventListener('click', () => {
      state.eventTitle = dom.cfgEventTitle.value.trim() || 'EVENT MARATHON';
      state.eventSubtitle = dom.cfgEventSubtitle.value.trim() || 'RACE DAY';
      state.hashtag = dom.cfgHashtag.value.trim() || '#RaceDay';

      const rawCategories = dom.cfgCategories.value.split(',').map((c) => c.trim()).filter(Boolean);
      state.categories = rawCategories.length > 0 ? rawCategories : ['5K', '10K', '21K', '42K'];
      if (!state.categories.includes(state.selectedCategory)) {
        state.selectedCategory = state.categories[0];
      }

      renderCategoryButtons();
      updateLivePreview();
      dom.configDrawer.classList.remove('open');
      showToast('Konfigurasi Event Klien berhasil diterapkan!');
    });

    window.addEventListener('resize', () => recalculatePhotoTransform());
  }

  // --- Initialize App ---
  renderCategoryButtons();
  initListeners();
  updateLivePreview();
})();
