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
    const containerWidth = container.clientWidth - 48; // Account for padding
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
            updateLayoutUI();
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
        currentFontSize = e.target.value;
        document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
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
    
    // Canvas click for sticker placement
    canvas.addEventListener('click', handleCanvasClick);
    
    // Window resize
    window.addEventListener('resize', () => {
        adjustCanvasSize();
        drawCanvas();
    });
}

function setupDragAndDrop() {
    const dropZone = document.getElementById('uploadOverlay');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
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
        showToast('Please select an image file', 'error');
        return;
    }
    
    showLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            document.getElementById('uploadOverlay').classList.add('hidden');
            drawCanvas();
            showLoading(false);
            showToast('Image uploaded successfully!', 'success');
        };
        img.onerror = () => {
            showLoading(false);
            showToast('Failed to load image', 'error');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    updateTheme();
}

function updateTheme() {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

function startCamera() {
    showLoading(true);
    
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
        } 
    })
    .then(mediaStream => {
        stream = mediaStream;
        const video = document.getElementById('videoPreview');
        video.srcObject = stream;
        video.classList.add('active');
        document.getElementById('uploadOverlay').classList.add('hidden');
        
        // Enable capture buttons
        document.getElementById('capturePhoto').disabled = false;
        document.getElementById('capturePhoto').classList.remove('opacity-50');
        document.getElementById('captureStrip').disabled = false;
        document.getElementById('captureStrip').classList.remove('opacity-50');
        
        showLoading(false);
        showToast('Camera started successfully!', 'success');
    })
    .catch(err => {
        console.error('Camera access denied:', err);
        showLoading(false);
        showToast('Camera access denied. Please use the upload option instead.', 'error');
    });
}

function capturePhoto() {
    const video = document.getElementById('videoPreview');
    if (video.srcObject) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        
        // Flip the image back to normal (remove mirror effect)
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(video, -tempCanvas.width, 0);
        
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            video.classList.remove('active');
            document.getElementById('uploadOverlay').classList.add('hidden');
            
            // Stop camera stream
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            
            // Disable capture buttons
            document.getElementById('capturePhoto').disabled = true;
            document.getElementById('capturePhoto').classList.add('opacity-50');
            document.getElementById('captureStrip').disabled = true;
            document.getElementById('captureStrip').classList.add('opacity-50');
            
            drawCanvas();
            showToast('Photo captured successfully!', 'success');
        };
        img.src = tempCanvas.toDataURL();
    }
}

function captureStrip() {
    // Start countdown and capture multiple photos
    let countdown = 3;
    stripImages = [];
    stripIndex = 0;
    
    const countdownTimer = document.getElementById('countdownTimer');
    const countdownNumber = countdownTimer.querySelector('.countdown-number');
    
    countdownTimer.classList.add('active');
    
    const countdownInterval = setInterval(() => {
        countdownNumber.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            captureStripPhoto();
        }
    }, 1000);
}

function captureStripPhoto() {
    const video = document.getElementById('videoPreview');
    if (video.srcObject && stripIndex < 3) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        
        // Flip the image back to normal
        tempCtx.scale(-1, 1);
        tempCtx.drawImage(video, -tempCanvas.width, 0);
        
        const img = new Image();
        img.onload = () => {
            stripImages.push(img);
            stripIndex++;
            
            if (stripIndex < 3) {
                // Continue capturing
                setTimeout(() => captureStripPhoto(), 1000);
            } else {
                // Finished capturing all photos
                currentImage = stripImages;
                currentLayout = 'strip';
                document.querySelector('input[value="strip"]').checked = true;
                updateLayoutUI();
                
                document.getElementById('videoPreview').classList.remove('active');
                document.getElementById('countdownTimer').classList.remove('active');
                document.getElementById('uploadOverlay').classList.add('hidden');
                
                // Stop camera stream
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    stream = null;
                }
                
                // Disable capture buttons
                document.getElementById('capturePhoto').disabled = true;
                document.getElementById('capturePhoto').classList.add('opacity-50');
                document.getElementById('captureStrip').disabled = true;
                document.getElementById('captureStrip').classList.add('opacity-50');
                
                drawCanvas();
                showToast('Photo strip captured successfully!', 'success');
            }
        };
        img.src = tempCanvas.toDataURL();
    }
}

