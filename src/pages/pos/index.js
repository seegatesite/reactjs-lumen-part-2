import React from "react";
import {
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Table,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./index.css";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Customer from "../customer";
import Item from "../item";
import List from "../list";

import ItemAPI from "../../services/request/Item";
import SalesAPI from "../../services/request/Sales";

import ToastError from "../../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faEdit,
  faSync,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const CustomCalender = ({ value, onClick }) => (
  <Button color="success" onClick={onClick}>
    {value}
  </Button>
);

const format_mysql_date = (d) => {
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

class POS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_item: true,
      sales: {
        customer_id: 0,
        customer_name: "",
        sales_date_display: new Date(),
        sales_date: format_mysql_date(new Date()),
        discount: 0,
        list_cart: [],
        sub_total: 0,
        grand_total: 0,
      },
      list_item: [],
      editItem: {},
      search_item_keyword: "",
      refresh_animation: false,
    };
  }

  cancelTransaction = () => {
    let y = window.confirm("Cancel Transaction ?");
    y && this.resetObject();
  };

  refreshItem() {
    this.setState({ refresh_animation: true });
    ItemAPI.itemList()
      .then((result) => {
        this.setState({
          list_item: result.data.data,
          refresh_animation: false,
        });
      })
      .catch((err) => {
        ToastError(err);
        this.setState({ refresh_animation: false });
      });
  }

  newCustomer = () => {
    this.props.history.push("/customer");
  };

  listSales = () => {
    this.props.history.push("/list");
  };

  newItem = () => {
    this.setState({ new_item: true, editItem: {} });
    this.props.history.push("/item");
  };

  editItem = (index) => {
    this.setState({ new_item: false, editItem: this.state.list_item[index] });
    this.props.history.push("/item");
  };

  deleteItem = (index) => {
    let detail = this.state.list_item[index];
    let del = window.confirm("Delete item : " + detail.item_name + " ?");
    if (del) {
      ItemAPI.itemDelete({ item_id: detail.item_id })
        .then((result) => {
          toast.success(result.data.message);
          this.refreshItem();
        })
        .catch((err) => {
          ToastError(err);
        });
    }
  };

  addCart = (index) => {
    let listCart = this.state.sales.list_cart;
    let newItem = this.state.list_item[index];
    index = listCart.findIndex((x) => x.item_id === newItem.item_id);
    if (index < 0) {
      listCart.push({
        item_name: newItem.item_name,
        item_qty: 1,
        item_price: parseFloat(newItem.item_price),
        item_id: newItem.item_id,
        item_subtotal: parseFloat(newItem.item_price),
      });
    } else {
      listCart[index].item_qty += 1;
      listCart[index].item_subtotal =
        parseFloat(newItem.item_price) * parseFloat(listCart[index].item_qty);
    }
    this.setState({ sales: { ...this.state.sales, list_cart: listCart } });
  };
  handleDecQty = (index) => {
    let listCart = this.state.sales.list_cart;
    if (listCart[index].item_qty === 1) {
      return;
    }
    listCart[index].item_qty -= 1;
    listCart[index].item_subtotal =
      parseFloat(listCart[index].item_price) *
      parseFloat(listCart[index].item_qty);
    this.setState({ sales: { ...this.state.sales, list_cart: listCart } });
  };
  handleIncQty = (index) => {
    let listCart = this.state.sales.list_cart;
    listCart[index].item_qty += 1;
    listCart[index].item_subtotal =
      parseFloat(listCart[index].item_price) *
      parseFloat(listCart[index].item_qty);
    this.setState({ sales: { ...this.state.sales, list_cart: listCart } });
  };
  deleteCart = (index) => {
    let listCart = this.state.sales.list_cart;
    listCart.splice(index, 1);
    this.setState({ sales: { ...this.state.sales, list_cart: listCart } });
  };
  resetObject() {
    this.setState({
      sales: {
        customer_id: 0,
        customer_name: "",
        sales_date_display: new Date(),
        sales_date: format_mysql_date(new Date()),
        discount: 0,
        list_cart: [],
        sub_total: 0,
        grand_total: 0,
      },
    });
  }
  payTransaction = (obj) => {
    let sales = this.state.sales;
    if (sales.customer_id === 0) {
      toast.error("Please choose customer before save");
      this.newCustomer();
      return;
    }
    if (sales.list_cart.length <= 0) {
      toast.error("Cart doesn't have any product");
      return;
    }
    let y = window.confirm("Save payment transaction ?");
    if (y) {
      SalesAPI.salesAdd(this.state.sales)
        .then((result) => {
          this.resetObject();
          toast.success(result.data.message);
        })
        .catch((err) => {
          ToastError(err);
        });
    }
  };
  setCustomer = (id, custname) => {
    this.setState({
      sales: {
        ...this.state.sales,
        customer_id: id,
        customer_name: custname,
      },
    });
    this.props.history.goBack();
  };

  componentDidUpdate() {}
  componentDidMount() {
    this.refreshItem();
  }

  render() {
    const itemlist = this.state.list_item;
    const searchword = this.state.search_item_keyword;
    const listCart = this.state.sales.list_cart;
    let disc = parseFloat(this.state.sales.discount);
    let subs = 0;
    this.state.sales.list_cart.forEach((obj) => {
      subs += parseFloat(obj.item_subtotal);
    });
    let grand_total = subs - (subs * disc) / 100;
    let sub_total = subs;

    return (
      <>
        <Row className="main-pos">
          <Col sm={4}>
            <Col className="main-pos-left" sm={12}>
              <div className="container-header">
                <div className="container-header-1">
                  <InputGroup>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={this.state.sales.sales_date_display}
                      onChange={(date) =>
                        this.setState({
                          sales: {
                            ...this.state.sales,
                            sales_date_display: date,
                            sales_date: format_mysql_date(date),
                          },
                        })
                      }
                      customInput={<CustomCalender />}
                    />

                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div className="container-header-2">
                  <Button color="info" onClick={this.newCustomer} block>
                    {this.state.sales.customer_id === 0
                      ? "+ Add Customer"
                      : this.state.sales.customer_name}
                  </Button>
                </div>
              </div>
              <div className="container-cart">
                <div className="container-cart-list">
                  <ListGroup flush>
                    {listCart.map((obj, index) => {
                      return (
                        <ListGroupItem key={index.toString()}>
                          <div className="cart-name">
                            <div>{obj.item_name}</div>
                          </div>
                          <div className="cart-detail">
                            <div className="cart-1">
                              <Button
                                onClick={() => {
                                  this.handleDecQty(index);
                                }}
                                size="sm"
                              >
                                -
                              </Button>
                              {"  "}
                              {obj.item_qty}
                              {"  "}
                              <Button
                                onClick={() => {
                                  this.handleIncQty(index);
                                }}
                                size="sm"
                              >
                                +
                              </Button>{" "}
                              x{" "}
                              <NumberFormat
                                value={obj.item_price}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>

                            <div className="cart-2">
                              <NumberFormat
                                value={obj.item_subtotal}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </div>
                            <div className="cart-3">
                              <FontAwesomeIcon
                                className="text-danger pointer-hand"
                                title="Delete item from cart"
                                icon={faTimes}
                                onClick={() => {
                                  this.deleteCart(index);
                                }}
                              />
                            </div>
                          </div>
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                </div>
                <div className="container-cart-recap">
                  <div className="recap">
                    <div className="title">Total</div>
                    <div className="result">
                      <NumberFormat
                        value={sub_total}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                  <div className="recap">
                    <div className="title">Discount</div>
                    <div className="result">
                      <InputGroup size="sm">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          size="sm"
                          onChange={(event) => {
                            const { target } = event;
                            this.setState({
                              sales: {
                                ...this.state.sales,
                                discount: target.value,
                              },
                            });
                          }}
                          value={this.state.sales.discount}
                          placeholder="0"
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>%</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="recap">
                    <div className="title">Net</div>
                    <div className="result recap-net">
                      <NumberFormat
                        value={grand_total}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Col>
          <Col sm={8}>
            <Col className="main-pos-right" sm={12}>
              <div className="mb-3">
                <InputGroup size="sm">
                  <Input
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({ search_item_keyword: target.value });
                    }}
                    placeholder="SEARCH PRODUCT HERE..."
                  />
                  <InputGroupAddon addonType="append">
                    <ButtonGroup title="Refresh item list" size="sm">
                      <Button
                        color="warning"
                        onClick={() => {
                          this.refreshItem();
                        }}
                      >
                        <FontAwesomeIcon
                          spin={this.state.refresh_animation}
                          icon={faSync}
                        />
                      </Button>
                      <Button color="primary" onClick={this.newItem}>
                        {" "}
                        + ADD NEW ITEM
                      </Button>
                    </ButtonGroup>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <Table responsive hover borderless>
                  <thead className="table-active">
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th className="text-right">Stock</th>
                      <th className="text-right">Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemlist
                      .filter((itm) =>
                        itm.item_name
                          .toUpperCase()
                          .includes(searchword.toUpperCase())
                      )
                      .map((obj, index) => {
                        return (
                          <tr key={index.toString()}>
                            <td>{index + 1}</td>
                            <td>{obj.item_name}</td>
                            <td className="text-right">{obj.item_stock}</td>
                            <td className="text-right">{obj.item_price}</td>
                            <td className="text-center">
                              <ButtonGroup size="sm">
                                <Button
                                  onClick={() => {
                                    this.addCart(index);
                                  }}
                                  title="Add to cart"
                                  color="success"
                                >
                                  <FontAwesomeIcon icon={faCartPlus} /> Add
                                </Button>
                                <Button
                                  title="Edit master item"
                                  color="warning"
                                  onClick={() => {
                                    this.editItem(index);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </Button>
                                <Button
                                  title="Delete item"
                                  onClick={() => {
                                    this.deleteItem(index);
                                  }}
                                  color="danger"
                                >
                                  <FontAwesomeIcon icon={faTrash} /> Delete
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
              <div>
                <Button
                  onClick={this.payTransaction}
                  color="success"
                  className="mr-1"
                >
                  PAYMENT
                </Button>
                <Button
                  onClick={this.cancelTransaction}
                  color="danger"
                  className="mr-1"
                >
                  CANCEL
                </Button>
                <Button onClick={this.listSales} color="info">
                  SALES'S LIST
                </Button>
              </div>
            </Col>
          </Col>
        </Row>

        <Switch>
          <Route exact path="/" />
          <Route
            path="/customer"
            render={() => (
              <Customer
                new={this.state.new_customer}
                callbackRequest={(id, custname) => {
                  this.setCustomer(id, custname);
                }}
                customerDetail={this.state.editCustomer}
              />
            )}
          />
          <Route path="/list">
            <List />
          </Route>
          <Route
            path="/item"
            render={() => (
              <Item
                new={this.state.new_item}
                refreshItem={() => {
                  this.refreshItem();
                }}
                itemDetail={this.state.editItem}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withRouter(POS);
