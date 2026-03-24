document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent page reload

      let isValid = true;

      // Get fields
      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const msgInput = document.getElementById('senderMsg');

      const nameGroup = document.getElementById('nameGroup');
      const emailGroup = document.getElementById('emailGroup');
      const msgGroup = document.getElementById('msgGroup');
      const successMsg = document.getElementById('formSuccess');

      // Reset errors
      nameGroup.classList.remove('invalid');
      emailGroup.classList.remove('invalid');
      msgGroup.classList.remove('invalid');
      successMsg.style.display = 'none';

      // Validate Name
      if (!nameInput.value.trim()) {
        nameGroup.classList.add('invalid');
        isValid = false;
      }

      // Validate Email (regex for valid email)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('invalid');
        isValid = false;
      }

      // Validate Message
      if (!msgInput.value.trim()) {
        msgGroup.classList.add('invalid');
        isValid = false;
      }

      // Submit successful
      if (isValid) {
        const btn = contactForm.querySelector('button');
        const origText = btn.innerHTML;
        btn.innerHTML = 'Encrypting & Sending...';
        btn.disabled = true;

        // Prepare the payload
        const payload = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: msgInput.value.trim(),
          _subject: "New Transmission from Portfolio!"
        };

        // Send via formsubmit.co
        fetch("https://formsubmit.co/ajax/mostafatasfiul@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(data => {
            // Success
            successMsg.innerHTML = '<span class="mono-text">&gt; Transmission Sent Successfully. Awaiting reply...</span><br><br><span style="color:var(--text-color); font-size: 0.85rem; font-family:var(--font-main);">IMPORTANT: If this is your very first time testing this form, FormSubmit has sent a one-time activation link to your email. You must check your inbox (or spam) and click "Activate Form" for emails to appear!</span>';
            successMsg.style.display = 'block';
            contactForm.reset();
            btn.innerHTML = origText;
            btn.disabled = false;
          })
          .catch(error => {
            console.error(error);
            btn.innerHTML = 'Error: Connection Failure';
            setTimeout(() => {
              btn.innerHTML = origText;
              btn.disabled = false;
            }, 3000);
          });
      }
    });

    // Clear validation error on input
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', function () {
        this.parentElement.classList.remove('invalid');
      });
    });
  }
});
