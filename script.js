let currentStep = 0;
const roleData = {
  student: {
    eyebrow: "For Students",
    title: "Turn learning into visible proof of capability",
    summary: "Build a portfolio that goes beyond marksheets with projects, verified skills, and a clearer path to opportunity.",
    highlights: [
      "Create a credible project portfolio",
      "Earn verified proof of skills and progress",
      "Discover peers, mentors, and career direction"
    ],
    outcome: "Move from learning to employability with a profile that shows what you can actually do."
  },
  educator: {
    eyebrow: "For Educators",
    title: "Extend your impact beyond the classroom",
    summary: "Mentor learners in a more outcome-driven way by validating real work, tracking growth, and making your guidance visible.",
    highlights: [
      "Review portfolios instead of isolated scores",
      "Verify student skills with context and credibility",
      "Showcase mentorship impact across a wider community"
    ],
    outcome: "Become the bridge between learning, confidence, and career readiness."
  },
  employer: {
    eyebrow: "For Employers",
    title: "Hire from evidence, not just resumes",
    summary: "Discover emerging talent through demonstrated skills, educator validation, and project-based proof of potential.",
    highlights: [
      "Find candidates with visible, verified capabilities",
      "Reduce screening effort with stronger signal upfront",
      "Build an early pipeline through community engagement"
    ],
    outcome: "Reach talent earlier and make hiring decisions with more confidence."
  }
};

// default
window.onload = () => {
  const firstBtn = document.querySelector(".role-btn");
  switchRole("student", firstBtn);
  if (isMobile()) {
  document.querySelector('.qr-btn i').className = 'fas fa-download text-white text-xl';
}
};

document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("menu-toggle");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      document.getElementById("mobile-menu").classList.toggle("hidden");
    });
  }

  const targetPage = window.location.hash.slice(1);
  if (targetPage && document.getElementById(targetPage)?.classList.contains("page")) {
    showPage(targetPage);
  }
});

function showPage(pageId) {
  console.log("Navigating to:", pageId);

  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active-page");
  }

  document.getElementById("mobile-menu").classList.add("hidden");

  window.scrollTo(0, 0);
}

