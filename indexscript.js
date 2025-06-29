function createParticles() {
    const particles = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
    }
}
document.getElementById('room-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const room = document.getElementById('room').value.trim();
    const usernameInput = document.getElementById('username');
    const roomInput = document.getElementById('room');
    usernameInput.classList.remove('shake');
    roomInput.classList.remove('shake');
    if (!/^[A-Za-z]{3,}$/.test(username)) {
        usernameInput.classList.add('shake');
        usernameInput.focus();
        showError('Username must be at least 3 letters with no numbers or special characters');
        return;
    }
    if (!room || room.length < 2) {
        roomInput.classList.add('shake');
        roomInput.focus();
        showError('Room name must be at least 2 characters long');
        return;
    }
    if (username && room) {
        const btn = document.querySelector('.join-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        btn.disabled = true;
        setTimeout(() => {
            window.location.href = `/chat.html?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`;
        }, 1000);
    }
});
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
                background: rgba(255, 107, 107, 0.9);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                margin-top: 15px;
                font-weight: 500;
                animation: slideInUp 0.3s ease;
                border-left: 4px solid #ff4757;
            `;
    errorDiv.textContent = message;

    const form = document.getElementById('room-form');
    form.appendChild(errorDiv);

    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, 5000);
}
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.parentNode.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', function () {
        this.parentNode.style.transform = 'scale(1)';
    });
});

document.addEventListener('DOMContentLoaded', createParticles);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});