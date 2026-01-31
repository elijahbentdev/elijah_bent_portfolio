document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Configuration
    const particleColor = '#2CD4D9'; // Neon Teal
    const connectionColor = '157, 78, 221'; // Neon Purple (RGB for rgba usage)
    const particleSize = 2;
    const connectionDistance = 150;
    const speed = 0.5;

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * speed;
            this.vy = (Math.random() - 0.5) * speed;
            this.size = Math.random() * particleSize + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.shadowBlur = 10;
            ctx.shadowColor = particleColor;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset for lines
        }
    }

    function init() {
        resize();
        createParticles();
        animate();
    }

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        createParticles(); // Re-create on resize to adjust density
    }

    function createParticles() {
        particles = [];
        // Adjust density: 1 particle per 9000px² approx
        const density = window.innerWidth < 768 ? 40 : 80;
        const count = Math.floor((width * height) / 15000) + density; 
        
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    // Opacity based on distance
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(${connectionColor}, ${opacity * 0.5})`; 
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        // Debounce resize
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(resize, 100);
    });

    init();
});
