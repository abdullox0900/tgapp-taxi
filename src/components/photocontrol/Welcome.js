import React from "react";
import {Button} from "antd-mobile";

export default function Welcome({initCamera, onOK}) {
    return (
      <>
        <h3 style={{textAlign: 'center'}}>
          Для выполнения фотоконтроля необходимо выполнить несколько шагов проверок
        </h3>
        <div style={{textAlign: 'center'}}>
          <Button
            onClick={() => {
              initCamera("environment")
                .then(res => { onOK(); })
            }}>Продолжить</Button>
        </div>
      </>
    )
}