const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        console.log("Azure Blob storage v12 - JavaScript quickstart sample");

        // Quick start code goes here
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw Error('Azure Storage Connection string not found');
        }

        // Create the BlobServiceClient object with connection string
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            AZURE_STORAGE_CONNECTION_STRING
        );
        // // Create a unique name for the container
        // const containerName = 'quickstart' + uuidv1();

        // console.log('\nCreating container...');
        // console.log('\t', containerName);

        // // Get a reference to a container
        const containerName = 'azurepicture'
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // // Create the container
        // const createContainerResponse = await containerClient.create();
        // console.log(
        //     `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
        // );

        // // Create a unique name for the blob
        // const blobName = 'quickstart' + uuidv1() + '.txt';

        // // Get a block blob client
        // const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // // Display blob name and url
        // console.log(
        //     `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
        // );

        // // Upload data to the blob
        // const data = 'Hello, World!';
        // const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        // console.log(
        //     `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
        // );

        // console.log('\nListing blobs...');

        // List the blob(s) in the container.
        // for await (const blob of containerClient.listBlobsFlat()) {
        //     // Get Blob Client from name, to get the URL
        //     const tempBlockBlobClient = containerClient.getBlockBlobClient(blob.name);

        //     // Display blob name and URL
        //     console.log(
        //         `\n\tname: ${blob.name}\n\tURL: ${tempBlockBlobClient.url}\n`
        //     );
        // }

        // Delete container
        // console.log('\nDeleting container...');

        // const deleteContainerResponse = await containerClient.delete();
        // console.log(
        //     'Container was deleted successfully. requestId: ',
        //     deleteContainerResponse.requestId
        // );


        // Set the container's access policy to allow public access to blobs
        // await containerClient.setAccessPolicy('blob');
        // console.log(`Container ${containerName} access level set to 'blob'`);

        //uploading an image 

        // Path to the image file you want to upload
        const blobName = 'image'
        const imagePath = './resources/' + blobName + '.png';

        // Get the blob client
        // const blobName = path.basename(imagePath);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the image
        const uploadBlobResponse = await blockBlobClient.uploadFile(imagePath);
        console.log(`Image ${blobName} uploaded to container ${containerName} successfully.`, uploadBlobResponse.requestId);

        // Get a reference to the blob (image)
        const blobClient = containerClient.getBlobClient(blobName);

        // Construct the URL
        const blobUrl = blobClient.url;

        console.log(`URL for the image: ${blobUrl}`);


    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

main()
    .then(() => console.log("Done"))
    .catch((ex) => console.log(ex.message));