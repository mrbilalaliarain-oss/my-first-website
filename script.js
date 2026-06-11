document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE NAVIGATION MENU
       ========================================================================== */
    const hamburgerToggle = document.getElementById('hamburger-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburgerToggle.addEventListener('click', () => {
        hamburgerToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ==========================================================================
       SCROLL INTERACTIONS (STICKY HEADER, SCROLL PROGRESS, SCROLL SPY)
       ========================================================================== */
    const mainHeader = document.getElementById('main-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 1. Sticky Header
        if (scrollTop > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // 2. Scroll Progress Bar
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // 3. Scroll Spy (Active nav link)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for navbar height
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* ==========================================================================
       INTERACTIVE MENU FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItemCards = document.querySelectorAll('.menu-item-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and add to clicked
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuItemCards.forEach(card => {
                // Apply fade out transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger reflow to apply transition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        scrollObserver.observe(element);
    });

    /* ==========================================================================
       ORDER PLACING SIMULATION (ADD-TO-ORDER)
       ========================================================================== */
    const addToOrderButtons = document.querySelectorAll('.add-to-order-btn');
    const orderModal = document.getElementById('order-modal');
    const orderModalCloseBtn = document.getElementById('order-modal-close-btn');
    const orderOkBtn = document.getElementById('order-ok-btn');

    addToOrderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Open simple order confirmation modal
            orderModal.classList.add('open');
        });
    });

    // Close order modal
    const closeOrderModal = () => {
        orderModal.classList.remove('open');
    };

    orderModalCloseBtn.addEventListener('click', closeOrderModal);
    orderOkBtn.addEventListener('click', closeOrderModal);
    orderModal.addEventListener('click', (e) => {
        if (e.target === orderModal) closeOrderModal();
    });

    /* ==========================================================================
       RESERVATION FORM VALIDATION & MODAL SUCCESS
       ========================================================================== */
    const reservationForm = document.getElementById('reservation-form');
    const bookingModal = document.getElementById('booking-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    // Set minimum date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Input elements for validation
    const inputsToValidate = {
        name: {
            element: document.getElementById('booking-name'),
            error: document.getElementById('error-name'),
            validate: (val) => val.trim().length >= 2
        },
        phone: {
            element: document.getElementById('booking-phone'),
            error: document.getElementById('error-phone'),
            validate: (val) => {
                // simple phone regex: matches +92..., 03..., or standard digits
                const phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
                return phoneRegex.test(val.trim());
            }
        },
        email: {
            element: document.getElementById('booking-email'),
            error: document.getElementById('error-email'),
            validate: (val) => {
                if (val.trim() === '') return true; // Optional field
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(val.trim());
            }
        },
        guests: {
            element: document.getElementById('booking-guests'),
            error: document.getElementById('error-guests'),
            validate: (val) => val !== ''
        },
        date: {
            element: document.getElementById('booking-date'),
            error: document.getElementById('error-date'),
            validate: (val) => val !== ''
        },
        time: {
            element: document.getElementById('booking-time'),
            error: document.getElementById('error-time'),
            validate: (val) => val !== ''
        }
    };

    // Add input listeners to clear errors on keyup/change
    Object.keys(inputsToValidate).forEach(key => {
        const item = inputsToValidate[key];
        const eventType = item.element.tagName === 'SELECT' || item.element.type === 'date' ? 'change' : 'input';
        
        item.element.addEventListener(eventType, () => {
            if (item.validate(item.element.value)) {
                item.element.parentElement.classList.remove('invalid');
            }
        });
    });

    // Handle Form Submission
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Run validation on all fields
        Object.keys(inputsToValidate).forEach(key => {
            const item = inputsToValidate[key];
            const isValid = item.validate(item.element.value);
            
            if (!isValid) {
                item.element.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                item.element.parentElement.classList.remove('invalid');
            }
        });

        if (isFormValid) {
            // Retrieve values for receipt in modal
            const nameVal = inputsToValidate.name.element.value;
            const guestsVal = inputsToValidate.guests.element.value;
            const dateVal = inputsToValidate.date.element.value;
            const timeVal = inputsToValidate.time.element.value;

            // Format date for modal readability
            const formattedDate = new Date(dateVal).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Map guests values
            let guestText = guestsVal + (parseInt(guestsVal) === 1 ? ' Person' : ' People');
            if (guestsVal.includes('-')) guestText = guestsVal + ' People';

            // Populate success modal fields
            document.getElementById('modal-user-name').textContent = nameVal;
            document.getElementById('modal-user-guests').textContent = guestText;
            document.getElementById('modal-user-date').textContent = formattedDate;
            document.getElementById('modal-user-time').textContent = timeVal;

            // Show confirmation modal
            bookingModal.classList.add('open');
            
            // Reset form
            reservationForm.reset();
        }
    });

    // Close reservation modal
    const closeBookingModal = () => {
        bookingModal.classList.remove('open');
    };

    modalCloseBtn.addEventListener('click', closeBookingModal);
    modalOkBtn.addEventListener('click', closeBookingModal);
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBookingModal();
    });

    /* ==========================================================================
       NEWSLETTER FORM SUBMISSION
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            const email = emailInput.value;
            
            if (email) {
                alert(`Thank you for subscribing! We will send news to ${email}.`);
                newsletterForm.reset();
            }
        });
    }
});
