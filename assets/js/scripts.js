const initFormCode = (el) => {
    document.querySelectorAll('.form-code').forEach(el => {
        const inputs = el.querySelectorAll('.form-control');

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                // Allow only numeric input
                if (!/^\d$/.test(e.target.value)) {
                    e.target.value = '';
                    return;
                }

                // Move to the next input if current input is filled
                if (e.target.value && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                // Navigate back when pressing backspace on an empty field
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    inputs[index - 1].focus();
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    return false;
                }
            });

            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData('text').replace(/\D/g, ''); // digits only
                const chars = pasted.slice(0, inputs.length).split('');
                chars.forEach((char, i) => {
                    inputs[i].value = char;
                });
                if (chars.length === inputs.length) {
                    inputs[inputs.length - 1].focus();
                } else if (chars.length > 0) {
                    inputs[chars.length].focus();
                }
            });
        });

        function submitCode() {
            let code = '';
            inputs.forEach(input => code += input.value);

            if (code.length === 4) {
                alert('Code entered: ' + code);
            } else {
                alert('Please enter all 4 digits.');
            }
        }

        inputs[0].focus();
    });
};

//popup-trigger
const initPopup = () => {
    (() => {
        // Open popup
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('.open-popup');
            if (!trigger) return;

            const target =
                trigger.getAttribute('href') ||
                trigger.dataset.target;

            if (!target || !target.startsWith('#')) return;

            const overlay = document.querySelector(target);
            if (!overlay || !overlay.classList.contains('overlay')) return;

            e.preventDefault();
            openOverlay(overlay);
        });

        function openOverlay(overlay) {
            overlay.classList.add('is-open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(() => overlay.classList.add('is-animated'), 50);

            const firstInput = overlay.querySelector('input, button, textarea, select');
            if (firstInput) firstInput.focus();
        }

        function closeOverlay(overlay) {
            overlay.classList.remove('is-open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;

            const overlay = document.querySelector('.overlay.is-open');
            if (overlay) closeOverlay(overlay);
        });

        // Open popup if URL has hash
        window.addEventListener('load', () => {
            const overlay = document.querySelector(
                `.overlay${window.location.hash}`
            );
            if (overlay) openOverlay(overlay);
        });
    })();
}

const initPresentation = () => {
    const form = document.querySelector('.form-presentation');
    if (!form) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(el => el.remove());
        form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));

        form.querySelectorAll('.form-control[required]').forEach(input => {
            const value = input.value.trim();

            // Required validation
            if (!value) {
                showError(input, 'This field is required');
                isValid = false;
                return;
            }

            // Email validation
            if (input.id === 'email' && !emailRegex.test(value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        });

        if (!isValid) return;

        // ✅ Form is valid
        console.log('Form data:', Object.fromEntries(new FormData(form)));

        const popup = document.querySelector('.popup');
        popup.classList.add('is-open');
        setTimeout(() => popup.classList.add('is-animated'), 50);

        // Submit logic here (AJAX / fetch)
        // form.submit();
    });

    function showError(input, message) {
        input.classList.add('is-error');

        const error = document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;

        input.closest('.form-entry').appendChild(error);
    }
}

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    initFormCode();
    initPopup();
    initPresentation();
});