function updateLayoutUI() {
    const layoutOptions = document.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
        const radio = option.querySelector('input');
        if (radio.value === currentLayout) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function renderEffects() {
    const effectsGrid = document.getElementById('effectsGrid');
    const categoryBtns = document.querySelectorAll('.effect-category-btn');
    
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
                <div>${effect.name}</div>
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
        Math.random() * (canvas.height * 0.3) + (canvas.height * 0.7) :
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
    showToast('Stickers cleared', 'success');
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Check if clicked on a sticker to remove it
    for (let i = stickers.length - 1; i >= 0; i--) {
        const sticker = stickers[i];
        const stickerSize = sticker.size;
        
        if (x >= sticker.x && x <= sticker.x + stickerSize &&
            y >= sticker.y - stickerSize && y <= sticker.y) {
            stickers.splice(i, 1);
            drawCanvas();
            break;
        }
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw frame
    drawFrame();
    
    // Draw image(s)
    if (currentImage) {
        if (currentLayout === 'strip' && Array.isArray(currentImage)) {
            drawStripImages();
        } else if (currentLayout === 'single' && !Array.isArray(currentImage)) {
            drawSingleImage();
        } else if (currentLayout === 'single' && Array.isArray(currentImage)) {
            // Convert strip to single by using first image
            drawSingleImageFromArray();
        }
    }
    
    // Apply effects
    if (selectedEffects.length > 0) {
        applyEffects();
    }
    
    // Draw stickers
    drawStickers();
    
    // Draw caption
    if (currentCaption) {
        drawCaption();
    }
}

function drawFrame() {
    const frameData = frames.find(f => f.id === currentFrame);
    if (!frameData) return;
    
    const frameWidth = 40;
    
    // Create gradient or solid color
    if (frameData.colors.length === 1) {
        ctx.fillStyle = frameData.colors[0];
    } else {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        frameData.colors.forEach((color, index) => {
            gradient.addColorStop(index / (frameData.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
    }
    
    // Draw frame
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear inner area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(frameWidth, frameWidth, canvas.width - frameWidth * 2, canvas.height - frameWidth * 2);
}

function drawSingleImage() {
    const frameWidth = 40;
    const imgArea = {
        x: frameWidth,
        y: frameWidth,
        width: canvas.width - frameWidth * 2,
        height: canvas.height - frameWidth * 2 - 80 // Leave space for caption
    };
    
    drawImageInArea(currentImage, imgArea);
}

function drawSingleImageFromArray() {
    const frameWidth = 40;
    const imgArea = {
        x: frameWidth,
        y: frameWidth,
        width: canvas.width - frameWidth * 2,
        height: canvas.height - frameWidth * 2 - 80 // Leave space for caption
    };
    
    drawImageInArea(currentImage[0], imgArea);
}

function drawStripImages() {
    const frameWidth = 40;
    const stripArea = {
        x: frameWidth,
        y: frameWidth,
        width: canvas.width - frameWidth * 2,
        height: canvas.height - frameWidth * 2 - 80 // Leave space for caption
    };
    
    const imageHeight = (stripArea.height - 20) / 3; // 3 images with gaps
    
    currentImage.forEach((img, index) => {
        const imgArea = {
            x: stripArea.x,
            y: stripArea.y + index * (imageHeight + 10),
            width: stripArea.width,
            height: imageHeight
        };
        
        drawImageInArea(img, imgArea);
    });
}

function drawImageInArea(image, area) {
    // Calculate image scaling
    const imgRatio = image.width / image.height;
    const areaRatio = area.width / area.height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgRatio > areaRatio) {
        drawWidth = area.width;
        drawHeight = area.width / imgRatio;
        drawX = area.x;
        drawY = area.y + (area.height - drawHeight) / 2;
    } else {
        drawHeight = area.height;
        drawWidth = area.height * imgRatio;
        drawY = area.y;
        drawX = area.x + (area.width - drawWidth) / 2;
    }
    
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function applyEffects() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    selectedEffects.forEach(effectId => {
        switch(effectId) {
            case 'sepia':
                applySepia(data);
                break;
            case 'vintage-film':
                applyVintageFilm(data);
                break;
            case 'cyberpunk':
                applyCyberpunk(data);
                break;
            case 'noir':
                applyNoir(data);
                break;
            case 'rainbow':
                applyRainbow(data);
                break;
            case 'deep-fried':
                applyDeepFried(data);
                break;
            case 'glowing':
                applyGlowing(data);
                break;
            case 'neon':
                applyNeon(data);
                break;
            default:
                // Apply basic filter
                applyBasicFilter(data, effectId);
        }
    });
    
    ctx.putImageData(imageData, 0, 0);
}

function applySepia(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
}

function applyVintageFilm(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Vintage warm tone
        data[i] = Math.min(255, r * 1.1);
        data[i + 1] = Math.min(255, g * 0.9);
        data[i + 2] = Math.min(255, b * 0.8);
    }
}

function applyCyberpunk(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Cyberpunk blue-purple tint
        data[i] = Math.min(255, r * 0.8);
        data[i + 1] = Math.min(255, g * 0.9);
        data[i + 2] = Math.min(255, b * 1.3);
    }
}

function applyNoir(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Convert to grayscale with high contrast
        const gray = Math.min(255, Math.max(0, (r * 0.299 + g * 0.587 + b * 0.114) * 1.5));
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
}

function applyRainbow(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Rainbow effect
        const hue = (i / 4) % 360;
        const saturation = 1;
        const lightness = (r + g + b) / (3 * 255);
        
        const [newR, newG, newB] = hslToRgb(hue / 360, saturation, lightness);
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
    }
}

function applyDeepFried(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Deep fried effect - high contrast and saturation
        data[i] = Math.min(255, r * 1.5);
        data[i + 1] = Math.min(255, g * 1.3);
        data[i + 2] = Math.min(255, b * 0.7);
    }
}

function applyGlowing(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Glowing effect
        const brightness = (r + g + b) / 3;
        const factor = brightness > 128 ? 1.3 : 1.1;
        
        data[i] = Math.min(255, r * factor);
        data[i + 1] = Math.min(255, g * factor);
        data[i + 2] = Math.min(255, b * factor);
    }
}

