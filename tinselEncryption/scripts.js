// テーマ設定
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeToggle = document.getElementById('themeToggle');

// 初期テーマ設定
document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
themeToggle.checked = prefersDarkScheme.matches;

// テーマ切り替え
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', themeToggle.checked);
});

// 暗号化用Web Worker
const encryptWorker = new Worker(URL.createObjectURL(new Blob([`
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

    self.onmessage = function(event) {
        const { password, fileContent } = event.data;
        // バイナリデータをBase64エンコード
        const base64Content = btoa(String.fromCharCode(...new Uint8Array(fileContent)));
        const encrypted = CryptoJS.AES.encrypt(base64Content, password).toString();
        self.postMessage(encrypted);
    };
`], { type: 'application/javascript' })));

const decryptWorker = new Worker(URL.createObjectURL(new Blob([`
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

    self.onmessage = function(event) {
        const { password, encryptedContent } = event.data;
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedContent, password);
            const base64Content = decrypted.toString(CryptoJS.enc.Utf8);
            // Base64デコードしてUint8Arrayに変換
            const fileContent = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));
            self.postMessage({ success: true, result: fileContent });
        } catch (error) {
            self.postMessage({ success: false, error: error.message });
        }
    };
`], { type: 'application/javascript' })));

document.getElementById('encryptButton').addEventListener('click', function () {
    const password = document.getElementById('encryptPassword').value;
    const fileInput = document.getElementById('fileInput').files[0];
    const loadingMessage = document.getElementById('encryptLoading');

    if (!password || !fileInput) {
        alert("パスワードとファイルを入力してください");
        return;
    }

    const reader = new FileReader();
    loadingMessage.style.display = 'block';

    reader.onload = function (e) {
        const fileContent = new Uint8Array(e.target.result);
        encryptWorker.postMessage({ password, fileContent });
    };

    reader.readAsArrayBuffer(fileInput);
});

encryptWorker.onmessage = function (e) {
    const encrypted = e.data;
    const fileInput = document.getElementById('fileInput').files[0];
    const encryptedBlob = new Blob([encrypted], { type: 'text/plain' });
    const downloadLink = document.getElementById('downloadLink');
    const loadingMessage = document.getElementById('encryptLoading');

    downloadLink.href = URL.createObjectURL(encryptedBlob);
    downloadLink.download = fileInput.name + ".enc";
    downloadLink.style.display = 'block';
    downloadLink.textContent = '暗号化されたファイルをダウンロード';
    loadingMessage.style.display = 'none';

    document.getElementById('encryptPassword').value = '';
    document.getElementById('fileInput').value = '';
};

document.getElementById('decryptButton').addEventListener('click', function () {
    const password = document.getElementById('decryptPassword').value;
    const fileInput = document.getElementById('decryptFileInput').files[0];
    const loadingMessage = document.getElementById('decryptLoading');

    if (!password || !fileInput) {
        alert("パスワードとファイルを入力してください");
        return;
    }

    const reader = new FileReader();
    loadingMessage.style.display = 'block';

    reader.onload = function (e) {
        const encryptedContent = e.target.result;
        decryptWorker.postMessage({ password, encryptedContent });
    };

    reader.readAsText(fileInput);
});

decryptWorker.onmessage = function (e) {
    const { success, result, error } = e.data;
    const downloadLink = document.getElementById('decryptDownloadLink');
    const loadingMessage = document.getElementById('decryptLoading');
    const fileInput = document.getElementById('decryptFileInput').files[0];

    if (success) {
        const decryptedBlob = new Blob([result], { type: 'application/octet-stream' });
        downloadLink.href = URL.createObjectURL(decryptedBlob);
        downloadLink.download = fileInput.name.replace(".enc", "");
        downloadLink.style.display = 'block';
        downloadLink.textContent = '復号されたファイルをダウンロード';
    } else {
        alert("復号に失敗しました: " + error);
    }

    loadingMessage.style.display = 'none';

    document.getElementById('decryptPassword').value = '';
    document.getElementById('decryptFileInput').value = '';
};
