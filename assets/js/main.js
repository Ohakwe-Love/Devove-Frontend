const navToggle = document.querySelector(".nav-toggle");
const navigation = document.getElementById("nav");
const closeNav = document.querySelector(".close-nav");

if (navToggle && navigation && closeNav) {
    // Toggle instead of separate open/close
    const toggleNav = () => navigation.classList.toggle("active");
    
    navToggle.addEventListener("click", toggleNav);
    closeNav.addEventListener("click", toggleNav);
    
    // Optional: Close on outside click
    document.addEventListener("click", (e) => {
        if (!navigation.contains(e.target) && !navToggle.contains(e.target)) {
            navigation.classList.remove("active");
        }
    });
    
    // Optional: Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navigation.classList.contains("active")) {
            navigation.classList.remove("active");
        }
    });
}

if (navToggle) {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add 'fixed' class when scrolled down more than 100px
        if (currentScrollY > 100) {
            navToggle.classList.add('fixed');
            
            // Optional: Hide when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY) {
                navToggle.classList.add('hidden');
            } else {
                navToggle.classList.remove('hidden');
            }
        } else {
            navToggle.classList.remove('fixed', 'hidden');
        }
        
        lastScrollY = currentScrollY;
    });
}

// date
const dateElement = document.querySelector(".date");
if (dateElement) {
    const currentYear = new Date().getFullYear();
    dateElement.textContent = currentYear;
}