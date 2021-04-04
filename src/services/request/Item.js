import { noAuthAPI } from "./AxiosDefault";

const itemAdd = (obj) => {
  return noAuthAPI.post("/item/add", obj);
};
const itemEdit = (obj) => {
  return noAuthAPI.post("/item/edit", obj);
};
const itemDelete = (obj) => {
  return noAuthAPI.post("/item/delete", obj);
};
const itemGet = (obj) => {
  return noAuthAPI.get("/item/get", { params: obj });
};
const itemList = (obj) => {
  return noAuthAPI.get("/item/list", { params: obj });
};
const itemSearch = (obj) => {
  return noAuthAPI.get("/item/search", { params: obj });
};

const ItemAPI = {
  itemAdd,
  itemEdit,
  itemDelete,
  itemGet,
  itemList,
  itemSearch,
};

export default ItemAPI;
