const previewContainer = document.querySelector('.prewiev-image-navigation');

let isDown = false;
let startX;
let scrollLeft;

previewContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - previewContainer.offsetLeft;
    scrollLeft = previewContainer.scrollLeft;
    previewContainer.style.cursor = 'grabbing';
});

previewContainer.addEventListener('mouseleave', () => {
    isDown = false;
    previewContainer.style.cursor = 'grab';
});

previewContainer.addEventListener('mouseup', () => {
    isDown = false;
    previewContainer.style.cursor = 'grab';
});

previewContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - previewContainer.offsetLeft;
    const walk = (x - startX) * 2;
    previewContainer.scrollLeft = scrollLeft - walk;
});

previewContainer.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].clientX - previewContainer.offsetLeft;
    scrollLeft = previewContainer.scrollLeft;
});

previewContainer.addEventListener('touchend', () => {
    isDown = false;
});

previewContainer.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].clientX - previewContainer.offsetLeft;
    const walk = (x - startX) * 2;
    previewContainer.scrollLeft = scrollLeft - walk;
});
