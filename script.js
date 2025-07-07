// Application State
let currentImage = null;
let currentLayout = 'single';
let currentFrame = 'classic-white';
let selectedEffects = [];
let currentCaption = '';
let currentFont = 'Arial';
let currentFontSize = 18;
let currentTextColor = '#000000';
let stickers = [];
let stream = null;
let isDarkMode = true;

// Frame combinations (24 vibrant double-colored frames)
const frames = [
    { id: 'classic-white', colors: ['#ffffff', '#f0f0f0'], name: 'Classic White' },
    { id: 'sunset-orange', colors: ['#ff6b35', '#f7931e'], name: 'Sunset Orange' },
    { id: 'ocean-blue', colors: ['#1e3a8a', '#3b82f6'], name: 'Ocean Blue' },
    { id: 'forest-green', colors: ['#059669', '#10b981'], name: 'Forest Green' },
    { id: 'royal-purple', colors: ['#7c3aed', '#a855f7'], name: 'Royal Purple' },
    { id: 'cherry-red', colors: ['#dc2626', '#ef4444'], name: 'Cherry Red' },
    { id: 'golden-yellow', colors: ['#d97706', '#f59e0b'], name: 'Golden Yellow' },
    { id: 'hot-pink', colors: ['#ec4899', '#f472b6'], name: 'Hot Pink' },
    { id: 'mint-green', colors: ['#06b6d4', '#67e8f9'], name: 'Mint Green' },
    { id: 'lavender', colors: ['#8b5cf6', '#c4b5fd'], name: 'Lavender' },
    { id: 'coral-peach', colors: ['#fb7185', '#fda4af'], name: 'Coral Peach' },
    { id: 'emerald', colors: ['#059669', '#34d399'], name: 'Emerald' },
    { id: 'indigo', colors: ['#4f46e5', '#6366f1'], name: 'Indigo' },
    { id: 'amber', colors: ['#f59e0b', '#fbbf24'], name: 'Amber' },
    { id: 'rose-gold', colors: ['#f43f5e', '#fb7185'], name: 'Rose Gold' },
    { id: 'electric-blue', colors: ['#0ea5e9', '#38bdf8'], name: 'Electric Blue' },
    { id: 'lime-green', colors: ['#65a30d', '#84cc16'], name: 'Lime Green' },
    { id: 'magenta', colors: ['#d946ef', '#e879f9'], name: 'Magenta' },
    { id: 'teal', colors: ['#0d9488', '#14b8a6'], name: 'Teal' },
    { id: 'crimson', colors: ['#b91c1c', '#dc2626'], name: 'Crimson' },
    { id: 'neon-purple', colors: ['#a21caf', '#c026d3'], name: 'Neon Purple' },
    { id: 'turquoise', colors: ['#0891b2', '#0ea5e9'], name: 'Turquoise' },
    { id: 'fire-orange', colors: ['#ea580c', '#f97316'], name: 'Fire Orange' },
    { id: 'electric-pink', colors: ['#be185d', '#db2777'], name: 'Electric Pink' }
];

// Effects with male-oriented options
const effects = {
    meme: [
        { id: 'spiderman-mask', name: '🕷️ Spider-Man', apply: applySpiderManMask },
        { id: 'thug-life', name: '😎 Thug Life', apply: applyThugLife },
        { id: 'deal-with-it', name: '🕶️ Deal With It', apply: applyDealWithIt },
        { id: 'doge-effect', name: '🐕 Doge', apply: applyDogeEffect },
        { id: 'batman-mask', name: '🦇 Batman', apply: applyBatmanMask },
        { id: 'iron-man', name: '🤖 Iron Man', apply: applyIronManMask },
        { id: 'chad-face', name: '💪 Chad', apply: applyChadFace },
        { id: 'wojak-face', name: '😢 Wojak', apply: applyWojakFace },
        { id: 'pepe-face', name: '🐸 Pepe', apply: applyPepeFace },
        { id: 'trollface', name: '😈 Trollface', apply: applyTrollface },
        { id: 'sunglasses', name: '🕶️ Sunglasses', apply: applySunglasses },
        { id: 'mustache', name: '👨 Mustache', apply: applyMustache }
    ],
    cinematic: [
        { id: 'vintage-film', name: '📽️ Vintage Film', apply: applyVintageFilm },
        { id: 'soft-blur', name: '✨ Soft Blur', apply: applySoftBlur },
        { id: 'anime-90s', name: '🌟 90s Anime', apply: applyAnime90s },
        { id: 'sepia-tone', name: '🏜️ Sepia', apply: applySepia },
        { id: 'black-white', name: '⚫ B&W', apply: applyBlackWhite },
        { id: 'warm-filter', name: '🔥 Warm', apply: applyWarmFilter },
        { id: 'cool-filter', name: '❄️ Cool', apply: applyCoolFilter },
        { id: 'high-contrast', name: '⚡ High Contrast', apply: applyHighContrast },
        { id: 'vignette', name: '🌙 Vignette', apply: applyVignette },
        { id: 'grain-effect', name: '🌾 Film Grain', apply: applyGrainEffect },
        { id: 'neon-glow', name: '💫 Neon Glow', apply: applyNeonGlow },
        { id: 'cyberpunk', name: '🌃 Cyberpunk', apply: applyCyberpunk }
    ]
};

