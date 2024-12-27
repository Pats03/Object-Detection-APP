import React, { useState, useRef } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [sampleImages, setSampleImages] = useState([]);
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cctvUrl, setCctvUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [predictedCount, setPredictedCount] = useState(null); // Track predicted count

  // Handle image upload
  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
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
  const handlesubmitImage = async (index) => {
    setIsLoading(true); // Set loading state to true
    setPredictedCount(null);
    try {
      // Retrieve the blob URL from the uploadedImages array
      const imageToHost = uploadedImages[index];

      // Log the full image data to ensure it's correctly formatted
      //console.log('Full image data:', imageToHost);

      // Convert the Blob URL to Base64
      const base64Image = await blobToBase64(imageToHost);

      // Log the base64 image data (for debugging)
      //console.log('Base64 image data:', base64Image);

      // Validate base64 data
      if (!base64Image || base64Image.trim().length === 0) {
        throw new Error('Base64 image data is empty or invalid.');
      }

      // Create encoded parameters for the API
      const encodedParams = new URLSearchParams();
      encodedParams.set('image', base64Image); // Base64 data of the image
      encodedParams.set('name', `image_${index + 1}.jpg`); // Dynamically set the image name

      // Define the API request options
      const options = {
        method: 'POST',
        url: 'https://upload-images-hosting-get-url.p.rapidapi.com/upload',
        headers: {
          'x-rapidapi-key':
            'dc6d62abc2mshb484761ed203da6p13c9dfjsn3f7b6383a772',
          'x-rapidapi-host': 'upload-images-hosting-get-url.p.rapidapi.com',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: encodedParams,
      };

      // Call the hosting API
      const hostingResponse = await axios.request(options);

      // Log the response from the hosting API for debugging
      console.log('Hosting API Response:', hostingResponse.data);

      // Check if the hosting API returned a valid URL
      if (!hostingResponse.data.data.url) {
        throw new Error('Failed to get hosted image URL');
      }

      const hostedImageUrl = hostingResponse.data.data.url; // Extract the hosted image URL

      // Log the hosted image URL
      console.log('Hosted Image URL:', hostedImageUrl);

      // Define the backend API request
      const backendOptions = {
        method: 'POST',
        url: 'https://5a19-124-123-171-114.ngrok-free.app/model/predict',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true,
        },
        data: {
          image_url: hostedImageUrl, // Pass the hosted URL to the backend
        },
      };

      // Call the backend API
      const backendResponse = await axios.request(backendOptions);

      // Log the backend response
      console.log('Backend Response:', backendResponse.data);

      // Show the backend response to the user
      setPredictedCount(backendResponse.data.predicted_count);
    } catch (error) {
      // Log the error for debugging
      console.error(
        'Error submitting image:',
        error.response ? error.response.data : error.message
      );

      // Notify the user of the failure
      alert('Failed to submit the image. Please try again.');
    } finally {
      setIsLoading(false); // Set loading state to false when done
    }
  };

  // Function to convert Blob to Base64
  const blobToBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', blobUrl, true);
      xhr.responseType = 'blob';

      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // The result is the Base64 data URL
          resolve(reader.result.split(',')[1]); // Extract Base64 part
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response); // Convert Blob to Base64
      };

      xhr.onerror = reject;
      xhr.send();
    });
  };

  // Load sample images
  const handleLoadSampleImages = () => {
    const exampleImages = [
      'https://via.placeholder.com/150?text=Sample1',
      'https://via.placeholder.com/150?text=Sample2',
      'https://via.placeholder.com/150?text=Sample3',
      'https://via.placeholder.com/150?text=Sample4',
    ];
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
            <button
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white"
              onClick={handleTakePhoto}
            >
              Take Photo
            </button>
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
