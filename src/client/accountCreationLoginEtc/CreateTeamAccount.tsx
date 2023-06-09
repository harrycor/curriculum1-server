import React from "react";
import { Link, useHistory } from "react-router-dom";
import { apiService } from "../services/api-services";

function CreateAccount() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [realEmail, setRealEmail] = React.useState("");
  const [approvalCode, setApprovalCode] = React.useState("");
  const [teamName, setTeamName] = React.useState("");

  let history = useHistory();

  const confirmApprovalCode = (e: any) => {
    e.preventDefault();
    if (approvalCode === "dynamic") {
      handleCreateAccount();
    } else {
      alert(
        "Sorry, you tried to submit an incorrect approval code. Please ask coach Jason for permission to access the curriculum"
      );
    }
  };

  const handleCreateAccount = () => {
    try {
      let requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: "admin",
          real_email: realEmail,
          tenant: teamName,
        }),
      };

      fetch("/api/users", requestOptions).then((data) => {
        alert(
          "Your account was created, you can now create your wrestler profile"
        );
        apiService("/auth/login", "POST", {
          email,
          password,
        }).then((data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("UID", data.UID);
        });
        history.push("/profilepage");
      });
    } catch (error) {
      // error is already logged from apiService
      // so possibly use history object to navigate to error page?
    }
  };

  return (
    <>
      <main className="container">
        <section className="mt-4 row justify-content-center">
          <form className="p-4 border rounded shadown form-group">
            <label>
              Username (please format it as your full name with all lowercase
              letters and no spaces. Example: johndoe):{" "}
            </label>
            <input
              className="mb-2 form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>
              Team Name (Be careful to spell it the exact way you would like it
              to be displayed):{" "}
            </label>
            <input
              className="mb-2 form-control"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <label>Email: </label>
            <input
              className="mb-2 form-control"
              value={realEmail}
              onChange={(e) => setRealEmail(e.target.value)}
            />
            <label>Password: </label>
            <input
              type="password"
              autoComplete="password"
              className="mb-2 form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Approval code: </label>
            <input
              type="password"
              className="mb-2 form-control"
              value={approvalCode}
              onChange={(e) => setApprovalCode(e.target.value)}
            />
            <button onClick={confirmApprovalCode} className="btn btn-primary">
              Create Team Account
            </button>

            <Link className="btn btn-secondary ml-2" to={`/login`}>
              Or click here to login
            </Link>
          </form>
        </section>
      </main>
      <h2 className="text-center">
        Want to create a video curriculum and grading system for your expertise?
      </h2>
      <h3>Contact Jason Layton at 516 996 9922, he's the man with the plan.</h3>
    </>
  );
}

export default CreateAccount;
