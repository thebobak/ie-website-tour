        /**
         * Website Redesign Tour App
         * This self-contained script handles styling, logic, and DOM injection.
         * Drop this into your CMS <head> or <footer>.
         */
        (function() {
            // Configuration
            const CONFIG = {
                storageKey: 'has_seen_redesign_tour_v1', // Change v1 to v2 if you ever want to force-show it again
                brandColor: '#144745',
                fontFamily: "'Lato', sans-serif",
                zIndex: 999999
            };

            // ePrivacy / GDPR Note: 
            // Storing a simple boolean flag in localStorage to remember a user's UI preference 
            // (like dismissing a modal) is generally classified as "strictly necessary" functionality 
            // and does not require explicit cookie banner consent.

            // 1. Check if the user has already seen the tour
            if (localStorage.getItem(CONFIG.storageKey) === 'true') {
                return; // Exit silently
            }

            // 2. Slide Data
            const slides = [
                {
                    title: "Welcome to Our New Look!",
                    text: "We've completely redesigned our website to provide you with a faster, cleaner, and more intuitive experience. Let's take a quick look around.",
                    // Using inline SVG for media so it works anywhere without external image dependencies
                    media: `<svg class="w-full h-full text-[#144745] opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2zm0 2.83l5.5 5.5V18h-2v-6H8.5v6h-2v-7.67L12 4.83z"/></svg>`
                },
                {
                    title: "Simplified Navigation",
                    text: "Finding what you need is now easier than ever. We've streamlined our menus so you can access your favorite tools in fewer clicks.",
                    media: `<svg class="w-full h-full text-[#144745] opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`
                },
                {
                    title: "Mobile Optimized",
                    text: "Whether you're on a desktop, tablet, or phone, our new design adapts perfectly to give you the best viewing experience on any device.",
                    media: `<svg class="w-full h-full text-[#144745] opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`
                }
            ];

            let currentStep = 0;

            // 3. Inject CSS
            function injectStyles() {
                const styleId = 'redesign-tour-styles';
                if (document.getElementById(styleId)) return;

                const css = `
                    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
                    
                    #redesign-tour-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: ${CONFIG.zIndex};
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.4s ease, visibility 0.4s ease;
                        font-family: ${CONFIG.fontFamily};
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    
                    #redesign-tour-overlay.tour-active {
                        opacity: 1;
                        visibility: visible;
                    }

                    #redesign-tour-modal {
                        background: #ffffff;
                        width: 100%;
                        max-width: 500px;
                        border-radius: 12px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        overflow: hidden;
                        transform: translateY(20px) scale(0.95);
                        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                        display: flex;
                        flex-direction: column;
                    }

                    #redesign-tour-overlay.tour-active #redesign-tour-modal {
                        transform: translateY(0) scale(1);
                    }

                    .tour-header {
                        position: relative;
                        padding: 16px;
                    }

                    .tour-close-btn {
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        background: none;
                        border: none;
                        color: #9ca3af;
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: color 0.2s, background 0.2s;
                    }

                    .tour-close-btn:hover {
                        color: #4b5563;
                        background: #f3f4f6;
                    }

                    .tour-close-btn svg { width: 24px; height: 24px; }

                    .tour-media-container {
                        height: 200px;
                        background: #f8fafc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 32px;
                        border-bottom: 1px solid #f1f5f9;
                    }

                    .tour-media-container img, .tour-media-container svg {
                        max-height: 100%;
                        max-width: 100%;
                        object-fit: contain;
                    }

                    .tour-body {
                        padding: 32px 24px 24px;
                        text-align: center;
                    }

                    .tour-title {
                        margin: 0 0 12px;
                        font-size: 24px;
                        font-weight: 700;
                        color: #1f2937;
                        line-height: 1.3;
                    }

                    .tour-text {
                        margin: 0;
                        font-size: 15px;
                        color: #4b5563;
                        line-height: 1.6;
                    }

                    .tour-footer {
                        padding: 16px 24px 24px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .tour-dots {
                        display: flex;
                        gap: 8px;
                    }

                    .tour-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #e5e7eb;
                        transition: background 0.3s ease, width 0.3s ease;
                    }

                    .tour-dot.active {
                        background: ${CONFIG.brandColor};
                        width: 24px;
                        border-radius: 4px;
                    }

                    .tour-actions {
                        display: flex;
                        gap: 12px;
                    }

                    .tour-btn {
                        padding: 10px 20px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;
                        font-family: inherit;
                        transition: all 0.2s;
                        border: none;
                    }

                    .tour-btn-secondary {
                        background: transparent;
                        color: #6b7280;
                    }

                    .tour-btn-secondary:hover {
                        background: #f3f4f6;
                        color: #1f2937;
                    }
                    
                    .tour-btn-secondary:disabled {
                        opacity: 0;
                        pointer-events: none;
                    }

                    .tour-btn-primary {
                        background: ${CONFIG.brandColor};
                        color: #ffffff;
                    }

                    .tour-btn-primary:hover {
                        opacity: 0.9;
                        transform: translateY(-1px);
                    }
                `;
                
                const styleEl = document.createElement('style');
                styleEl.id = styleId;
                styleEl.innerHTML = css;
                document.head.appendChild(styleEl);
            }

            // 4. Render HTML Structure
            function renderModal() {
                const existing = document.getElementById('redesign-tour-overlay');
                if (existing) existing.remove();

                const overlay = document.createElement('div');
                overlay.id = 'redesign-tour-overlay';
                
                overlay.innerHTML = `
                    <div id="redesign-tour-modal" role="dialog" aria-modal="true" aria-labelledby="tour-title">
                        <div class="tour-header">
                            <button class="tour-close-btn" aria-label="Close tour">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="tour-media-container" id="tour-media"></div>
                        <div class="tour-body">
                            <h2 class="tour-title" id="tour-title"></h2>
                            <p class="tour-text" id="tour-text"></p>
                        </div>
                        <div class="tour-footer">
                            <div class="tour-dots" id="tour-dots"></div>
                            <div class="tour-actions">
                                <button class="tour-btn tour-btn-secondary" id="tour-prev">Back</button>
                                <button class="tour-btn tour-btn-primary" id="tour-next">Next</button>
                            </div>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                // Attach Event Listeners
                overlay.querySelector('.tour-close-btn').addEventListener('click', dismissTour);
                overlay.querySelector('#tour-prev').addEventListener('click', prevStep);
                overlay.querySelector('#tour-next').addEventListener('click', nextStep);
                
                // Allow clicking outside to close
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) dismissTour();
                });
            }

            // 5. Update content based on current step
            function updateStep() {
                const slide = slides[currentStep];
                
                // Update text & media
                document.getElementById('tour-title').innerText = slide.title;
                document.getElementById('tour-text').innerText = slide.text;
                document.getElementById('tour-media').innerHTML = slide.media;

                // Update dots
                const dotsContainer = document.getElementById('tour-dots');
                dotsContainer.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.className = `tour-dot ${index === currentStep ? 'active' : ''}`;
                    dotsContainer.appendChild(dot);
                });

                // Update buttons
                const prevBtn = document.getElementById('tour-prev');
                const nextBtn = document.getElementById('tour-next');

                prevBtn.disabled = currentStep === 0;
                
                if (currentStep === slides.length - 1) {
                    nextBtn.innerText = "Got it!";
                } else {
                    nextBtn.innerText = "Next";
                }
            }

            // 6. Navigation Logic
            function nextStep() {
                if (currentStep < slides.length - 1) {
                    currentStep++;
                    updateStep();
                } else {
                    dismissTour();
                }
            }

            function prevStep() {
                if (currentStep > 0) {
                    currentStep--;
                    updateStep();
                }
            }

            function dismissTour() {
                // Mark as seen in local storage
                localStorage.setItem(CONFIG.storageKey, 'true');
                
                // Animate out
                const overlay = document.getElementById('redesign-tour-overlay');
                overlay.classList.remove('tour-active');
                
                // Remove from DOM after animation completes
                setTimeout(() => {
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 400);
            }

            // 7. Initialize
            function init() {
                injectStyles();
                renderModal();
                updateStep();
                
                // Trigger animation slightly after DOM insertion for CSS transition to catch
                setTimeout(() => {
                    document.getElementById('redesign-tour-overlay').classList.add('tour-active');
                }, 50);
            }

            // Wait for DOM to be ready regardless of where script is placed
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
