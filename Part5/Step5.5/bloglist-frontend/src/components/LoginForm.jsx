import React from "react";

const LoginForm = (props) => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <div>
          username
          <input
            value={props.username}
            onChange={props.handleUsernameChange}
            name="username"
          />
        </div>
        <div>
          password{" "}
          <input
            value={props.password}
            onChange={props.handlePasswordChange}
            name="password"
          />
        </div>
        <button onClick={() => props.setLoginVisible(true)}>log in</button>
      </form>
    </div>
  );
};

export default LoginForm;
