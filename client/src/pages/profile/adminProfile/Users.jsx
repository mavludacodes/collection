import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  Box,
  IconButton,
  Tooltip,
  Toolbar,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import { getUsers, blockUser, changeUserRole } from "../../../fetch/auth";
import Modal from "@mui/material/Modal";
import { LabelContext } from "../index";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
  p: 4,
};

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Email",
    selector: (row) => row.email,
  },
  {
    name: "Joined",
    selector: (row) => {
      return (
        new Date(row.created_at).getFullYear() +
        "-" +
        (new Date(row.created_at).getMonth() + 1 < 9
          ? "0" + (new Date(row.created_at).getMonth() + 1)
          : new Date(row.created_at).getMonth() + 1) +
        "-" +
        new Date(row.created_at).getDate()
      );
    },
  },
  {
    name: "Last Login",
    selector: (row) => {
      return (
        new Date(row.last_login).getFullYear() +
        "-" +
        (new Date(row.last_login).getMonth() + 1 < 9
          ? "0" + (new Date(row.last_login).getMonth() + 1)
          : new Date(row.last_login).getMonth() + 1) +
        "-" +
        new Date(row.last_login).getDate()
      );
    },
  },

  {
    name: "Status",
    selector: (row) => (
      <Box
        sx={{
          backgroundColor: row.status
            ? "rgba(84, 214, 44, 0.16)"
            : "rgba(255, 72, 66, 0.16)",
          padding: "5px",
          color: row.status ? "rgb(34, 154, 22)" : "rgb(183, 33, 54);",
          fontWeight: 700,
          borderRadius: "4px",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        {row.status ? "active" : "blocked"}
      </Box>
    ),
  },
  {
    name: "Role",
    selector: (row) =>
      row.role === "admin" ? (
        <Box
          sx={{
            backgroundColor: "#FFF387",
            padding: "5px",
            color: "rgb(34, 154, 22)",
            fontWeight: 700,
            borderRadius: "4px",
            textAlign: "center",
            fontSize: "12px",
          }}
        >
          {row.role}
        </Box>
      ) : (
        row.role
      ),
  },
];

function Users() {
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const navigate = useNavigate();
  const [state, setState] = useContext(LabelContext);
  const { token } = current_user;
  const [data, setData] = useState([]);
  const [changed, setChanged] = useState(true);
  useEffect(() => {
    setState((state) => ({
      ...state,
      label: "All users",
      sublabel: "Control all users from here",
    }));
    getUsers(token).then((res) => {
      setData(res);
    });
  }, [changed]);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleChange = (state) => {
    console.log(state);
    setSelectedRows(state.selectedRows);
  };
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  // handle role
  const [role, setRole] = useState();
  const handleRole = (event) => {
    setRole(event.target.value);
  };

  // modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setRole("");
  };

  const changeRoleBtn = (e) => {
    e.preventDefault();

    if (selectedRows.length > 0) {
      Promise.all(
        selectedRows.map((el) => {
          const data = {
            id: el.id,
            role,
          };

          return changeUserRole(data, current_user.token).then(
            (res) => res.status
          );
        })
      ).then((responses) => {
        if (responses.length > 0) {
          setSelectedRows([]);
          handleClearRows();
          setChanged(!changed);
          handleCloseModal();
          if (role == "user") {
            const isME = selectedRows.filter((el) => el.id == current_user.id);
            if (isME.length > 0) {
              navigate("/auth/login");
              localStorage.removeItem("current_user");
            }
          }
        }
      });
    }
  };

  const blockUserBtn = (e, status) => {
    e.preventDefault();
    if (selectedRows.length > 0) {
      Promise.all(
        selectedRows.map((el) => {
          const data = {
            id: el.id,
            status,
          };

          return blockUser(data, current_user.token).then((res) => res.status);
        })
      ).then((responses) => {
        if (responses.length > 0) {
          setSelectedRows([]);
          handleClearRows();
          setChanged(!changed);
          if (!status) {
            const isME = selectedRows.filter((el) => el.id == current_user.id);
            if (selectedRows.length === data.length || isME.length > 0) {
              navigate("/auth/login");
              localStorage.removeItem("current_user");
            }
          }
        }
      });
    }
  };

  return (
    <Box
      sx={{
        padding: "30px",
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "0 1px 20px 0 rgb(69 90 100 / 8%)",
      }}
    >
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selectedRows.length > 0 && {
            bgcolor: "#F6F9FC",
            borderRadius: "5px",
          }),
        }}
      >
        {selectedRows.length > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selectedRows.length} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Users
          </Typography>
        )}

        {selectedRows.length > 0 && (
          <>
            <Tooltip title="Block">
              <Button
                variant="contained"
                color="error"
                sx={{
                  margin: "5px",
                  boxShadow: "none",
                  "&:hover, &:active, &:focus": {
                    boxShadow: "none",
                  },
                }}
                onClick={(e) => blockUserBtn(e, false)}
              >
                Block
              </Button>
            </Tooltip>
            <Tooltip title="Unblock" onClick={(e) => blockUserBtn(e, true)}>
              <IconButton>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Change role">
              <IconButton onClick={handleOpenModal}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>

      <DataTable
        columns={columns}
        data={data}
        pagination
        selectableRows
        onSelectedRowsChange={handleChange}
        clearSelectedRows={toggledClearRows}
      />
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              value={role}
              onChange={handleRole}
            >
              <FormControlLabel
                value="admin"
                control={
                  <Radio
                    sx={{
                      color: "rgb(52, 71, 103)",
                      "&.Mui-checked": {
                        color: "rgb(52, 71, 103)",
                      },
                    }}
                  />
                }
                label="Administrator"
              />
              <FormControlLabel
                value="user"
                control={
                  <Radio
                    sx={{
                      color: "rgb(52, 71, 103)",
                      "&.Mui-checked": {
                        color: "rgb(52, 71, 103)",
                      },
                    }}
                  />
                }
                label="Simple User"
              />
            </RadioGroup>
          </FormControl>
          <Box
            mt={3}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              disabled={role ? false : true}
              sx={{
                mr: "5px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover, &:active, &:focus": {
                  boxShadow: "none",
                  backgroundColor: "rgba(52, 71, 103, 0.9)",
                },
                backgroundColor: "rgb(52, 71, 103)",
              }}
              size="small"
              onClick={changeRoleBtn}
            >
              Apply
            </Button>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={handleCloseModal}
              sx={{
                textTransform: "none",
                boxShadow: "none",
                "&:hover, &:active, &:focus": {
                  boxShadow: "none",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Users;
