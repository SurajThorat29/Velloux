// --- UNIFIED PRELOADER & SCROLL-LOCK ENGINE ---
// --- SESSION-AWARE PRELOADER & SCROLL-LOCK ENGINE ---
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const video = document.getElementById("preloader-video");

    // Check if the user has already seen the intro animation in this browser session
    const hasSeenIntro = sessionStorage.getItem("velloux_intro_played");

    if (hasSeenIntro) {
        // --- CASE A: Returning User (SKIP VIDEO Entirely) ---
        if (preloader) {
            preloader.style.display = "none"; // Hard remove instantly
        }
        body.classList.remove("is-loading"); // Ensure scrolling is fully active
        return; // Halt further execution of the loader code
    }

    // --- CASE B: First Time Landing (PLAY VIDEO) ---
    // Force immediately lock scrolling when structural elements are ready
    body.classList.add("is-loading");

    const revealWebsite = () => {
        if (preloader && !preloader.classList.contains("fade-out")) {
            preloader.classList.add("fade-out");
            body.classList.remove("is-loading");
            
            // Mark session flag so it doesn't fire again on subpage navigation
            sessionStorage.setItem("velloux_intro_played", "true");
            
            // Clean up display entirely after CSS transition finishes
            setTimeout(() => {
                preloader.style.display = "none";
            }, 800); 
        }
    };

    if (video) {
        // Reveal precisely when your logo animation finishes playing
        video.addEventListener("ended", revealWebsite);

        // Fallback: Prevent getting trapped if asset paths fail or block
        window.addEventListener("load", () => {
            setTimeout(revealWebsite, 6900); 
        });
    } else {
        revealWebsite();
    }
});

// --- CUSTOM KINETIC CURSOR ENGINE ---
        const cursor = document.getElementById('custom-cursor');
        let cursorVisible = false;

        window.addEventListener('mousemove', (e) => {
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
            cursor.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 100, fill: "forwards" });
        });

        window.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorVisible = false;
        });

        document.querySelectorAll('a, button, .service-block, .portfolio-card, .why-card, .process-node, .testimonial-card, .faq-accordion-node, .accordion-trigger, .pulse-ring, .contact-card-node, .contact-form-vault').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '45px';
                cursor.style.height = '45px';
                cursor.style.backgroundColor = 'rgba(0, 242, 254, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'transparent';
            });
        });


        // --- ADVANCED NODE-GRID CANVAS ENGINE ---
        const canvas = document.getElementById('interactive-particle-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        const mouse = { x: null, y: null, radius: 140 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor(x, y) {
                this.x = x; this.y = y;
                this.baseX = x; this.baseY = y;
                this.size = Math.random() * 2 + 0.5;
                this.density = (Math.random() * 25) + 12;
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            update() {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 15;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 15;
                    }
                }
            }
        }

        function initParticles() {
            points = [];
            const count = Math.min(90, Math.floor(window.innerWidth / 14));
            for (let i = 0; i < count; i++) {
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                points.push(new Particle(x, y));
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < points.length; i++) {
                points[i].update();
                points[i].draw();
            }
            for (let a = 0; a < points.length; a++) {
                for (let b = a; b < points.length; b++) {
                    let dx = points[a].x - points[b].x;
                    let dy = points[a].y - points[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        let alpha = (1 - (dist / 110)) * 0.06;
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(points[a].x, points[a].y);
                        ctx.lineTo(points[b].x, points[b].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();


        // --- MOUSE TILT CONTROLLER ---
        const tiltCards = document.querySelectorAll('.service-block');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                const degX = (y / (rect.height / 2)) * -12;
                const degY = (x / (rect.width / 2)) * 12;
                card.style.transform = `rotateX(${degX}deg) rotateY(${degY}deg) translateY(-8px)`;
            });
            card.style.transformStyle = 'preserve-3d';
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });

        const heroMedia = document.getElementById('hero-media-tilt');
        if(heroMedia) {
            window.addEventListener('mousemove', (e) => {
                const x = (window.innerWidth / 2 - e.clientX) / 35;
                const y = (window.innerHeight / 2 - e.clientY) / 35;
                heroMedia.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
            });
        }


        // --- HIGH-PERFORMANCE INTERSECTION OBSERVER FOR SCROLL REVEALS ---
        const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -40px 0px" };
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, revealOptions);
        document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


        // --- SEO FAQ ENGINE ACCORDIONS ---
        document.querySelectorAll('.faq-trigger-btn').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const node = trigger.parentElement;
                const panel = trigger.nextElementSibling;
                const isActive = node.classList.contains('active');
                
                document.querySelectorAll('.faq-accordion-node').forEach(n => {
                    n.classList.remove('active');
                    n.querySelector('.faq-panel-content').style.maxHeight = null;
                });

                if (!isActive) {
                    node.classList.add('active');
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        });


        // --- SIDE ACCORDIONS (ABOUT SECTION) ---
        document.querySelectorAll('.accordion-trigger').forEach(trigger => {
            trigger.addEventListener('click', () => {
                const node = trigger.parentElement;
                const panel = trigger.nextElementSibling;
                const isActive = node.classList.contains('active');
                
                document.querySelectorAll('.accordion-node').forEach(n => {
                    n.classList.remove('active');
                    n.querySelector('.accordion-panel').style.maxHeight = null;
                });

                if (!isActive) {
                    node.classList.add('active');
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        });


        // --- MODAL SYSTEM CONTROLS ---
        /* ==========================================================================
   SECURE PIPELINE DATA TRANSMISSION & CUSTOM POP-UP DIALOGUE
   ========================================================================== */
const secureForm = document.getElementById('secure-project-pipeline');
const successModal = document.getElementById('form-success-modal');
const closePopupBtn = document.getElementById('close-popup-btn');

if (secureForm && successModal && closePopupBtn) {
    const submitBtn = secureForm.querySelector('button[type="submit"]');

    secureForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Lock down standard browser reload execution paths

        // Basic Front-End Email Structure Verification
        const emailInput = secureForm.querySelector('input[type="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert("Please provide a valid structural email address format.");
            return;
        }

        const formData = new FormData(secureForm);
        const originalText = submitBtn.textContent;

        // Visual handling of button during transmission runtime
        submitBtn.textContent = "SENDING...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Display the custom success pop-up modal directly on-screen
                successModal.classList.add('active');
                secureForm.reset(); // Safely clear out input data sets
            } else {
                alert("Transmission Rejected: " + data.message);
            }

        } catch (error) {
            alert("Critical Error: Network connection disrupted. Check your pipeline link.");
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Close Modal Trigger Listener Event
    closePopupBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Close Modal alternative options (clicking outside box overlay)
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}
