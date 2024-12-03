import { Button, Space } from "antd-mobile"
import React, { useEffect, useState } from "react"
import TakePhoto from "../common/TakePhoto"

export default function PhotoStep({ initCamera, camera, code, title, keyboard, repeatMode, onNext, onNextOption, onPrev, onCancel }) {
  let [stepPhoto, setStepPhoto] = useState(null)

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

      <div style={{ margin: '10px 0' }}>
        <TakePhoto code={code} initCamera={initCamera} camera={camera} onPhoto={(data) => {
          setStepPhoto(data)
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
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
              <Button className='flex items-center justify-center mx-auto gap-[20px] w-full px-[20px] py-[12px] rounded-[20px] bg-[#FFD12E] font-proxima text-[24px] text-[#181C1E]' id={item.code} block color='primary' onClick={() => {
                onNextOption(item.title)
              }}>{item.title}</Button>
            ))
          }
          {
            !repeatMode && (
              <Button id={"prev"} block color='primary' onClick={() => { onPrev() }}>Назад</Button>
            )
          }
          <Button id={"cancel"} block color='primary' onClick={() => { onCancel() }}>Отмена</Button>
        </Space>
      </div>
    </div>
  )
}