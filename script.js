// Application State
let currentImage = null;
let currentLayout = 'single';
let currentFrame = 'classic-white';
let selectedEffects = [];
let currentCaption = '';
let currentFont = 'Inter';
let currentFontSize = 18;
let currentTextColor = '#ffffff';
let stickers = [];
let stream = null;
let isDarkMode = true;
let stripImages = [];
let stripIndex = 0;
let bottomAreaOnly = false;
let canvas, ctx;

// Effects and Frames Data
const effects = {
    cinematic: [
        { id: 'blade-runner', name: 'Blade Runner', icon: '🌆' },
        { id: 'matrix', name: 'Matrix', icon: '🔢' },
        { id: 'noir', name: 'Film Noir', icon: '🎭' },
        { id: 'cyberpunk', name: 'Cyberpunk', icon: '📺' },
        { id: 'tron', name: 'Tron', icon: '🔷' },
        { id: 'mad-max', name: 'Mad Max', icon: '💥' },
        { id: 'alien', name: 'Alien', icon: '🛸' },
        { id: 'terminator', name: 'Terminator', icon: '🎯' },
        { id: 'interstellar', name: 'Interstellar', icon: '⭐' }
    ],
    meme: [
        { id: 'deep-fried', name: 'Deep Fried', icon: '🍟' },
        { id: 'laser-eyes', name: 'Laser Eyes', icon: '🔴' },
        { id: 'glowing', name: 'Glowing', icon: '🌟' },
        { id: 'rainbow', name: 'Rainbow', icon: '🌈' },
        { id: 'vaporwave', name: 'Vaporwave', icon: '💜' },
        { id: 'neon', name: 'Neon', icon: '✨' },
        { id: 'holographic', name: 'Holo', icon: '💎' },
        { id: 'pixel', name: 'Pixel Art', icon: '🎮' },
        { id: 'comic', name: 'Comic', icon: '💥' }
    ],
    vintage: [
        { id: 'vintage-film', name: 'Film', icon: '📹' },
        { id: 'sepia', name: 'Sepia', icon: '🟤' },
        { id: 'polaroid-fade', name: 'Fade', icon: '📸' },
        { id: 'film-grain', name: 'Grain', icon: '⚪' },
        { id: 'light-leaks', name: 'Light Leaks', icon: '🌅' },
        { id: 'cross-process', name: 'Cross Process', icon: '🎨' },
        { id: 'lomography', name: 'Lomo', icon: '🔴' },
        { id: 'instant', name: 'Instant', icon: '⬜' },
        { id: 'super8', name: 'Super 8', icon: '🎥' }
    ]
};

const frames = [
    { id: 'classic-white', colors: ['#ffffff', '#f5f5f5'], name: 'Classic White' },
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
    { id: 'midnight-black', colors: ['#000000', '#1f1f1f'], name: 'Midnight Black' },
    { id: 'silver-chrome', colors: ['#c0c0c0', '#e5e5e5'], name: 'Silver Chrome' },
    { id: 'rainbow', colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'], name: 'Rainbow' }
];

const stickerEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '🔥', '💯', '💥', '⭐', '🌟', '✨', '🎉', '🎊', '💫', '🌈',
    '☀️', '🌙', '⚡', '❄️', '🌊', '💎', '🎭', '🎪', '🎨', '🎬'
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderEffects();
    renderFrames();
    renderStickers();
    drawCanvas();
    loadTheme();
});

function initializeApp() {
    canvas = document.getElementById('polaroidCanvas');
    ctx = canvas.getContext('2d');
    
    // Adjust canvas size for mobile
    adjustCanvasSize();
    
    // Set initial theme
    updateTheme();
}

