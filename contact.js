// Function to get translated error message
function getTranslatedMessage(fieldName) {
  // Check if translations are loaded
  if (window.currentLanguage && window.currentLanguage !== 'EN' && window.translations && window.translations[window.currentLanguage]) {
    const translationId = 'formError_' + fieldName;
    if (window.translations[window.currentLanguage][translationId]) {
      return window.translations[window.currentLanguage][translationId];
    }
  }
  
  // Fallback to hardcoded English messages
  const englishMessages = {
    firstName: 'First name must be at least 2 characters',
    lastName: 'Last name must be at least 2 characters',
    company: 'Company is required',
    position: 'Position is required',
    email: 'Please enter a valid email address',
    phone: 'Phone is required',
    website: 'Website is required',
    message: 'Message is required'
  };
  
  return englishMessages[fieldName] || 'Invalid field';
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  const errorFormMessage = document.getElementById('errorFormMessage');
  const messageTextarea = document.getElementById('message');
  const messageIcon = document.getElementById('messageIcon');

  // Function to update message icon position
  function updateMessageIconPosition() {
    if (messageTextarea && messageIcon) {
      const containerRect = messageTextarea.parentElement.getBoundingClientRect();
      const textareaRect = messageTextarea.getBoundingClientRect();
      
      // Calculate the vertical center of the textarea relative to its container
      const textareaHeight = textareaRect.height;
      const textareaTopInContainer = textareaRect.top - containerRect.top;
      const centerPosition = textareaTopInContainer + (textareaHeight / 2);
      
      messageIcon.style.top = centerPosition + 'px';
    }
  }

  // Update position on load
  setTimeout(updateMessageIconPosition, 0);
  
  // Use MutationObserver to detect changes in textarea height
  const resizeObserver = new ResizeObserver(() => {
    updateMessageIconPosition();
  });
  resizeObserver.observe(messageTextarea);
  
  // Also update on input
  messageTextarea.addEventListener('input', updateMessageIconPosition);
  window.addEventListener('resize', updateMessageIconPosition);

  // Track which fields have been edited
  const touchedFields = {};

  // Field configurations
  const fields = {
    firstName: {
      element: document.getElementById('firstName'),
      errorElement: document.getElementById('firstNameError'),
      iconElement: document.getElementById('firstNameIcon'),
      minLength: 2
    },
    lastName: {
      element: document.getElementById('lastName'),
      errorElement: document.getElementById('lastNameError'),
      iconElement: document.getElementById('lastNameIcon'),
      minLength: 2
    },
    company: {
      element: document.getElementById('company'),
      errorElement: document.getElementById('companyError'),
      iconElement: document.getElementById('companyIcon'),
      minLength: 1
    },
    position: {
      element: document.getElementById('position'),
      errorElement: document.getElementById('positionError'),
      iconElement: document.getElementById('positionIcon'),
      minLength: 1
    },
    email: {
      element: document.getElementById('email'),
      errorElement: document.getElementById('emailError'),
      iconElement: document.getElementById('emailIcon'),
      type: 'email'
    },
    phone: {
      element: document.getElementById('phone'),
      errorElement: document.getElementById('phoneError'),
      iconElement: document.getElementById('phoneIcon'),
      minLength: 1
    },
    website: {
      element: document.getElementById('website'),
      errorElement: document.getElementById('websiteError'),
      iconElement: document.getElementById('websiteIcon'),
      minLength: 1
    },
    message: {
      element: document.getElementById('message'),
      errorElement: document.getElementById('messageError'),
      iconElement: document.getElementById('messageIcon'),
      minLength: 1
    }
  };

  // Validation functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateField(fieldName, showError = false) {
    const field = fields[fieldName];
    const value = field.element.value.trim();

    let isValid = false;
    let errorMsg = getTranslatedMessage(fieldName);

    if (field.type === 'email') {
      if (value === '') {
        errorMsg = window.currentLanguage && window.currentLanguage !== 'EN' && window.translations && window.translations[window.currentLanguage] && window.translations[window.currentLanguage]['formError_email'] 
          ? window.translations[window.currentLanguage]['formError_email'] 
          : 'Email is required';
      } else if (!validateEmail(value)) {
        errorMsg = getTranslatedMessage('email');
      } else {
        isValid = true;
      }
    } else if (field.minLength) {
      if (value.length < field.minLength) {
        isValid = false;
      } else {
        isValid = true;
      }
    }

    // Update UI - only show error if field was touched or showError is true
    if (isValid) {
      field.errorElement.classList.remove('show');
      field.iconElement.classList.add('show');
    } else {
      if (touchedFields[fieldName] || showError) {
        field.errorElement.textContent = errorMsg;
        field.errorElement.classList.add('show');
      }
      field.iconElement.classList.remove('show');
    }

    return isValid;
  }

  function checkFormValidity() {
    let allValid = true;
    for (const fieldName in fields) {
      if (!validateField(fieldName, false)) {
        allValid = false;
      }
    }
    submitBtn.disabled = !allValid;
  }

  // Add event listeners to all fields
  for (const fieldName in fields) {
    fields[fieldName].element.addEventListener('input', () => {
      // Mark field as touched when user starts editing
      touchedFields[fieldName] = true;
      validateField(fieldName, false);
      checkFormValidity();
      
      // Update message icon position if resizing textarea
      if (fieldName === 'message') {
        updateMessageIconPosition();
      }
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields and show all errors
    let allValid = true;
    for (const fieldName in fields) {
      if (!validateField(fieldName, true)) {
        allValid = false;
      }
    }

    if (!allValid) {
      return;
    }

    // Prepare form data
    const formData = new FormData(form);

    try {
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        successMessage.classList.add('show');
        errorFormMessage.classList.remove('show');
        form.reset();

        // Reset validation UI and touched fields
        for (const fieldName in fields) {
          fields[fieldName].errorElement.classList.remove('show');
          fields[fieldName].iconElement.classList.remove('show');
          touchedFields[fieldName] = false;
        }
        submitBtn.disabled = true;
        
        // Reset message icon position
        updateMessageIconPosition();

        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 5000);
      } else {
        errorFormMessage.classList.add('show');
        successMessage.classList.remove('show');
      }
    } catch (error) {
      console.error('Error:', error);
      errorFormMessage.classList.add('show');
      successMessage.classList.remove('show');
    }
  });

  // Function to update displayed error messages when language changes
  window.updateContactFormErrorMessages = function() {
    for (const fieldName in fields) {
      const field = fields[fieldName];
      // If the error message is currently displayed, update it with the new translation
      if (field.errorElement.classList.contains('show')) {
        field.errorElement.textContent = getTranslatedMessage(fieldName);
      }
    }
  };
});
