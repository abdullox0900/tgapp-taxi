import React from "react";
import {Button} from "antd-mobile";

export default function Cancel({text, onOK}) {
  return (
    <>
      <h3 style={{textAlign: 'center'}}>
        {text}
      </h3>
      <div style={{textAlign: 'center'}}>
        <Button onClick={() => { onOK() }}>Закрыть приложение</Button>
      </div>
    </>
  )
}