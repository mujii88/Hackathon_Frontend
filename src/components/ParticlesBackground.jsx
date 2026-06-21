import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let particles = [];
        const numParticles = 250; // More particles for a denser effect

        let mouse = {
            x: null,
            y: null,
            radius: 150
        };

        const colors = [
            '#4285F4', // Google Blue
            '#EA4335', // Google Red
            '#FBBC05', // Google Yellow
            '#34A853', // Google Green
            '#A066FF'  // Gemini Purple
        ];

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        class Particle {
            constructor() {
                this.reset();
                // Randomize initial distance so they don't all spawn at center at once
                this.distance = Math.random() * (canvas.width / 2);
            }

            reset() {
                this.angle = Math.random() * Math.PI * 2;
                this.distance = Math.random() * 50; // Start near center
                this.speed = (Math.random() * 2) + 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.length = (Math.random() * 10) + 5;
                this.thickness = (Math.random() * 1.5) + 0.5;
                this.opacity = Math.random() * 0.8 + 0.2;
                
                // Repel properties
                this.vx = 0;
                this.vy = 0;
            }

            update() {
                // Move outward
                this.distance += this.speed;
                this.speed *= 1.02; // Accelerate outwards

                // Calculate base position
                let cx = canvas.width / 2;
                let cy = canvas.height / 2;

                let targetX = cx + Math.cos(this.angle) * this.distance;
                let targetY = cy + Math.sin(this.angle) * this.distance;

                // Apply mouse repel
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - targetX;
                    let dy = mouse.y - targetY;
                    let distToMouse = Math.sqrt(dx * dx + dy * dy);

                    if (distToMouse < mouse.radius) {
                        let force = (mouse.radius - distToMouse) / mouse.radius;
                        this.vx -= (dx / distToMouse) * force * 2;
                        this.vy -= (dy / distToMouse) * force * 2;
                    }
                }

                // Friction
                this.vx *= 0.9;
                this.vy *= 0.9;

                this.x = targetX + this.vx;
                this.y = targetY + this.vy;

                // Calculate tail (for motion blur effect)
                // The tail points towards the center (or opposite to movement)
                let moveDirX = Math.cos(this.angle) * this.speed + this.vx;
                let moveDirY = Math.sin(this.angle) * this.speed + this.vy;
                
                // Normalize and multiply by length
                let moveDist = Math.sqrt(moveDirX * moveDirX + moveDirY * moveDirY);
                if (moveDist > 0) {
                    this.tailX = this.x - (moveDirX / moveDist) * this.length;
                    this.tailY = this.y - (moveDirY / moveDist) * this.length;
                } else {
                    this.tailX = this.x;
                    this.tailY = this.y;
                }

                // If particle goes off screen, reset it
                if (this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
                    this.reset();
                }

                this.draw();
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.tailX, this.tailY);
                ctx.lineTo(this.x, this.y);
                
                // Use hex with opacity
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.lineWidth = this.thickness;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            // Small trailing effect for blur
            ctx.fillStyle = 'rgba(5, 5, 7, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
        };

        handleResize();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%', background: 'transparent' }}
        />
    );
};

export default ParticlesBackground;
