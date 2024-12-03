import { Button, Space } from "antd-mobile"
import React, { useEffect, useState } from "react"

export default function TextInputStep({ code, title, keyboard, repeatMode, onNext, onPrev, onCancel }) {
  let [stepText, setStepText] = useState("")

  useEffect(() => {
    setStepText("")
  }, [code])

  return (
    <>
      <h3 style={{ textAlign: 'center' }}>
        {title}
      </h3>

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <textarea rows={4}
          style={{
            width: '90%',
            height: '150px',
            padding: '12px 20px',
            boxSizing: 'border-box',
            border: '2px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f8f8f8',
            fontSize: '16px', resize: 'none'
          }}
          onChange={(e) => { setStepText(e.target.value) }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <Space direction={"vertical"} style={{ width: '90%' }}>
          {
            keyboard.map((item, index) => (
              <Button id={item.code} block color='primary' onClick={() => {
                onNext(item.title)
              }}>{item.title}</Button>
            ))
          }
          <Button id={"next"} block color='primary' onClick={() => {
            if (!stepText) {
              alert(title)
              return
            }
            onNext(stepText)
          }}>Далее</Button>
          {
            !repeatMode && (
              <Button id={"prev"} block color='primary' onClick={() => { onPrev() }}>Назад</Button>
            )
          }
          {/* <Button id={"cancel"} block color='primary' onClick={() => { onCancel() }}>Отмена</Button> */}
        </Space>
      </div>
    </>
  )
}