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
let stickerHistory = []; // For undo functionality
let stream = null;
let isDarkMode = true;
let stripImages = [null, null, null]; // Array for 3 strip images
let stripIndex = 0;
let activeStripSlot = 0;
let bottomAreaOnly = false;
let canvas, ctx;
let isStripMode = false;
let currentEffectCategory = 'cinematic';

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
        { id: 'cool-glasses', name: 'Cool Glasses', icon: '🕶️' },
        { id: 'vampire-teeth', name: 'Vampire Teeth', icon: '🧛' },
        { id: 'red-lights', name: 'Red Lights', icon: '🔴' },
        { id: 'high-contrast', name: 'High Contrast', icon: '⚫' },
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
    '🧛', '🧙', '👹', '💀', '👻', '🎃', '🦇', '🕷️', '🔮', '⚰️',
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
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
        updateTheme();
    }
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
    
    // Effect category buttons
    document.querySelectorAll('.effect-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.effect-category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentEffectCategory = e.target.dataset.category;
            renderEffects();
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
    
    // Undo stickers
    document.getElementById('undoStickers').addEventListener('click', undoStickers);
    
    // Bottom area only checkbox
    document.getElementById('bottomAreaOnly').addEventListener('change', (e) => {
        bottomAreaOnly = e.target.checked;
    });
    
    // Canvas click for sticker placement
    canvas.addEventListener('click', handleCanvasClick);
    
    // Strip slot selection
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('strip-slot')) {
            const slotIndex = parseInt(e.target.dataset.slot);
            selectStripSlot(slotIndex);
        }
    });
    
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
            if (currentLayout === 'strip') {
                stripImages[activeStripSlot] = img;
            } else {
                currentImage = img;
            }
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

function updateLayoutUI() {
    const layoutOptions = document.querySelectorAll('.layout-option');
    layoutOptions.forEach(option => {
        option.classList.remove('active');
        if (option.querySelector('input').value === currentLayout) {
            option.classList.add('active');
        }
    });
    
    // Show/hide strip selector
    const stripSelector = document.getElementById('stripSelector');
    if (currentLayout === 'strip') {
        stripSelector.classList.add('active');
        isStripMode = true;
    } else {
        stripSelector.classList.remove('active');
        isStripMode = false;
    }
}

function selectStripSlot(slotIndex) {
    activeStripSlot = slotIndex;
    
    // Update visual feedback
    document.querySelectorAll('.strip-slot').forEach((slot, index) => {
        slot.classList.toggle('active', index === slotIndex);
    });
    
    showToast(`Selected slot ${slotIndex + 1}`, 'success');
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
            if (currentLayout === 'strip') {
                stripImages[activeStripSlot] = img;
            } else {
                currentImage = img;
            }
            
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
    if (!stream) {
        showToast('Please start the camera first', 'error');
        return;
    }
    
    currentLayout = 'strip';
    updateLayoutUI();
    drawCanvas();
    
    // Auto-capture for all 3 slots with countdown
    captureStripSequence();
}

function captureStripSequence() {
    let slotIndex = 0;
    
    function captureNextSlot() {
        if (slotIndex >= 3) {
            showToast('Strip capture complete!', 'success');
            return;
        }
        
        selectStripSlot(slotIndex);
        
        // Countdown
        let countdown = 3;
        const countdownTimer = document.getElementById('countdownTimer');
        const countdownNumber = countdownTimer.querySelector('.countdown-number');
        
        countdownTimer.classList.add('active');
        
        const countdownInterval = setInterval(() => {
            countdownNumber.textContent = countdown;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownInterval);
                countdownTimer.classList.remove('active');
                
                // Capture photo for current slot
                const video = document.getElementById('videoPreview');
                if (video.srcObject) {
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = video.videoWidth;
                    tempCanvas.height = video.videoHeight;
                    
                    tempCtx.scale(-1, 1);
                    tempCtx.drawImage(video, -tempCanvas.width, 0);
                    
                    const img = new Image();
                    img.onload = () => {
                        stripImages[slotIndex] = img;
                        drawCanvas();
                        slotIndex++;
                        
                        if (slotIndex < 3) {
                            setTimeout(() => captureNextSlot(), 1000);
                        } else {
                            // Stop camera after all captures
                            if (stream) {
                                stream.getTracks().forEach(track => track.stop());
                                stream = null;
                            }
                            
                            const video = document.getElementById('videoPreview');
                            video.classList.remove('active');
                            
                            // Disable capture buttons
                            document.getElementById('capturePhoto').disabled = true;
                            document.getElementById('capturePhoto').classList.add('opacity-50');
                            document.getElementById('captureStrip').disabled = true;
                            document.getElementById('captureStrip').classList.add('opacity-50');
                            
                            showToast('Strip capture complete!', 'success');
                        }
                    };
                    img.src = tempCanvas.toDataURL();
                }
            }
        }, 1000);
    }
    
    captureNextSlot();
}

