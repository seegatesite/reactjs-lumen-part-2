import React from "react";
import "./index.css";
import CustomModal from "../../components/CustomModal";
import { Table, ButtonGroup, Button } from "reactstrap";
import SalesAPI from "../../services/request/Sales";
import ToastError from "../../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import NumberFormat from "react-number-format";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  deleteSales = (id) => {
    SalesAPI.salesDelete({ sales_id: id })
      .then((result) => {
        toast.success(result.data.message);
        this.refreshSales();
      })
      .catch((err) => {
        ToastError(err);
      });
  };

  componentDidMount() {
    this.refreshSales();
  }

  refreshSales() {
    SalesAPI.salesList()
      .then((result) => {
        console.log(result);
        this.setState({
          list: result.data.data,
        });
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  render() {
    const SalesList = this.state.list;
    return (
      <CustomModal title="Sales">
        <Table responsive hover borderless>
          <thead className="table-active">
            <tr>
              <th>#</th>
              <th>Sales Date</th>
              <th>Customer</th>
              <th>Discount</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SalesList.map((obj, index) => {
              return (
                <tr key={index.toString()}>
                  <td>{index + 1}</td>
                  <td>{obj.sales_date}</td>
                  <td>{obj.customer_name}</td>
                  <td>
                    <NumberFormat
                      value={obj.discount}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </td>
                  <td>
                    <NumberFormat
                      value={parseFloat(obj.total)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        title="Delete Sales"
                        onClick={() => {
                          this.deleteSales(obj.sales_id);
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
      </CustomModal>
    );
  }
}

export default List;
