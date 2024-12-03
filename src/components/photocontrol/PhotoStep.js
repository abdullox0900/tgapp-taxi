import { Button, Space } from "antd-mobile"
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

  return (
    <div className='container'>
      <h2 style={{ textAlign: 'center' }} className='text-[24px] mb-[20px] font-proxima font-bold text-center leading-[28px]'>
        {title}
      </h2>

      <div className={`${isDarkMode ? 'bg-[#202427]' : ''
        } w-full h-[395px] bg-[#F5F5F5] rounded-[24px] mb-[20px]`}>
        <TakePhoto code={code} initCamera={initCamera} camera={camera} onPhoto={(data) => {
          setStepPhoto(data)
        }} />
      </div>

      <div style={{ textAlign: 'center' }} >
        <Space direction={"vertical"} style={{ width: '90%' }}>
          {
            stepPhoto !== null && (
              <Button id={"next"} block color='primary' onClick={() => {
                onNext(stepPhoto)
              }}>Далее</Button>
            )
          }
          {
            keyboard.map((item) => (
              <button className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]' id={item.code} block color='primary' onClick={() => {
                onNextOption(item.title)
              }}>{item.title}</button>
            ))
          }
          {
            !repeatMode && (
              <Button className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''
                } font-bold font-[ProximaNova] text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`} id={"prev"} block color='primary' onClick={() => { onPrev() }}>Назад</Button>
            )
          }
          <Button className={`${isDarkMode ? 'text-[#fff] border-[#fff]' : ''
            } font-bold font-[ProximaNova] text-[24px] text-[#181C1E] bg-transparent border-[2px] border-solid border-[#181C1E]`}
            id={"cancel"} block color='primary' onClick={() => { onCancel() }}>Отмена</Button>
        </Space>
      </div>
    </div>
  )
}