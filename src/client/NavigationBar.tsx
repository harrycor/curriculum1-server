import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AiOutlineMessage } from "react-icons/ai";
import { Link, useHistory } from "react-router-dom";

function NavDropdownExample() {
  const [counter, setCounter] = React.useState(0);
  const [userRole, setUserRole] = React.useState("");
  const [userTenant, setUserTenant] = React.useState();
  const [dynamicCoach, setDynamicCoach] = React.useState(false);

  let UID = Number(localStorage.getItem("UID"));

  React.useEffect(() => {
    fetch(`/api/users/${UID}`)
      .then((res) => res.json())
      .then((results) => {
        console.log({ role: results[0].role });
        setUserRole(results[0].role);
        setUserTenant(results[0].tenant);
        if (
          (results[0].role === "coach" || results[0].role === "admin") &&
          results[0].tenant === 75
        ) {
          setDynamicCoach(true);
        }
      });
  });

  let history = useHistory();
  let logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UID");
    history.push("/");
  };

  let goToChatPage = () => {
    history.push("/chat");
  };
  let goToUnitVideosPage = () => {
    history.push("/CreateALessonPlan");
  };

  let goToPrivateLessonsScheduling = () => {
    history.push("/LessonsScheduling");
  };

  let goToTestPage = () => {
    history.push("/Tests");
  };

  let goToFindPartnersPage = () => {
    history.push("/findpartners");
  };

  let goToWrestlerView = () => {
    history.push("/WrestlersView");
  };

  let goToAdminPage = () => {
    history.push("/admin");
  };

  let goToServicesAndMerchandisePage = () => {
    history.push("/servicesAndMerchandise");
  };

  let goToAccount = () => {
    history.push("/userAccount");
  };

  let goToCheckInPage = () => {
    history.push("/checkIns");
  };

  let goToAutomatedServices = () => {
    history.push("/automatedServices");
  };

  let goToCoachesView = () => {
    history.push("/coachesview");
  };

  let callMeAScrub = () => {
    if (counter === 0) {
      alert("Scrub, I said not to press that button!");
    }
    if (counter === 1) {
      alert("Why don't you listen?");
    }
    if (counter === 2) {
      alert("How many times do you need to be told? DON'T TOUCH THE BUTTON!");
    }
    if (counter === 3) {
      alert(
        "You clearly aren't good at following directions... Maybe becoming a champion wrestler isn't for you?"
      );
    }
    if (counter === 4) {
      alert(
        'Wow, you are so persistent... I am impressed! Your persistence has paid off, you have now received the official title of: TURD. Tell your parents they can pickup their "proud parent of a turd" bumper sticker from the front desk'
      );
    }
    if (counter > 4) {
      alert("I give up!");
      setCounter(-1);
    }
    if (counter < 5) setCounter(counter + 1);
  };

  return (
    <Navbar collapseOnSelect expand="xl" bg="light" variant="light">
      <Container>
        <Navbar.Brand
          onClick={goToServicesAndMerchandisePage}
          className="btn btn-warning"
        >
          Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav defaultActiveKey="1">
            <Nav.Item onClick={goToWrestlerView} className="xl-mt-2">
              <Nav.Link eventKey="1" href="#/home">
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={goToUnitVideosPage}>
              <Nav.Link eventKey="2" title="Item">
                Practice Playlists
              </Nav.Link>
            </Nav.Item>
            <Nav.Item onClick={goToPrivateLessonsScheduling}>
              <Nav.Link eventKey="3">Lessons Scheduling</Nav.Link>
            </Nav.Item>
            {userTenant == 75 && (
              <Nav.Item onClick={goToAccount}>
                <Nav.Link eventKey="5">
                  Account{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
                    <circle cx="12" cy="10" r="3" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link eventKey="7" onClick={goToChatPage} target="_blank">
                Chat <AiOutlineMessage />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="7"
                href="https://www.youtube.com/watch?v=J6oUYvNDn2Q"
                target="_blank"
              >
                Warm Up
              </Nav.Link>
            </Nav.Item>
            {userRole == "admin" || userRole == "coach" ? (
              //
              <NavDropdown title="Coaches" id="nav-dropdown">
                {/*
                  <NavDropdown.Item
                    eventKey="8.1"
                    href="https://docs.google.com/document/d/1uI2pQhtL3oBWOMGjx0Odxt19t6Vfnvg4aGf99lO2A04/edit?usp=sharing"
                    target="_blank"
                  >
                    Resources for Coaches
                  </NavDropdown.Item>
                  */}
                <NavDropdown.Item
                  onClick={() => {
                    userRole == "coach" || userRole == "admin"
                      ? goToCoachesView()
                      : callMeAScrub();
                  }}
                >
                  Grading
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="8.2" onClick={goToCheckInPage}>
                  Check-in
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="8.3" onClick={goToTestPage}>
                  Tests
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="8.4" onClick={goToFindPartnersPage}>
                  Find Partners
                </NavDropdown.Item>
              </NavDropdown>
            ) : //
            null}

            {userRole == "admin" && (
              //
              <NavDropdown title="Admin" id="nav-dropdown">
                <NavDropdown.Item eventKey="9.1" onClick={goToAdminPage}>
                  Admin Pannel
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  eventKey="9.2"
                  onClick={goToAutomatedServices}
                >
                  Automation
                </NavDropdown.Item>
              </NavDropdown>
              //
            )}
            <Nav.Item onClick={logout}>
              <Nav.Link>Logout</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavDropdownExample;
