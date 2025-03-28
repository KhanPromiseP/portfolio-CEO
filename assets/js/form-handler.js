document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitSpinner = submitBtn.querySelector('.spinner-border');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form first
            if (!validateForm()) {
                return;
            }

            // Show loading state
            submitText.textContent = "Sending...";
            submitSpinner.classList.remove('d-none');
            submitBtn.disabled = true;

            try {
                // Save to localStorage (as backup)
                saveToLocalStorage(getFormData());

                // Submit to FormSubmit
                const response = await submitForm();

                if (response.ok) {
                    showAlert('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error("Error:", error);
                showAlert('Failed to send. Please try again later.', 'danger');
            } finally {
                // Reset button state
                submitText.textContent = "Send Message";
                submitSpinner.classList.add('d-none');
                submitBtn.disabled = false;
            }
        });
    }

    // Validate form fields
    function validateForm() {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.classList.remove('is-invalid');

            if (input.required && !input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            }

            if (input.type === 'email' && !isValidEmail(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            }

            if (input.id === 'message' && input.value.trim().length < 10) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });

        return isValid;
    }

    // Check valid email format
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Get form data as object
    function getFormData() {
        const formData = new FormData(contactForm);
        return Object.fromEntries(formData.entries());
    }

    // Save to localStorage (backup)
    function saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem('formSubmissions')) || [];
            data.timestamp = new Date().toISOString();
            submissions.push(data);
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
        } catch (error) {
            console.error("LocalStorage error:", error);
        }
    }

    // Submit form to FormSubmit
    async function submitForm() {
        const formData = new FormData(contactForm);
        return await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    // Show alert message
    function showAlert(message, type = 'success') {
        formAlert.textContent = message;
        formAlert.className = `alert alert-${type} mt-3`;
        formAlert.classList.remove('d-none');

        // Auto-hide after 5s
        setTimeout(() => {
            formAlert.classList.add('d-none');
        }, 5000);
    }
});