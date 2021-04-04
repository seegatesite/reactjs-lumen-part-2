import React from "react";
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import profile from "./assets/image/profile.png";
import "./App.css";
import POS from "./pages/pos/";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Container fluid={true}>
            <Row>
              <Col sm="2" className="text-center header-col-brand">
                POS REACT
              </Col>
              <Col sm="10" className="header-col-nav">
                <Nav className=" ml-auto">
                  <NavItem>
                    <div className="profile">
                      <div className="name">Sigit Prasetya</div>
                      <div className="image">
                        <img
                          alt="profile-photos"
                          className="rounded-circle"
                          src={profile}
                          height="40px"
                        />
                      </div>
                    </div>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navlink-padding" href="#">
                      <FontAwesomeIcon icon={faBell} size="lg" />
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navlink-padding" href="#">
                      <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </header>
        <main className="main-app">
          <Container className="container-main" fluid>
            <POS />
          </Container>
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
