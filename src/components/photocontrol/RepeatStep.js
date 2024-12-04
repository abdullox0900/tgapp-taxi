import React from "react"
import { useDarkMode } from '../../contexts/DarkModeContext'

export default function RepeatStep({ workflow, onStepSelected, onOK, onCancel }) {
  const isDarkMode = useDarkMode()

  return (
    <div className='container'>
      <h2 className={`${isDarkMode ? 'text-[#fff]' : ''} text-[24px] mb-[20px] font-proxima font-bold text-center`}>
        Выберите этап для перефотографирования
      </h2>

      <div className='flex flex-col gap-4'>
        {workflow.map((item) => (
          <button
            key={item.code}
            className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]'
            onClick={() => {
              onStepSelected(item.code)
            }}
          >
            {item.menu_item}
          </button>
        ))}

        <div className='flex items-center justify-center gap-[20px] w-full'>
          <button
            className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
            onClick={() => {
              onCancel()
            }}
          >
            Отмена
          </button>

          <button
            className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''} w-full px-[20px] py-[12px] rounded-[20px] font-bold text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
            onClick={() => {
              onOK()
            }}
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  )
}