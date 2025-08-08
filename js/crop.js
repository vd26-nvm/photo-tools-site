const cropUpload = document.getElementById('crop-upload');
const cropCanvas = document.getElementById('crop-canvas');
const cropCtx = cropCanvas.getContext('2d');
const cropDownloadBtn = document.getElementById('crop-download-btn');

let cropImage = null;
let isDragging = false;
let startX, startY, endX, endY;

cropUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      cropImage = img;
      cropCanvas.width = img.width;
      cropCanvas.height = img.height;
      cropCtx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

cropCanvas.addEventListener('mousedown', (e) => {
  if (!cropImage) return;
  const rect = cropCanvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
  isDragging = true;
});

cropCanvas.addEventListener('mousemove', (e) => {
  if (!isDragging || !cropImage) return;

  const rect = cropCanvas.getBoundingClientRect();
  endX = e.clientX - rect.left;
  endY = e.clientY - rect.top;

  cropCtx.drawImage(cropImage, 0, 0); // Reset
  cropCtx.strokeStyle = '#A67DB8';
  cropCtx.lineWidth = 2;
  cropCtx.strokeRect(startX, startY, endX - startX, endY - startY);
});

cropCanvas.addEventListener('mouseup', () => {
  if (!isDragging || !cropImage) return;
  isDragging = false;

  const cropWidth = endX - startX;
  const cropHeight = endY - startY;

  const croppedData = cropCtx.getImageData(startX, startY, cropWidth, cropHeight);

  // Resize canvas to new cropped size
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;

  cropCtx.putImageData(croppedData, 0, 0);
});

cropDownloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'cropped-image.png';
  link.href = cropCanvas.toDataURL('image/png');
  link.click();
});

// Initialize cropper with aspect ratio options
let cropper;
function initCropTool(imageElement) {
  if (cropper) cropper.destroy();
  
  cropper = new Cropper(imageElement, {
    viewMode: 1,
    autoCropArea: 1,
    responsive: true,
  });

  document.querySelectorAll('.aspect-ratio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ratio = btn.getAttribute('data-ratio');
      cropper.setAspectRatio(ratio === 'free' ? NaN : parseFloat(ratio));
    });
  });
}
