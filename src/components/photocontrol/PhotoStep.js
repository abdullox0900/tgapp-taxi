import React, { useEffect, useState } from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'
import TakePhoto from "../common/TakePhoto"

export default function PhotoStep({ initCamera, camera, code, title, keyboard, repeatMode, onNext, onNextOption, onPrev, onCancel }) {
  let [stepPhoto, setStepPhoto] = useState(null)

  const isDarkMode = useDarkMode()

  useEffect(() => {
    setStepPhoto(null)
  }, [code])

  useEffect(() => {
    console.log("[stepPhoto]", stepPhoto)
  }, [stepPhoto])

  // Tugma stilini aniqlash uchun funksiya
  const getButtonStyle = (buttonTitle) => {
    if (buttonTitle.toLowerCase() === 'нет') {
      return 'bg-[#FF3B30] text-white' // Qizil tugma
    }
    return 'bg-[#FFD12E] text-[#181C1E]' // Default sariq tugma
  }

  return (
    <div className='container'>
      <h2 style={{ textAlign: 'center' }} className={`${isDarkMode ? 'text-[#fff]' : ''
        } text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        {title}
      </h2>

      <div>
        <TakePhoto code={code} initCamera={initCamera} camera={camera} onPhoto={(data) => {
          setStepPhoto(data)
        }} />
      </div>

      <div style={{ textAlign: 'center' }} >
        {
          keyboard.map((item) => (
            <button
              key={item.code}
              className={`flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] mb-[20px] rounded-[20px] font-proxima text-[24px] ${getButtonStyle(item.title)}`}
              id={item.code}
              onClick={() => {
                onNextOption(item.title)
              }}
            >
              {item.title}
            </button>
          ))
        }
        <div className='flex items-center justify-center gap-[20px] w-full'>
          {/* "Назад" tugmasi */}
          {!repeatMode && (
            <button
              className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
              id={"prev"}
              onClick={() => { onPrev() }}
            >
              Назад
            </button>
          )}

          {/* "Далее" tugmasi faqat rasm olingandan keyin ko'rinadi */}
          {stepPhoto && (
            <button
              className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
              id={"next"}
              onClick={() => { onNext(stepPhoto) }}
            >
              Далее
            </button>
          )}
        </div>
      </div>
    </div>
  )
}