// Polaroid Studio - Professional Photo Editor
// Advanced JavaScript Implementation with 15+ Cinema Effects

class PolaroidStudio {
    constructor() {
        this.canvas = document.getElementById('polaroidCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stripCanvas = document.getElementById('stripCanvas');
        this.stripCtx = this.stripCanvas.getContext('2d');
        
        // State management
        this.currentMode = 'single'; // 'single' or 'strip'
        this.currentEffect = 'none';
        this.currentFrame = 'classic';
        this.currentTheme = 'dark';
        this.isStreamActive = false;
        this.isPalmDetected = false;
        this.capturedImage = null;
        this.countdown = 0;
        
        // Strip mode state
        this.stripCaptures = [null, null, null];
        this.currentStripIndex = 0;
        this.stripVideos = [];
        
        // Camera and detection
        this.stream = null;
        this.video = document.getElementById('videoPreview');
        this.palmDetectionActive = false;
        this.palmDetectionRef = null;
        
        // Adjustments
        this.adjustments = {
            contrast: 100,
            brightness: 100,
            saturation: 100
        };
        
        // Initialize the application
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeCanvas();
        this.setupStripVideos();
        this.filterEffects('cinema'); // Show cinema effects by default
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Layout mode switches
        document.getElementById('singleMode').addEventListener('click', () => {
            this.setMode('single');
        });
        
        document.getElementById('stripMode').addEventListener('click', () => {
            this.setMode('strip');
        });
        
        // Camera controls
        document.getElementById('startCamera').addEventListener('click', () => {
            this.startCamera();
        });
        
        document.getElementById('capturePhoto').addEventListener('click', () => {
            this.capturePhoto();
        });
        
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
        
        // File upload
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        // Upload overlay click
        document.getElementById('uploadOverlay').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        
        // Effect category filters
        document.querySelectorAll('.effect-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterEffects(e.target.dataset.category);
                this.setActiveButton(e.target, '.effect-category-btn');
            });
        });
        
        // Effect buttons
        document.querySelectorAll('.effect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentEffect = e.target.closest('.effect-btn').dataset.effect;
                this.setActiveButton(e.target.closest('.effect-btn'), '.effect-btn');
                this.applyCurrentEffect();
            });
        });
        
        // Frame buttons
        document.querySelectorAll('.frame-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFrame = e.target.dataset.frame;
                this.setActiveButton(e.target, '.frame-btn');
                this.redrawCanvas();
            });
        });
        
        // Caption controls
        document.getElementById('captionInput').addEventListener('input', () => {
            this.redrawCanvas();
        });
        
        document.getElementById('fontSelect').addEventListener('change', () => {
            this.redrawCanvas();
        });
        
        document.getElementById('textColor').addEventListener('change', () => {
            this.redrawCanvas();
        });
        
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            this.redrawCanvas();
        });
        
        // Adjustment controls
        document.getElementById('contrastSlider').addEventListener('input', (e) => {
            this.adjustments.contrast = parseInt(e.target.value);
            document.getElementById('contrastValue').textContent = e.target.value + '%';
            this.applyCurrentEffect();
        });
        
        document.getElementById('brightnessSlider').addEventListener('input', (e) => {
            this.adjustments.brightness = parseInt(e.target.value);
            document.getElementById('brightnessValue').textContent = e.target.value + '%';
            this.applyCurrentEffect();
        });
        
        document.getElementById('saturationSlider').addEventListener('input', (e) => {
            this.adjustments.saturation = parseInt(e.target.value);
            document.getElementById('saturationValue').textContent = e.target.value + '%';
            this.applyCurrentEffect();
        });
        
        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadImage();
        });
        
        // Strip preview clicks
        document.querySelectorAll('.strip-preview-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.strip-preview-item').dataset.index);
                this.captureStripPhoto(index);
            });
        });
    }
    
    setupStripVideos() {
        for (let i = 1; i <= 3; i++) {
            this.stripVideos.push(document.getElementById(`stripVideo${i}`));
        }
    }
    
    initializeCanvas() {
        // Clear and draw initial state
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw placeholder
        this.drawPlaceholder();
        this.createPolaroidFrame();
        
        // Initialize strip canvas
        this.initializeStripCanvas();
    }
    
    initializeStripCanvas() {
        this.stripCtx.fillStyle = 'white';
        this.stripCtx.fillRect(0, 0, this.stripCanvas.width, this.stripCanvas.height);
        
        // Draw strip placeholder frames
        for (let i = 0; i < 3; i++) {
            const y = 20 + (i * 190);
            this.stripCtx.fillStyle = '#f0f0f0';
            this.stripCtx.fillRect(30, y, 340, 170);
            
            this.stripCtx.fillStyle = '#ccc';
            this.stripCtx.font = '16px Inter';
            this.stripCtx.textAlign = 'center';
            this.stripCtx.fillText(`Photo ${i + 1}`, 200, y + 90);
        }
    }
    
    drawPlaceholder() {
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(30, 30, this.canvas.width - 60, this.canvas.height - 110);
        
        this.ctx.fillStyle = '#ccc';
        this.ctx.font = '18px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('📸', this.canvas.width / 2, this.canvas.height / 2 - 20);
        this.ctx.fillText('Upload or capture a photo', this.canvas.width / 2, this.canvas.height / 2 + 10);
    }
    
    setMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        if (mode === 'single') {
            document.getElementById('singleMode').classList.add('active');
            document.getElementById('stripMode').classList.remove('active');
            document.getElementById('stripContainer').classList.add('hidden');
            document.getElementById('polaroidCanvas').style.display = 'block';
        } else {
            document.getElementById('stripMode').classList.add('active');
            document.getElementById('singleMode').classList.remove('active');
            document.getElementById('stripContainer').classList.remove('hidden');
            document.getElementById('polaroidCanvas').style.display = 'none';
        }
        
        this.showToast('Layout changed to ' + (mode === 'single' ? 'Single Photo' : '3-Strip Vertical'), 'success');
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(this.currentTheme);
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    async startCamera() {
        try {
            this.showLoading(true);
            
            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            this.isStreamActive = true;
            
            // Update UI
            document.getElementById('startCamera').disabled = true;
            document.getElementById('capturePhoto').disabled = false;
            document.getElementById('uploadOverlay').classList.add('hidden');
            this.video.classList.add('active');
            
            // Start palm detection
            this.startPalmDetection();
            document.getElementById('palmDetection').classList.add('active');
            
            this.showToast('Camera started successfully! Show your palm to start timer.', 'success');
            
        } catch (error) {
            console.error('Camera error:', error);
            this.showToast('Failed to start camera. Please check permissions.', 'error');
        } finally {
            this.showLoading(false);
        }
    }
    
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.isStreamActive = false;
        this.video.classList.remove('active');
        this.video.srcObject = null;
        
        // Stop palm detection
        this.stopPalmDetection();
        document.getElementById('palmDetection').classList.remove('active');
        
        // Update UI
        document.getElementById('startCamera').disabled = false;
        document.getElementById('capturePhoto').disabled = true;
        
        if (!this.capturedImage) {
            document.getElementById('uploadOverlay').classList.remove('hidden');
        }
    }
    
    startPalmDetection() {
        if (this.palmDetectionRef) return;
        
        this.palmDetectionActive = true;
        
        const detectPalm = () => {
            if (!this.palmDetectionActive || !this.video.videoWidth) {
                this.palmDetectionRef = requestAnimationFrame(detectPalm);
                return;
            }
            
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = this.video.videoWidth;
                canvas.height = this.video.videoHeight;
                
                ctx.drawImage(this.video, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Simple skin detection as palm proxy
                let skinPixels = 0;
                const totalPixels = data.length / 4;
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    if (r > 95 && g > 40 && b > 20 && 
                        Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                        Math.abs(r - g) > 15 && r > g && r > b) {
                        skinPixels++;
                    }
                }
                
                const skinRatio = skinPixels / totalPixels;
                const detected = skinRatio > 0.15;
                
                if (detected !== this.isPalmDetected) {
                    this.isPalmDetected = detected;
                    this.updatePalmDetectionUI(detected);
                    
                    if (detected && this.countdown === 0) {
                        this.startCountdown();
                    }
                }
                
            } catch (error) {
                // Ignore detection errors
            }
            
            this.palmDetectionRef = requestAnimationFrame(detectPalm);
        };
        
        detectPalm();
    }
    
    stopPalmDetection() {
        this.palmDetectionActive = false;
        if (this.palmDetectionRef) {
            cancelAnimationFrame(this.palmDetectionRef);
            this.palmDetectionRef = null;
        }
        this.isPalmDetected = false;
        this.updatePalmDetectionUI(false);
    }
    
    updatePalmDetectionUI(detected) {
        const indicator = document.querySelector('.palm-indicator');
        const status = document.getElementById('palmStatus');
        
        if (detected) {
            indicator.classList.add('detected');
            status.textContent = 'Palm detected - Starting timer!';
        } else {
            indicator.classList.remove('detected');
            status.textContent = 'Show your palm to start timer...';
        }
    }
    
    startCountdown() {
        if (this.countdown > 0) return;
        
        let count = 3;
        this.countdown = count;
        
        const countdownElement = document.querySelector('.countdown-number');
        const countdownTimer = document.getElementById('countdownTimer');
        
        countdownTimer.classList.add('active');
        countdownElement.textContent = count;
        
        const interval = setInterval(() => {
            count--;
            this.countdown = count;
            countdownElement.textContent = count;
            
            if (count <= 0) {
                clearInterval(interval);
                countdownTimer.classList.remove('active');
                this.countdown = 0;
                
                if (this.currentMode === 'single') {
                    this.capturePhoto();
                } else {
                    this.captureStripPhoto(this.currentStripIndex);
                }
            }
        }, 1000);
    }
    
    capturePhoto() {
        if (!this.isStreamActive) return;
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.video.videoWidth;
            canvas.height = this.video.videoHeight;
            
            // Flip horizontally for mirror effect
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.video, -canvas.width, 0);
            ctx.restore();
            
            canvas.toBlob(blob => {
                const img = new Image();
                img.onload = () => {
                    this.capturedImage = img;
                    this.redrawCanvas();
                    this.showToast('Photo captured successfully!', 'success');
                };
                img.src = URL.createObjectURL(blob);
            });
            
        } catch (error) {
            console.error('Capture error:', error);
            this.showToast('Failed to capture photo. Please try again.', 'error');
        }
    }
    
    async captureStripPhoto(index) {
        if (index >= 3 || this.stripCaptures[index]) return;
        
        try {
            // Start camera for this strip if not active
            if (!this.stripVideos[index].srcObject) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 320, height: 240 }
                });
                this.stripVideos[index].srcObject = stream;
                this.stripVideos[index].classList.add('active');
                
                // Mark strip item as active
                const stripItem = document.querySelector(`[data-index="${index}"]`);
                stripItem.classList.add('active');
                
                // Wait a moment for video to stabilize
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Capture the photo
            const video = this.stripVideos[index];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(video, -canvas.width, 0);
            ctx.restore();
            
            canvas.toBlob(blob => {
                const img = new Image();
                img.onload = () => {
                    this.stripCaptures[index] = img;
                    this.updateStripCanvas();
                    
                    // Stop this video stream
                    const stream = video.srcObject;
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                    video.classList.remove('active');
                    
                    // Update UI
                    const stripItem = document.querySelector(`[data-index="${index}"]`);
                    stripItem.classList.remove('active');
                    stripItem.querySelector('.strip-placeholder').classList.add('captured');
                    stripItem.querySelector('.strip-placeholder span').textContent = 'Captured ✓';
                    
                    // Move to next strip
                    if (index < 2) {
                        this.currentStripIndex = index + 1;
                    }
                    
                    this.showToast(`Photo ${index + 1} captured!`, 'success');
                    
                    // Check if all strips are captured
                    if (this.stripCaptures.every(capture => capture !== null)) {
                        this.showToast('All photos captured! Strip complete.', 'success');
                    }
                };
                img.src = URL.createObjectURL(blob);
            });
            
        } catch (error) {
            console.error('Strip capture error:', error);
            this.showToast(`Failed to capture photo ${index + 1}`, 'error');
        }
    }
    
    updateStripCanvas() {
        this.stripCtx.fillStyle = 'white';
        this.stripCtx.fillRect(0, 0, this.stripCanvas.width, this.stripCanvas.height);
        
        this.stripCaptures.forEach((capture, index) => {
            if (capture) {
                const y = 20 + (index * 190);
                
                // Draw frame
                this.stripCtx.fillStyle = 'white';
                this.stripCtx.fillRect(30, y, 340, 170);
                
                // Draw shadow
                this.stripCtx.fillStyle = 'rgba(0,0,0,0.1)';
                this.stripCtx.fillRect(32, y + 2, 340, 170);
                
                // Draw image with current effect
                this.drawImageToCanvas(
                    this.stripCtx, 
                    capture, 
                    this.stripCanvas, 
                    this.currentEffect,
                    { x: 40, y: y + 10, width: 320, height: 150 }
                );
            }
        });
        
        // Apply frame
        this.createPolaroidFrame(this.stripCtx, this.stripCanvas);
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select a valid image file', 'error');
            return;
        }
        
        this.showLoading(true);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.capturedImage = img;
                this.redrawCanvas();
                this.showLoading(false);
                this.showToast('Image uploaded successfully!', 'success');
                
                // Hide upload overlay
                document.getElementById('uploadOverlay').classList.add('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    redrawCanvas() {
        if (!this.capturedImage) return;
        
        // Clear canvas
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw image with effect
        this.drawImageToCanvas(this.ctx, this.capturedImage, this.canvas, this.currentEffect);
        
        // Apply frame
        this.createPolaroidFrame();
        
        // Add caption
        this.addCaption();
    }
    
    applyCurrentEffect() {
        if (this.currentMode === 'single') {
            this.redrawCanvas();
        } else {
            this.updateStripCanvas();
        }
    }
    
    drawImageToCanvas(ctx, img, canvas, effectType, area = null) {
        const frameMargin = 30;
        const bottomMargin = 80;
        
        const targetArea = area || {
            x: frameMargin,
            y: frameMargin,
            width: canvas.width - (frameMargin * 2),
            height: canvas.height - frameMargin - bottomMargin
        };
        
        // Calculate scaling to fit image within target area
        const scale = Math.min(
            targetArea.width / img.width,
            targetArea.height / img.height
        );
        
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        
        // Center the image
        const x = targetArea.x + (targetArea.width - scaledWidth) / 2;
        const y = targetArea.y + (targetArea.height - scaledHeight) / 2;
        
        // Create temporary canvas for effects
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = scaledWidth;
        tempCanvas.height = scaledHeight;
        
        tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        
        // Apply effect
        this.applyEffect(tempCtx, tempCanvas, effectType);
        
        // Draw to main canvas
        ctx.drawImage(tempCanvas, x, y);
    }
    
    applyEffect(ctx, canvas, effectType) {
        const width = canvas.width;
        const height = canvas.height;
        
        switch (effectType) {
            case 'matrix':
                this.applyMatrixEffect(ctx, width, height);
                break;
            case 'soft-blur':
                this.applySoftBlur(ctx, width, height);
                break;
            case 'film-noir':
                this.applyFilmNoir(ctx, width, height);
                break;
            case 'golden-hour':
                this.applyGoldenHour(ctx, width, height);
                break;
            case 'cyberpunk':
                this.applyCyberpunk(ctx, width, height);
                break;
            case 'vintage-film':
                this.applyVintageFilm(ctx, width, height);
                break;
            case 'dreamy-haze':
                this.applyDreamyHaze(ctx, width, height);
                break;
            case 'moody-dark':
                this.applyMoodyDark(ctx, width, height);
                break;
            case 'sunset-vibes':
                this.applySunsetVibes(ctx, width, height);
                break;
            case 'retro-80s':
                this.applyRetro80s(ctx, width, height);
                break;
            case 'vaporwave':
                this.applyVaporwave(ctx, width, height);
                break;
            case 'teal-orange':
                this.applyTealOrange(ctx, width, height);
                break;
            case 'pastel-dream':
                this.applyPastelDream(ctx, width, height);
                break;
            case 'happy-birthday':
                this.applyHappyBirthday(ctx, width, height);
                break;
            case 'blade-runner':
                this.applyBladeRunner(ctx, width, height);
                break;
            case 'sepia':
                this.applySepia(ctx, width, height);
                break;
            case 'polaroid-classic':
                this.applyPolaroidClassic(ctx, width, height);
                break;
            case 'neon-glow':
                this.applyNeonGlow(ctx, width, height);
                break;
            case 'pop-art':
                this.applyPopArt(ctx, width, height);
                break;
            case 'none':
            default:
                // Apply adjustments only
                this.applyAdjustments(ctx, width, height);
                break;
        }
    }
    
    // Effect implementations
    applyMatrixEffect(ctx, width, height) {
        this.applyAdjustments(ctx, width, height);
        
        // Green tint overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#00FF00';
        ctx.font = '12px monospace';
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const char = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillText(char, x, y);
        }
    }
    
    applySoftBlur(ctx, width, height) {
        this.applyAdjustments(ctx, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const output = new Uint8ClampedArray(data);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const neighborIdx = ((y + dy) * width + (x + dx)) * 4 + c;
                            sum += data[neighborIdx];
                        }
                    }
                    output[idx + c] = sum / 9;
                }
            }
        }
        
        for (let i = 0; i < data.length; i++) {
            data[i] = output[i];
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    applyFilmNoir(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            const contrast = Math.pow(gray / 255, 0.7) * 255;
            data[i] = data[i + 1] = data[i + 2] = contrast;
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyGoldenHour(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.15);
            data[i + 1] = Math.min(255, data[i + 1] * 1.05);
            data[i + 2] = Math.min(255, data[i + 2] * 0.8);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyCyberpunk(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.8);
            data[i + 1] = Math.min(255, data[i + 1] * 0.9);
            data[i + 2] = Math.min(255, data[i + 2] * 1.3);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyVintageFilm(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1 + 10);
            data[i + 1] = Math.min(255, data[i + 1] * 1.0);
            data[i + 2] = Math.min(255, data[i + 2] * 0.9 - 10);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyDreamyHaze(ctx, width, height) {
        this.applyAdjustments(ctx, width, height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    applyMoodyDark(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.7);
            data[i + 1] = Math.min(255, data[i + 1] * 0.7);
            data[i + 2] = Math.min(255, data[i + 2] * 0.7);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applySunsetVibes(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 0.9);
            data[i + 2] = Math.min(255, data[i + 2] * 0.7);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyRetro80s(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1 + 20);
            data[i + 1] = Math.min(255, data[i + 1] * 0.8);
            data[i + 2] = Math.min(255, data[i + 2] * 1.2);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyVaporwave(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1);
            data[i + 1] = Math.min(255, data[i + 1] * 0.7);
            data[i + 2] = Math.min(255, data[i + 2] * 1.3);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyTealOrange(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (r > g && r > b) {
                data[i] = Math.min(255, r * 1.3);
                data[i + 1] = Math.min(255, g * 0.8);
            } else {
                data[i + 1] = Math.min(255, g * 1.1);
                data[i + 2] = Math.min(255, b * 1.2);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyPastelDream(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.8 + 50);
            data[i + 1] = Math.min(255, data[i + 1] * 0.8 + 50);
            data[i + 2] = Math.min(255, data[i + 2] * 0.8 + 50);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyHappyBirthday(ctx, width, height) {
        this.applyAdjustments(ctx, width, height);
        
        ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Add confetti
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillRect(x, y, 3, 3);
        }
    }
    
    applyBladeRunner(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.9);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 1.3);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
        
        // Add atmospheric glow
        ctx.fillStyle = 'rgba(0, 150, 255, 0.05)';
        ctx.fillRect(0, 0, width, height);
    }
    
    applySepia(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyPolaroidClassic(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.05 + 5);
            data[i + 1] = Math.min(255, data[i + 1] * 1.02);
            data[i + 2] = Math.min(255, data[i + 2] * 0.98);
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyNeonGlow(ctx, width, height) {
        this.applyAdjustments(ctx, width, height);
        
        // Create neon glow effect
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
        gradient.addColorStop(0, 'rgba(255, 0, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0.02)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    applyPopArt(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Posterize effect
            data[i] = Math.round(data[i] / 64) * 64;
            data[i + 1] = Math.round(data[i + 1] / 64) * 64;
            data[i + 2] = Math.round(data[i + 2] / 64) * 64;
        }
        
        ctx.putImageData(imageData, 0, 0);
        this.applyAdjustments(ctx, width, height);
    }
    
    applyAdjustments(ctx, width, height) {
        if (this.adjustments.contrast === 100 && 
            this.adjustments.brightness === 100 && 
            this.adjustments.saturation === 100) {
            return; // No adjustments needed
        }
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        const contrast = this.adjustments.contrast / 100;
        const brightness = this.adjustments.brightness / 100;
        const saturation = this.adjustments.saturation / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Apply brightness
            r *= brightness;
            g *= brightness;
            b *= brightness;
            
            // Apply contrast
            r = ((r / 255 - 0.5) * contrast + 0.5) * 255;
            g = ((g / 255 - 0.5) * contrast + 0.5) * 255;
            b = ((b / 255 - 0.5) * contrast + 0.5) * 255;
            
            // Apply saturation
            const gray = r * 0.299 + g * 0.587 + b * 0.114;
            r = gray + (r - gray) * saturation;
            g = gray + (g - gray) * saturation;
            b = gray + (b - gray) * saturation;
            
            data[i] = Math.max(0, Math.min(255, r));
            data[i + 1] = Math.max(0, Math.min(255, g));
            data[i + 2] = Math.max(0, Math.min(255, b));
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    createPolaroidFrame(ctx = this.ctx, canvas = this.canvas) {
        switch (this.currentFrame) {
            case 'classic':
                this.drawClassicFrame(ctx, canvas);
                break;
            case 'vintage':
                this.drawVintageFrame(ctx, canvas);
                break;
            case 'modern':
                this.drawModernFrame(ctx, canvas);
                break;
            case 'film':
                this.drawFilmFrame(ctx, canvas);
                break;
            case 'instant':
                this.drawInstantFrame(ctx, canvas);
                break;
            case 'retro':
                this.drawRetroFrame(ctx, canvas);
                break;
            default:
                this.drawClassicFrame(ctx, canvas);
        }
    }
    
    drawClassicFrame(ctx, canvas) {
        ctx.strokeStyle = '#f0f0f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    }
    
    drawVintageFrame(ctx, canvas) {
        ctx.strokeStyle = '#d4a574';
        ctx.lineWidth = 3;
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    }
    
    drawModernFrame(ctx, canvas) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    }
    
    drawFilmFrame(ctx, canvas) {
        ctx.fillStyle = '#000';
        for (let i = 0; i < canvas.height; i += 20) {
            ctx.fillRect(0, i, 10, 10);
            ctx.fillRect(canvas.width - 10, i, 10, 10);
        }
    }
    
    drawInstantFrame(ctx, canvas) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 60);
    }
    
    drawRetroFrame(ctx, canvas) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(1, '#4ecdc4');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    }
    
    addCaption() {
        const caption = document.getElementById('captionInput').value;
        if (!caption) return;
        
        const font = document.getElementById('fontSelect').value;
        const color = document.getElementById('textColor').value;
        const size = document.getElementById('fontSize').value;
        
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px ${font}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(caption, this.canvas.width / 2, this.canvas.height - 20);
    }
    
    filterEffects(category) {
        const allEffects = document.querySelectorAll('.effect-btn');
        
        allEffects.forEach(effect => {
            if (category === 'all' || effect.dataset.category === category) {
                effect.style.display = 'flex';
            } else {
                effect.style.display = 'none';
            }
        });
    }
    
    setActiveButton(activeBtn, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    downloadImage() {
        const canvas = this.currentMode === 'single' ? this.canvas : this.stripCanvas;
        
        const link = document.createElement('a');
        link.download = `polaroid-${this.currentMode}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        this.showToast('Polaroid downloaded successfully!', 'success');
    }
    
    reset() {
        // Stop camera
        this.stopCamera();
        
        // Reset state
        this.capturedImage = null;
        this.stripCaptures = [null, null, null];
        this.currentStripIndex = 0;
        this.currentEffect = 'none';
        this.currentFrame = 'classic';
        this.adjustments = { contrast: 100, brightness: 100, saturation: 100 };
        
        // Reset UI
        document.getElementById('captionInput').value = '';
        document.getElementById('fontSize').value = 18;
        document.getElementById('fontSizeValue').textContent = '18px';
        document.getElementById('contrastSlider').value = 100;
        document.getElementById('contrastValue').textContent = '100%';
        document.getElementById('brightnessSlider').value = 100;
        document.getElementById('brightnessValue').textContent = '100%';
        document.getElementById('saturationSlider').value = 100;
        document.getElementById('saturationValue').textContent = '100%';
        
        // Reset active buttons
        document.querySelectorAll('.effect-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-effect="none"]').classList.add('active');
        document.querySelectorAll('.frame-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-frame="classic"]').classList.add('active');
        
        // Reset strip UI
        document.querySelectorAll('.strip-preview-item').forEach((item, index) => {
            item.classList.remove('active');
            const placeholder = item.querySelector('.strip-placeholder');
            placeholder.classList.remove('captured');
            placeholder.querySelector('span').textContent = `Photo ${index + 1}`;
        });
        
        // Reinitialize canvases
        this.initializeCanvas();
        
        // Show upload overlay
        document.getElementById('uploadOverlay').classList.remove('hidden');
        
        this.showToast('Everything has been reset', 'success');
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        
        // Set content
        messageEl.textContent = message;
        
        // Set icon and type
        toast.className = `toast ${type}`;
        switch (type) {
            case 'success':
                icon.className = 'toast-icon fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'toast-icon fas fa-exclamation-circle';
                break;
            case 'warning':
                icon.className = 'toast-icon fas fa-exclamation-triangle';
                break;
            default:
                icon.className = 'toast-icon fas fa-info-circle';
        }
        
        // Show toast
        toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.polaroidStudio = new PolaroidStudio();
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    if (window.polaroidStudio) {
        window.polaroidStudio.showToast('An error occurred. Please try again.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (window.polaroidStudio) {
        window.polaroidStudio.showToast('An error occurred. Please try again.', 'error');
    }
});
