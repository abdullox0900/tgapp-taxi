import React from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function Done({ text, onClose, onRepeat }) {

  const isDarkMode = useDarkMode()

  return (
    <>
      <h3 style={{ textAlign: 'center' }} className={`${isDarkMode ? 'text-[#fff]' : ''
        } text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        {text}
      </h3>
      <div style={{ textAlign: 'center' }}>
        <button id={"rephoto"} style={{ width: 300 }} onClick={() => { onRepeat() }} className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]'>Перефотографировать этап</button>
        <button id={"cloe"} style={{ width: 300 }} onClick={() => { onClose() }} className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''
          } w-full font-bold px-[20px] py-[12px] rounded-[20px] text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}>Завершить 	<svg
            width='19'
            height='18'
            viewBox='0 0 19 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M18.4996 15.75L16.2498 18L9.49959 11.25L2.74968 18L0.499622 15.75L7.2498 8.99996L0.499622 2.24998L2.74968 -1.8e-05L9.49959 6.74996L16.2498 -1.8e-05L18.4996 2.24998L11.7497 8.99996L18.4996 15.75Z'
              fill={`${isDarkMode ? '#fff' : '#181C1E'}`}
            />
          </svg> </button>
      </div>
    </>
  )
}