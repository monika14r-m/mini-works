@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Creepster&family=Orbitron:wght@400;700&family=Courier+Prime&family=Bungee&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Dark theme colors */
    --bg-primary: hsl(240, 50%, 3%);
    --bg-secondary: hsl(240, 20%, 8%);
    --bg-tertiary: hsl(240, 15%, 12%);
    --bg-quaternary: hsl(240, 10%, 18%);
    --text-primary: hsl(0, 0%, 98%);
    --text-secondary: hsl(0, 0%, 88%);
    --text-muted: hsl(0, 0%, 64%);
    --accent-primary: hsl(248, 78%, 70%);
    --accent-secondary: hsl(280, 45%, 60%);
    --accent-gradient: linear-gradient(135deg, hsl(248, 78%, 70%) 0%, hsl(280, 45%, 60%) 100%);
    --border: hsla(0, 0%, 100%, 0.1);
    --shadow: hsla(0, 0%, 0%, 0.3);
    --success: hsl(142, 71%, 58%);
    --warning: hsl(25, 95%, 62%);
    --danger: hsl(0, 73%, 70%);
    --glass-bg: hsla(0, 0%, 100%, 0.05);
    --glass-border: hsla(0, 0%, 100%, 0.1);
}

[data-theme="light"] {
    --bg-primary: hsl(0, 0%, 98%);
    --bg-secondary: hsl(0, 0%, 100%);
    --bg-tertiary: hsl(218, 27%, 96%);
    --bg-quaternary: hsl(220, 13%, 91%);
    --text-primary: hsl(220, 39%, 11%);
    --text-secondary: hsl(215, 25%, 27%);
    --text-muted: hsl(215, 16%, 47%);
    --accent-primary: hsl(213, 94%, 68%);
    --accent-secondary: hsl(262, 83%, 58%);
    --accent-gradient: linear-gradient(135deg, hsl(213, 94%, 68%) 0%, hsl(262, 83%, 58%) 100%);
    --border: hsla(0, 0%, 0%, 0.1);
    --shadow: hsla(0, 0%, 0%, 0.1);
    --glass-bg: hsla(0, 0%, 0%, 0.02);
    --glass-border: hsla(0, 0%, 0%, 0.05);
}

body {
    font-family: 'Inter', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header {
    background: var(--bg-secondary);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 1rem 1.5rem;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.brand-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: var(--accent-gradient);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.125rem;
}

.brand-title {
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.theme-toggle {
    background: var(--glass-bg);
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    font-size: 1.125rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    min-width: 44px;
    min-height: 44px;
}

.theme-toggle:hover {
    background: var(--accent-primary);
    transform: scale(1.05);
}

.main-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

.preview-section {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 0;
}

.canvas-container {
    position: relative;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 2rem;
    box-shadow: 0 25px 50px -12px var(--shadow);
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
}

.canvas-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 35px 60px -12px var(--shadow);
}

#polaroidCanvas {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px -5px var(--shadow);
    transition: all 0.3s ease;
}

.upload-overlay {
    position: absolute;
    top: 2rem;
    left: 2rem;
    right: 2rem;
    bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    transition: opacity 0.3s ease;
    background: hsla(0, 0%, 0%, 0.3);
    backdrop-filter: blur(4px);
    cursor: pointer;
}

.upload-overlay.hidden {
    opacity: 0;
    pointer-events: none;
}

.upload-prompt {
    text-align: center;
    padding: 3rem;
    border: 2px dashed var(--border);
    border-radius: 0.75rem;
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.upload-prompt:hover {
    border-color: var(--accent-primary);
    background: var(--glass-border);
    transform: scale(1.02);
}

.upload-icon {
    width: 4rem;
    height: 4rem;
    background: var(--accent-gradient);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    color: white;
    font-size: 1.5rem;
}

.upload-prompt h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.upload-prompt p {
    color: var(--text-muted);
}

.camera-preview {
    position: absolute;
    top: 2rem;
    left: 2rem;
    right: 2rem;
    bottom: 2rem;
    width: calc(100% - 4rem);
    height: calc(100% - 4rem);
    object-fit: cover;
    border-radius: 0.75rem;
    transform: scaleX(-1);
    display: none;
}

.camera-preview.active {
    display: block;
}

.countdown-timer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background: hsla(0, 0%, 0%, 0.5);
    backdrop-filter: blur(4px);
    border-radius: 0.75rem;
}

.countdown-timer.active {
    display: flex;
}

.countdown-number {
    font-size: 4rem;
    font-weight: 700;
    color: var(--accent-primary);
    text-shadow: 0 0 20px currentColor;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.controls-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 1.5rem;
    height: fit-content;
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(20px);
}

.control-panel {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
}

.control-panel:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.panel-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.panel-title i {
    color: var(--accent-primary);
}

.camera-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.btn {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    backdrop-filter: blur(10px);
    min-height: 44px;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
}

.btn-primary {
    background: var(--accent-gradient);
    color: white;
}

.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.btn-outline {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.btn-success {
    background: var(--success);
    color: white;
}

.btn-warning {
    background: var(--warning);
    color: white;
}

.btn-large {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
}

.btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px var(--shadow);
}

.palm-detection {
    display: none;
    background: var(--glass-bg);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1rem;
    text-align: center;
}

.palm-detection.active {
    display: block;
}

