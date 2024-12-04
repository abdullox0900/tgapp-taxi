import React from "react"
import ImgStep1 from '../../assets/img/img-people.png'
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function Resume({ initCamera, onResume, onReset }) {
  const isDarkMode = useDarkMode()

  return (
    <div className='container'>
      <h2 className={`${isDarkMode ? 'text-[#fff]' : ''} text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        У вас есть незавершенный фотоконтроль. Хотите продолжить?
      </h2>

      <div className={`${isDarkMode ? 'bg-[#202427]' : ''} mx-auto relative rounded-[24px] bg-[#F5F5F5] w-[343px] h-[435px] mb-[20px]`}>
        <img
          className='absolute left-[50%] bottom-0 translate-x-[-50%]'
          src={ImgStep1}
          alt=''
        />
      </div>

      <div className='flex flex-col gap-4'>
        <button
          onClick={() => {
            initCamera("environment")
              .then(res => { onResume() })
          }}
          className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]'
        >
          Продолжить
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#clip0_3053_1686)'>
              <path
                d='M1.90735e-06 10.4848V13.5152H18.1818L9.84848 21.8485L12 24L24 12L12 0L9.84848 2.15152L18.1818 10.4848H1.90735e-06Z'
                fill='#181C1E'
              />
            </g>
            <defs>
              <clipPath id='clip0_3053_1686'>
                <rect width='24' height='24' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </button>

        <button
          onClick={() => { onReset() }}
          className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} flex items-center justify-center gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
        >
          Начать заново
        </button>
      </div>
    </div>
  )
}