import React from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function Cancel({ text, onOK }) {
  const isDarkMode = useDarkMode()

  return (
    <div className='container'>
      <h2 className={`${isDarkMode ? 'text-[#fff]' : ''} text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        {text}
      </h2>
      <div>
        <button
          onClick={() => { onOK() }}
          className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} flex items-center justify-center gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
        >
          Закрыть приложение
        </button>
      </div>
    </div>
  )
}