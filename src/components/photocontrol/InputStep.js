import React, { useEffect, useState } from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function TextInputStep({ code, title, keyboard, repeatMode, onNext, onPrev, onCancel }) {
  const [stepText, setStepText] = useState("")
  const isDarkMode = useDarkMode()

  useEffect(() => {
    setStepText("")
  }, [code])

  return (
    <div className='container'>
      <h2 style={{ textAlign: 'center' }}
        className={`${isDarkMode ? 'text-[#fff]' : ''} text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        {title}
      </h2>

      <div className="mb-[20px]">
        <textarea
          rows={4}
          value={stepText}
          className={`w-full h-[150px] p-[12px] rounded-[16px] text-[16px] resize-none outline-none
            ${isDarkMode
              ? 'bg-[#202427] text-white border-[#fff] border-[1px]'
              : 'bg-[#f8f8f8] text-[#181C1E] border-[#ccc] border-[2px]'}`}
          onChange={(e) => { setStepText(e.target.value) }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        {keyboard.map((item) => (
          <button
            key={item.code}
            className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E] mb-[12px]'
            id={item.code}
            onClick={() => {
              onNext(item.title)
            }}
          >
            {item.title}
          </button>
        ))}

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

          {/* "Далее" tugmasi */}
          <button
            className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
            id={"next"}
            onClick={() => {
              if (!stepText) {
                alert(title)
                return
              }
              onNext(stepText)
            }}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  )
}