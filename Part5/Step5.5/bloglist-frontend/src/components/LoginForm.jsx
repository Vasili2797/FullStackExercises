import React from "react";
import PropTypes from "prop-types";

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

LoginForm.PropTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
