import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Validator from "validatorjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Button,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginUser } from "../fetch/auth";
import HandleSnackbar from "../components/alert/HandleSnackbar";

function Login() {
  let navigate = useNavigate();

  // email
  const [emailInputs, setEmailInputs] = useState({
    email: "",
    rule: "required|email",
    startValidate: false,
  });

  const validationEmail = new Validator(
    { email: emailInputs.email },
    { email: emailInputs.rule }
  );

  const handleEmail = (e) => {
    setEmailInputs((prevState) => ({
      ...prevState,
      email: e.target.value,
      startValidate: true,
    }));
  };

  // password
  const [passwordInputs, setPasswordInputs] = useState({
    password: "",
    rule: "required",
    startValidate: false,
  });

  const validationPassword = new Validator(
    { password: passwordInputs.password },
    { password: passwordInputs.rule }
  );

  const handlePassword = (e) => {
    setPasswordInputs((prevState) => ({
      ...prevState,
      password: e.target.value,
      startValidate: true,
    }));
  };

  // snackbar
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleOpenSnackbar = (severity, message) => {
    setSnackbarState((prevState) => ({
      ...prevState,
      open: true,
      severity,
      message,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  // show password
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [disabled, setDisabled] = useState(false);
  const loginBtn = (e) => {
    e.preventDefault();
    if (validationEmail.passes() && validationPassword.passes()) {
      const data = {
        email: emailInputs.email,
        password: passwordInputs.password,
      };
      setDisabled(true);
      // console.log(data);
      loginUser(data).then(async (res) => {
        // console.log(res);
        if (res.status === 200) {
          const resClone = await res
            .clone()
            .json()
            .then((json) => {
              localStorage.setItem("current_user", JSON.stringify(json));
              handleOpenSnackbar("success", "User logged in successfully");
              setTimeout(() => {
                if (json.role === "admin") {
                  navigate("/profile/users");
                } else {
                  navigate("/profile/my-collections");
                }
                setDisabled(false);
              }, 1000);
            });
        } else if (res.status === 403) {
          console.log("User blocked");
          handleOpenSnackbar("error", "This user is blocked");
          setDisabled(false);
        } else if (res.status === 401) {
          console.log("Wrong login or password !");
          handleOpenSnackbar("error", "Wrong login or password");
          setDisabled(false);
        }
      });
    } else {
      setEmailInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
      setPasswordInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F6F9FC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          width: { xs: "80%", sm: "500px" },
          borderRadius: "5px",
          boxShadow: "0 1px 20px 0 rgb(69 90 100 / 8%)",
          padding: "15px",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          sx={{
            marginTop: "10px",
            marginLeft: "25px",
            fontWeight: "700",
            lineHeight: "1.2",
            color: "rgb(52, 71, 103)",
          }}
        >
          Sign in
        </Typography>
        <form>
          <Grid container>
            <Grid item xs={12} m={3} mb={0}>
              <InputLabel
                htmlFor="email-login"
                sx={{
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "rgba(52, 71, 103, 0.9)",
                }}
              >
                Email Address
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="email-login"
                type="email"
                name="email"
                size="small"
                placeholder="Enter email address"
                value={emailInputs.email}
                onChange={handleEmail}
                error={
                  emailInputs.startValidate &&
                  (validationEmail.passes() === true ? false : true)
                }
              />
              <FormHelperText error>
                {emailInputs.startValidate &&
                  validationEmail.errors.first("email")}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} m={3} mb={0}>
              <InputLabel
                htmlFor="email-signup"
                sx={{
                  marginBottom: "5px",
                  fontWeight: "500",
                  color: "rgba(52, 71, 103, 0.9)",
                }}
              >
                Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="password-login"
                type={showPassword ? "text" : "password"}
                name="email"
                size="small"
                placeholder="*****"
                value={passwordInputs.password}
                onChange={handlePassword}
                error={
                  passwordInputs.startValidate &&
                  (validationPassword.passes() === true ? false : true)
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText error>
                {passwordInputs.startValidate &&
                  validationPassword.errors.first("password")}
              </FormHelperText>
            </Grid>
            <Grid item xs={12} m={3} mt={4} mb={0}>
              <Button
                disabled={disabled}
                sx={{
                  p: 1,
                  boxShadow: "none",
                  "&:hover, &:active, &:focus": {
                    boxShadow: "none",
                    backgroundColor: "rgba(52, 71, 103, 0.9)",
                  },
                  textTransform: "capitalize",
                  backgroundColor: "rgb(52, 71, 103)",
                }}
                variant="contained"
                fullWidth
                onClick={loginBtn}
              >
                {disabled ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Typography variant="body2" align="center" m={3}>
          <Link
            to="/auth/register"
            style={{
              textDecoration: "none",
              fontWeight: "500",
              color: "rgba(52, 71, 103, 0.9)",
              lineHeight: "1.75",
            }}
          >
            Don't have an account?
          </Link>
        </Typography>
        <HandleSnackbar
          snackbarState={snackbarState}
          handleCloseSnackbar={handleCloseSnackbar}
        />
      </Box>
    </Box>
  );
}

export default Login;
