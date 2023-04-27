import React from "react";
import { Link, useHistory } from "react-router-dom";

function CreateAccount() {
  // const [email, setEmail] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [realEmail, setRealEmail] = React.useState("");
  // const [approvalCode, setApprovalCode] = React.useState("");

  let history = useHistory();

  let goToLoginPage = () => {
    history.push("/login");
  };

  // const confirmApprovalCode = (e: any) => {
  //   e.preventDefault();
  //   if (approvalCode === "dynamic") {
  //     handleCreateAccount();
  //   } else {
  //     alert(
  //       "Sorry, you tried to submit an incorrect approval code. Please ask coach Jason for permission to access the curriculum"
  //     );
  //   }
  // };

  // const handleCreateAccount = () => {
  //   try {
  //     let requestOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         password: password,
  //         role: "wrestler",
  //         real_email: realEmail,
  //         tenant: "dynamic",
  //       }),
  //     };

  //     fetch("/api/users", requestOptions).then((data) => {
  //       alert(
  //         "Your account was created, you can now create your wrestler profile"
  //       );
  //       apiService("/auth/login", "POST", {
  //         email,
  //         password,
  //       }).then((data) => {
  //         localStorage.setItem("token", data.token);
  //         localStorage.setItem("UID", data.UID);
  //       });
  //       history.push("/profilepage");
  //     });
  //   } catch (error) {
  //     // error is already logged from apiService
  //     // so possibly use history object to navigate to error page?
  //   }
  // };

  return (
    <>
      {/* <main className="container">
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
              Create Account
            </button>

            <Link className="btn btn-secondary ml-2" to={`/login`}>
              Or click here to login
            </Link>
            <Link className="btn btn-secondary ml-2" to={`/CreateTeamAccount`}>
              Or click here to create a video curriculum for your team
            </Link>
          </form>
        </section>
      </main> */}
      <div className="d-flex justify-content-center mt-3 mb-3">
        <div
          className="d-flex justify-content-center flex-wrap col-md-7 col-12 pt-2 pb-3"
          style={{ border: "solid black 1px", borderRadius: "1rem" }}
        >
          <div className="col-12  text-center">
            <span style={{ fontSize: "2rem" }}>Already have an account?</span>
          </div>
          {/* <div className="col-12  text-center">
            <span style={{ fontSize: "2rem" }}>talk to coach about creating an account?</span>
          </div> */}
          <div className="col-12  text-center">
            <button className="btn btn-primary" onClick={goToLoginPage}>
              Login
            </button>
          </div>
        </div>
      </div>
      <h2 className="text-center">Want access?</h2>
      <h4>
        The Dynamic Curriculum is free for members of the Dynamic Wrestling
        Academy, if you aren't a member you can gain access for $100.
      </h4>
      <h3>What it includes:</h3>
      <ul>
        <li>
          Organized and growing curriculum with over 200 detailed technique
          videos spread across 16 levels
        </li>

        <li>
          Designed to turn beginners into elite wrestlers via a technical study
          of the sport
        </li>
        <li>8 unit videos designed for team practices</li>
        <li>Live positions: The movie!</li>
        <li>
          Grading system for earning the colored Dynamic shirts (only for
          Dynamic members via private lessons)
        </li>
        <li>
          It will continue to be updated for as long as Jason Layton coaches
          wrestling (which is most likely forever)
        </li>
      </ul>

      <h4>
        To gain acces, please send $100 via paypal to WrestleDynamic@gmail.com
        (make sure to include your full name and that you are requesting access)
        and I will create an account for you.
      </h4>
    </>
  );
}

export default CreateAccount;