// Stickers (60+ emoji collection)
const stickerEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯'
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderFrames();
    renderEffects();
    renderStickers();
    drawCanvas();
});

function initializeApp() {
    // Set initial theme
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    updateThemeToggle();
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Camera controls
    document.getElementById('startCamera').addEventListener('click', startCamera);
    document.getElementById('capturePhoto').addEventListener('click', capturePhoto);
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('uploadPhoto').click();
    });
    document.getElementById('uploadPhoto').addEventListener('change', handleFileUpload);
    
    // Layout controls
    document.querySelectorAll('input[name="layout"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentLayout = e.target.value;
            drawCanvas();
        });
    });
    
    // Caption controls
    document.getElementById('captionInput').addEventListener('input', (e) => {
        currentCaption = e.target.value;
        drawCanvas();
    });
    
    document.getElementById('fontSelect').addEventListener('change', (e) => {
        currentFont = e.target.value;
        drawCanvas();
    });
    
    document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
        currentFontSize = parseInt(e.target.value);
        drawCanvas();
    });
    
    document.getElementById('textColorPicker').addEventListener('change', (e) => {
        currentTextColor = e.target.value;
        drawCanvas();
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', downloadPolaroid);
    
    // Effect category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEffects(e.target.dataset.category);
        });
    });
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    updateThemeToggle();
}

function updateThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    toggle.textContent = isDarkMode ? '☀️' : '🌙';
}

function renderFrames() {
    const frameGrid = document.getElementById('frameGrid');
    frameGrid.innerHTML = '';
    
    frames.forEach(frame => {
        const frameDiv = document.createElement('div');
        frameDiv.className = 'frame-option';
        frameDiv.dataset.frameId = frame.id;
        frameDiv.style.background = `linear-gradient(45deg, ${frame.colors[0]}, ${frame.colors[1]})`;
        frameDiv.title = frame.name;
        
        if (frame.id === currentFrame) {
            frameDiv.classList.add('active');
        }
        
        frameDiv.addEventListener('click', () => {
            currentFrame = frame.id;
            document.querySelectorAll('.frame-option').forEach(f => f.classList.remove('active'));
            frameDiv.classList.add('active');
            drawCanvas();
        });
        
        frameGrid.appendChild(frameDiv);
    });
}

function renderEffects(category = 'meme') {
    const effectGrid = document.getElementById('effectGrid');
    effectGrid.innerHTML = '';
    
    effects[category].forEach(effect => {
        const effectDiv = document.createElement('div');
        effectDiv.className = 'effect-option';
        effectDiv.dataset.effectId = effect.id;
        effectDiv.textContent = effect.name;
        
        if (selectedEffects.includes(effect.id)) {
            effectDiv.classList.add('active');
        }
        
        effectDiv.addEventListener('click', () => {
            toggleEffect(effect.id);
            effectDiv.classList.toggle('active');
            drawCanvas();
        });
        
        effectGrid.appendChild(effectDiv);
    });
}

function renderStickers() {
    const stickerGrid = document.getElementById('stickerGrid');
    stickerGrid.innerHTML = '';
    
    stickerEmojis.forEach(emoji => {
        const stickerDiv = document.createElement('div');
        stickerDiv.className = 'sticker-option';
        stickerDiv.textContent = emoji;
        
        stickerDiv.addEventListener('click', () => {
            addSticker(emoji);
        });
        
        stickerGrid.appendChild(stickerDiv);
    });
}

function toggleEffect(effectId) {
    const index = selectedEffects.indexOf(effectId);
    if (index > -1) {
        selectedEffects.splice(index, 1);
    } else {
        selectedEffects.push(effectId);
    }
}

function addSticker(emoji) {
    const sticker = {
        emoji: emoji,
        x: Math.random() * 200 + 100,
        y: Math.random() * 200 + 200,
        size: 30,
        rotation: 0
    };
    stickers.push(sticker);
    drawCanvas();
}

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.style.display = 'block';
        video.play();
        
        document.getElementById('startCamera').disabled = true;
        document.getElementById('capturePhoto').disabled = false;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please check permissions.');
    }
}

function capturePhoto() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Start countdown
    startCountdown(() => {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        loadImage(imageData);
        
        // Stop camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        video.style.display = 'none';
        document.getElementById('startCamera').disabled = false;
        document.getElementById('capturePhoto').disabled = true;
    });
}

