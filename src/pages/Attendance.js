import React, { useState, useRef } from 'react';
import axios from 'axios';
import img1 from '../assets/img4.jpeg';

const Attendance = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [sampleImages, setSampleImages] = useState([]);
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cctvUrl, setCctvUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [predictedCount, setPredictedCount] = useState(null); // Track predicted count
    const [uploadedImages1, setUploadedImages1] = useState([]);

  // Handle image upload
  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedImages1((prevImages) => [...prevImages, ...files]);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...imagePreviews]);
  };

  // Handle "Upload Directory" (advanced functionality)
  const handleUploadDirectory = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      const imagePreviews = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prevImages) => [...prevImages, ...imagePreviews]);
    } else {
      alert('No files selected.');
    }
  };

  // Handle "Take Photo" functionality using the user's camera
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsCameraOn(true);
    } catch (err) {
      alert('Error accessing camera: ' + err.message);
    }
  };

  // Capture the photo from the video stream
  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL('image/png');
    setUploadedImages((prevImages) => [...prevImages, photo]);

    // Stop the video stream
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    setIsCameraOn(false);
    video.srcObject = null;
  };

  // Handle deleting an uploaded image
  const handleDeleteImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
const blobToFormData = (blob, index) => {
  const formData = new FormData();
  formData.append('image', blob, `image_${index + 1}.jpg`); // Attach the image Blob with a name
  return formData;
};

