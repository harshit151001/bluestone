let currentImageIndex = 0;
let images = [];

// DOM Elements
const mainImage = document.querySelector('.main-image');
const thumbnailsContainer = document.querySelector('.thumbnails');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const quantityDisplay = document.querySelector('.quantity-display');
const decreaseButton = document.querySelector('.decrease');
const increaseButton = document.querySelector('.increase');
const addToCartButton = document.querySelector('.add-to-cart');
const confirmation = document.querySelector('.confirmation');
const prevThumbnailButton = document.querySelector('.prev-thumbnail');
const nextThumbnailButton = document.querySelector('.next-thumbnail');
const imageContainer = document.querySelector('.image-container');
const magnifier = document.createElement('div');
magnifier.className = 'magnifier';
imageContainer.appendChild(magnifier);



// Fetch images from Lorem Picsum
async function fetchImages() {
    try {
        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=10');
        const data = await response.json();
        images = data.map(img => ({
            full: `https://picsum.photos/id/${img.id}/800/800`,
            thumb: `https://picsum.photos/id/${img.id}/100/100`
        }));
        initializeCarousel();
    } catch (error) {
        console.error('Error fetching images:', error);
    }
}

function initializeCarousel() {
    if (images.length === 0) return;

    // Set initial main image
    updateMainImage();
    initializeZoom();

    // Create thumbnails
    images.forEach((image, index) => {
        const thumb = document.createElement('img');
        thumb.src = image.thumb;
        thumb.alt = `Product view ${index + 1}`;
        thumb.classList.add('thumbnail');
        if (index === currentImageIndex) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
        });
        thumbnailsContainer.appendChild(thumb);
    });
}

function updateMainImage() {
    mainImage.src = images[currentImageIndex].full;
    mainImage.alt = `Product view ${currentImageIndex + 1}`;

    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
        if (index === currentImageIndex) {
            const thumbsContainer = thumbnailsContainer;
            const thumb = thumbsContainer.children[index];


            const containerCenter = thumbsContainer.offsetWidth / 2;
            const thumbCenter = thumb.offsetLeft + (thumb.offsetWidth / 2);
            const scrollLeft = thumbCenter - containerCenter;

            // Smooth scroll the thumbnails container
            thumbsContainer.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    });
}

// Carousel navigation
prevButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateMainImage();
});

nextButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateMainImage();
});


// Quantity selector
let quantity = 1;

decreaseButton.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});

increaseButton.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
});


prevThumbnailButton.addEventListener('click', () => {
    thumbnailsContainer.scrollBy({
        left: -100,
        behavior: 'smooth'
    });
});

nextThumbnailButton.addEventListener('click', () => {
    thumbnailsContainer.scrollBy({
        left: 100,
        behavior: 'smooth'
    });
});

// Add to cart functionality
addToCartButton.addEventListener('click', () => {
    confirmation.style.display = 'block';
    setTimeout(() => {
        confirmation.style.display = 'none';
    }, 3000);
});

// Touch/swipe functionality for mobile
let touchStartX = 0;
let touchEndX = 0;

mainImage.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

mainImage.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const minSwipe = 50;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > minSwipe) {
        if (difference > 0) {
            // Swipe left
            currentImageIndex = (currentImageIndex + 1) % images.length;
        } else {
            // Swipe right
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        }
        updateMainImage();
    }
}

function initializeZoom() {
    // Only initialize zoom for desktop devices
    if (window.matchMedia("(hover: hover)").matches) {
        imageContainer.addEventListener('mousemove', handleZoom);
        imageContainer.addEventListener('mouseleave', () => {
            magnifier.style.display = 'none';
        });
    }
}

function handleZoom(e) {
    const rect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;


    magnifier.style.left = `${x - 100}px`;
    magnifier.style.top = `${y - 100}px`;


    magnifier.style.backgroundImage = `url(${mainImage.src})`;
    magnifier.style.backgroundSize = '300%';
    magnifier.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    magnifier.style.display = 'block';
}

// Initialize
fetchImages();