// Configuration
const CONFIG = {
    limits: {
        name: { min: 2, max: 50 },
        email: { max: 100 },
        subject: { min: 5, max: 100 },
        message: { min: 10, max: 500 }
    }
};

// Utility Functions
const sanitizeInput = (input) => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/[^\w\s@.,!?'-]/g, ''); // Allow only safe characters
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// DOM Elements
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const messageDiv = document.getElementById('messageDiv');

// Error Elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const subjectError = document.getElementById('subjectError');
const messageError = document.getElementById('messageError');

// Add character counters to subject and message fields
const addCharCounter = (input, errorElement, maxChars) => {
    const counter = document.createElement('div');
    counter.className = 'char-count';
    errorElement.parentNode.insertBefore(counter, errorElement.nextSibling);
    
    const updateCounter = () => {
        const length = input.value.length;
        counter.textContent = `${length}/${maxChars} characters`;
        counter.classList.toggle('over-limit', length > maxChars);
    };
    
    input.addEventListener('input', updateCounter);
    updateCounter();
};

// Initialize character counters
addCharCounter(subjectInput, subjectError, CONFIG.limits.subject.max);
addCharCounter(messageInput, messageError, CONFIG.limits.message.max);

// Validation Functions
const showError = (input, errorElement, message) => {
    errorElement.textContent = message;
    errorElement.classList.add('display');
    input.classList.add('input-error');
    input.classList.remove('input-valid');
    return false;
};

const showSuccess = (input, errorElement) => {
    errorElement.textContent = '';
    errorElement.classList.remove('display');
    input.classList.remove('input-error');
    input.classList.add('input-valid');
    return true;
};

const validateName = () => {
    const value = nameInput.value.trim();
    const { min, max } = CONFIG.limits.name;
    
    if (value === '') {
        return showError(nameInput, nameError, 'Name is required');
    }
    if (value.length < min) {
        return showError(nameInput, nameError, `Name must be at least ${min} characters`);
    }
    if (value.length > max) {
        return showError(nameInput, nameError, `Name must not exceed ${max} characters`);
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        return showError(nameInput, nameError, 'Name can only contain letters, spaces, hyphens, and apostrophes');
    }
    
    return showSuccess(nameInput, nameError);
};

const validateEmailField = () => {
    const value = emailInput.value.trim();
    const { max } = CONFIG.limits.email;
    
    if (value === '') {
        return showError(emailInput, emailError, 'Email is required');
    }
    if (!validateEmail(value)) {
        return showError(emailInput, emailError, 'Please enter a valid email address');
    }
    if (value.length > max) {
        return showError(emailInput, emailError, `Email must not exceed ${max} characters`);
    }
    
    return showSuccess(emailInput, emailError);
};

const validateSubject = () => {
    const value = subjectInput.value.trim();
    const { min, max } = CONFIG.limits.subject;
    
    if (value === '') {
        return showError(subjectInput, subjectError, 'Subject is required');
    }
    if (value.length < min) {
        return showError(subjectInput, subjectError, `Subject must be at least ${min} characters`);
    }
    if (value.length > max) {
        return showError(subjectInput, subjectError, `Subject must not exceed ${max} characters`);
    }
    
    return showSuccess(subjectInput, subjectError);
};

const validateMessage = () => {
    const value = messageInput.value.trim();
    const { min, max } = CONFIG.limits.message;
    
    if (value === '') {
        return showError(messageInput, messageError, 'Message is required');
    }
    if (value.length < min) {
        return showError(messageInput, messageError, `Message must be at least ${min} characters`);
    }
    if (value.length > max) {
        return showError(messageInput, messageError, `Message must not exceed ${max} characters`);
    }
    
    return showSuccess(messageInput, messageError);
};

// Real-time validation
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmailField);
subjectInput.addEventListener('blur', validateSubject);
messageInput.addEventListener('blur', validateMessage);

// Show feedback message
const showMessage = (message, type) => {
    messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
};

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmailField();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    
    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showMessage('Please fix the errors before submitting', 'error');
        return;
    }
    
    // Sanitize inputs
    const formData = {
        name: sanitizeInput(nameInput.value),
        email: sanitizeInput(emailInput.value),
        subject: sanitizeInput(subjectInput.value),
        message: sanitizeInput(messageInput.value)
    };
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    
    try {
        // EmailJS integration
        // Replace with your EmailJS service ID, template ID, and public key
        await emailjs.send(
            'service_i042pfg',
            'template_ehuccn3',
            formData,
            '9vLLVYFSMFFrwEmPq'
        );
        
        showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        
        // Remove validation classes
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            input.classList.remove('input-valid', 'input-error');
        });
        
        // Reset character counters
        document.querySelectorAll('.char-count').forEach(counter => {
            counter.textContent = counter.textContent.replace(/^\d+/, '0');
        });
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showMessage('Failed to send message. Please try again later.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// Prevent excessive character input
[subjectInput, messageInput].forEach(input => {
    const maxLength = input === subjectInput ? CONFIG.limits.subject.max : CONFIG.limits.message.max;
    
    input.addEventListener('input', (e) => {
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
        }
    });
});