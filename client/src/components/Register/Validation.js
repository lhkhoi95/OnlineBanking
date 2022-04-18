function Validation(props) {
  function ValidateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(props.email);
  }
  function ValidateUsername(username) {
    return /^[0-9a-zA-Z]+$/.test(props.username);
  }
  const message = ["", false];
  function hasWhiteSpace(s) {
    return s.indexOf(" ") >= 0;
  }

  if (
    hasWhiteSpace(props.username) ||
    hasWhiteSpace(props.password) ||
    hasWhiteSpace(props.email) ||
    hasWhiteSpace(props.lastName) ||
    hasWhiteSpace(props.firstName)
  ) {
    message[0] = "Inputs cannot contain white spaces";
  } else if (!ValidateEmail(props.email)) {
    message[0] = "Invalid email";
  } else if (!ValidateUsername(props.username)) {
    message[0] = "Username only contains letters or digits";
  } else if (
    props.username.length < 6 ||
    props.username.length > 25 ||
    props.password.length < 6 ||
    props.password.length > 25
  ) {
    message[0] = "Username and password must be between 6-25 characters";
    return message;
  } else if (props.firstName.length >= 46 || props.lastName.length >= 46) {
    message[0] = "First name and last name cannot be longer than 46 characters";
  } else {
    message[0] = "user is valid";
    message[1] = true;
  }

  return message;
}

export default Validation;
