import { noAuthAPI } from "./AxiosDefault";

const salesAdd = (obj) => {
  return noAuthAPI.post("/sales/add", obj);
};
const salesDelete = (obj) => {
  return noAuthAPI.post("/sales/delete", obj);
};
const salesGet = (obj) => {
  return noAuthAPI.get("/sales/get", { params: obj });
};
const salesList = (obj) => {
  return noAuthAPI.get("/sales/list", { params: obj });
};

const SalesAPI = {
  salesAdd,
  salesDelete,
  salesGet,
  salesList,
};

export default SalesAPI;
