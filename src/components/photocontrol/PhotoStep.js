import React, {useEffect, useState} from "react";
import {Button, Space} from "antd-mobile";
import TakePhoto from "../common/TakePhoto";

export default function PhotoStep({initCamera, camera, code, title, keyboard, repeatMode, onNext, onNextOption, onPrev, onCancel}) {
  let [stepPhoto, setStepPhoto] = useState(null);

  useEffect(() => {
    setStepPhoto(null);
  }, [code])

  useEffect(() => {
    console.log("[stepPhoto]", stepPhoto);
  }, [stepPhoto])

  return (
    <>
      <h2 style={{textAlign: 'center'}}>
        {title}
      </h2>

      <div style={{margin: '10px 0'}}>
        <TakePhoto code={code} initCamera={initCamera} camera={camera} onPhoto={(data) => {
          setStepPhoto(data);
        }}/>
      </div>

      <div style={{textAlign: 'center'}}>
        <Space direction={"vertical"} style={{width: '90%'}}>
          {
            stepPhoto !== null && (
              <Button id={"next"} block color='primary' onClick={() => {
                onNext(stepPhoto);
              }}>Далее</Button>
            )
          }
          {
            keyboard.map((item) => (
              <Button id={item.code} block color='primary' onClick={() => {
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
    </>
  )
}