function goToEcosystem() {
  showPage("home");

  requestAnimationFrame(() => {
    const ecosystemSection = document.getElementById("ecosystem");

    if (ecosystemSection) {
      ecosystemSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function handleQRClick() {
  const appLink = "https://drive.google.com/file/d/1mgdjWcMFJZ6lZL--J8pxYVlhmP9PdM-P/view";

  if (isMobile()) {
    // Direct open on mobile
    window.location.href = appLink;
  } else {
    // Show QR on desktop
    toggleQR();
  }
}

function toggleQR() {
  document.getElementById("qrPopup").classList.toggle("hidden");
}

// Registration modal logic
const REGISTER_API_BASE = 'https://api.socioturtle.com';

let _prevActiveElement = null;
let _regOtpBusy = false;
let _regEmailVerifyToken = null;
let _regVerifiedEmail = null;

function handleRegisterClick() {
  openRegisterModal();
}

function openRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (!modal) return;
  _prevActiveElement = document.activeElement;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  const email = document.getElementById('regEmail');
  setTimeout(() => email && email.focus(), 50);

  // trap focus
  document.addEventListener('keydown', _modalKeyHandler);
}

function closeRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');

  document.removeEventListener('keydown', _modalKeyHandler);
  resetRegisterForm();
  if (_prevActiveElement && typeof _prevActiveElement.focus === 'function') _prevActiveElement.focus();
}

function _modalKeyHandler(e) {
  const modal = document.getElementById('registerModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeRegisterModal();
    return;
  }

  if (e.key === 'Tab') {
    // Basic focus trap
    const focusable = modal.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function setRegError(field, message) {
  const label = field.charAt(0).toUpperCase() + field.slice(1);
  const el = document.getElementById('reg' + label + 'Error');
  if (el) {
    el.textContent = message || '';
    el.classList.toggle('hidden', !message);
  }
}

function markEmailUnverified() {
  _regEmailVerifyToken = null;
  _regVerifiedEmail = null;
  document.getElementById('regEmailVerified').classList.add('hidden');
  document.getElementById('regStatus').textContent = '';
}

function sendRegOtp() {
  if (_regOtpBusy) return;

  const emailEl = document.getElementById('regEmail');
  const email = (emailEl.value || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setRegError('email', '');

  if (!email || !emailRegex.test(email)) {
    setRegError('email', 'Enter a valid email address.');
    return;
  }

  _regOtpBusy = true;
  const sendBtn = document.getElementById('regSendOtpBtn');
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending…';

  fetch(REGISTER_API_BASE + '/api/leads/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email }),
  })
    .then(response => response.json().then(body => ({ ok: response.ok, body: body })))
    .then(result => {
      if (!result.ok) {
        const detail = typeof (result.body && result.body.detail) === 'string'
          ? result.body.detail
          : 'Could not send a code. Please try again.';
        setRegError('email', detail);
        return;
      }
      markEmailUnverified();
      setRegError('otp', '');
      document.getElementById('regOtpRow').classList.remove('hidden');
      document.getElementById('regOtpHint').textContent = 'Code sent to ' + email + '. It expires in a few minutes.';
      document.getElementById('regStatus').textContent = 'Verification code sent — check your inbox.';
      document.getElementById('regOtpCode').focus();
    })
    .catch(() => {
      setRegError('email', 'Could not reach the server. Please check your connection and try again.');
    })
    .finally(() => {
      _regOtpBusy = false;
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send code';
    });
}

function verifyRegOtp() {
  if (_regOtpBusy) return;

  const emailEl = document.getElementById('regEmail');
  const codeEl = document.getElementById('regOtpCode');
  const email = (emailEl.value || '').trim();
  const code = (codeEl.value || '').trim();
  setRegError('otp', '');

  if (!code) {
    setRegError('otp', 'Enter the 6-digit code sent to your email.');
    return;
  }

  _regOtpBusy = true;
  const verifyBtn = document.getElementById('regVerifyOtpBtn');
  verifyBtn.disabled = true;
  verifyBtn.textContent = 'Verifying…';

  fetch(REGISTER_API_BASE + '/api/leads/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, code: code }),
  })
    .then(response => response.json().then(body => ({ ok: response.ok, body: body })))
    .then(result => {
      if (!result.ok) {
        const detail = typeof (result.body && result.body.detail) === 'string'
          ? result.body.detail
          : 'Incorrect code. Please try again.';
        setRegError('otp', detail);
        return;
      }
      _regEmailVerifyToken = result.body.verify_token;
      _regVerifiedEmail = email;
      document.getElementById('regEmailVerified').classList.remove('hidden');
      document.getElementById('regOtpRow').classList.add('hidden');
      codeEl.value = '';
      verifyBtn.textContent = 'Registering…';
      return completeRegistration(email);
    })
    .catch(() => {
      setRegError('otp', 'Could not reach the server. Please check your connection and try again.');
    })
    .finally(() => {
      _regOtpBusy = false;
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify';
    });
}

function completeRegistration(email) {
  // Verifying the code IS registering — no separate submit step needed.
  const alertBox = document.getElementById('regAlert');
  const status = document.getElementById('regStatus');
  alertBox.classList.add('hidden');
  status.textContent = '';

  return fetch(REGISTER_API_BASE + '/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      source: 'website',
      // Verifying an email through this flow is the only "opt in" step it
      // has — treat it as consent to hear from us. Every send carries an
      // unsubscribe link.
      newsletter_opt_in: true,
      email_verify_token: _regEmailVerifyToken,
    }),
  })
    .then(response => response.json().then(body => ({ ok: response.ok, body: body })))
    .then(result => {
      if (!result.ok) {
        const detail = typeof (result.body && result.body.detail) === 'string'
          ? result.body.detail
          : 'Something went wrong. Please try again.';
        alertBox.textContent = detail;
        alertBox.classList.remove('hidden');
        return;
      }
      status.innerHTML = 'All Set! You are registered 😊<br>Check your mail for access to Socioturtle Portal';
    })
    .catch(() => {
      alertBox.textContent = 'Could not reach the server. Please check your connection and try again.';
      alertBox.classList.remove('hidden');
    });
}

