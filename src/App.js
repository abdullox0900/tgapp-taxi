import React, {useEffect, useState} from "react";
import { SafeArea} from 'antd-mobile'

import Welcome from "./components/photocontrol/Welcome";
import Done from "./components/photocontrol/Done";
import PhotoStep from "./components/photocontrol/PhotoStep";
import TextInputStep from "./components/photocontrol/InputStep";
import ErrorMessage from "./components/photocontrol/ErrorMessage";
import Cancel from "./components/photocontrol/Cancel";
import RepeatStep from "./components/photocontrol/RepeatStep";
import Loading from "./components/photocontrol/Loading";
import Resume from "./components/photocontrol/Resume";

import './App.css';
import {apiClient} from "./services/ApiClient";

const STEP_WELCOME = "welcome";
const STEP_DONE = "done";
const STEP_CANCEL = "cancel";
const STEP_REPEAT = "repeat";
const STEP_RESUME = "resume";

const INIT_STATE = {step: STEP_WELCOME, id: "", repeatMode: false};

function App() {

  let [workflowState, setWorkflowState] = useState(INIT_STATE);
  let [tgApp, setTgApp] = useState(null);
  let [workflow, setWorkflow] = useState([]);
  let [isAuthenticated, setAuthenticated] = useState(false);
  let [camera, setCamera] = useState(null);
  let [resumeStep, setResumeStep] = useState(null);

  useEffect(() => {
    if(window.Telegram?.WebApp) {
      if(!window.Telegram.WebApp.isExpanded) {
        window.Telegram.WebApp.expand();
      }
      // if(!window.Telegram.WebApp.isFullscreen) {
      //   window.Telegram.WebApp.requestFullscreen();
      // }

      window.Telegram.WebApp.enableClosingConfirmation();

      setTgApp(window.Telegram.WebApp);

      console.log("[initData]", window.Telegram.WebApp.initData);
      console.log("[initDataUnsafe]", window.Telegram.WebApp.initDataUnsafe);
    }

    if(!isAuthenticated) {
      // apiClient.authTrusted(window.Telegram.WebApp.initDataUnsafe.user.username, {"tg_uid": String(window.Telegram.WebApp.initDataUnsafe.user.id)})
      apiClient.authTrusted("1251546567", {"tg_uid": "1251546567"})
        .then(() => {
          setAuthenticated(true);
          console.log("authenticated");
        })
        .catch(err => console.error("[authTrusted]", err));
    }
  }, []);

  useEffect(() => {
    if(isAuthenticated) {
      // login
      apiClient.getWorkflowDescription()
        .then(res => {
          //
          const description = res.description.steps;
          setWorkflow(description)

          // load current state
          apiClient.getWorkflowState()
            .then(res => {
              console.log("[getWorkflowState]", res);
              if(!res.step) {
                setWorkflowState({step: STEP_WELCOME, id: res.id})
                return
              }
              // ask for resume process
              setResumeStep(nextStep(res.step, description));
              setWorkflowState({step: STEP_RESUME, id: res.id})
            })
            .catch(err => {
              console.error("[getWorkflowState]", err)
              if(err.status === 404) {
                apiClient.createWorkflowState()
                  .then(res => {
                    setWorkflowState({step: STEP_WELCOME, id: res.id})
                  })
                  .catch(err => {
                    console.error("[createWorkflowState]", err)
                    tgApp.showAlert("Ошибка, повторите позже или обратитесь в поддержку");
                  })
              }
            });
        })
        .catch(err => {
          console.error("[getWorkflowDescription]", err);
          tgApp.showAlert("Ошибка, повторите позже или обратитесь в поддержку");
        });
    } else {
      setWorkflow([]);
      setWorkflowState(INIT_STATE);
    }
  }, [isAuthenticated]);

  // debug
  useEffect(() => {
    console.log("[workflow]", workflow);
  }, [workflow])

  useEffect(() => {
    console.log("[workflowState]", workflowState);
  }, [workflowState])

  useEffect(() => {
    console.log("[camera]", camera);
  }, [camera])

  const isReady = () => {
    if(!workflowState.step || !workflow || workflow.length === 0) {
      return false;
    }
    return true;
  }

  const initCamera = (mode) => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(
        {
          video: {
            facingMode: {
              ideal: mode
            }
          },
          audio: false
        })
        .then(stream => {
          setCamera(stream);
          resolve(stream);
        })
        .catch(err => {
          console.log("[init] video stream query failed")
          tgApp.showAlert("Для продолжения необходимо разрешить доспуп к камере");
          reject();
        })
    })
  }

  const nextStep = (step, description) => {
    let currentIndex = description.findIndex(el => el.code === step);
    if(currentIndex < 0) {
      return STEP_WELCOME;
    }
    let nextIndex = currentIndex + 1;
    if(nextIndex >= description.length) {
      return STEP_DONE;
    }
    return description[nextIndex].code;
  }

  const prevStep = () => {
    let currentIndex = workflow.findIndex(el => el.code === workflowState.step);
    if(currentIndex < 0) {
      return STEP_WELCOME;
    }
    let nextIndex = currentIndex - 1;
    if(nextIndex === 0) {
      return STEP_WELCOME;
    }
    return workflow[nextIndex].code;
  }

  /**
   * @param {{code: string, text: string, menu_item: string, reply_types: string[], keyboard: {title: string, code: string}[]}} stepInfo
   */
  const renderPhotoStep = (stepInfo) => {
    return (
      <PhotoStep
        initCamera={initCamera}
        camera={camera}
        code={stepInfo.code}
        title={stepInfo.text}
        replyTypes={stepInfo.reply_types || []}
        keyboard={stepInfo.keyboard || []}
        repeatMode={workflowState.repeatMode}
        onNext={(result) => {
          apiClient.updateWorkflowStateFile(workflowState.id, workflowState.step, {"photo": result})
            .then(res => {
              let next = nextStep(workflowState.step, workflow)
              if(workflowState.repeatMode) {
                next = STEP_REPEAT;
              }
              setWorkflowState({...workflowState, step: next});
            })
            .catch(err => {
              console.error("[updateWorkflowState]", err);
              tgApp.showAlert("Ошибка");
            })
        }}
        onNextOption={(result) => {
          apiClient.updateWorkflowState(workflowState.id, workflowState.step, {"reply_message": result})
            .then(res => {
              let next = nextStep(workflowState.step, workflow)
              if(workflowState.repeatMode) {
                next = STEP_REPEAT;
              }
              setWorkflowState({...workflowState, step: next});
            })
            .catch(err => {
              console.error("[updateWorkflowState]", err);
              tgApp.showAlert("Ошибка");
            })
        }}
        onPrev={() => {
          setWorkflowState({...workflowState, step: prevStep()});
        }}
        onCancel={() => {
          apiClient.cancelWorkflow(workflowState.id)
            .then(res => {
              let next = STEP_CANCEL;
              if(workflowState.repeatMode) {
                next = STEP_REPEAT;
              }
              setWorkflowState({...workflowState, step: next})
            })
            .catch(err => {
              console.error(err);
              tgApp.showAlert("Ошибка");
            })
        }}
      />
    )
  }

  /**
   * @param {{code: string, text: string, menu_item: string, reply_types: string[], keyboard: {title: string, code: string}[]}} stepInfo
   */
  const renderTextStep = stepInfo => {
    return (
      <TextInputStep
        code={stepInfo.code}
        title={stepInfo.text}
        replyTypes={stepInfo.reply_types}
        keyboard={stepInfo.keyboard}
        repeatMode={workflowState.repeatMode}
        onNext={(result) => {
          apiClient.updateWorkflowState(workflowState.id, workflowState.step, {"reply_message": result})
            .then(res => {
              let next = nextStep(workflowState.step, workflow)
              if(workflowState.repeatMode) {
                next = STEP_REPEAT;
              }
              setWorkflowState({...workflowState, step: next});
            })
            .catch(err => {
              console.error("updateWorkflowState", err);
              tgApp.showAlert("Ошибка");
            })
        }}
        onPrev={() => {
          setWorkflowState({...workflowState, step: prevStep()});
        }}
        onCancel={() => {
          apiClient.cancelWorkflow(workflowState.id)
            .then(res => {
              let next = STEP_CANCEL;
              if(workflowState.repeatMode) {
                next = STEP_REPEAT;
              }
              setWorkflowState({...workflowState, step: next})
            })
            .catch(err => {
              console.error(err);
              tgApp.showAlert("Ошибка");
            })
        }}
      />
    )
  };

  function renderRepeatStep() {
    return (
      <RepeatStep
        workflow={workflow}
        onStepSelected={(step) => {
          setWorkflowState({...workflowState, step: step})
        }}
        onOK={() => {
          setWorkflowState({...workflowState, step: STEP_DONE})
        }}
        onCancel={() => {
          apiClient.cancelWorkflow(workflowState.id)
            .then(res => {
              setWorkflowState({...workflowState, step: STEP_CANCEL})
            })
            .catch(err => {
              console.error(err);
              tgApp.showAlert("Ошибка");
            })
        }}
      />
    )
  }

  const renderCurrentStep = () => {
    if(!isReady()) {
      return (
        <Loading/>
      )
    }

    if(workflowState.step === STEP_DONE) {
      return (
        <Done
          text={"Фотоконтроль завершен"}
          onClose={() => {
            apiClient.submitWorkflow(workflowState.id)
              .then(res => {
                tgApp?.close();
                setWorkflowState(INIT_STATE);
              })
              .catch(err => {
                console.log(err);
              })
          }}
          onRepeat={() => {
            setWorkflowState({...workflowState, step: STEP_REPEAT, repeatMode:  true});
          }}
        />
      )
    }

    if(workflowState.step === STEP_CANCEL) {
      return (
        <Cancel
          text={"Фотоконтроль отменен"}
          onOK={() => {
            tgApp?.close();
          }}
        />
      )
    }

    if(workflowState.step === STEP_REPEAT) {
      return renderRepeatStep()
    }

    if (workflowState.step === STEP_WELCOME){
      return (
        <Welcome initCamera={initCamera} onOK={() => {
          setWorkflowState({...workflowState, step: workflow[0].code});
        }}/>
      );
    }

    if (workflowState.step === STEP_RESUME){
      return (
        <Resume
          initCamera={initCamera}
          onResume={() => {
            setWorkflowState({...workflowState, step: resumeStep});
          }}
          onReset={() => {
            setResumeStep(null);
            apiClient.cancelWorkflow(workflowState.id)
              .then(res => {
                apiClient.createWorkflowState()
                  .then(res => {
                    setWorkflowState({step: workflow[0].code, id: res.id, repeatMode: false})
                  })
                  .catch(err => { console.error(err) })
              })
              .catch(err => { console.error(err) })
          }}
        />
      );
    }

    let stepInfo = workflow.find(el => el.code === workflowState.step);
    if(!stepInfo) {
      return (
        <ErrorMessage text={"Ошибка инициализации, обратитесь к администратору"} onOK={() => { tgApp?.close(); }}/>
      );
    }

    if(stepInfo.reply_types.indexOf("photo") >= 0) {
      return renderPhotoStep(stepInfo)
    }
    return renderTextStep(stepInfo);
  };

  return (
    <div>
      <div style={{ background: '#ace0ff' }}>
        <SafeArea position='top' />
      </div>
      <div className="App">
        { renderCurrentStep() }
      </div>
      <div style={{ background: '#ffcfac' }}>
        <SafeArea position='bottom' />
      </div>
    </div>
  );
}

export default App;
