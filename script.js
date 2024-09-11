const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('file-input');
const captureBtn = document.getElementById('capture-btn');
const uploadBtn = document.getElementById('upload-btn');
const shareBtn = document.getElementById('share-btn');
const nomeField = document.getElementById('nome');
const cargoField = document.getElementById('cargo');
const emailField = document.getElementById('email');
const telefoneField = document.getElementById('telefone');

// Inicializa a câmera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => console.error('Erro ao acessar a câmera', error));

// Captura a imagem do vídeo
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    processImage(canvas);
});

// Processa a imagem usando Tesseract.js
function processImage(image) {
    Tesseract.recognize(image, 'por', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        extractInformation(text);
    });
}

// Extração de informações
function extractInformation(text) {
    const lines = text.split('\n');
    nomeField.textContent = lines[0] || 'Não encontrado';
    cargoField.textContent = lines[1] || 'Não encontrado';
    emailField.textContent = lines.find(line => line.includes('@')) || 'Não encontrado';
    telefoneField.textContent = lines.find(line => line.match(/(?\d{2}?\s)?(\d{4,5}\-\d{4})/)) || 'Não encontrado';
}

// Upload de imagem
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            processImage(canvas);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// Compartilhar as informações
shareBtn.addEventListener('click', () => {
    const nome = nomeField.textContent;
    const cargo = cargoField.textContent;
    const email = emailField.textContent;
    const telefone = telefoneField.textContent;

    const shareData = {
        title: 'Informações de Contato',
        text: `Nome: ${nome}\nCargo: ${cargo}\nEmail: ${email}\nTelefone: ${telefone}`
    };

    navigator.share(shareData)
        .then(() => console.log('Informações compartilhadas com sucesso'))
        .catch((error) => console.error('Erro ao compartilhar', error));
});
