import React from "react";
import AccountsDisplayer from "./AccountsDisplayer";
import WarZoneIdFetchFromNameInput from "../../reusableComponents/WarZoneIdFetchFromNameInput";
import { IUser } from "../../../types";

function CreateAccount() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [realEmail, setRealEmail] = React.useState("");
  const [userTenant, setUserTenant] = React.useState();
  const [createdAccountsRoll, setCreatedAccountsRoll] =
    React.useState("wrestler");
  const [wrestlersFirstName, setWrestlersFirstName] = React.useState("");
  const [wrestlersLastName, setWrestlersLastName] = React.useState("");
  const [warId, setWarId] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [doNotTextList, setDoNotTextList] = React.useState<boolean>(false);
  const [renderBool, setRenderBool] = React.useState<boolean>(false);

  let UID = Number(localStorage.getItem("UID"));

  //gets the user's tenant so that the wrestlers created are linked to the proper tenant
  React.useEffect(() => {
    fetch(`/api/users/${UID}`)
      .then((res) => res.json())
      .then((results) => {
        setUserTenant(results[0].tenant);
      });
  }, []);

  function validatePhoneNumber(input_str: string) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    return re.test(input_str);
  }

  // Phone Number Validation
  function convertPhoneNumber(number: string) {
    let formattedNumber = number.replace(/[^\d\+]/g, "");
    return formattedNumber;
  }

  const handleCreateAccount = (e: any) => {
    e.preventDefault();
    if (
      email.length < 1 ||
      password.length < 1 ||
      realEmail.length < 1 ||
      !userTenant ||
      phone.length < 1
    ) {
      alert("Fill everything out!");
      return;
    }
    if (
      !confirm("are you sure all of the wrestler's information is correct?")
    ) {
      return;
    }
    if (!validatePhoneNumber(phone)) {
      // WC's func here; did want to change things there
      alert("Account not created. Was the phone number provided?");
      return;
    }
    let token = localStorage.getItem("token");
    let formattedNumber = convertPhoneNumber(phone);
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role: createdAccountsRoll,
        real_email: realEmail,
        phone_number: formattedNumber,
        war_zone_id: warId == "" ? null : warId,
        tenant: userTenant,
        first_name: wrestlersFirstName,
        last_name: wrestlersLastName,
        doNotTextList: doNotTextList,
      }),
    };
    fetch("/api/users/forAdminCreatedAccounts", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        renderBoolFunc();
      })
      .catch((err) => console.log(err));
  };

  let renderBoolFunc = () => {
    setRenderBool(!renderBool);
  };

  const handleWarZoneInputChange = (wreslter: { id: number; name: string }) => {
    setWarId(String(wreslter.id));
  };

  return (
    <>
      <main className="container">
        <section className="mt-4 row justify-content-center">
          <form className="p-4 border rounded shadown form-group">
            <h2>Add wrestlers and coaches to your team's curriculum:</h2>
            <label>Wrestler's first name:</label>
            <input
              className="mb-2 form-control"
              value={wrestlersFirstName}
              onChange={(e) => setWrestlersFirstName(e.target.value)}
            />
            <label>Wrestler's last name:</label>
            <input
              className="mb-2 form-control"
              value={wrestlersLastName}
              onChange={(e) => setWrestlersLastName(e.target.value)}
            />
            <label>
              Username (please format it as the wrestler's full name with all
              lowercase letters and no spaces. Example: johndoe):{" "}
            </label>
            <input
              className="mb-2 form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email: </label>
            <input
              className="mb-2 form-control"
              value={realEmail}
              onChange={(e) => setRealEmail(e.target.value)}
            />
            <label>Phone:</label>
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />{" "}
            <input
              onChange={() => setDoNotTextList(!doNotTextList)}
              className="mb-2"
              checked={doNotTextList}
              type="checkbox"
              name="do-not-text-list"
              id="do-not-text-list"
            />{" "}
            <label style={{ fontSize: ".7rem" }} htmlFor="do-not-text-list">
              Do not text
            </label>
            <br />
            <label>War Zone Id</label>{" "}
            <small>Please Leave blank if doesn't exist</small>
            {/*use this*/}
            <WarZoneIdFetchFromNameInput
              setStateFunction={handleWarZoneInputChange}
            />
            <label>Password: </label>
            <input
              type="password"
              autoComplete="password"
              className="mb-2 form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Role: </label>
            <select
              name="role"
              id="role"
              className="mb-2 form-control"
              onChange={(e) => setCreatedAccountsRoll(e.target.value)}
            >
              <option value="wrestler">Wrestler</option>
              <option value="coach">
                Coach (can submit and edit grades of wrestlers)
              </option>
              <option value="admin">
                Admin (can add/delete videos, can register new accounts)
              </option>
            </select>
            <button onClick={handleCreateAccount} className="btn btn-primary">
              Create Account
            </button>
          </form>
        </section>
      </main>
      <AccountsDisplayer
        renderBoolFunc={renderBoolFunc}
        renderBool={renderBool}
      />
    </>
  );
}

export default CreateAccount;