function renderEffects() {
    const effectsGrid = document.getElementById('effectsGrid');
    effectsGrid.innerHTML = '';
    
    const categoryEffects = effects[currentEffectCategory] || [];
    
    categoryEffects.forEach(effect => {
        const effectEl = document.createElement('div');
        effectEl.className = 'effect-option';
        effectEl.dataset.effectId = effect.id;
        
        if (selectedEffects.includes(effect.id)) {
            effectEl.classList.add('active');
        }
        
        effectEl.innerHTML = `
            <div class="effect-icon">${effect.icon}</div>
            <div class="effect-name">${effect.name}</div>
        `;
        
        effectEl.addEventListener('click', () => toggleEffect(effect.id));
        effectsGrid.appendChild(effectEl);
    });
}

function toggleEffect(effectId) {
    const index = selectedEffects.indexOf(effectId);
    if (index > -1) {
        selectedEffects.splice(index, 1);
    } else {
        selectedEffects.push(effectId);
    }
    
    renderEffects();
    drawCanvas();
}

function renderFrames() {
    const framesGrid = document.getElementById('framesGrid');
    framesGrid.innerHTML = '';
    
    frames.forEach(frame => {
        const frameEl = document.createElement('div');
        frameEl.className = 'frame-option';
        frameEl.dataset.frameId = frame.id;
        
        if (currentFrame === frame.id) {
            frameEl.classList.add('active');
        }
        
        const previewEl = document.createElement('div');
        previewEl.className = 'frame-preview';
        
        if (frame.colors.length > 1) {
            previewEl.style.borderColor = frame.colors[0];
            previewEl.style.background = `linear-gradient(45deg, ${frame.colors.join(', ')})`;
        } else {
            previewEl.style.borderColor = frame.colors[0];
        }
        
        const nameEl = document.createElement('div');
        nameEl.className = 'frame-name';
        nameEl.textContent = frame.name;
        
        frameEl.appendChild(previewEl);
        frameEl.appendChild(nameEl);
        
        frameEl.addEventListener('click', () => selectFrame(frame.id));
        framesGrid.appendChild(frameEl);
    });
}

function selectFrame(frameId) {
    currentFrame = frameId;
    renderFrames();
    drawCanvas();
}

function renderStickers() {
    const stickersGrid = document.getElementById('stickersGrid');
    stickersGrid.innerHTML = '';
    
    stickerEmojis.forEach(emoji => {
        const stickerEl = document.createElement('div');
        stickerEl.className = 'sticker-option';
        stickerEl.textContent = emoji;
        stickerEl.dataset.emoji = emoji;
        
        stickerEl.addEventListener('click', () => selectSticker(emoji));
        stickersGrid.appendChild(stickerEl);
    });
}

function selectSticker(emoji) {
    document.body.style.cursor = 'crosshair';
    canvas.style.cursor = 'crosshair';
    
    // Store selected sticker for placement
    canvas.dataset.selectedSticker = emoji;
    
    showToast(`Click on the polaroid to place ${emoji}`, 'success');
}

function undoStickers() {
    if (stickerHistory.length > 0) {
        stickers = stickerHistory.pop();
        drawCanvas();
        showToast('Sticker placement undone', 'success');
    } else {
        showToast('No actions to undo', 'warning');
    }
}

