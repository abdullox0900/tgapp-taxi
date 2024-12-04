import React from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function Done({ text, onClose, onRepeat }) {
  const isDarkMode = useDarkMode()

  return (
    <div className='container'>
      <h2 className={`${isDarkMode ? 'text-[#fff]' : ''} text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        {text}
      </h2>
      <div className='flex flex-col gap-4'>
        <button
          id="rephoto"
          onClick={() => { onRepeat() }}
          className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]'
        >
          Перефотографировать этап
        </button>
        <button
          id="close"
          onClick={() => { onClose() }}
          className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} flex items-center justify-center gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
        >
          Завершить
          <svg width='19' height='18' viewBox='0 0 19 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M18.4996 15.75L16.2498 18L9.49959 11.25L2.74968 18L0.499622 15.75L7.2498 8.99996L0.499622 2.24998L2.74968 -1.8e-05L9.49959 6.74996L16.2498 -1.8e-05L18.4996 2.24998L11.7497 8.99996L18.4996 15.75Z'
              fill={isDarkMode ? '#fff' : '#181C1E'}
            />
          </svg>
        </button>
      </div>
    </div>
  )
}