const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const analyzeBtn = document.querySelector('.analyze-btn');
const resultSection = document.querySelector('.result-section');

const openCameraBtn = document.getElementById('openCamera');
const closeCameraBtn = document.getElementById('closeCamera');
const cameraFeed = document.getElementById('cameraFeed');
const captureBtn = document.getElementById('captureBtn');
const canvas = document.getElementById('canvas');
let stream = null;

const closePreviewBtn = document.getElementById('closePreview');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(255, 255, 255, 0.1)';
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.style.background = 'transparent';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = 'transparent';
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
        stream = null;
    }
    // Add immediate visual feedback
    cameraFeed.style.opacity = '0';
    setTimeout(() => {
        cameraFeed.srcObject = null;
        cameraFeed.hidden = true;
        captureBtn.hidden = true;
        closeCameraBtn.hidden = true;
        openCameraBtn.hidden = false;
        canvas.hidden = true;
    }, 300); // Match transition duration
}

openCameraBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = stream;
        cameraFeed.hidden = false;
        captureBtn.hidden = false;
        closeCameraBtn.hidden = false;
        openCameraBtn.hidden = true;
        cameraFeed.play();
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access camera. Please make sure you have granted permission.');
    }
});

closeCameraBtn.addEventListener('click', closeCamera);

captureBtn.addEventListener('click', () => {
    if (!stream) return;
    
    // Immediately hide camera feed for visual feedback
    cameraFeed.classList.add('closing');
    
    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;
    canvas.getContext('2d').drawImage(cameraFeed, 0, 0);
    
    canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        
        // Close camera completely before handling file
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop();
                track.enabled = false;
            });
            stream = null;
        }
        
        // Reset UI elements
        cameraFeed.srcObject = null;
        cameraFeed.hidden = true;
        captureBtn.hidden = true;
        closeCameraBtn.hidden = true;
        openCameraBtn.hidden = false;
        canvas.hidden = true;
        cameraFeed.classList.remove('closing');
        
        // Handle the captured image
        handleFile(file);
    }, 'image/jpeg');
});

// Add window event listener to ensure camera is closed when leaving page
window.addEventListener('beforeunload', closeCamera);

closePreviewBtn.addEventListener('click', () => {
    // Reset preview
    preview.hidden = true;
    preview.src = '';
    closePreviewBtn.hidden = true;
    
    // Show upload content
    dropZone.querySelector('.upload-content').hidden = false;
    
    // Reset analyze button
    analyzeBtn.disabled = true;
    
    // Reset result section if visible
    resultSection.hidden = true;
    
    // Reset file input
    fileInput.value = '';
});

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.hidden = false;
            closePreviewBtn.hidden = false;
            dropZone.querySelector('.upload-content').hidden = true;
            analyzeBtn.disabled = false;
        };
        reader.readAsDataURL(file);
        fileInput.files = new FileList([file]);
    }
}

analyzeBtn.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    
    try {
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;
        
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        resultSection.hidden = false;
        document.querySelector('.disease-name').textContent = data.disease;
        document.querySelector('.confidence').textContent = 
            `${(data.confidence * 100).toFixed(1)}%`;
            
    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing image. Please try again.');
    } finally {
        analyzeBtn.textContent = 'Analyze Image';
        analyzeBtn.disabled = false;
    }
});
