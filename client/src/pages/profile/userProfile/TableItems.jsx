import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Validator from "validatorjs";
import DataTable from "react-data-table-component";
import { LabelContext } from "../index";

import CreatableSelect from "react-select/creatable";
import {
  Box,
  Tooltip,
  Toolbar,
  Button,
  Typography,
  Modal,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import {
  getItems,
  getStringFields,
  getCheckboxFields,
  getIntegerFields,
} from "../../../fetch/apies";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Image",
    selector: (row) => (
      <img
        width="50%"
        src={`${process.env.REACT_APP_BACKEND_API}/images/${row.image_id}/${row.image_url}`}
      />
    ),
  },
  {
    name: "Tags",
    selector: (row) => "",
  },
  {
    name: "Created",
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
];

function TableItems(props) {
  const { id } = useParams();
  console.log(id);
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const { token } = current_user;
  const [state, setState] = useContext(LabelContext);

  const [data, setData] = useState([]);

  const [extraInputs, setExtraInputs] = useState({
    stringInputs: "",
    integerInputs: "",
    checkboxInputs: "",
  });
  useEffect(() => {
    setState((state) => ({
      ...state,
      label: "My Items",
      sublabel: "Recently created items",
    }));
    getItems(token, id).then((res) => {
      setData(res);
    });

    getStringFields(token, id).then((res) => {
      setExtraInputs((prevState) => ({ ...prevState, stringInputs: res }));
    });

    getIntegerFields(token, id).then((res) => {
      setExtraInputs((prevState) => ({ ...prevState, integerInputs: res }));
    });
    getCheckboxFields(token, id).then((res) => {
      setExtraInputs((prevState) => ({ ...prevState, checkboxInputs: res }));
    });
  }, []);

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  // name
  const [nameInputs, setNameInputs] = useState({
    email: "",
    rule: "required",
    startValidate: false,
  });

  const validationName = new Validator(
    { name: nameInputs.name },
    { name: nameInputs.rule }
  );

  const handleName = (e) => {
    setNameInputs((prevState) => ({
      ...prevState,
      name: e.target.value,
      startValidate: true,
    }));
  };

  // image
  const [imageInputs, setImageInputs] = useState({
    file: "",
    preview: "",
    error: "",
  });

  const handleImage = (e) => {
    setImageInputs((prevState) => ({
      ...prevState,
      file: "",
      preview: "",
      error: "",
    }));
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      var extension = file.name.split(".").pop().toLowerCase();
      var isSuccess = ["jpg", "jpeg", "png"].indexOf(extension) > -1;
    }
    if (isSuccess) {
      reader.onloadend = () => {
        setImageInputs((prevState) => ({
          ...prevState,
          file: file,
          preview: reader.result,
        }));
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setImageInputs((prevState) => ({
        ...prevState,
        error: "Wrong format",
      }));
    }
  };

  // tags
  const handleChange = (selected) => {
    console.log(selected);
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Items</Typography>
        <Tooltip title="Add new item">
          <Button
            variant="contained"
            onClick={handleClickOpen("paper")}
            sx={{
              background: "rgb(52, 71, 103)",
              textTransform: "none",
              boxShadow: "none",
              "&:hover, &:active, &:focus": {
                boxShadow: "none",
                backgroundColor: "rgba(52, 71, 103, 0.9)",
              },
            }}
          >
            Add item
          </Button>
        </Tooltip>
      </Toolbar>
      <DataTable columns={columns} data={data} pagination />

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogContent dividers="paper">
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
              maxWidth="400px"
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                color="rgb(52, 71, 103)"
              >
                Create Item
              </Typography>
              <FormControl fullWidth sx={{ mb: "10px" }}>
                <Typography
                  variant="body2"
                  mb={1}
                  mt={2}
                  color="rgb(52, 71, 103)"
                >
                  Name:
                </Typography>
                <TextField
                  fullWidth
                  id="outlined-required"
                  size="small"
                  value={nameInputs.name}
                  onChange={handleName}
                  error={
                    nameInputs.startValidate &&
                    (validationName.passes() === true ? false : true)
                  }
                />
                <FormHelperText error sx={{ ml: 0 }}>
                  {nameInputs.startValidate &&
                    validationName.errors.first("name")}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <Typography variant="body2" mb={1} color="rgb(52, 71, 103)">
                  Item Image:
                </Typography>

                <label htmlFor="collection-image">
                  <Box
                    width="400px"
                    height="200px"
                    sx={{
                      borderRadius: "5px",
                      cursor: "pointer",
                      background: "#e8f4ff",
                      color: "#1976d2",
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {imageInputs.preview ? (
                      <img
                        src={imageInputs.preview}
                        height={"100%"}
                        width={"100%"}
                        style={{
                          objectFit: "cover",
                          borderRadius: "5px",
                          border: "solid #e8f4ff 2px",
                        }}
                      />
                    ) : (
                      "+"
                    )}
                  </Box>
                </label>
                {imageInputs.error && (
                  <p style={{ color: "#e53935", fontSize: "11px" }}>
                    {imageInputs.error}
                  </p>
                )}

                <input
                  type="file"
                  id="collection-image"
                  name="collection-image"
                  accept="image/png, image/jpeg"
                  style={{ display: "none " }}
                  onChange={handleImage}
                />
              </FormControl>
              {extraInputs &&
                extraInputs.stringInputs &&
                extraInputs.stringInputs.map((el) => (
                  <Box key={el.id}>
                    <FormControl fullWidth>
                      <Typography
                        variant="body2"
                        mb={1}
                        mt={2}
                        color="rgb(52, 71, 103)"
                      >
                        {el.name}:
                      </Typography>
                      <TextField
                        fullWidth
                        id="outlined-required"
                        size="small"
                      />
                    </FormControl>
                  </Box>
                ))}

              {extraInputs &&
                extraInputs.integerInputs &&
                extraInputs.integerInputs.map((el) => (
                  <Box key={el.id}>
                    <FormControl fullWidth>
                      <Typography
                        variant="body2"
                        mb={1}
                        mt={2}
                        color="rgb(52, 71, 103)"
                      >
                        {el.name}:
                      </Typography>
                      <TextField
                        type="number"
                        fullWidth
                        id="outlined-required"
                        size="small"
                      />
                    </FormControl>
                  </Box>
                ))}

              {extraInputs && extraInputs.checkboxInputs && (
                <Box mt={3}>
                  {extraInputs.checkboxInputs.map((el) => (
                    <Box key={el.id}>
                      <FormControlLabel
                        sx={{
                          color: "rgb(52, 71, 103)",
                        }}
                        control={
                          <Checkbox
                            sx={{
                              color: "rgb(52, 71, 103)",
                            }}
                          />
                        }
                        label={el.name}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              <Box>
                <CreatableSelect
                  isMulti
                  onChange={handleChange}
                  options={options}
                />
              </Box>

              <Box my={3} display="flex" justifyContent={"flex-end"}>
                <Button
                  variant="contained"
                  sx={{
                    mr: "10px",
                    background: "rgb(52, 71, 103)",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover, &:active, &:focus": {
                      boxShadow: "none",
                      backgroundColor: "rgba(52, 71, 103, 0.9)",
                    },
                  }}
                >
                  Create
                </Button>
                <Button
                  variant="secondary"
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}

export default TableItems;
