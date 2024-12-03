import React, {useEffect, useState, useRef} from "react";

import {Button, Space} from "antd-mobile";

export default function TakePhoto({initCamera, camera, code, onPhoto}) {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  let [frontMode, setFrontMode] = useState(false)
  let [photoData, setPhotoData] = useState(null);

  useEffect(() => {
    setPhotoData(null);
    init().catch((err) => { console.error("video init failed", err) });
  }, [code, camera])

  async function init() {
    console.log("[init]", videoRef.current);
    //
    videoRef.current.playsInline = true;
    videoRef.current.style.display = 'block';
    //
    imgRef.current.style.display = 'none';

    if ('srcObject' in videoRef.current) {
      console.log("[init] srcObject =>", camera);
      videoRef.current.srcObject = camera;
    } else {
      console.log("[init] src =>", camera);
      videoRef.current.src = window.URL.createObjectURL(camera);
    }

    videoRef.current.oncanplay = (ev) => {
      console.log("[init] video can play");
      videoRef.current.oncanplay = "";
    }
    videoRef.current.onplaying = (ev) => {
      console.log("[init] video is playing");
    }
    videoRef.current.onclick = () => {
      switchCamera();
    }

    tryPlay();
  }

  function tryPlay() {
    console.log("[video.play] starting play on target:", videoRef.current);

    // метод play возвращает promise
    videoRef.current.play()
      .then(() => {
        console.log("[video.play] video is playing");
      })
      .catch((err) => {
        console.log("[video.play]", err);
        if (err.name !== 'AbortError') {
          return;
        }

        // не удалось воспроизвести видео
        const retry = !videoRef.current.muted;

        // выключаем звук
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.volume = 0;

        // пробуем воспроизвести еще раз
        retry && tryPlay();
      });
  }

  function switchCamera() {
    const mode = !frontMode;
    initCamera(mode ? "user" : "environment")
      .then(res => {
        setFrontMode(mode);
      })
  }

  function takePhoto() {
    const imgWidth = videoRef.current.videoWidth;
    const imgHeight = videoRef.current.videoHeight;

    canvasRef.current.width = imgWidth;
    canvasRef.current.height = imgHeight;
    canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0, imgWidth, imgHeight);
    canvasRef.current.toBlob(function (blob) {
      setPhotoData(blob);
      onPhoto(blob);
    }, 'image/jpeg', 100);

    // set img source to created image
    imgRef.current.src = canvasRef.current.toDataURL('image/png')

    // hide video and show image
    videoRef.current.style.display = 'none';
    imgRef.current.style.display = 'block';
  }

  return (
    <>
      <div>
        <video
          id={`video_${code}`}
          ref={videoRef}
          width="90%"
          height="495px"
          style={{border: '1px solid #ccc', borderRadius: '5px', margin: '0 auto'}}
          autoPlay muted loop
        />
      </div>
      <div>
        <canvas ref={canvasRef} width="99%" height="99%" style={{display: 'none'}}/>
        <img ref={imgRef} width="90%" height="495px"
             style={{display: 'none', margin: '0 auto', borderRadius: '5px', border: '1px solid #ccc'}}/>
      </div>
      <div style={{textAlign: 'center', margin: '10px 0'}}>
        {
          photoData === null && (
            <Space direction={"vertical"} style={{width: '90%'}}>
              <Button block color='primary' onClick={() => { takePhoto() }}>Сделать фото</Button>
            </Space>
          )
        }
        {
          photoData !== null && (
            <Space direction={"vertical"} style={{width: '90%'}}>
              <Button block color='primary' onClick={() => {
                setPhotoData(null);
                init().catch((err) => { console.error("video init failed", err) });
              }}>Новое фото</Button>
            </Space>
          )
        }
      </div>
    </>
  )
}