function resetRegisterForm() {
  const form = document.getElementById('registerForm');
  if (form) form.reset();

  markEmailUnverified();
  document.getElementById('regOtpRow').classList.add('hidden');
  document.getElementById('regOtpHint').textContent = '';
  ['email', 'otp'].forEach(f => setRegError(f, ''));

  const alertBox = document.getElementById('regAlert');
  if (alertBox) alertBox.classList.add('hidden');
  const status = document.getElementById('regStatus');
  if (status) status.textContent = '';
}

// One-time wiring — attached once so re-opening the modal doesn't stack duplicate listeners.
(function initRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (!modal) return;

  modal.querySelectorAll('[data-dismiss="modal"], .modal-close').forEach(el => {
    el.addEventListener('click', closeRegisterModal);
  });

  document.getElementById('regEmail').addEventListener('input', () => {
    const current = document.getElementById('regEmail').value.trim();
    if (_regVerifiedEmail && current !== _regVerifiedEmail) markEmailUnverified();
  });

  document.getElementById('regSendOtpBtn').addEventListener('click', sendRegOtp);
  document.getElementById('regVerifyOtpBtn').addEventListener('click', verifyRegOtp);
})();

function switchRole(role, el = null) {
  const container = document.getElementById("roleContent");
  const data = roleData[role];
  container.className = `role-card role-card-${role}`;

  container.innerHTML = `
    <div class="role-card-inner">
      <p class="role-eyebrow">${data.eyebrow}</p>
      <h3 class="role-title">${data.title}</h3>
      <p class="role-summary">${data.summary}</p>
      <div class="role-divider"></div>
      <ul class="role-highlights">
        ${data.highlights.map(item => `
          <li class="role-highlight-item">
            <span class="role-highlight-icon"><i class="fas fa-check"></i></span>
            <span>${item}</span>
          </li>
        `).join("")}
      </ul>
      <p class="role-outcome">${data.outcome}</p>
    </div>
  `;

  document.querySelectorAll(".role-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  if (el) {
    el.classList.add("active");
  }
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in, .stagger").forEach(el => {
  observer.observe(el);
});

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const update = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;

    const increment = target / 50;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(update, 30);
    } else {
      counter.innerText = target;
    }
  };

  update();
});

const observerFlow = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".fade-in").forEach(el => observerFlow.observe(el));

// flow start
const wrapper = document.querySelector(".eco-wrapper");
const nodes = document.querySelectorAll(".eco-node");
const lines = document.querySelectorAll(".line");

// default open (student)
let activeNode = document.querySelector('[data-role="student"]');
activeNode.classList.add("expanded");
wrapper.classList.add("student-active");

nodes.forEach(node => {
  const role = node.dataset.role;

  node.addEventListener("click", e => {
    e.stopPropagation();
    delete wrapper.dataset.activeConnection;

    nodes.forEach(n => n.classList.remove("expanded"));
    wrapper.classList.remove("student-active", "educator-active", "employer-active");

    node.classList.add("expanded");
    wrapper.classList.add(`${role}-active`);

    activeNode = node;
  });

  node.addEventListener("mouseenter", () => {
    delete wrapper.dataset.activeConnection;
    wrapper.classList.add(`${role}-active`);
  });

  node.addEventListener("mouseleave", () => {
    wrapper.classList.remove(`${role}-active`);
    wrapper.classList.add(`${activeNode.dataset.role}-active`);
  });
});

lines.forEach(line => {
  const connection = line.dataset.connection;

  line.addEventListener("mouseenter", () => {
    wrapper.dataset.activeConnection = connection;
  });

  line.addEventListener("mouseleave", () => {
    delete wrapper.dataset.activeConnection;
  });
});

document.addEventListener("click", () => {
  nodes.forEach(n => n.classList.remove("expanded"));
  wrapper.classList.remove("student-active", "educator-active", "employer-active");
  delete wrapper.dataset.activeConnection;

  activeNode.classList.add("expanded");
  wrapper.classList.add(`${activeNode.dataset.role}-active`);
});
// flow end
