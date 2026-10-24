/* ===================================
   Savannah Bites – script.js
   =================================== */

// ===== MENU FILTER (Show/Hide categories) =====
function filterMenu(category, btn) {
  const allCategories = document.querySelectorAll('.menu-category');
  const allBtns = document.querySelectorAll('.menu-filter-btn');

  // Update button states
  allBtns.forEach(b => {
    b.classList.remove('btn-warning', 'active');
    b.classList.add('btn-outline-warning');
  });
  btn.classList.remove('btn-outline-warning');
  btn.classList.add('btn-warning', 'active');

  // Show/hide sections
  allCategories.forEach(cat => {
    if (category === 'all') {
      cat.style.display = 'block';
    } else {
      cat.style.display = cat.id === 'cat-' + category ? 'block' : 'none';
    }
  });

  // Smooth scroll to the selected category
  if (category !== 'all') {
    const targetCat = document.getElementById('cat-' + category);
    if (targetCat) {
      targetCat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
window.addEventListener('scroll', function () {
  const nav = document.getElementById('mainNav');
  if (nav) {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(20,20,20,0.98)';
      nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      nav.style.background = 'rgba(20,20,20,0.95)';
      nav.style.boxShadow = 'none';
    }
  }
});

// ===== MODAL RESERVATION VALIDATION =====
function submitModalReservation() {
  const name = document.getElementById('modalName');
  const email = document.getElementById('modalEmail');
  const date = document.getElementById('modalDate');
  const guests = document.getElementById('modalGuests');

  let valid = true;

  // Reset border colours
  [name, email, date, guests].forEach(el => {
    if (el) el.style.borderColor = '';
  });

  if (!name || name.value.trim() === '') {
    alert('⚠️ Please enter your full name.');
    if (name) name.style.borderColor = '#dc3545';
    name.focus();
    return;
  }

  const emailVal = email ? email.value.trim() : '';
  if (emailVal === '') {
    alert('⚠️ Email is required.');
    if (email) email.style.borderColor = '#dc3545';
    email.focus();
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    alert('⚠️ Please enter a valid email address.');
    if (email) email.style.borderColor = '#dc3545';
    email.focus();
    return;
  }

  if (!date || date.value === '') {
    alert('⚠️ Please select a reservation date.');
    if (date) date.style.borderColor = '#dc3545';
    return;
  }

  if (!guests || guests.value === '') {
    alert('⚠️ Please select the number of guests.');
    if (guests) guests.style.borderColor = '#dc3545';
    return;
  }

  // All good — close modal and show success alert
  const modal = bootstrap.Modal.getInstance(document.getElementById('reserveModal'));
  if (modal) modal.hide();

  // Construct WhatsApp message for modal reservation
  const message = `*Quick Reservation Request*%0A%0A` +
    `👤 *Name:* ${name.value}%0A` +
    `📧 *Email:* ${email.value}%0A` +
    `👥 *Guests:* ${guests.value}%0A` +
    `📅 *Date:* ${date.value}%0A%0A` +
    `Please confirm this reservation. Thank you!`;

  // Open WhatsApp with the message
  const whatsappUrl = `https://wa.me/256702286577?text=${message}`;
  window.open(whatsappUrl, '_blank');

  // Clear fields
  if (name) name.value = '';
  if (email) email.value = '';
  if (date) date.value = '';
  if (guests) guests.value = '';

  // Show a toast or alert
  showSuccessToast(`🎉 Reservation request sent! We'll confirm via WhatsApp soon.`);
}

// ===== CONTACT PAGE RESERVATION FORM =====
function submitReservation() {
  const name = document.getElementById('resName');
  const email = document.getElementById('resEmail');
  const date = document.getElementById('resDate');
  const guests = document.getElementById('resGuests');

  // Reset states
  [name, email, date, guests].forEach(el => {
    if (el) {
      el.classList.remove('is-invalid', 'is-valid');
    }
  });

  let valid = true;

  if (!name || name.value.trim() === '') {
    markInvalid(name, 'nameError', 'Full name is required.');
    valid = false;
  } else {
    markValid(name);
  }

  const emailVal = email ? email.value.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailVal === '') {
    markInvalid(email, 'emailError', 'Email address is required.');
    valid = false;
  } else if (!emailRegex.test(emailVal)) {
    markInvalid(email, 'emailError', 'Please enter a valid email address (e.g. you@email.com).');
    valid = false;
  } else {
    markValid(email);
  }

  if (!date || date.value === '') {
    markInvalid(date, 'dateError', 'Please pick a reservation date.');
    valid = false;
  } else {
    markValid(date);
  }

  if (!guests || guests.value === '') {
    markInvalid(guests, 'guestsError', 'Please select the number of guests.');
    valid = false;
  } else {
    markValid(guests);
  }

  if (!valid) return;

  // Get form values
  const phone = document.getElementById('resPhone');
  const time = document.getElementById('resTime');
  const notes = document.getElementById('resNotes');

  // Construct WhatsApp message
  const message = `*New Reservation Request*%0A%0A` +
    `👤 *Name:* ${name.value}%0A` +
    `📧 *Email:* ${email.value}%0A` +
    `📱 *Phone:* ${phone ? phone.value : 'Not provided'}%0A` +
    `👥 *Guests:* ${guests.value}%0A` +
    `📅 *Date:* ${date.value}%0A` +
    `⏰ *Time:* ${time ? time.value : 'Not specified'}%0A` +
    `${notes && notes.value ? `📝 *Special Requests:* ${notes.value}%0A` : ''}%0A` +
    `Please confirm this reservation. Thank you!`;

  // Open WhatsApp with the message
  const whatsappUrl = `https://wa.me/256702286577?text=${message}`;
  window.open(whatsappUrl, '_blank');

  // Show success message
  const successAlert = document.getElementById('successAlert');
  const form = document.getElementById('reservationForm');

  if (successAlert) successAlert.classList.remove('d-none');
  if (form) {
    form.style.opacity = '0.4';
    form.style.pointerEvents = 'none';
  }

  // Scroll to alert
  if (successAlert) successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Reset after 5 seconds
  setTimeout(() => {
    if (successAlert) successAlert.classList.add('d-none');
    if (form) {
      form.style.opacity = '1';
      form.style.pointerEvents = '';
    }
    // Clear inputs
    [name, email, date, guests].forEach(el => {
      if (el) {
        el.value = '';
        el.classList.remove('is-valid', 'is-invalid');
      }
    });
    if (phone) phone.value = '';
    if (notes) notes.value = '';
    if (time) time.value = '';
  }, 6000);
}

function markInvalid(el, errId, message) {
  if (!el) return;
  el.classList.add('is-invalid');
  const errEl = document.getElementById(errId);
  if (errEl) {
    errEl.textContent = message;
    errEl.style.display = 'block';
  }
}

function markValid(el) {
  if (!el) return;
  el.classList.add('is-valid');
}

// ===== GALLERY LIGHTBOX =====
function openLightbox(el) {
  const img = el.querySelector('img');
  if (!img) return;

  const lightboxImg = document.getElementById('lightboxImg');
  if (lightboxImg) {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
  modal.show();
}

// ===== TOAST NOTIFICATION =====
function showSuccessToast(message) {
  // Create toast container if it doesn't exist
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;';
    document.body.appendChild(container);
  }

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-success border-0 show';
  toastEl.style.cssText = 'min-width:300px;margin-top:8px;box-shadow:0 8px 24px rgba(0,0,0,0.2);';
  toastEl.setAttribute('role', 'alert');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body fw-semibold">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.closest('.toast').remove()"></button>
    </div>
  `;
  container.appendChild(toastEl);

  setTimeout(() => {
    toastEl.remove();
  }, 5000);
}

// ===== GALLERY FILTER (Show/Hide gallery categories) =====
function filterGallery(category, btn) {
  const allCategories = document.querySelectorAll('.gallery-category');
  const allBtns = document.querySelectorAll('.gallery-filter-btn');

  // Update button states
  allBtns.forEach(b => {
    b.classList.remove('btn-warning', 'active');
    b.classList.add('btn-outline-warning');
  });
  btn.classList.remove('btn-outline-warning');
  btn.classList.add('btn-warning', 'active');

  // Show/hide sections
  allCategories.forEach(cat => {
    if (category === 'all') {
      cat.style.display = 'block';
    } else {
      cat.style.display = cat.id === 'cat-' + category ? 'block' : 'none';
    }
  });

  // Smooth scroll to the selected category
  if (category !== 'all') {
    const targetCat = document.getElementById('cat-' + category);
    if (targetCat) {
      targetCat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
