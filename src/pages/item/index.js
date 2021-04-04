import React from "react";
import "./index.css";
import CustomModal from "../../components/CustomModal";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import NumberFormat from "react-number-format";
import ItemAPI from "../../services/request/Item";
import { toast } from "react-toastify";
import ToastError from "../../services/request/ErrorReq";

const item_validation_default = {
  item_name_invalid: false,
  item_package_invalid: false,
};

const item_default = {
  item_id: 0,
  item_name: "",
  item_price: 0,
  item_stock: 0,
  item_package: "",
};

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.new ? item_default : props.itemDetail,
      item_validation: item_validation_default,
      is_new: props.new,
      in_proses: false,
    };
  }
  componentDidUpdate() {}
  componentDidMount() {}
  saveItem = () => {
    let req = this.state.item;
    if (req.item_name === "") {
      this.setState({
        item_validation: {
          ...this.state.item_validation,
          item_name_invalid: true,
        },
      });
      this.itemRef.focus();
      return;
    }
    if (req.item_package === "") {
      this.setState({
        item_validation: {
          ...this.state.item_validation,
          item_package_invalid: true,
        },
      });
      this.packageRef.focus();
      return;
    }
    this.state.is_new ? this.saveNewItem() : this.editItem();
  };
  saveNewItem() {
    ItemAPI.itemAdd(this.state.item)
      .then((result) => {
        toast.success(result.data.message);
        this.setState({ item: item_default });
        this.itemRef.focus();
        this.props.refreshItem();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  editItem() {
    ItemAPI.itemEdit(this.state.item)
      .then((result) => {
        toast.success(result.data.message);
        this.itemRef.focus();
        this.props.refreshItem();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  render() {
    return (
      <CustomModal title={this.state.is_new ? "New Item" : "Edit Item"}>
        <Form>
          <FormGroup row>
            <Label sm={2}>Item Name</Label>
            <Col sm={6}>
              <Input
                invalid={this.state.item_validation.item_name_invalid}
                autoFocus
                innerRef={(ref) => {
                  this.itemRef = ref;
                }}
                size="sm"
                type="text"
                name="item_name"
                value={this.state.item.item_name}
                placeholder="Item name"
                onChange={(event) => {
                  const { target } = event;
                  this.setState({
                    item: {
                      ...this.state.item,
                      item_name: target.value,
                    },
                  });
                }}
              />
              <FormFeedback tooltip>Item name is required</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Price</Label>
            <Col sm={6}>
              <NumberFormat
                className="form-control-sm form-control"
                placeholder="0"
                type="text"
                name="item_price"
                value={this.state.item.item_price}
                thousandSeparator={true}
                inputMode="numeric"
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({
                    item: {
                      ...this.state.item,
                      item_price: value,
                    },
                  });
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Stock</Label>
            <Col sm={6}>
              <NumberFormat
                className="form-control-sm form-control"
                placeholder="0"
                type="text"
                name="item_stock"
                value={this.state.item.item_stock}
                thousandSeparator={true}
                inputmode="numeric"
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({
                    item: {
                      ...this.state.item,
                      item_stock: value,
                    },
                  });
                }}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Package</Label>
            <Col sm={6}>
              <Input
                invalid={this.state.item_validation.item_package_invalid}
                type="select"
                innerRef={(ref) => {
                  this.packageRef = ref;
                }}
                defaultValue={this.state.item.item_package}
                onChange={(event) => {
                  const { target } = event;
                  this.setState({
                    item: {
                      ...this.state.item,
                      item_package: target.value,
                    },
                  });
                }}
                name="item_package"
                size="sm"
              >
                <option value="" disabled selected>
                  Select package name
                </option>
                <option value="PCS">PCS</option>
                <option value="BOX">BOX</option>
              </Input>
              <FormFeedback tooltip>Package name is required</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}></Label>
            <Col sm={6}>
              <Button color="primary" onClick={this.saveItem} title="Save Item">
                {this.props.new ? "Save Item" : "Edit Item"}
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </CustomModal>
    );
  }
}

export default Item;
