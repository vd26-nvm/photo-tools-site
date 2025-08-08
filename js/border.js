const uploadInput = document.getElementById('border-upload');
const canvas = document.getElementById('border-canvas');
const ctx = canvas.getContext('2d');

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
      drawImageWithBorder();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function drawImageWithBorder() {
  if (!originalImage) return;

  const borderSize = parseInt(thicknessInput.value);
  const borderColor = colorInput.value;

  const canvasWidth = originalImage.width + borderSize * 2;
  const canvasHeight = originalImage.height + borderSize * 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Fill border color
  ctx.fillStyle = borderColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw original image in the center
  ctx.drawImage(originalImage, borderSize, borderSize);
}

// Redraw when border settings change
colorInput.addEventListener('input', drawImageWithBorder);
thicknessInput.addEventListener('input', drawImageWithBorder);

// Download button
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'bordered-photo.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
