import React from "react";
import "./index.css";
import CustomModal from "../../components/CustomModal";
import {
  Table,
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  FormFeedback,
  Label,
  FormGroup,
  Input,
  Col,
  Form,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import CustomerAPI from "../../services/request/Customer";
import ToastError from "../../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const customer_validation_default = {
  customer_name_invalid: false,
};
const customer_default = {
  customer_id: 0,
  customer_name: "",
  customer_address: "",
  customer_phone: "",
};

class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDialog: false,
      selected_customer: {},
      list_customer: [],
      customer: customer_default,
      customer_validation: customer_validation_default,
      is_new: true,
      in_proses: false,
    };
  }
  saveCustomer = () => {
    let req = this.state.customer;
    if (req.customer_name === "") {
      this.setState({
        customer_validation: {
          ...this.state.customer_validation,
          customer_name_invalid: true,
        },
      });
      this.customerRef.focus();
      return;
    }
    this.state.is_new ? this.saveNewcustomer() : this.editcustomer();
  };
  setCustomerToCart = (index) => {
    this.props.callbackRequest(
      this.state.list_customer[index].customer_id,
      this.state.list_customer[index].customer_name
    );
  };
  deleteCustomer = (id) => {
    CustomerAPI.customerDelete({ customer_id: id })
      .then((result) => {
        toast.success(result.data.message);
        this.refreshCustomer();
      })
      .catch((err) => {
        ToastError(err);
      });
  };
  getCustomer = (index) => {
    this.setState({ customer: this.state.list_customer[index], is_new: false });
    this.toggleModal();
  };
  saveNewcustomer() {
    CustomerAPI.customerAdd(this.state.customer)
      .then((result) => {
        toast.success(result.data.message);
        this.setState({ customer: customer_default });
        this.customerRef.focus();
        this.refreshCustomer();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  editcustomer() {
    CustomerAPI.customerEdit(this.state.customer)
      .then((result) => {
        toast.success(result.data.message);
        this.refreshCustomer();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  componentDidMount() {
    this.refreshCustomer();
  }
  toggleModal = () => {
    this.setState({ modalDialog: !this.state.modalDialog });
  };
  refreshCustomer() {
    CustomerAPI.customerList()
      .then((result) => {
        this.setState({
          list_customer: result.data.data,
        });
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  render() {
    const customerList = this.state.list_customer;
    return (
      <CustomModal title="Customer">
        <Button color="primary" onClick={this.toggleModal} className="mb-2">
          + Add Customer
        </Button>
        <Table responsive hover borderless>
          <thead className="table-active">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customerList.map((obj, index) => {
              return (
                <tr key={index.toString()}>
                  <td>{index + 1}</td>
                  <td>{obj.customer_name}</td>
                  <td>{obj.customer_address}</td>
                  <td>{obj.customer_phone}</td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        title="Add to cart"
                        color="success"
                        onClick={() => {
                          this.setCustomerToCart(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add To Cart
                      </Button>
                      <Button
                        title="Edit Customer"
                        color="warning"
                        onClick={() => {
                          this.getCustomer(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </Button>
                      <Button
                        title="Delete Customer"
                        onClick={() => {
                          this.deleteCustomer(obj.customer_id);
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
        <Modal
          isOpen={this.state.modalDialog}
          size="lg"
          toggle={this.toggleModal}
        >
          <ModalHeader toggle={this.toggleModal}>
            {this.state.is_new ? "New Customer" : "Edit Customer"}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label sm={3}>Customer Name</Label>
                <Col sm={8}>
                  <Input
                    invalid={
                      this.state.customer_validation.customer_name_invalid
                    }
                    autoFocus
                    innerRef={(ref) => {
                      this.customerRef = ref;
                    }}
                    size="sm"
                    type="text"
                    name="customer_name"
                    value={this.state.customer.customer_name}
                    placeholder="customer name"
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({
                        customer: {
                          ...this.state.customer,
                          customer_name: target.value,
                        },
                      });
                    }}
                  />
                  <FormFeedback tooltip>customer name is required</FormFeedback>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Customer Address</Label>
                <Col sm={9}>
                  <Input
                    invalid={
                      this.state.customer_validation.customer_address_invalid
                    }
                    size="sm"
                    type="textarea"
                    value={this.state.customer.customer_address}
                    placeholder="Customer address"
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({
                        customer: {
                          ...this.state.customer,
                          customer_address: target.value,
                        },
                      });
                    }}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={3}>Customer Phone</Label>
                <Col sm={4}>
                  <Input
                    invalid={
                      this.state.customer_validation.customer_phone_invalid
                    }
                    size="sm"
                    type="text"
                    value={this.state.customer.customer_phone}
                    placeholder="Customer phone"
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({
                        customer: {
                          ...this.state.customer,
                          customer_phone: target.value,
                        },
                      });
                    }}
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>{" "}
            <Button color="primary" onClick={this.saveCustomer}>
              {this.state.is_new ? "Save New" : "Edit Customer"}
            </Button>
          </ModalFooter>
        </Modal>
      </CustomModal>
    );
  }
}

export default Customer;
