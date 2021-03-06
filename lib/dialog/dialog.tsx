import React, { ReactElement, Fragment, ReactNode } from "react";
import "./dialog.scss";
import { Icon } from "../index";
import { scopeClassMaker } from "../helpers/classes";
import ReactDOM from "react-dom";
import Button from "../button/button";

interface Props {
  visible: boolean;
  buttons?: Array<ReactElement>;
  onClose: React.MouseEventHandler;
  closeOnClickMask?: boolean;
}

const scopedClass = scopeClassMaker("bui-dialog");
const sc = scopedClass;

const Dialog: React.FunctionComponent<Props> = (props) => {
  const onClickClose: React.MouseEventHandler = (e) => {
    props.onClose(e);
  };
  const onClickMask: React.MouseEventHandler = (e) => {
    props.closeOnClickMask && props.onClose(e);
  };
  const dialogElement = props.visible ? (
    <Fragment>
      <div className={sc("mask")} onClick={onClickMask}></div>
      <div className={sc("")}>
        <div className={sc("close")} onClick={onClickClose}>
          <Icon name="close" />
        </div>
        <header className={sc("header")}>提示</header>
        <main className={sc("main")}>{props.children}</main>
        {props.buttons && props.buttons.length > 0 && (
          <footer className={sc("footer")}>
            {props.buttons && props.buttons.map((button, index) => React.cloneElement(button, { key: index }))}
          </footer>
        )}
      </div>
    </Fragment>
  ) : null;
  return ReactDOM.createPortal(dialogElement, document.body);
};

Dialog.defaultProps = {
  closeOnClickMask: false,
};

const alert = (content: string) => {
  const button = <Button onClick={() => close()}>ok</Button>;
  const close = modal(content, [button]);
};

const modal = (content: ReactNode, buttons?: Array<ReactElement>, afterClose?: () => void) => {
  const close = () => {
    ReactDOM.render(React.cloneElement(component, { visible: false }), div);
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  };
  const component = (
    <Dialog
      visible={true}
      onClose={() => {
        close();
        afterClose && afterClose();
      }}
      buttons={buttons}
    >
      {content}
    </Dialog>
  );
  const div = document.createElement("div");
  document.body.append(div);
  ReactDOM.render(component, div);
  return close;
};

const confirm = (content: string, yes?: () => void, no?: () => void) => {
  const onYes = () => {
    close();
    yes && yes();
  };
  const onNo = () => {
    close();
    no && no();
  };
  const buttons = [<Button onClick={onYes}>Yes</Button>, <Button onClick={onNo}>No</Button>];
  const close = modal(content, buttons, no);
};

export { alert, confirm, modal };
export default Dialog;
