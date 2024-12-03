import React, { useEffect, useRef, useState } from "react"

import { useDarkMode } from '../../contexts/DarkModeContext'

export default function TakePhoto({ initCamera, camera, code, onPhoto }) {

  const isDarkMode = useDarkMode()

  const videoRef = useRef(null)
  const videoWrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  let [frontMode, setFrontMode] = useState(false)
  let [photoData, setPhotoData] = useState(null)

  useEffect(() => {
    setPhotoData(null)
    init().catch((err) => { console.error("video init failed", err) })
  }, [code, camera])

  async function init() {
    console.log("[init]", videoRef.current)
    //
    videoRef.current.playsInline = true
    videoRef.current.style.display = 'block'
    //
    imgRef.current.style.display = 'none'

    if ('srcObject' in videoRef.current) {
      console.log("[init] srcObject =>", camera)
      videoRef.current.srcObject = camera
    } else {
      console.log("[init] src =>", camera)
      videoRef.current.src = window.URL.createObjectURL(camera)
    }

    videoRef.current.oncanplay = (ev) => {
      console.log("[init] video can play")
      videoRef.current.oncanplay = ""
    }
    videoRef.current.onplaying = (ev) => {
      console.log("[init] video is playing")
    }
    videoRef.current.onclick = () => {
      switchCamera()
    }

    tryPlay()
  }

  function tryPlay() {
    console.log("[video.play] starting play on target:", videoRef.current)

    // метод play возвращает promise
    videoRef.current.play()
      .then(() => {
        console.log("[video.play] video is playing")
      })
      .catch((err) => {
        console.log("[video.play]", err)
        if (err.name !== 'AbortError') {
          return
        }

        // не удалось воспроизвести видео
        const retry = !videoRef.current.muted

        // выключаем звук
        videoRef.current.playsInline = true
        videoRef.current.muted = true
        videoRef.current.volume = 0

        // пробуем воспроизвести еще раз
        retry && tryPlay()
      })
  }

  function switchCamera() {
    const mode = !frontMode
    initCamera(mode ? "user" : "environment")
      .then(res => {
        setFrontMode(mode)
      })
  }

  function takePhoto() {
    const imgWidth = videoRef.current.videoWidth
    const imgHeight = videoRef.current.videoHeight

    canvasRef.current.width = imgWidth
    canvasRef.current.height = imgHeight
    canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0, imgWidth, imgHeight)
    canvasRef.current.toBlob(function (blob) {
      setPhotoData(blob)
      onPhoto(blob)
    }, 'image/jpeg', 100)

    // set img source to created image
    imgRef.current.src = canvasRef.current.toDataURL('image/png')

    // hide video and show image
    videoRef.current.style.display = 'none'
    videoWrapperRef.current.style.display = 'none'
    imgRef.current.style.display = 'block'
  }

  return (
    <>
      <div className={`${isDarkMode ? 'bg-[#202427]' : ''
        } w-full h-[395px] bg-[#F5F5F5] rounded-[24px] mb-[20px]`} ref={videoWrapperRef} style={{ width: '395px' }}>
        <video
          id={`video_${code}`}
          ref={videoRef}
          width="100%"
          height="395px"
          style={{ height: '395px', border: '1px solid #ccc', borderRadius: '16px', margin: '0 auto' }}
          autoPlay muted loop
        />
      </div>
      <div>
        <canvas ref={canvasRef} width="99%" height="99%" style={{ display: 'none' }} />
        <img className={`${isDarkMode ? 'bg-[#202427]' : ''
          } overflow-hidden w-full h-[395px] bg-[#F5F5F5] rounded-[24px] mb-[20px]`} ref={imgRef} width="80%" height="395px"
          style={{ display: 'none', margin: '0 auto', borderRadius: '16px', border: '1px solid #ccc' }} />
      </div>
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        {
          photoData === null && (
            <button className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]' block color='primary' onClick={() => { takePhoto() }}>Сделать фото
              <svg
                width='25'
                height='24'
                viewBox='0 0 25 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <g clip-path='url(#clip0_3053_1814)'>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M7.1888 2.6032C7.51752 2.11008 7.96289 1.70574 8.48539 1.42607C9.0079 1.1464 9.59136 1.00004 10.184 1H14.816C15.4086 1.00004 15.9921 1.1464 16.5146 1.42607C17.0371 1.70574 17.4825 2.11008 17.8112 2.6032L18.7856 4.066C18.8952 4.2303 19.0437 4.365 19.2179 4.45815C19.392 4.55131 19.5865 4.60003 19.784 4.6H20.9C21.8548 4.6 22.7705 4.97928 23.4456 5.65442C24.1207 6.32955 24.5 7.24522 24.5 8.2V19C24.5 19.9548 24.1207 20.8705 23.4456 21.5456C22.7705 22.2207 21.8548 22.6 20.9 22.6H4.1C3.14522 22.6 2.22955 22.2207 1.55442 21.5456C0.879285 20.8705 0.5 19.9548 0.5 19V8.2C0.5 7.24522 0.879285 6.32955 1.55442 5.65442C2.22955 4.97928 3.14522 4.6 4.1 4.6H5.216C5.41351 4.60003 5.60798 4.55131 5.78214 4.45815C5.9563 4.365 6.10478 4.2303 6.2144 4.066L7.1888 2.6032ZM10.1 13C10.1 12.3635 10.3529 11.753 10.8029 11.3029C11.253 10.8529 11.8635 10.6 12.5 10.6C13.1365 10.6 13.747 10.8529 14.1971 11.3029C14.6471 11.753 14.9 12.3635 14.9 13C14.9 13.6365 14.6471 14.247 14.1971 14.6971C13.747 15.1471 13.1365 15.4 12.5 15.4C11.8635 15.4 11.253 15.1471 10.8029 14.6971C10.3529 14.247 10.1 13.6365 10.1 13ZM12.5 8.2C11.227 8.2 10.0061 8.70571 9.10589 9.60589C8.20571 10.5061 7.7 11.727 7.7 13C7.7 14.273 8.20571 15.4939 9.10589 16.3941C10.0061 17.2943 11.227 17.8 12.5 17.8C13.773 17.8 14.9939 17.2943 15.8941 16.3941C16.7943 15.4939 17.3 14.273 17.3 13C17.3 11.727 16.7943 10.5061 15.8941 9.60589C14.9939 8.70571 13.773 8.2 12.5 8.2Z'
                    fill='#181C1E'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_3053_1814'>
                    <rect
                      width='24'
                      height='24'
                      fill='white'
                      transform='translate(0.5)'
                    />
                  </clipPath>
                </defs></svg>
            </button>
          )
        }
        {
          photoData !== null && (
            <button className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] mb-[20px] text-[24px] text-[#181C1E]' block color='primary' onClick={() => {
              setPhotoData(null)
              init().catch((err) => { console.error("video init failed", err) })
            }}>Новое фото</button>
          )
        }
      </div>
    </>
  )
}