import React, { useEffect, useCallback } from "react";
import "./index.css";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
function CustomModal({ title, children }) {
  let history = useHistory();
  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        history.goBack();
      }
    },
    [history]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className="container-custom-modal" onClick={() => history.goBack()}>
      <div
        className="container-inner-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container-inner-modal-header">
          <h2 className="page-header">{title}</h2>
          <Button
            close
            onClick={() => history.goBack()}
            style={{
              color: "#000",
              fontSize: "29px",
              marginRight: "5px",
            }}
          />
        </div>
        <div className="container-inner-modal-content">{children}</div>
      </div>
    </div>
  );
}

CustomModal.defaultProps = {
  title: "Title",
};

export default CustomModal;
