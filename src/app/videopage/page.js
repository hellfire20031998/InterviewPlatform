'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPage() {
  const videoRef = useRef();
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef();
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    async function getStream() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prev => [...prev, event.data]);
        }
      };
    }

    getStream();
  }, []);

  const startRecording = () => {
    setRecordedChunks([]);
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Live Stream & Recording</h2>
      <video ref={videoRef} autoPlay playsInline width={600}></video>
      <div>
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
        {recordedChunks.length > 0 && <button onClick={downloadRecording}>Download</button>}
      </div>
    </div>
  );
}