function startCountdown(callback) {
    const countdown = document.getElementById('countdown');
    let count = 3;
    
    countdown.classList.add('active');
    countdown.textContent = count;
    
    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdown.textContent = count;
        } else {
            countdown.textContent = '📸';
            setTimeout(() => {
                countdown.classList.remove('active');
                callback();
            }, 500);
            clearInterval(timer);
        }
    }, 1000);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function loadImage(src) {
    const img = new Image();
    img.onload = function() {
        currentImage = img;
        drawCanvas();
    };
    img.src = src;
}

function drawCanvas() {
    const canvas = document.getElementById('polaroidCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentLayout === 'single') {
        drawSinglePolaroid(ctx, canvas);
    } else {
        drawStripPolaroid(ctx, canvas);
    }
}

function drawSinglePolaroid(ctx, canvas) {
    const frameData = frames.find(f => f.id === currentFrame);
    
    // Draw frame background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, frameData.colors[0]);
    gradient.addColorStop(1, frameData.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw inner white area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 120);
    
    // Draw image if available
    if (currentImage) {
        const imageArea = {
            x: 20,
            y: 20,
            width: canvas.width - 40,
            height: canvas.height - 120
        };
        
        drawImageWithEffects(ctx, currentImage, imageArea);
    }
    
    // Draw caption
    if (currentCaption) {
        ctx.fillStyle = currentTextColor;
        ctx.font = `${currentFontSize}px ${currentFont}`;
        ctx.textAlign = 'center';
        ctx.fillText(currentCaption, canvas.width / 2, canvas.height - 50);
    }
    
    // Draw stickers
    drawStickers(ctx);
}

function drawStripPolaroid(ctx, canvas) {
    const frameData = frames.find(f => f.id === currentFrame);
    const stripHeight = (canvas.height - 80) / 3;
    
    // Draw frame background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, frameData.colors[0]);
    gradient.addColorStop(1, frameData.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw three strips
    for (let i = 0; i < 3; i++) {
        const y = 20 + i * stripHeight;
        
        // Draw white background for each strip
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(20, y, canvas.width - 40, stripHeight - 10);
        
        // Draw image if available
        if (currentImage) {
            const imageArea = {
                x: 20,
                y: y,
                width: canvas.width - 40,
                height: stripHeight - 10
            };
            
            drawImageWithEffects(ctx, currentImage, imageArea);
        }
    }
    
    // Draw caption
    if (currentCaption) {
        ctx.fillStyle = currentTextColor;
        ctx.font = `${currentFontSize}px ${currentFont}`;
        ctx.textAlign = 'center';
        ctx.fillText(currentCaption, canvas.width / 2, canvas.height - 20);
    }
    
    // Draw stickers
    drawStickers(ctx);
}

function drawImageWithEffects(ctx, image, area) {
    // Save context
    ctx.save();
    
    // Calculate scaling to fit image in area
    const scale = Math.min(area.width / image.width, area.height / image.height);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;
    const x = area.x + (area.width - scaledWidth) / 2;
    const y = area.y + (area.height - scaledHeight) / 2;
    
    // Draw image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    
    // Apply effects
    selectedEffects.forEach(effectId => {
        const effect = findEffect(effectId);
        if (effect) {
            effect.apply(ctx, { x, y, width: scaledWidth, height: scaledHeight });
        }
    });
    
    // Restore context
    ctx.restore();
}

function drawStickers(ctx) {
    stickers.forEach(sticker => {
        ctx.save();
        ctx.translate(sticker.x, sticker.y);
        ctx.rotate(sticker.rotation);
        ctx.font = `${sticker.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(sticker.emoji, 0, 0);
        ctx.restore();
    });
}

function findEffect(effectId) {
    for (const category in effects) {
        const effect = effects[category].find(e => e.id === effectId);
        if (effect) return effect;
    }
    return null;
}

function downloadPolaroid() {
    const canvas = document.getElementById('polaroidCanvas');
    const link = document.createElement('a');
    link.download = `polaroid-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Effect implementations
function applySpiderManMask(ctx, area) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(area.x, area.y, area.width, area.height * 0.6);
    
    // Draw web pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(area.x + area.width * 0.3, area.y + area.height * 0.3, i * 20, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function applyThugLife(ctx, area) {
    // Draw sunglasses
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(area.x + area.width * 0.2, area.y + area.height * 0.3, area.width * 0.6, area.height * 0.15);
    
    // Add "THUG LIFE" text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('THUG LIFE', area.x + area.width / 2, area.y + area.height * 0.9);
}

function applyDealWithIt(ctx, area) {
    // Draw cool sunglasses
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(area.x + area.width * 0.15, area.y + area.height * 0.25, area.width * 0.7, area.height * 0.2);
    
    // Add reflective shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(area.x + area.width * 0.2, area.y + area.height * 0.3, area.width * 0.25, area.height * 0.05);
}

function applyDogeEffect(ctx, area) {
    // Add doge-style text
    const phrases = ['much photo', 'very cool', 'wow', 'such style'];
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.font = 'bold 14px Comic Sans MS';
    
    phrases.forEach((phrase, i) => {
        ctx.fillText(phrase, area.x + Math.random() * area.width, area.y + (i + 1) * area.height / 5);
    });
}

function applyBatmanMask(ctx, area) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.ellipse(area.x + area.width / 2, area.y + area.height * 0.4, area.width * 0.4, area.height * 0.3, 0, 0, 2 * Math.PI);
    ctx.fill();
}

function applyIronManMask(ctx, area) {
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.fillRect(area.x + area.width * 0.2, area.y + area.height * 0.2, area.width * 0.6, area.height * 0.5);
    
    // Add glowing eyes
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(area.x + area.width * 0.35, area.y + area.height * 0.35, 10, 0, 2 * Math.PI);
    ctx.arc(area.x + area.width * 0.65, area.y + area.height * 0.35, 10, 0, 2 * Math.PI);
    ctx.fill();
}

function applyChadFace(ctx, area) {
    // Draw strong jaw
    ctx.fillStyle = 'rgba(210, 180, 140, 0.7)';
    ctx.fillRect(area.x + area.width * 0.3, area.y + area.height * 0.6, area.width * 0.4, area.height * 0.3);
    
    // Add "CHAD" text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CHAD', area.x + area.width / 2, area.y + area.height * 0.9);
}

function applyWojakFace(ctx, area) {
    // Draw sad expression
    ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
    ctx.beginPath();
    ctx.arc(area.x + area.width / 2, area.y + area.height * 0.4, area.width * 0.3, 0, 2 * Math.PI);
    ctx.fill();
}

function applyPepeFace(ctx, area) {
    // Draw green tint
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(area.x, area.y, area.width, area.height * 0.7);
    
    // Add "FEELS GOOD MAN" text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FEELS GOOD MAN', area.x + area.width / 2, area.y + area.height * 0.9);
}

function applyTrollface(ctx, area) {
    // Draw trollface outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(area.x + area.width / 2, area.y + area.height * 0.4, area.width * 0.3, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Add evil grin
    ctx.beginPath();
    ctx.arc(area.x + area.width / 2, area.y + area.height * 0.5, area.width * 0.2, 0, Math.PI);
    ctx.stroke();
}

function applySunglasses(ctx, area) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(area.x + area.width * 0.2, area.y + area.height * 0.3, area.width * 0.6, area.height * 0.15);
}

function applyMustache(ctx, area) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(area.x + area.width * 0.35, area.y + area.height * 0.55, area.width * 0.3, area.height * 0.08);
}

