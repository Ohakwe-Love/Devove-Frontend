const projects_wrapper = document.querySelector(".projects");
const overlay = document.querySelector(".overlay");

if (projects_wrapper) {
    const projectImgs = document.querySelectorAll(".project-img");
    const quickViewImage = document.querySelectorAll(".quickview-btn");
    const projectLightbox = document.querySelector(".project_lightbox");
    const lightboxImg = projectLightbox.querySelector(".lightbox_img");

    const prevLightboxImg = projectLightbox.querySelector(".prev_lightbox_img");
    const nextLightboxImg = projectLightbox.querySelector(".next_lightbox_img");
    const closeLightboxBtn = projectLightbox.querySelector(".close_lightbox");
    let currentIndex = 0;

    function openLightbox(index) {
        if (lightboxImg) {
            lightboxImg.src = projectImgs[index].src;
        }

        if (projectLightbox) {
            projectLightbox.classList.add("active")
        };

        if (overlay) {
            overlay.classList.add('active');
        }
        if (document.body) document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (projectLightbox) {
            projectLightbox.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        if (document.body) document.body.style.overflow = 'auto';
    }

    quickViewImage.forEach((btn, index) => {
        btn.addEventListener("click", () => openLightbox(index));
    })

    if (overlay) {
        overlay.addEventListener("click", closeLightbox)
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener("click", closeLightbox)
    }

    if (prevLightboxImg) {
        prevLightboxImg.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + projectImgs.length) % projectImgs.length;
            lightboxImg.src = projectImgs[currentIndex].src;
        })
    }

    if (nextLightboxImg) {
        nextLightboxImg.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % projectImgs.length;
            lightboxImg.src = projectImgs[currentIndex].src;
        })
    }
}