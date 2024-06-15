document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('File uploaded successfully');
        } else {
            alert('File upload failed');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file');
    }
});