function applyVintageFilm(ctx, area) {
    ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
}

function applySoftBlur(ctx, area) {
    ctx.filter = 'blur(2px)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
    ctx.filter = 'none';
}

function applyAnime90s(ctx, area) {
    // Add anime-style sparkles
    ctx.fillStyle = 'rgba(255, 192, 203, 0.6)';
    for (let i = 0; i < 20; i++) {
        const x = area.x + Math.random() * area.width;
        const y = area.y + Math.random() * area.height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function applySepia(ctx, area) {
    ctx.fillStyle = 'rgba(160, 120, 80, 0.3)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
}

function applyBlackWhite(ctx, area) {
    ctx.fillStyle = 'rgba(128, 128, 128, 0.4)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
}

function applyWarmFilter(ctx, area) {
    ctx.fillStyle = 'rgba(255, 200, 100, 0.2)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
}

function applyCoolFilter(ctx, area) {
    ctx.fillStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
}

function applyHighContrast(ctx, area) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(area.x, area.y, area.width / 2, area.height);
}

function applyVignette(ctx, area) {
    const gradient = ctx.createRadialGradient(
        area.x + area.width / 2, area.y + area.height / 2, 0,
        area.x + area.width / 2, area.y + area.height / 2, area.width / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(area.x, area.y, area.width, area.height);
}

function applyGrainEffect(ctx, area) {
    for (let i = 0; i < 500; i++) {
        const x = area.x + Math.random() * area.width;
        const y = area.y + Math.random() * area.height;
        const opacity = Math.random() * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(x, y, 1, 1);
    }
}

function applyNeonGlow(ctx, area) {
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
    ctx.shadowBlur = 0;
}

function applyCyberpunk(ctx, area) {
    ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
    ctx.fillRect(area.x, area.y, area.width, area.height);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fillRect(area.x, area.y, area.width / 2, area.height);
}
