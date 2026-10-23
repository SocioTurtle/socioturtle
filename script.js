let currentStep = 0;
const roleData = {
  student: {
    eyebrow: "For Women Students",
    title: "Turn learning into visible proof of capability",
    summary: "Build a portfolio that goes beyond marksheets with projects, verified skills, and a clearer path to opportunity.",
    highlights: [
      "Create a credible project portfolio",
      "Earn verified proof of skills and progress",
      "Discover peers, mentors, and career direction"
    ],
    outcome: "Move from learning to employability with a profile that shows what you can actually do.",
    cta: "Register as a student"
  },
  educator: {
    eyebrow: "For Women Mentors & Educators",
    title: "Extend your impact beyond the classroom",
    summary: "Mentor learners in a more outcome-driven way by validating real work, tracking growth, and making your guidance visible.",
    highlights: [
      "Review portfolios instead of isolated scores",
      "Verify student skills with context and credibility",
      "Showcase mentorship impact across a wider community"
    ],
    outcome: "Become the bridge between learning, confidence, and career readiness.",
    cta: "Register as a mentor"
  },
  employer: {
    eyebrow: "For Employers",
    title: "Hire from evidence, not just resumes",
    summary: "Discover emerging women talent through demonstrated skills, educator validation, and project-based proof of potential.",
    highlights: [
      "Find candidates with visible, verified capabilities",
      "Reduce screening effort with stronger signal upfront",
      "Build an early pipeline through community engagement"
    ],
    outcome: "Reach talent earlier and make hiring decisions with more confidence.",
    cta: "Get early access to talent"
  }
};

window.onload = () => {
  switchRole("student");
};

document.addEventListener("click", event => {
  const roleButton = event.target.closest("[data-role-switch]");
  if (!roleButton) return;

  switchRole(roleButton.dataset.roleSwitch);
});

// These sections used to live on the home page as index.html#about etc.; keep shared and bookmarked links working.
const MOVED_SECTIONS = ["about", "gallery", "testimonials", "investors", "contact"];

document.addEventListener("DOMContentLoaded", function () {
  const hashTarget = window.location.hash.slice(1);

  if (MOVED_SECTIONS.includes(hashTarget)) {
    window.location.replace(`${hashTarget}.html`);
  }
});

function switchRole(role) {
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
            <span class="role-highlight-icon" aria-hidden="true"><i class="fas fa-check"></i></span>
            <span>${item}</span>
          </li>
        `).join("")}
      </ul>
      <p class="role-outcome">${data.outcome}</p>
      <a href="https://forms.gle/Q35893Xg42MVkgYC7" target="_blank" rel="noopener noreferrer" class="inline-block mt-6 bg-primary text-dark px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition">${data.cta}<span class="sr-only"> (opens in a new tab)</span></a>
    </div>
  `;

  document.querySelectorAll("[data-role-switch]").forEach(button => {
    const isActive = button.dataset.roleSwitch === role;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
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
    nodes.forEach(n => n.setAttribute("aria-pressed", String(n === node)));
  });

  node.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    node.click();
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