function handleCanvasClick(e) {
    const selectedSticker = canvas.dataset.selectedSticker;
    if (!selectedSticker) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Check if click is in allowed area
    const isAllowedArea = checkStickerPlacement(x, y);
    
    if (isAllowedArea) {
        // Save current state for undo
        stickerHistory.push([...stickers]);
        
        stickers.push({
            emoji: selectedSticker,
            x: x,
            y: y,
            size: 30
        });
        
        drawCanvas();
        showToast(`${selectedSticker} placed!`, 'success');
    } else {
        showToast('Stickers can only be placed outside the image area', 'error');
    }
    
    // Reset cursor
    document.body.style.cursor = 'default';
    canvas.style.cursor = 'default';
    delete canvas.dataset.selectedSticker;
}

function checkStickerPlacement(x, y) {
    const margin = 30;
    const frameThickness = 20;
    
    if (currentLayout === 'single') {
        // Single image area
        const imageArea = {
            x: margin,
            y: margin,
            width: canvas.width - margin * 2,
            height: canvas.height - margin * 2 - 60 // Leave space for caption
        };
        
        if (bottomAreaOnly) {
            // Only bottom area allowed
            return y > imageArea.y + imageArea.height;
        } else {
            // Outside image area
            return !(x > imageArea.x + frameThickness && 
                    x < imageArea.x + imageArea.width - frameThickness && 
                    y > imageArea.y + frameThickness && 
                    y < imageArea.y + imageArea.height - frameThickness);
        }
    } else {
        // Strip layout - more restrictive
        const stripWidth = (canvas.width - 60) / 3;
        const stripHeight = stripWidth * 1.2;
        
        if (bottomAreaOnly) {
            return y > 40 + stripHeight;
        } else {
            // Only margins and between strips
            return y < 40 || y > 40 + stripHeight || 
                   (x > stripWidth + 10 && x < stripWidth + 30) || 
                   (x > stripWidth * 2 + 20 && x < stripWidth * 2 + 40);
        }
    }
}

function clearStickers() {
    if (stickers.length > 0) {
        // Save current state for undo
        stickerHistory.push([...stickers]);
        stickers = [];
        drawCanvas();
        showToast('All stickers cleared', 'success');
    } else {
        showToast('No stickers to clear', 'warning');
    }
}

function drawCanvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (currentLayout === 'single') {
        drawSingleLayout();
    } else {
        drawStripLayout();
    }
    
    // Draw stickers
    drawStickers();
    
    // Draw vampire teeth overlay if effect is active
    if (selectedEffects.includes('vampire-teeth')) {
        drawVampireTeethOverlay();
    }
}

function drawSingleLayout() {
    const margin = 30;
    const frameThickness = 20;
    
    // Draw frame
    drawFrame(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2 - 60);
    
    // Draw image if available
    if (currentImage) {
        const imageArea = {
            x: margin + frameThickness,
            y: margin + frameThickness,
            width: canvas.width - margin * 2 - frameThickness * 2,
            height: canvas.height - margin * 2 - 60 - frameThickness * 2
        };
        
        const processedImage = applyEffects(currentImage);
        drawImageToFit(processedImage, imageArea.x, imageArea.y, imageArea.width, imageArea.height);
    }
    
    // Draw caption in middle area
    if (currentCaption) {
        drawCaption();
    }
}

function drawStripLayout() {
    const margin = 20;
    const stripWidth = (canvas.width - margin * 2 - 20) / 3; // 20px gap between strips
    const stripHeight = stripWidth * 1.2;
    const startY = 40;
    
    // Draw 3 strips
    for (let i = 0; i < 3; i++) {
        const x = margin + i * (stripWidth + 10);
        const y = startY;
        
        // Draw frame for each strip
        drawFrame(x, y, stripWidth, stripHeight);
        
        // Draw image if available
        if (stripImages[i]) {
            const imageArea = {
                x: x + 10,
                y: y + 10,
                width: stripWidth - 20,
                height: stripHeight - 20
            };
            
            const processedImage = applyEffects(stripImages[i]);
            drawImageToFit(processedImage, imageArea.x, imageArea.y, imageArea.width, imageArea.height);
        }
        
        // Draw slot number if no image
        if (!stripImages[i]) {
            ctx.fillStyle = '#cccccc';
            ctx.font = '24px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(i + 1, x + stripWidth / 2, y + stripHeight / 2);
        }
    }
    
    // Draw caption below strips
    if (currentCaption) {
        drawCaptionForStrip(startY + stripHeight + 20);
    }
}

