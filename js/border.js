const uploadInput = document.getElementById('border-upload');

const previewCanvas = document.getElementById('border-preview-canvas');
const previewCtx = previewCanvas.getContext('2d');

const downloadCanvas = document.getElementById('border-download-canvas');
const downloadCtx = downloadCanvas.getContext('2d');

const colorInput = document.getElementById('border-color');
const thicknessInput = document.getElementById('border-thickness');
const downloadBtn = document.querySelector('#tool-border .download-btn');

let originalImage = null;

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      originalImage = img;
      drawPreviewCanvas();
      drawDownloadCanvas();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

colorInput.addEventListener('input', () => {
  drawPreviewCanvas();
  drawDownloadCanvas();
});
thicknessInput.addEventListener('input', () => {
  drawPreviewCanvas();
  drawDownloadCanvas();
});

function drawPreviewCanvas() {
  if (!originalImage) return;

  const borderSize = parseInt(thicknessInput.value);
  const borderColor = colorInput.value;

  const scaleFactor = 600 / originalImage.width; // Max width: 600px
  const previewWidth = Math.min(600, originalImage.width + borderSize * 2 * scaleFactor);
  const previewHeight = originalImage.height * scaleFactor + borderSize * 2 * scaleFactor;

  previewCanvas.width = previewWidth;
  previewCanvas.height = previewHeight;

  // Fill background (border)
  previewCtx.fillStyle = borderColor;
  previewCtx.fillRect(0, 0, previewWidth, previewHeight);

  // Draw scaled image
  previewCtx.drawImage(
    originalImage,
    borderSize * scaleFactor,
    borderSize * scaleFactor,
    originalImage.width * scaleFactor,
    originalImage.height * scaleFactor
  );
}

function drawDownloadCanvas() {
  if (!originalImage) return;

  const borderSize = parseInt(thicknessInput.value);
  const borderColor = colorInput.value;

  const canvasWidth = originalImage.width + borderSize * 2;
  const canvasHeight = originalImage.height + borderSize * 2;

  downloadCanvas.width = canvasWidth;
  downloadCanvas.height = canvasHeight;

  // Fill background (border)
  downloadCtx.fillStyle = borderColor;
  downloadCtx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw original image in the center
  downloadCtx.drawImage(originalImage, borderSize, borderSize);
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'bordered-photo.png';
  link.href = downloadCanvas.toDataURL('image/png');
  link.click();
});
