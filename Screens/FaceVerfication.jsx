import * as Camera from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import { useState, useEffect } from "react";

const FaceVerification = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Permission denied.</Text>;
  }

  const handleFaceDetection = async (photoUri) => {
    const faceData = await FaceDetector.detectFacesAsync(photoUri);

    if (faceData.faces.length > 0) {
      // Send photo to the backend for face verification
      verifyIdentity(photoUri);
    } else {
      alert("No face detected. Please try again.");
    }
  };

  const capturePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri);
      handleFaceDetection(photo.uri);
    }
  };

  const verifyIdentity = async (photoUri) => {
    const formData = new FormData();
    formData.append("image", {
      uri: photoUri,
      type: "image/jpeg",
      name: "userFace.jpg",
    });

    const response = await fetch("your-backend-url/verify-face", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.isVerified) {
      markCheckIn();
    } else {
      alert("Face verification failed.");
    }
  };

  const markCheckIn = () => {
    // Mark the check-in as completed in your backend
    console.log("Check-in marked!");
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        ref={(ref) => setCameraRef(ref)}
      >
        <Button title="Capture" onPress={capturePhoto} />
      </Camera>
    </View>
  );
};

export default FaceVerification;
