document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const formAlert = document.getElementById('formAlert');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitSpinner = submitBtn.querySelector('.spinner-border');
    const FORM_SUBMISSIONS_KEY = 'formSubmissionsBackup';

    // Enhanced submit handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        setLoadingState(true);

        try {
            const formData = getFormData();
            saveToLocalStorage(formData);

            // 1. Try FormSubmit first
            let response = await submitToFormSubmit(formData);

            // 2. Fallback to emailJS if FormSubmit fails
            if (!response.ok) {
                response = await submitToEmailJS(formData);
            }

            if (response.ok) {
                showAlert('Message sent successfully!', 'success');
                contactForm.reset();
                clearSuccessfulSubmissions(); // Cleanup localStorage
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            console.error("Submission Error:", error);
            showAlert('Failed to send. Saved offline - we\'ll submit when you\'re back online.', 'warning');
            trackFailedSubmission();
        } finally {
            setLoadingState(false);
        }
    });

    // ======================
    // IMPROVED CORE FUNCTIONS
    // ======================

    function setLoadingState(isLoading) {
        submitBtn.disabled = isLoading;
        submitText.textContent = isLoading ? "Sending..." : "Send Message";
        submitSpinner.classList.toggle('d-none', !isLoading);
    }

    function validateForm() {
        let isValid = true;
        const inputs = contactForm.querySelectorAll('[required]');

        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');

            // Enhanced validation
            if (input.required && !input.value.trim()) {
                markInvalid(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                markInvalid(input, 'Please enter a valid email');
                isValid = false;
            } else if (input.id === 'message' && input.value.trim().length < 10) {
                markInvalid(input, 'Message must be at least 10 characters');
                isValid = false;
            } else {
                input.classList.add('is-valid');
            }
        });

        return isValid;
    }

    function markInvalid(element, message) {
        element.classList.add('is-invalid');
        const feedback = element.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function getFormData() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.pageUrl = window.location.href;
        return data;
    }

    // ======================
    // SUBMISSION METHODS
    // ======================

    async function submitToFormSubmit(formData) {
        const formSubmitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formSubmitData.append(key, value);
        });

        return await fetch(contactForm.action, {
            method: 'POST',
            body: formSubmitData,
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    async function submitToEmailJS(formData) {
        // Fallback service configuration
        if (typeof emailjs === 'undefined') {
            throw new Error('No fallback service available');
        }

        return await emailjs.send(
            'service_id',
            'template_id',
            formData,
            'user_id'
        );
    }

    // ======================
    // OFFLINE HANDLING
    // ======================

    function saveToLocalStorage(data) {
        try {
            const submissions = JSON.parse(localStorage.getItem(FORM_SUBMISSIONS_KEY)) || [];
            submissions.push(data);
            localStorage.setItem(FORM_SUBMISSIONS_KEY, JSON.stringify(submissions));
        } catch (error) {
            console.error("LocalStorage Error:", error);
        }
    }

    function clearSuccessfulSubmissions() {
        try {
            const submissions = JSON.parse(localStorage.getItem(FORM_SUBMISSIONS_KEY)) || [];
            const failedSubmissions = submissions.filter(sub => !sub.success);
            localStorage.setItem(FORM_SUBMISSIONS_KEY, JSON.stringify(failedSubmissions));
        } catch (error) {
            console.error("Cleanup Error:", error);
        }
    }

    function trackFailedSubmission() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('failedFormSubmission');
            });
        }
    }

    // ======================
    // USER FEEDBACK
    // ======================

    function showAlert(message, type = 'success') {
        formAlert.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // Auto-dismiss after 5s
        setTimeout(() => {
            const alert = formAlert.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }

    // ======================
    // RETRY FAILED SUBMISSIONS
    // ======================

    function retryFailedSubmissions() {
        if (!navigator.onLine) return;

        const submissions = JSON.parse(localStorage.getItem(FORM_SUBMISSIONS_KEY)) || [];
        submissions.forEach(async (submission) => {
            if (!submission.success) {
                try {
                    const response = await submitToFormSubmit(submission);
                    if (response.ok) {
                        submission.success = true;
                    }
                } catch (error) {
                    console.error("Retry failed:", error);
                }
            }
        });

        localStorage.setItem(FORM_SUBMISSIONS_KEY, JSON.stringify(submissions));
    }

    // Check for failed submissions on load
    window.addEventListener('online', retryFailedSubmissions);
    retryFailedSubmissions();
});