function applyNeon(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Neon effect - bright colors
        data[i] = Math.min(255, r * 1.2);
        data[i + 1] = Math.min(255, g * 1.4);
        data[i + 2] = Math.min(255, b * 1.6);
    }
}

function applyBasicFilter(data, effectId) {
    // Apply basic color adjustments for other effects
    const factor = effectId.includes('bright') ? 1.2 : 
                   effectId.includes('dark') ? 0.8 : 1.0;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * factor);
        data[i + 1] = Math.min(255, data[i + 1] * factor);
        data[i + 2] = Math.min(255, data[i + 2] * factor);
    }
}

function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function drawStickers() {
    stickers.forEach(sticker => {
        ctx.font = `${sticker.size}px Arial`;
        ctx.fillText(sticker.emoji, sticker.x, sticker.y);
    });
}

function drawCaption() {
    const frameWidth = 40;
    const captionArea = {
        x: frameWidth,
        y: canvas.height - 80,
        width: canvas.width - frameWidth * 2,
        height: 40
    };
    
    ctx.fillStyle = currentTextColor;
    ctx.font = `${currentFontSize}px ${currentFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Text shadow for better readability
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(currentCaption, captionArea.x + captionArea.width / 2, captionArea.y + captionArea.height / 2);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `polaroid-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
    showToast('Image downloaded successfully!', 'success');
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    switch(type) {
        case 'success':
            toastIcon.className = 'toast-icon fas fa-check-circle';
            toastIcon.style.color = 'var(--success)';
            break;
        case 'error':
            toastIcon.className = 'toast-icon fas fa-exclamation-circle';
            toastIcon.style.color = 'var(--danger)';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon fas fa-exclamation-triangle';
            toastIcon.style.color = 'var(--warning)';
            break;
        default:
            toastIcon.className = 'toast-icon fas fa-info-circle';
            toastIcon.style.color = 'var(--accent-primary)';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
        updateTheme();
    }
});

// Handle page visibility change to stop camera when page is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden && stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        document.getElementById('videoPreview').classList.remove('active');
        document.getElementById('capturePhoto').disabled = true;
        document.getElementById('capturePhoto').classList.add('opacity-50');
        document.getElementById('captureStrip').disabled = true;
        document.getElementById('captureStrip').classList.add('opacity-50');
    }
});