function adjustCanvasSize() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 96; // Account for padding
    const isMobile = window.innerWidth < 768;
    
    let canvasWidth = isMobile ? Math.min(300, containerWidth) : Math.min(400, containerWidth);
    let canvasHeight = (canvasWidth * 5) / 4; // 4:5 ratio for polaroid
    
    canvas.style.maxWidth = `${canvasWidth}px`;
    canvas.style.maxHeight = `${canvasHeight}px`;
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Camera controls
    document.getElementById('startCamera').addEventListener('click', startCamera);
    document.getElementById('capturePhoto').addEventListener('click', capturePhoto);
    document.getElementById('captureStrip').addEventListener('click', captureStrip);
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Upload overlay
    document.getElementById('uploadOverlay').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    // Drag and drop
    setupDragAndDrop();
    
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
    
    document.getElementById('fontSize').addEventListener('input', (e) => {
        currentFontSize = parseInt(e.target.value);
        drawCanvas();
    });
    
    document.getElementById('textColor').addEventListener('change', (e) => {
        currentTextColor = e.target.value;
        drawCanvas();
    });
    
    // Download button
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    
    // Clear stickers
    document.getElementById('clearStickers').addEventListener('click', clearStickers);
    
    // Bottom area only checkbox
    document.getElementById('bottomAreaOnly').addEventListener('change', (e) => {
        bottomAreaOnly = e.target.checked;
    });
    
    // Window resize
    window.addEventListener('resize', () => {
        adjustCanvasSize();
        drawCanvas();
    });
    
    // Canvas click for sticker placement
    canvas.addEventListener('click', handleCanvasClick);
}

function setupDragAndDrop() {
    const dropZone = document.getElementById('uploadOverlay');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight(e) {
        dropZone.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
    }
    
    function unhighlight(e) {
        dropZone.style.backgroundColor = '';
    }
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, WebP)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            hideUploadOverlay();
            drawCanvas();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function hideUploadOverlay() {
    document.getElementById('uploadOverlay').classList.add('hidden');
}

function showUploadOverlay() {
    document.getElementById('uploadOverlay').classList.remove('hidden');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    updateTheme();
    saveTheme();
}

function updateTheme() {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
}

function saveTheme() {
    localStorage.setItem('polaroid-theme', isDarkMode ? 'dark' : 'light');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('polaroid-theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
        updateTheme();
    }
}

async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        
        const video = document.getElementById('videoPreview');
        video.srcObject = stream;
        video.classList.add('active');
        hideUploadOverlay();
        
        // Enable capture buttons
        document.getElementById('capturePhoto').disabled = false;
        document.getElementById('captureStrip').disabled = false;
        
        // Show palm detection
        document.getElementById('palmDetection').classList.add('active');
        
    } catch (err) {
        console.error('Camera access denied:', err);
        alert('Camera access denied. Please allow camera access or use the upload option instead.');
    }
}

function capturePhoto() {
    const video = document.getElementById('videoPreview');
    if (video.srcObject) {
        // Show countdown
        showCountdown(() => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;
            
            // Flip image horizontally to match preview
            tempCtx.scale(-1, 1);
            tempCtx.drawImage(video, -tempCanvas.width, 0);
            
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                video.classList.remove('active');
                stopCamera();
                drawCanvas();
            };
            img.src = tempCanvas.toDataURL();
        });
    }
}

function captureStrip() {
    const video = document.getElementById('videoPreview');
    if (video.srcObject) {
        stripImages = [];
        stripIndex = 0;
        currentLayout = 'strip';
        document.querySelector('input[value="strip"]').checked = true;
        
        captureStripPhoto();
    }
}

function captureStripPhoto() {
    const video = document.getElementById('videoPreview');
    if (stripIndex < 3) {
        showCountdown(() => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;
            
            // Flip image horizontally to match preview
            tempCtx.scale(-1, 1);
            tempCtx.drawImage(video, -tempCanvas.width, 0);
            
            const img = new Image();
            img.onload = () => {
                stripImages.push(img);
                stripIndex++;
                
                if (stripIndex < 3) {
                    setTimeout(() => captureStripPhoto(), 1000);
                } else {
                    currentImage = stripImages;
                    video.classList.remove('active');
                    stopCamera();
                    drawCanvas();
                }
            };
            img.src = tempCanvas.toDataURL();
        });
    }
}

