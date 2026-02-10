(() => {
  const form = document.querySelector('.form-wrap form');
  if (!form) {
    return;
  }

  const formWrap = form.closest('.form-wrap');
  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const resetBtn = formWrap.querySelector('.form-reset');
  const successPanel = formWrap.querySelector('.form-success');
  const successHeading = formWrap.querySelector('.form-success h2');
  const liveRegion = formWrap.querySelector('#form-live-region');
  const firstInput = form.querySelector('input, select, textarea');
  const fieldsToValidate = Array.from(form.querySelectorAll('#fullName, #email, #reason, #message'));
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send enquiry';
  const statusDefault = status ? status.textContent.trim() : '';

  const announce = (message, politeness = 'polite') => {
    if (!liveRegion) return;
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 20);
  };

  const clearStatus = () => {
    if (!status) return;
    status.textContent = statusDefault;
    status.classList.remove('form-status--error', 'form-status--success');
    status.setAttribute('aria-live', 'polite');
  };

  const getFieldErrorMessage = (field) => {
    if (field.validity.valueMissing) {
      if (field.id === 'fullName') return 'Please enter your full name.';
      if (field.id === 'email') return 'Please enter your email address.';
      if (field.id === 'reason') return 'Please select a reason for enquiry.';
      if (field.id === 'message') return 'Please enter your message.';
    }

    if (field.id === 'email' && field.validity.typeMismatch) {
      return 'Please enter a valid email address.';
    }

    return 'Please check this field.';
  };

  const setFieldError = (field, message) => {
    const errorEl = document.getElementById(`${field.id}-error`);
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    }
  };

  const clearFieldError = (field) => {
    const errorEl = document.getElementById(`${field.id}-error`);
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
  };

  const validateField = (field) => {
    if (field.checkValidity()) {
      clearFieldError(field);
      return true;
    }
    setFieldError(field, getFieldErrorMessage(field));
    return false;
  };

  const clearAllFieldErrors = () => {
    fieldsToValidate.forEach(clearFieldError);
  };

  const validateFields = () => {
    let hasInvalid = false;
    let firstInvalid = null;

    fieldsToValidate.forEach((field) => {
      const valid = validateField(field);
      if (!valid) {
        hasInvalid = true;
        if (!firstInvalid) {
          firstInvalid = field;
        }
      }
    });

    return { hasInvalid, firstInvalid };
  };

  const showError = (message) => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('form-status--success');
    status.classList.add('form-status--error');
    status.setAttribute('aria-live', 'assertive');
    announce(message, 'assertive');
  };

  const showSuccess = (message) => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('form-status--error');
    status.classList.add('form-status--success');
    status.setAttribute('aria-live', 'polite');
    announce(message, 'polite');
  };

  fieldsToValidate.forEach((field) => {
    field.addEventListener('invalid', (event) => {
      event.preventDefault();
      validateField(field);
    });

    field.addEventListener('blur', () => {
      validateField(field);
    });

    field.addEventListener('change', () => {
      validateField(field);
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();
    clearAllFieldErrors();

    const validation = validateFields();
    if (validation.hasInvalid || !form.checkValidity()) {
      form.reportValidity();
      showError('Please correct the highlighted fields and try again.');
      if (validation.firstInvalid) {
        validation.firstInvalid.focus();
      }
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      showError('You appear to be offline. Please reconnect and try again, or email us directly.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    let didSucceed = false;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        let details = '';
        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length > 0) {
            details = data.errors.map((item) => item.message).join(' ');
          }
        } catch (parseError) {
          // Keep a generic fallback message when a detailed error is not available.
        }
        throw new Error(details || 'Form submission failed');
      }

      didSucceed = true;
      showSuccess('Thank you. Your enquiry has been sent successfully.');
      form.reset();
      clearAllFieldErrors();
      formWrap.classList.add('is-submitted');
      form.setAttribute('aria-hidden', 'true');
      if (successPanel) {
        successPanel.setAttribute('aria-hidden', 'false');
      }
      if (successHeading) {
        window.requestAnimationFrame(() => {
          successHeading.focus();
        });
      }
    } catch (error) {
      const hasServerMessage = error && error.message && error.message !== 'Form submission failed';
      const fallbackMessage = 'Sorry, something went wrong while sending your enquiry. Please try again or email us directly.';
      showError(hasServerMessage ? `Sorry, ${error.message}` : fallbackMessage);
    } finally {
      if (!didSucceed && submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearAllFieldErrors();
      formWrap.classList.remove('is-submitted');
      form.removeAttribute('aria-hidden');
      if (successPanel) {
        successPanel.setAttribute('aria-hidden', 'true');
      }
      clearStatus();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
      if (firstInput) {
        firstInput.focus();
      }
      announce('Form reset. You can send another enquiry.');
    });
  }
})();
