function Validation(props) {
  function ValidateUsername(username) {
    return /^[0-9a-zA-Z]+$/.test(props.username);
  }
  const message = ["", false];
  function hasWhiteSpace(s) {
    return s.indexOf(" ") >= 0;
  }

  if (hasWhiteSpace(props.username) || hasWhiteSpace(props.password)) {
    message[0] = "Inputs cannot contain white spaces";
  } else if (!ValidateUsername(props.username)) {
    message[0] = "Username only contains letters or digits";
  } else if (
    props.username.length < 6 ||
    props.username.length > 25 ||
    props.password.length < 6 ||
    props.password.length > 25
  ) {
    message[0] = "Username and password must be between 6 to 25 characters";
    return message;
  } else {
    message[0] = "user is valid";
    message[1] = true;
  }

  return message;
}

export default Validation;