function showCountdown(callback) {
    const countdownEl = document.getElementById('countdownTimer');
    const numberEl = countdownEl.querySelector('.countdown-number');
    
    let count = 3;
    countdownEl.classList.add('active');
    
    const countdownInterval = setInterval(() => {
        numberEl.textContent = count;
        count--;
        
        if (count < 0) {
            clearInterval(countdownInterval);
            countdownEl.classList.remove('active');
            callback();
        }
    }, 1000);
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    document.getElementById('capturePhoto').disabled = true;
    document.getElementById('captureStrip').disabled = true;
    document.getElementById('palmDetection').classList.remove('active');
}

function renderEffects() {
    const effectsGrid = document.getElementById('effectsGrid');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Handle category switching
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            renderEffectCategory(category);
        });
    });
    
    // Initial render
    renderEffectCategory('cinematic');
    
    function renderEffectCategory(category) {
        effectsGrid.innerHTML = '';
        effects[category].forEach(effect => {
            const effectElement = document.createElement('div');
            effectElement.className = 'effect-option';
            effectElement.innerHTML = `
                <div class="effect-icon">${effect.icon}</div>
                <div class="effect-name">${effect.name}</div>
            `;
            effectElement.addEventListener('click', () => {
                // Toggle effect
                const index = selectedEffects.indexOf(effect.id);
                if (index > -1) {
                    selectedEffects.splice(index, 1);
                    effectElement.classList.remove('active');
                } else {
                    selectedEffects.push(effect.id);
                    effectElement.classList.add('active');
                }
                drawCanvas();
            });
            
            // Check if effect is already selected
            if (selectedEffects.includes(effect.id)) {
                effectElement.classList.add('active');
            }
            
            effectsGrid.appendChild(effectElement);
        });
    }
}

function renderFrames() {
    const framesGrid = document.getElementById('framesGrid');
    frames.forEach(frame => {
        const frameElement = document.createElement('div');
        frameElement.className = 'frame-option';
        frameElement.title = frame.name;
        
        if (frame.colors.length === 1) {
            frameElement.style.backgroundColor = frame.colors[0];
        } else {
            frameElement.style.background = `linear-gradient(135deg, ${frame.colors.join(', ')})`;
        }
        
        frameElement.addEventListener('click', () => {
            document.querySelectorAll('.frame-option').forEach(el => {
                el.classList.remove('active');
            });
            frameElement.classList.add('active');
            currentFrame = frame.id;
            drawCanvas();
        });
        
        // Set default frame
        if (frame.id === currentFrame) {
            frameElement.classList.add('active');
        }
        
        framesGrid.appendChild(frameElement);
    });
}

function renderStickers() {
    const stickersGrid = document.getElementById('stickersGrid');
    stickerEmojis.forEach(emoji => {
        const stickerElement = document.createElement('div');
        stickerElement.className = 'sticker-option';
        stickerElement.textContent = emoji;
        stickerElement.addEventListener('click', () => {
            addSticker(emoji);
        });
        stickersGrid.appendChild(stickerElement);
    });
}

function addSticker(emoji) {
    const canvasRect = canvas.getBoundingClientRect();
    const x = Math.random() * (canvas.width - 50);
    const y = bottomAreaOnly ? 
        Math.random() * (canvas.height * 0.2) + (canvas.height * 0.8) :
        Math.random() * (canvas.height - 50);
    
    stickers.push({
        emoji: emoji,
        x: x,
        y: y,
        size: 30 + Math.random() * 20
    });
    
    drawCanvas();
}

function clearStickers() {
    stickers = [];
    drawCanvas();
}

function handleCanvasClick(e) {
    // This could be expanded to handle sticker repositioning
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width
