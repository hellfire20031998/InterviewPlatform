'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VideoPage() {
  const localVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(5);
  const [intervalId, setIntervalId] = useState(null);
  const router = useRouter();

  // Start camera on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => console.error("Webcam error:", err));
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          stopInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const startInterview = () => {
    setRecordedChunks([]);
    setTimer(duration * 60);
    setIsRunning(true);

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordedChunks((prev) => [...prev, e.data]);
      }
    };

    recorder.start();
  };

  const stopInterview = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRunning(false);
    clearInterval(intervalId);
  };

  const addOneMinute = () => {
    setTimer((prev) => prev + 60);
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEndInterview = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (intervalId) clearInterval(intervalId);
    setIsRunning(false);
    setTimer(0);
    setRecordedChunks([]);

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    router.push('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎥 Video Interview</h1>

      <div style={styles.controls}>
        <label>
          Duration (min):&nbsp;
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="1"
            max="60"
            disabled={isRunning}
            style={styles.input}
          />
        </label>

        <div style={styles.buttonGroup}>
          <button onClick={startInterview} disabled={isRunning} style={styles.button}>Start</button>
          <button onClick={stopInterview} disabled={!isRunning} style={{ ...styles.button, backgroundColor: '#dc3545' }}>Stop</button>
          <button onClick={addOneMinute} disabled={!isRunning} style={{ ...styles.button, backgroundColor: '#ffc107', color: '#000' }}>+1 Min</button>
          {recordedChunks.length > 0 && (
            <button onClick={downloadVideo} style={{ ...styles.button, backgroundColor: '#28a745' }}>Download</button>
          )}
          <button
            onClick={handleEndInterview}
            style={{ ...styles.button, backgroundColor: '#6c757d' }}
          >
            End Interview
          </button>
        </div>
      </div>

      <h2 style={styles.timer}>⏱ {formatTime(timer)}</h2>

      <div style={styles.videoContainer}>
        <div style={styles.videoBox}>
          <h3>📹 Local Stream</h3>
          <video ref={localVideoRef} autoPlay muted style={styles.video} />
        </div>

        <div style={styles.videoBox}>
          <h3>🌐 Remote Stream</h3>
          <div style={styles.remotePlaceholder}>Remote feed (placeholder)</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center'
  },
  heading: {
    fontSize: '26px',
    marginBottom: '20px'
  },
  controls: {
    marginBottom: '20px'
  },
  input: {
    padding: '5px',
    width: '60px',
    marginRight: '10px'
  },
  buttonGroup: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  timer: {
    fontSize: '22px',
    color: '#333'
  },
  videoContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '30px'
  },
  videoBox: {
    maxWidth: '100%',
    textAlign: 'center'
  },
  video: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    border: '2px solid #444',
    borderRadius: '8px'
  },
  remotePlaceholder: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    backgroundColor: '#f1f1f1',
    border: '2px dashed #aaa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#555',
    borderRadius: '8px'
  }
};
