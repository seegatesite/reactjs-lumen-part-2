import { noAuthAPI } from "./AxiosDefault";

const customerAdd = (obj) => {
  return noAuthAPI.post("/customer/add", obj);
};
const customerEdit = (obj) => {
  return noAuthAPI.post("/customer/edit", obj);
};
const customerDelete = (obj) => {
  return noAuthAPI.post("/customer/delete", obj);
};
const customerGet = (obj) => {
  return noAuthAPI.get("/customer/get", { params: obj });
};
const customerList = (obj) => {
  return noAuthAPI.get("/customer/list", { params: obj });
};
const customerSearch = (obj) => {
  return noAuthAPI.get("/customer/search", { params: obj });
};

const CustomerAPI = {
  customerAdd,
  customerEdit,
  customerDelete,
  customerGet,
  customerList,
  customerSearch,
};

export default CustomerAPI;
