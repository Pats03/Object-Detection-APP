import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import axios from 'axios';
import img1 from '../assets/img13.jpg';
import img2 from '../assets/img14.jpg';
import img3 from '../assets/img15.jpg';
import img4 from '../assets/img16.jpg';

const Doubleattendance = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImages1, setUploadedImages1] = useState([]);
  const [sampleImages, setSampleImages] = useState([]);
  const videoRef = useRef(null);
  const [showSampleImages, setShowSampleImages] = useState(false); // State for toggling visibility

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cctvUrl1, setCctvUrl1] = useState('');
  const [cctvUrl2, setCctvUrl2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictedCount, setPredictedCount] = useState(null);
  const [stitchedImage, setStitchedImage] = useState(null);

  // useNavigate hook to handle navigation
  const navigate = useNavigate();

  // Toggle the visibility of sample images
  const toggleSampleImages = () => {
    setShowSampleImages((prev) => !prev); // Toggle visibility
    if (!showSampleImages) {
      // Only load sample images when they're about to be shown
      handleLoadSampleImages();
    }
  };

  // Handle loading sample images
  const handleLoadSampleImages = () => {
    const exampleImages = [img1, img2, img3, img4];
    setSampleImages(exampleImages);
  };

  // Handle image upload
  const handleUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedImages1((prevImages) => [...prevImages, ...files]);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prevImages) => [...prevImages, ...imagePreviews]);
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

  // Capture a photo from the video feed
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

  // Delete a selected image
  const handleDeleteImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle image prediction
  const handlePredict = async () => {
    const formData = new FormData();
    const response = await fetch(stitchedImage);
    const blob = await response.blob();
    formData.append('stitched_image', blob);
    try {
      setIsLoading(true);
      const predictionResponse = await axios.post(
        'http://127.0.0.1:5173/predict',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setIsLoading(false);
      setPredictedCount(predictionResponse.data);
    } catch (error) {
      setIsLoading(false);
      console.error('Error predicting count:', error);
    }
  };

  // Handle image directory upload
  const handleUploadDirectory = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      const imagePreviews = files.map((file) => URL.createObjectURL(file));
      setUploadedImages((prevImages) => [...prevImages, ...imagePreviews]);
    } else {
      alert('No files selected.');
    }
  };

  // Handle fetching image from CCTV URLs
  const handleCCTVUrl = async (urlType) => {
    let urlToFetch;

    if (urlType === 'url1') {
      urlToFetch = cctvUrl1;
    } else if (urlType === 'url2') {
      urlToFetch = cctvUrl2;
    }

    if (!urlToFetch) {
      alert('Please enter a valid CCTV URL.');
      return;
    }

    try {
      console.log('Fetching image from proxy server for URL:', urlToFetch);

      const proxyUrl = `https://5a19-124-123-171-114.ngrok-free.app/proxy/proxy?url=${encodeURIComponent(urlToFetch)}`;
      const response = await axios.get(proxyUrl, { responseType: 'blob' });

      const contentType = response.headers['content-type'];
      if (!contentType.startsWith('image/')) {
        throw new Error('The URL did not return an image.');
      }

      const imagePreview = URL.createObjectURL(response.data);
      setUploadedImages((prevImages) => [...prevImages, imagePreview]);

      if (urlType === 'url1') {
        setCctvUrl1('');
      } else if (urlType === 'url2') {
        setCctvUrl2('');
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      alert('Error fetching image: ' + (error.response?.statusText || error.message));
    }
  };

  // Handle image stitching
  const handleStitch = async () => {
    if (uploadedImages1.length !== 2) {
      console.error('Exactly two images are required to stitch.');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image1', uploadedImages1[0]);
    formData.append('image2', uploadedImages1[1]);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5173/image/stitch',
        formData,
        {
          responseType: 'blob',
        }
      );
      console.log(response.data);

      setStitchedImage(URL.createObjectURL(response.data));
      setUploadedImages([]);
    } catch (error) {
      console.error('Error stitching images:', error);
      setIsLoading(false);
    }
  };

  // Navigate to /singlepic page
  const goToSinglePic = () => {
    navigate('/singlepic'); // This will navigate to the /singlepic route
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Object Detection Demonstration</h2>
          <p className="text-gray-300 mb-6">
            This tool demonstrates object detection capabilities. Upload images, use the camera, or fetch from CCTV URLs.
          </p>

          <div className="flex gap-4 mb-6">
            <label className="hover:text-green-400 bg-green-600 border-green-600 hover:shadow font-bold text-white px-4 py-2 rounded cursor-pointer">
              + Upload Image 1
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </label>
            <label className="hover:text-blue-400 bg-blue-600 border-blue-600 hover:shadow font-bold text-white px-4 py-2 rounded cursor-pointer">
              + Upload Image 2
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </label>
          </div>

          <div className="flex gap-4 mb-6">
            <input type="text" className="flex-1 px-4 py-2 rounded bg-gray-700 text-white" placeholder="Enter CCTV URL... 1" value={cctvUrl1} onChange={(e) => setCctvUrl1(e.target.value)} />
            <button className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer" onClick={() => handleCCTVUrl('url1')}>Fetch Image</button>
          </div>
          <div className="flex gap-4 mb-6">
            <input type="text" className="flex-1 px-4 py-2 rounded bg-gray-700 text-white" placeholder="Enter CCTV URL... 2" value={cctvUrl2} onChange={(e) => setCctvUrl2(e.target.value)} />
            <button className="bg-orange-600 text-white px-4 py-2 rounded cursor-pointer" onClick={() => handleCCTVUrl('url2')}>Fetch Image</button>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="text-center">
                    <img src={image} alt={`Uploaded Preview ${index + 1}`} className="w-full rounded-lg" />
                    <div className="flex gap-4 mt-2 justify-center">
                      <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleDeleteImage(index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-300">
                {stitchedImage ? 'Stitched image uploaded.' : 'No images uploaded yet.'}
              </p>
            )}

            {uploadedImages.length === 2 && (
              <div className="mt-4 text-center">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleStitch}>Stitch Images</button>
              </div>
            )}

            {stitchedImage && (
              <div className="mt-6 text-center">
                <img src={stitchedImage} alt="Stitched Result" className="w-full max-w-md mx-auto rounded-lg" />
                <button className="bg-blue-600 text-white px-4 py-2 mt-4 rounded" onClick={handlePredict}>Predict</button>
              </div>
            )}

            {predictedCount && !isLoading && (
              <div className="mt-4 text-center">
                <p className="text-2xl font-semibold text-green-500">Predicted Count</p>
                <ul className="mt-2 text-lg text-red-700 list-disc pl-5">
                  <li><span className="font-medium text-blue-600">Total: {predictedCount.total}</span></li>
                  <li><span className="font-medium text-blue-600">Duplicates: {predictedCount.duplicates}</span></li>
                  <li><span className="font-medium text-blue-600">Originals: {predictedCount.originals}</span></li>
                </ul>
              </div>
            )}

            {isLoading && <div className="spinner-border animate-spin w-6 h-6 border-4 border-t-4 border-white rounded-full"></div>}
          </div>

          {isCameraOn && (
            <div className="mt-6 text-center">
              <video ref={videoRef} className="mx-auto rounded-lg" width="320" height="240" />
              <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded" onClick={capturePhoto}>Capture Photo</button>
            </div>
          )}
        </div>

        <div className="mt-8">
          {showSampleImages && (
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
          )}
          <button
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 mt-4 text-white rounded"
            onClick={toggleSampleImages}
          >
            {showSampleImages ? 'Hide Images' : 'Load Sample Inputs'}
          </button>
          </div>

          <div className="fixed bottom-4 right-4">
          {/* Add the new button for navigation */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-4 rounded-lg"
            onClick={goToSinglePic}
          >
            Go to SinglePic Page
          </button>
          </div>
        
      </main>
    </div>
  );
};

export default Doubleattendance;
