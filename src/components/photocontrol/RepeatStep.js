import React  from "react";
import {Button, Space} from "antd-mobile";

export default function RepeatStep(props) {
  return (
    <>
      <h3 style={{textAlign: 'center'}}>
        Выберите этап контроля для изменения
      </h3>

      <div style={{textAlign: 'center'}}>
        <Space direction={"vertical"} style={{width: '90%'}}>
          {
            props.workflow
              .filter(item => item.menu_item)
              .map((item, index) => (
                <Button key={item.code} block color='default' onClick={() => {
                  props.onStepSelected(item.code)
                }}>{item.menu_item}</Button>
              ))
          }
          <Button key={"ok"} block color='primary' onClick={() => { props.onOK() }}>Завершить</Button>
          <Button key={"cancel"} block color='primary' onClick={() => { props.onCancel() }}>Отменить контроль</Button>
        </Space>
      </div>
    </>
  )
}