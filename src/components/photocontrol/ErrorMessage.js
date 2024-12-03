import React from "react";
import {Button} from "antd-mobile";

export default function ErrorMessage({onOK, text}) {
    return (
      <>
        <h3 style={{textAlign: 'center'}}>
          {text}
        </h3>
        <div style={{textAlign: 'center'}}>
          <Button onClick={() => {onOK()}}>Закрыть</Button>
        </div>
      </>
    )
}