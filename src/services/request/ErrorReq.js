import { toast } from "react-toastify";
import { request_delay } from "../Constants";

const ToastError = (err) => {
  if (
    !("response" in err) ||
    err.message === "Network Error" ||
    err.message === "timeout of " + request_delay.toString() + "ms exceeded"
  ) {
    toast.error(err.message);
  } else {
    let error = err.response;
    if (
      error.status === "401" ||
      error.status === "400" ||
      error.status === "500" ||
      error.status === "498"
    ) {
      let msg = error.data.message;
      toast.error("Error " + error.status + " - " + msg);
    }
    if (error.status === "404") {
      toast.error("Error " + error.status + " - API Not Found");
    }
    if (error.status === "405") {
      toast.error("Error " + error.status + " - Method Not Allowed");
    }
  }
};

export default ToastError;