.palm-detection i {
    font-size: 2rem;
    color: var(--success);
    margin-bottom: 0.5rem;
}

.palm-detection p {
    font-size: 0.875rem;
    color: var(--text-muted);
}

.layout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.layout-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--glass-bg);
}

.layout-option:hover {
    border-color: var(--accent-primary);
    background: var(--glass-border);
}

.layout-option input {
    display: none;
}

.layout-option input:checked + .layout-preview {
    border-color: var(--accent-primary);
    background: var(--accent-primary);
}

.layout-preview {
    width: 40px;
    height: 50px;
    border: 2px solid var(--border);
    border-radius: 0.375rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.layout-single {
    width: 100%;
    height: 100%;
    background: var(--bg-tertiary);
}

.layout-strip {
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        to bottom,
        var(--bg-tertiary) 0px,
        var(--bg-tertiary) 14px,
        var(--border) 14px,
        var(--border) 16px
    );
}

.effect-categories {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}

.category-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    white-space: nowrap;
    min-height: 44px;
}

.category-btn.active {
    background: var(--accent-gradient);
    color: white;
    border-color: var(--accent-primary);
}

.category-btn:hover {
    transform: translateY(-1px);
}

.effects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.75rem;
    max-height: 200px;
    overflow-y: auto;
}

.effect-option {
    aspect-ratio: 1;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.75rem;
    text-align: center;
    padding: 0.5rem;
    gap: 0.25rem;
    min-height: 44px;
}

.effect-option:hover {
    transform: translateY(-2px);
    border-color: var(--accent-primary);
    background: var(--glass-border);
}

.effect-option.active {
    background: var(--accent-gradient);
    color: white;
    border-color: var(--accent-primary);
}

.effect-icon {
    font-size: 1.5rem;
}

.frames-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 0.75rem;
    max-height: 150px;
    overflow-y: auto;
}

.frame-option {
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-height: 44px;
    min-width: 44px;
}

.frame-option:hover {
    transform: scale(1.05);
    border-color: var(--accent-primary);
}

.frame-option.active {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px var(--accent-primary);
}

.caption-input {
    width: 100%;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 1rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
}

.caption-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    background: var(--glass-border);
}

.caption-controls {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.font-select {
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    color: var(--text-primary);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
}

.color-picker {
    width: 3rem;
    height: 2.5rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    background: transparent;
}

.font-size-control {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.font-size-control label {
    font-size: 0.875rem;
    color: var(--text-muted);
}

.size-slider {
    width: 100%;
    height: 0.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
    outline: none;
    cursor: pointer;
}

.sticker-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
}

.checkbox-label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--accent-primary);
}

.stickers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 0.5rem;
    max-height: 150px;
    overflow-y: auto;
}

.sticker-option {
    aspect-ratio: 1;
    background: var(--bg-tertiary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.5rem;
    min-height: 44px;
    min-width: 44px;
    user-select: none;
}

.sticker-option:hover {
    transform: scale(1.1);
    background: var(--glass-border);
    border-color: var(--accent-primary);
}

.hidden {
    display: none;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: var(--accent-primary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--accent-secondary);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .main-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1.5rem;
    }
    
    .preview-section {
        order: 1;
    }
    
    .controls-section {
        order: 2;
        max-height: 60vh;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 1rem;
        gap: 1rem;
    }
    
    .canvas-container {
        padding: 1.5rem;
    }
    
    .camera-controls {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .layout-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .effect-categories {
        justify-content: center;
        gap: 0.25rem;
    }
    
    .category-btn {
        flex: 1;
        min-width: 0;
        font-size: 0.75rem;
        padding: 0.5rem;
    }
    
    .effects-grid {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        max-height: 160px;
    }
    
    .frames-grid {
        grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
        max-height: 120px;
    }
    
    .stickers-grid {
        grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
        max-height: 120px;
    }
    
    .brand-title {
        font-size: 1.25rem;
    }
    
    .countdown-number {
        font-size: 3rem;
    }
    
    .caption-controls {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .color-picker {
        width: 100%;
        height: 2.5rem;
    }
}

@media (max-width: 480px) {
    .main-content {
        padding: 0.75rem;
    }
    
    .canvas-container {
        padding: 1rem;
    }
    
    .controls-section {
        padding: 1rem;
        max-height: 50vh;
    }
    
    .brand-title {
        font-size: 1.125rem;
    }
    
    .countdown-number {
        font-size: 2.5rem;
    }
    
    .btn {
        padding: 0.625rem 0.75rem;
        font-size: 0.8rem;
    }
    
    .btn-large {
        padding: 0.875rem 1rem;
        font-size: 0.9rem;
    }
    
    .effect-categories {
        gap: 0.25rem;
    }
    
    .category-btn {
        font-size: 0.7rem;
        padding: 0.375rem 0.5rem;
    }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
    .btn, .effect-option, .frame-option, .sticker-option, .layout-option {
        min-height: 44px;
        min-width: 44px;
    }
    
    .category-btn {
        min-height: 44px;
        padding: 0.75rem 1rem;
    }
}

/* Animations */
@keyframes slideInUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.control-panel {
    animation: slideInUp 0.3s ease-out;
}

/* Loading states */
.loading {
    opacity: 0.6;
    pointer-events: none;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top: 2px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}
