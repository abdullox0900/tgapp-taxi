import React from "react";
import {Button, Space} from "antd-mobile";

export default function Done({text, onClose, onRepeat}) {
  return (
    <>
      <h3 style={{textAlign: 'center'}}>
        {text}
      </h3>
      <div style={{textAlign: 'center'}}>
        <Space direction={"vertical"} style={{width: '90%'}}>
          <Button id={"rephoto"} style={{width: 300}} onClick={() => { onRepeat() }}>Перефотографировать этап</Button>
          <Button id={"cloe"} style={{width: 300}} onClick={() => { onClose() }}>Завершить</Button>
        </Space>
      </div>
    </>
  )
}