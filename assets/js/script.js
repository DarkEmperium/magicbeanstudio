const yearSpan = document.querySelector("#currentYear");
const currentYear = new Date();
yearSpan.innerHTML = currentYear.getFullYear();

var swiper = new Swiper(".home-slider", {
  speed: 1500,
  spaceBetween: 0,
  centeredSlides: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
    stopOnLast: true,
  },
  loop: true,
});

const startCounting = () => {
  const counters = document.querySelectorAll(".counter");
  const duration = 2500;

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const startTime = performance.now();
    let lastValue = -1;

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = progress * (2 - progress); 
      const currentValue = Math.floor(easedProgress * target);

      if (currentValue !== lastValue) {
        counter.innerText = currentValue;
        lastValue = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target; 
      }
    };

    requestAnimationFrame(updateCount);
  });
};

const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      startCounting();
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const statsSection = document.querySelector("#stats");
if (statsSection) observer.observe(statsSection);

const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

function showTab(evt, tabId) {
  const panels = document.querySelectorAll(".service-panel");
  const navItems = document.querySelectorAll(".nav-item");

  panels.forEach((p) => p.classList.remove("active"));
  navItems.forEach((n) => n.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    // Safety check in case this script runs on pages without the form
    if(contactForm) {
        const deviceSelect = document.querySelector('select[name="device_category"]');
        const serviceSelect = document.querySelector('#service_selection');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const toast = document.getElementById('custom-toast');
        const toastMsg = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');

        function showNotification(message, type = 'success') {
            toastMsg.textContent = message;
            toast.className = 'custom-toast show'; 
            
            if (type === 'success') {
                toast.classList.add('toast-success');
                toastIcon.className = 'bx bx-check-circle';
            } else {
                toast.classList.add('toast-error');
                toastIcon.className = 'bx bx-error-circle';
            }

            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }

        const allServiceOptions = Array.from(serviceSelect.options);
        const mapping = {
            'drone': ['drone', 'sales', 'trade', 'recycle'],
            'pc': ['computer', 'setup', 'sales', 'trade', 'recycle'],
            'laptop': ['computer', 'setup', 'sales', 'trade', 'recycle'],
            'other': ['sales', 'trade', 'recycle']
        };

        function updateServiceOptions() {
            const selectedCategory = deviceSelect.value;
            const allowedValues = mapping[selectedCategory] || [];
            serviceSelect.innerHTML = '';

            if (selectedCategory === "") {
                const placeholder = document.createElement('option');
                placeholder.value = "";
                placeholder.textContent = "Please Choose Device Category";
                serviceSelect.appendChild(placeholder);
                serviceSelect.disabled = true;
            } else {
                serviceSelect.disabled = false;
                serviceSelect.appendChild(allServiceOptions[0]); 
                allServiceOptions.forEach(option => {
                    if (allowedValues.includes(option.value)) {
                        serviceSelect.appendChild(option.cloneNode(true));
                    }
                });
            }
            serviceSelect.selectedIndex = 0;
        }

        deviceSelect.addEventListener('change', updateServiceOptions);
        updateServiceOptions();
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBtn.disabled = true;
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                if (response.status == 200) {
                    showNotification("Ticket Submitted Successfully", "success");
                    contactForm.reset(); 
                    updateServiceOptions(); 
                } else {
                    showNotification("Submission Failed", "error");
                }
            })
            .catch(() => {
                showNotification("Connection Error Detected", "error");
            })
            .finally(() => {
                submitBtn.disabled = false;
            });
        });
    }
});

// --- ADDED: GSAP Scroll Reveal Animations ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener("DOMContentLoaded", () => {
    // Hide elements initially
    gsap.set(".reveal-left", { x: -60, opacity: 0, visibility: "hidden" });
    gsap.set(".reveal-right", { x: 60, opacity: 0, visibility: "hidden" });
    gsap.set(".reveal-up", { y: 40, opacity: 0, visibility: "hidden" });
    gsap.set(".reveal-zoom", { scale: 0.8, opacity: 0, visibility: "hidden" });
    gsap.set(".reveal-item", { scale: 0.5, opacity: 0, y: 30, visibility: "hidden" });

    // Animate Left/Right Panels
    const experienceElements = document.querySelectorAll(".reveal-left, .reveal-right");
    experienceElements.forEach((el) => {
      gsap.to(el, {
        x: 0,
        opacity: 1,
        visibility: "visible",
        duration: 1,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });

    // Stagger Items (Cards)
    const staggerWrappers = document.querySelectorAll(".services-card-wrapper, .reveal-stagger-container");
    staggerWrappers.forEach((wrapper) => {
      const items = wrapper.querySelectorAll(".reveal-item");
      if (items.length > 0) {
        gsap.to(items, {
          scale: 1,
          opacity: 1,
          y: 0,
          visibility: "visible",
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          force3D: true,
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%",
            once: true,
          },
          onComplete: function () {
            gsap.set(items, { clearProps: "transform, scale" });
          },
        });
      }
    });

    // Review / Zoom animations
    gsap.to(".reveal-zoom", {
      scale: 1,
      opacity: 1,
      visibility: "visible",
      duration: 1.2,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: ".review-container",
        start: "top 80%",
        once: true,
      },
    });

    // General Upward fade
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        visibility: "visible",
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    });
  });
}