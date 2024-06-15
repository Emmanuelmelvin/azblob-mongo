const express = require('express');
const multer = require('multer');
require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');
const { Readable } = require('stream');

const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 3000;

// Azure Blob Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'profilepics'
const blobName = "Ade"

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

const checkIfContainerExists = async () => {
    try {
        const containerExists = await containerClient.exists();

        if (containerExists) {
            console.log(`Container "${containerName}" already exists.`);
        } else {
            // Create the container
            const createContainerResponse = await containerClient.create();
            console.log(`Container "${containerName}" was created successfully.`);
            console.log(`\trequestId: ${createContainerResponse.requestId}`);
            console.log(`\tURL: ${containerClient.url}`);
            // Set the container's access policy to allow public access to blobs
            await containerClient.setAccessPolicy('blob');
            console.log(`Container ${containerName} access level set to 'blob'`);

        }
    } catch (error) {
        console.log(error)
    }
}

checkIfContainerExists()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        // Create a readable stream from the buffer
        const stream = Readable.from(req.file.buffer);
        const uploadOptions = { blobHTTPHeaders: { blobContentType: req.file.mimetype } };

        // Upload the stream to Azure Blob Storage
        await blockBlobClient.uploadStream(stream, req.file.size, undefined, uploadOptions);
        console.log('File uploaded successfully to Azure Blob Storage.');

        // Get a reference to the blob (image)
        const blobClient = containerClient.getBlobClient(blobName);

        // Construct the URL
        const blobUrl = blobClient.url;

        console.log(`URL for the image: ${blobUrl}`);
    } catch (error) {
        console.error('Error uploading to Azure Blob Storage:', error);
        res.status(500).send('Error uploading file.');
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
