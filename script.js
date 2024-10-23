const fileUpload = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name');
const scanButton = document.getElementById('scan-button');
const scanAnimation = document.getElementById('scan-animation');
const diagnosis = document.getElementById('diagnosis');
const fileUploadLabel = document.getElementById('file-upload-label');
const diagnosisResult = document.getElementById('diagnosis-result');
const imageCanvas = document.getElementById('imageCanvas');
const ctx = imageCanvas.getContext('2d');

fileUpload.addEventListener('change', function() {
  const file = fileUpload.files[0];
  const fileName = file.name;
  fileNameDisplay.textContent = `File: ${fileName}`;
  fileUploadLabel.style.display = 'none';
  fileUpload.style.display = 'none';
  scanButton.style.display = 'inline-block';
  const img = new Image();
  const reader = new FileReader();
  reader.onload = function(event) {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);

  img.onload = function() {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  };
});

function getMostProminentColors() {
    const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const pixels = imageData.data;
    const colorCount = {};
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const color = `rgb(${r},${g},${b})`;
  
      if (colorCount[color]) {
        colorCount[color]++;
      } else {
        colorCount[color] = 1;
      }
    }
    const colorArray = Object.entries(colorCount);
    colorArray.sort((a, b) => b[1] - a[1]);
    const topColors = colorArray.slice(0, 5).map(entry => entry[0]);
    return topColors;
}

function isInRange(value, target, tolerance) {
    return value >= target - tolerance && value <= target + tolerance;
}

function getColorName(rgb) {
    const [r, g, b] = rgb;
    const tolerance = 30;

    if (isInRange(r, 255, tolerance) && isInRange(g, 0, tolerance) && isInRange(b, 0, tolerance)) {
        return "Red";
    } else if (isInRange(r, 0, tolerance) && isInRange(g, 255, tolerance) && isInRange(b, 0, tolerance)) {
        return "Green";
    } else if (isInRange(r, 0, tolerance) && isInRange(g, 0, tolerance) && isInRange(b, 255, tolerance)) {
        return "Blue";
    } else if (isInRange(r, 255, tolerance) && isInRange(g, 255, tolerance) && isInRange(b, 0, tolerance)) {
        return "Yellow";
    } else if (isInRange(r, 255, tolerance) && isInRange(g, 165, tolerance) && isInRange(b, 0, tolerance)) {
        return "Orange";
    } else if (isInRange(r, 255, tolerance) && isInRange(g, 192, tolerance) && isInRange(b, 203, tolerance)) {
        return "Pink";
    } else if (isInRange(r, 0, tolerance) && isInRange(g, 255, tolerance) && isInRange(b, 255, tolerance)) {
        return "Cyan";
    } else if (isInRange(r, 128, tolerance) && isInRange(g, 0, tolerance) && isInRange(b, 128, tolerance)) {
        return "Purple";
    } else if (isInRange(r, 0, tolerance) && isInRange(g, 0, tolerance) && isInRange(b, 0, tolerance)) {
        return "Black";
    } else if (isInRange(r, 255, tolerance) && isInRange(g, 255, tolerance) && isInRange(b, 255, tolerance)) {
        return "White";
    }
    return "Unknown";
}

function rgbToColorNames(rgbArray) {
    const colorNames = [];
    rgbArray.forEach(rgb => {
        const colorName = getColorName(rgb);
        colorNames.push(colorName);
    });
    return colorNames;
}

scanButton.addEventListener('click', function() {
  scanAnimation.style.display = 'block';
  diagnosis.style.display = 'none';
  const MostProminentColors = getMostProminentColors();
  const diagnosisText = GenerateDiagnosis(rgbToColorNames(MostProminentColors));
  diagnosisResult.textContent = diagnosisText;
  diagnosis.style.display = 'block';
  scanAnimation.style.display = 'none';
});

function GenerateDiagnosis(MostProminentColors) {

    
    const colorDiagnoses = {
        'red': "Possible inflammation or injury.",
        'blue': "May indicate bruising or swelling.",
        'green': "Possible signs of healing or recovery.",
        'yellow': "Could suggest a recent bruise or mild injury.",
        'purple': "May indicate severe bruising or trauma.",
        'black': "Potential severe injury; consult a professional.",
        'white': "Could indicate a lack of blood flow or necrosis."
    };

    const diagnoses = [];
    MostProminentColors.forEach(color => {
        const diagnosis = colorDiagnoses[color.toLowerCase()];
        if (diagnosis) {
            diagnoses.push(diagnosis);
        }
    });

    if (diagnoses.length > 0) {
        return "Diagnosis based on prominent colors: " + diagnoses.join("; ");
    } else {
        return "No significant diagnosis could be generated from the colors provided.";
    }
}
