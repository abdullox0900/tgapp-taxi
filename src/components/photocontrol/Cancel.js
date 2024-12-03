import React from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function Cancel({ text, onOK }) {
  const isDarkMode = useDarkMode()

  return (
    <>
      <h3 style={{ textAlign: 'center' }} className={`${isDarkMode ? 'text-[#fff]' : ''
        } text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        {text}
      </h3>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => { onOK() }} className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''
          } flex items-center gap-[20px] w-full font-bold px-[20px] py-[12px] rounded-[20px] text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}>Закрыть приложение </button>
      </div>
    </>
  )
}