function drawFrame(x, y, width, height) {
    const frameData = frames.find(f => f.id === currentFrame);
    if (!frameData) return;
    
    ctx.save();
    
    if (frameData.colors.length === 1) {
        ctx.fillStyle = frameData.colors[0];
        ctx.fillRect(x, y, width, height);
    } else if (frameData.id === 'rainbow') {
        // Special rainbow frame
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        frameData.colors.forEach((color, index) => {
            gradient.addColorStop(index / (frameData.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
    } else {
        // Gradient frame
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        frameData.colors.forEach((color, index) => {
            gradient.addColorStop(index / (frameData.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
    }
    
    ctx.restore();
}

function drawImageToFit(imageSource, x, y, width, height) {
    // Handle both Image objects and Canvas objects
    const image = imageSource.tagName === 'CANVAS' ? imageSource : imageSource;
    
    const imgAspect = image.width / image.height;
    const areaAspect = width / height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgAspect > areaAspect) {
        // Image is wider than area
        drawHeight = height;
        drawWidth = height * imgAspect;
        drawX = x - (drawWidth - width) / 2;
        drawY = y;
    } else {
        // Image is taller than area
        drawWidth = width;
        drawHeight = width / imgAspect;
        drawX = x;
        drawY = y - (drawHeight - height) / 2;
    }
    
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawCaption() {
    if (!currentCaption) return;
    
    ctx.save();
    ctx.fillStyle = currentTextColor;
    ctx.font = `${currentFontSize}px ${currentFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Position caption in middle area (not at bottom)
    const captionY = canvas.height - 40; // 40px from bottom instead of 20px
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(currentCaption, canvas.width / 2, captionY);
    ctx.restore();
}

function drawCaptionForStrip(y) {
    if (!currentCaption) return;
    
    ctx.save();
    ctx.fillStyle = currentTextColor;
    ctx.font = `${currentFontSize}px ${currentFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(currentCaption, canvas.width / 2, y);
    ctx.restore();
}

function drawStickers() {
    stickers.forEach(sticker => {
        ctx.save();
        ctx.font = `${sticker.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, sticker.x, sticker.y);
        ctx.restore();
    });
}

function drawVampireTeethOverlay() {
    if (currentLayout === 'strip') {
        // Draw fangs on each strip that has an image
        for (let i = 0; i < 3; i++) {
            if (stripImages[i]) {
                drawVampireFangsOnStrip(i);
            }
        }
    } else {
        // Single image - draw fangs in center
        if (currentImage) {
            drawVampireFangsSingle();
        }
    }
}

function drawVampireFangsSingle() {
    const margin = 30;
    const frameThickness = 20;
    const imageArea = {
        x: margin + frameThickness,
        y: margin + frameThickness,
        width: canvas.width - margin * 2 - frameThickness * 2,
        height: canvas.height - margin * 2 - 60 - frameThickness * 2
    };
    
    const centerX = imageArea.x + imageArea.width / 2;
    const centerY = imageArea.y + imageArea.height * 0.6; // Lower in face area
    
    drawFangs(centerX, centerY);
}

function drawVampireFangsOnStrip(stripIndex) {
    const margin = 20;
    const stripWidth = (canvas.width - margin * 2 - 20) / 3;
    const stripHeight = stripWidth * 1.2;
    const x = margin + stripIndex * (stripWidth + 10);
    const y = 40;
    
    const centerX = x + stripWidth / 2;
    const centerY = y + stripHeight * 0.6;
    
    drawFangs(centerX, centerY, 0.7); // Smaller fangs for strips
}

function drawFangs(centerX, centerY, scale = 1) {
    ctx.save();
    
    const size = 15 * scale;
    const height = 20 * scale;
    
    // Draw left fang
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.beginPath();
    ctx.moveTo(centerX - size, centerY);
    ctx.lineTo(centerX - size * 0.3, centerY + height);
    ctx.lineTo(centerX - size * 1.5, centerY + height * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // Draw right fang
    ctx.beginPath();
    ctx.moveTo(centerX + size, centerY);
    ctx.lineTo(centerX + size * 0.3, centerY + height);
    ctx.lineTo(centerX + size * 1.5, centerY + height * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // Add red tint to tips
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(centerX - size * 0.3, centerY + height, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + size * 0.3, centerY + height, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function applyEffects(image) {
    if (selectedEffects.length === 0) return image;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    
    tempCtx.drawImage(image, 0, 0);
    
    selectedEffects.forEach(effectId => {
        applyEffect(tempCtx, effectId, tempCanvas.width, tempCanvas.height);
    });
    
    // Create a new image element and wait for it to load
    const processedImage = new Image();
    processedImage.src = tempCanvas.toDataURL();
    
    // Return the canvas context directly for synchronous processing
    return tempCanvas;
}

function applyEffect(ctx, effectId, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    switch (effectId) {
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
            }
            break;
            
        case 'noir':
            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }
            break;
            
        case 'vintage-film':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.2);
                data[i + 1] = Math.min(255, data[i + 1] * 1.1);
                data[i + 2] = Math.min(255, data[i + 2] * 0.9);
            }
            break;
            
        case 'cyberpunk':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 0.8);
                data[i + 1] = Math.min(255, data[i + 1] * 1.2);
                data[i + 2] = Math.min(255, data[i + 2] * 1.4);
            }
            break;
            
        case 'vaporwave':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.3);
                data[i + 1] = Math.min(255, data[i + 1] * 0.8);
                data[i + 2] = Math.min(255, data[i + 2] * 1.5);
            }
            break;
            
        case 'deep-fried':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.5);
                data[i + 1] = Math.min(255, data[i + 1] * 1.2);
                data[i + 2] = Math.min(255, data[i + 2] * 0.7);
            }
            break;
            
        case 'neon':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.4);
                data[i + 1] = Math.min(255, data[i + 1] * 1.6);
                data[i + 2] = Math.min(255, data[i + 2] * 1.2);
            }
            break;
            
        case 'matrix':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 0.3);
                data[i + 1] = Math.min(255, data[i + 1] * 1.5);
                data[i + 2] = Math.min(255, data[i + 2] * 0.3);
            }
            break;
            
        case 'blade-runner':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.2);
                data[i + 1] = Math.min(255, data[i + 1] * 0.9);
                data[i + 2] = Math.min(255, data[i + 2] * 0.7);
            }
            break;
            
        case 'rainbow':
            for (let i = 0; i < data.length; i += 4) {
                const x = (i / 4) % width;
                const hue = (x / width) * 360;
                const [r, g, b] = hslToRgb(hue, 0.8, 0.5);
                data[i] = Math.min(255, data[i] * 0.5 + r * 0.5);
                data[i + 1] = Math.min(255, data[i + 1] * 0.5 + g * 0.5);
                data[i + 2] = Math.min(255, data[i + 2] * 0.5 + b * 0.5);
            }
            break;
            
        case 'cool-glasses':
            // Apply dark tint and increase contrast
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 0.7);
                data[i + 1] = Math.min(255, data[i + 1] * 0.7);
                data[i + 2] = Math.min(255, data[i + 2] * 0.7);
            }
            break;
            
        case 'laser-eyes':
            // Add red tint
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.5);
                data[i + 1] = Math.min(255, data[i + 1] * 0.3);
                data[i + 2] = Math.min(255, data[i + 2] * 0.3);
            }
            break;
            
        case 'glowing':
            // Bright glow effect
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.3);
                data[i + 1] = Math.min(255, data[i + 1] * 1.3);
                data[i + 2] = Math.min(255, data[i + 2] * 1.3);
            }
            break;
            
        case 'holographic':
            // Iridescent effect
            for (let i = 0; i < data.length; i += 4) {
                const y = Math.floor((i / 4) / width);
                const shift = Math.sin(y * 0.1) * 50;
                data[i] = Math.min(255, data[i] + shift);
                data[i + 1] = Math.min(255, data[i + 1] + shift * 0.5);
                data[i + 2] = Math.min(255, data[i + 2] + shift * 1.5);
            }
            break;
            
        case 'pixel':
            // Pixelate effect
            const pixelSize = 8;
            for (let y = 0; y < height; y += pixelSize) {
                for (let x = 0; x < width; x += pixelSize) {
                    const idx = (y * width + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    
                    for (let py = 0; py < pixelSize && y + py < height; py++) {
                        for (let px = 0; px < pixelSize && x + px < width; px++) {
                            const pidx = ((y + py) * width + (x + px)) * 4;
                            data[pidx] = r;
                            data[pidx + 1] = g;
                            data[pidx + 2] = b;
                        }
                    }
                }
            }
            break;
            
        case 'comic':
            // High contrast comic effect
            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] > 128 ? 255 : 0;
                data[i + 1] = data[i + 1] > 128 ? 255 : 0;
                data[i + 2] = data[i + 2] > 128 ? 255 : 0;
            }
            break;
            
        case 'film-grain':
            // Add film grain
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * 30;
                data[i] = Math.max(0, Math.min(255, data[i] + noise));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
            }
            break;
            
        case 'light-leaks':
            // Add light leak effect
            for (let i = 0; i < data.length; i += 4) {
                const x = (i / 4) % width;
                const y = Math.floor((i / 4) / width);
                const distance = Math.sqrt(x * x + y * y);
                const leak = Math.max(0, 100 - distance * 0.1);
                data[i] = Math.min(255, data[i] + leak);
                data[i + 1] = Math.min(255, data[i + 1] + leak * 0.8);
                data[i + 2] = Math.min(255, data[i + 2] + leak * 0.6);
            }
            break;
            
        case 'high-contrast':
            // Increase contrast dramatically
            for (let i = 0; i < data.length; i += 4) {
                const contrast = 2.0; // Contrast multiplier
                const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                
                data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
                data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
                data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
            }
            break;
            
        case 'red-lights':
            // Create red lighting effect
            for (let i = 0; i < data.length; i += 4) {
                const x = (i / 4) % width;
                const y = Math.floor((i / 4) / width);
                
                // Create multiple red light sources
                const light1 = Math.max(0, 150 - Math.sqrt((x - width * 0.3) ** 2 + (y - height * 0.3) ** 2) * 0.5);
                const light2 = Math.max(0, 150 - Math.sqrt((x - width * 0.7) ** 2 + (y - height * 0.7) ** 2) * 0.5);
                const redBoost = Math.max(light1, light2);
                
                data[i] = Math.min(255, data[i] + redBoost);
                data[i + 1] = Math.min(255, data[i + 1] * 0.6);
                data[i + 2] = Math.min(255, data[i + 2] * 0.6);
            }
            break;
            
        case 'vampire-teeth':
            // Dark, dramatic effect with red accent
            for (let i = 0; i < data.length; i += 4) {
                // Darken overall image
                data[i] = Math.min(255, data[i] * 0.8);
                data[i + 1] = Math.min(255, data[i + 1] * 0.7);
                data[i + 2] = Math.min(255, data[i + 2] * 0.7);
                
                // Add subtle red tint
                data[i] = Math.min(255, data[i] + 20);
            }
            break;
            
        default:
            // Apply a basic filter for other effects
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.1);
                data[i + 1] = Math.min(255, data[i + 1] * 1.05);
                data[i + 2] = Math.min(255, data[i + 2] * 1.15);
            }
            break;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function hslToRgb(h, s, l) {
    h /= 360;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / (1/12)) % 12;
        return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `polaroid-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    showToast('Image downloaded successfully!', 'success');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Remove existing classes
    toast.classList.remove('success', 'error', 'warning');
    
    // Add new type class
    toast.classList.add(type);
    
    // Set icon based on type
    switch (type) {
        case 'success':
            toastIcon.className = 'toast-icon fas fa-check-circle';
            break;
        case 'error':
            toastIcon.className = 'toast-icon fas fa-times-circle';
            break;
        case 'warning':
            toastIcon.className = 'toast-icon fas fa-exclamation-triangle';
            break;
        default:
            toastIcon.className = 'toast-icon fas fa-info-circle';
    }
    
    toastMessage.textContent = message;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
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