const handlesubmitImage = async (index) => {
  setIsLoading(true); // Start loading state
  setPredictedCount(null); // Reset predicted count

  try {
    // Step 1: Retrieve the image blob from uploadedImages1
    const imageBlob = uploadedImages1[index];
    if (!imageBlob) throw new Error('No image found at the specified index.');

    // Step 2: Convert the Blob to FormData
    const formData = blobToFormData(imageBlob, index);

    // Step 3: Send the image directly to your backend
    const backendResponse = await axios.post(
      'http://127.0.0.1:5173/model/predict', // Replace with your backend API endpoint
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Log and display the backend response
    console.log('Backend Response:', backendResponse.data);
    setPredictedCount(backendResponse.data.predicted_count);
  } catch (error) {
    // Handle errors gracefully
    console.error(
      'Error submitting image:',
      error.response ? error.response.data : error.message
    );
    alert('Failed to submit the image. Please try again.');
  } finally {
    setIsLoading(false); // Stop loading state
  }
};

  // Load sample images
  const handleLoadSampleImages = () => {
    const exampleImages = [img1];
    setSampleImages(exampleImages);
  };

  // Extract an image from a CCTV URL
  const handleCCTVUrl = async () => {
    if (!cctvUrl) {
      alert('Please enter a valid CCTV URL.');
      return;
    }

    try {
      // Log the URL being requested (optional for debugging)
      console.log('Fetching image from proxy server for URL:', cctvUrl);

      // The proxy server endpoint that forwards the request
      const proxyUrl = `https://5a19-124-123-171-114.ngrok-free.app/proxy/proxy?url=${encodeURIComponent(
        cctvUrl
      )}`;

      // Axios GET request for binary data (image)
      const response = await axios.get(proxyUrl, { responseType: 'blob' });

      // Check if the response is an image
      const contentType = response.headers['content-type'];
      if (!contentType.startsWith('image/')) {
        throw new Error('The URL did not return an image.');
      }

      // Create an object URL from the Blob
      const imagePreview = URL.createObjectURL(response.data);

      // Update the state with the image preview
      setUploadedImages((prevImages) => [...prevImages, imagePreview]);

      // Clear the input for the next URL
      setCctvUrl('');
    } catch (error) {
      console.error('Error fetching image:', error);
      alert(
        'Error fetching image: ' + (error.response?.statusText || error.message)
      );
    }
  };
  const handleDownload = () => {
    const content = `
    <h2>Atica AI Predictions</h2>
    <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr>
          <th style="padding: 10px; text-align: left;">Image Name</th>
          <th style="padding: 10px; text-align: left;">Timestamp</th>
          <th style="padding: 10px; text-align: left;">Original Count</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 10px;">Image1.jpg</td>
          <td style="padding: 10px;">${new Date().toLocaleString()}</td>
          <td style="padding: 10px;">${predictedCount}</td>
        </tr>
        <!-- Add more rows as needed for other images -->
      </tbody>
    </table>
  `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a link element, simulate a click to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predictions.html'; // or you could use .txt or .csv depending on the content
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold">
          Computer Vision AI{' '}
          <span className="text-orange-400">Object Detection</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        {/* Discover and Docs Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            className="bg-teal-700 hover:bg-teal-600 px-6 py-3 rounded text-white font-semibold"
            onClick={() =>
              alert('Discover asticaVision functionality coming soon.')
            }
          >
            Discover asticaVision
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded text-white font-semibold"
            onClick={() => window.open('https://docs.example.com', '_blank')}
          >
            View API Documentation
          </button>
        </div>

        {/* Object Detection Demonstration Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Object Detection Demonstration
          </h2>
          <p className="text-gray-300 mb-6">
            This tool demonstrates object detection capabilities. Upload an
            image, select a directory, take a photo, or fetch an image from a
            CCTV URL.
          </p>

          {/* Upload Buttons */}
          <div className="flex gap-4 mb-6">
            <label className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white cursor-pointer">
              + Upload Image(s)
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
              />
            </label>
            <label className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white cursor-pointer">
              Upload Directory
              <input
                type="file"
                accept="image/*"
                multiple
                webkitdirectory="true"
                onChange={handleUploadDirectory}
                className="hidden"
              />
            </label>
          </div>

          {/* CCTV URL Input */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded bg-gray-700 text-white"
              placeholder="Enter CCTV URL..."
              value={cctvUrl}
              onChange={(e) => setCctvUrl(e.target.value)}
            />
            <button
              className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-white"
              onClick={handleCCTVUrl}
            >
              Fetch Image
            </button>
          </div>

          {/* Photo and Actions Table */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">PHOTO</span>
              <span className="font-semibold">ACTION</span>
            </div>
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={image}
                      alt={`Uploaded Preview ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                    <div className="flex gap-4 mt-2">
                      {isLoading ? (
                        <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-4 border-white rounded-full"></div>
                      ) : (
                        <>
                          <button
                            className="bg-red-600 hover:bg-red-500 px-4 py-2 mt-2 rounded text-white"
                            onClick={() => handleDeleteImage(index)}
                          >
                            Delete
                          </button>
                          <button
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 mt-2 rounded text-white"
                            onClick={() => handlesubmitImage(index)}
                          >
                            Submit
                          </button>
                        </>
                      )}
                    </div>

                    {predictedCount !== null && !isLoading && (
                      <div className="mt-4 text-center">
                        <p className="text-xl font-semibold text-green-500">
                          Predicted Count: {predictedCount}
                        </p>
                        <button
                          onClick={handleDownload}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                        >
                          Download Predictions
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 border border-dashed border-gray-500 rounded">
                Click to add a photo to astica Vision AI
              </div>
            )}
          </div>

          {/* Camera Preview */}
          {isCameraOn && (
            <div className="mt-6 text-center">
              <video
                ref={videoRef}
                className="mx-auto rounded-lg"
                width="320"
                height="240"
              />
              <button
                className="bg-green-600 hover:bg-green-500 px-4 py-2 mt-2 rounded text-white"
                onClick={capturePhoto}
              >
                Capture Photo
              </button>
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Vision AI Examples</h2>
          <p className="text-gray-300 mb-4">
            Browse a subset of randomly selected set of asticaVision outputs.
          </p>
          {/* Example Images */}
          <div className="grid grid-cols-4 gap-4">
            {sampleImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Example ${index + 1}`}
                className="rounded-lg"
              />
            ))}
          </div>
          <button
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 mt-4 rounded text-white"
            onClick={handleLoadSampleImages}
          >
            Load Sample Images
          </button>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
