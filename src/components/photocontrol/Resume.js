import React from "react";
import {Button, Space} from "antd-mobile";

export default function Resume({initCamera, onResume, onReset}) {
    return (
      <>
        <h3 style={{textAlign: 'center'}}>
          Обнаружен не завершенный контроль, продолжить или начать заново?
        </h3>
        <div style={{textAlign: 'center'}}>
          <Space direction={"vertical"} style={{width: '90%'}}>
            <Button block color='primary'
              onClick={() => {
                initCamera("environment")
                  .then((stream) => { onResume(); })
                  .catch(() => {  })
              }}>Продолжить</Button>
            <Button block color='primary'
              onClick={() => {
                initCamera("environment")
                  .then((stream) => { onReset(); })
                  .catch(() => {  })
              }}>Пройти заново</Button>
          </Space>
        </div>
      </>
  )
}