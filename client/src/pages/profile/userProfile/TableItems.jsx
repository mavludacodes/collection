import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Validator from "validatorjs";
import DataTable from "react-data-table-component";
import { LabelContext } from "../index";
import CircularProgress from "@mui/material/CircularProgress";
import CreatableSelect from "react-select/creatable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
  IconButton,
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
  postImage,
  createItem,
  deleteItem,
  updateItem,
} from "../../../fetch/apies";

import {
  createStringValue,
  createIntegerValue,
  createCheckboxValue,
  getStringValues,
  getIntegerValues,
  getCheckboxValues,
} from "../../../fetch/fields";

import { getTags, postTags } from "../../../fetch/tags";

function TableItems() {
  const { id } = useParams();
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const { token } = current_user;

  const [state, setState] = useContext(LabelContext);
  useEffect(() => {
    setState((state) => ({
      ...state,
      label: "My Items",
      sublabel: "Recently created items",
    }));
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Image",
      selector: (row) => (
        <img
          style={{ margin: "15px" }}
          width="50%"
          src={`${process.env.REACT_APP_BACKEND_API}/images/${row.image_id}/${row.image_url}`}
        />
      ),
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
    {
      cell: (row) => (
        <Box>
          <IconButton onClick={(e) => openModalForEdit(e, row)}>
            <EditIcon sx={{ color: "rgb(52, 71, 103)" }} />
          </IconButton>
          <IconButton onClick={(e) => deleteItemBtn(e, row.id)}>
            <DeleteIcon sx={{ color: "rgb(52, 71, 103)" }} />
          </IconButton>
        </Box>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const [data, setData] = useState([]);
  const [changed, setChanged] = useState(true);
  useEffect(() => {
    getItems(token, id).then((res) => {
      setData(res);
    });
  }, [changed]);

  const [extraInputs, setExtraInputs] = useState({
    stringInputs: "",
    integerInputs: "",
    checkboxInputs: "",
  });

  useEffect(() => {
    getStringFields(token, id).then((res) => {
      setExtraInputs((prevState) => ({ ...prevState, stringInputs: res }));
    });
  }, []);

  useEffect(() => {
    getIntegerFields(token, id).then((res) => {
      setExtraInputs((prevState) => ({ ...prevState, integerInputs: res }));
    });
  }, []);

  useEffect(() => {
    getCheckboxFields(token, id).then((res) => {
      setExtraInputs((prevState) => ({ ...prevState, checkboxInputs: res }));
    });
  }, []);

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [tagOptions, setTagOptions] = useState();
  useEffect(() => {
    getTags().then((res) => {
      let newArr = res.map((el) => ({ value: el.id, label: el.tagname }));
      setTagOptions(newArr);
    });
  }, []);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
    setAction("Create");
  };

  const handleClose = () => {
    setOpen(false);
    setAction("");
    setNameInputs((prevState) => ({
      ...prevState,
      name: "",
      startValidate: false,
    }));
    setImageInputs((prevState) => ({
      ...prevState,
      file: "",
      preview: "",
      error: "",
    }));

    setSelectedTags((prevState) => ({
      ...prevState,
      oldTags: [],
      newTags: [],
    }));

    setAdditionalInputs((prevState) => ({
      ...prevState,
      stringValues: new Map(),
      integerValues: new Map(),
      checkboxValues: new Map(),
    }));
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
    name: "",
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
  const [selectedTags, setSelectedTags] = useState({
    oldTags: [],
    newTags: [],
  });

  const handleChange = (selected) => {
    if (selected) {
      let newTags = selected.filter((el) => {
        if ("__isNew__" in el) {
          if (el.__isNew__ === true) {
            return el;
          }
        }
      });
      let oldTags = selected.filter((el) => {
        if (!("__isNew__" in el)) {
          return el;
        }
      });
      setSelectedTags((prevState) => ({ ...prevState, oldTags, newTags }));
    }
  };

  const [additionalInputs, setAdditionalInputs] = useState({
    stringValues: new Map(),
    integerValues: new Map(),
    checkboxValues: new Map(),
  });
  const handleAdditionalInputs = (e, id, option, type) => {
    setAdditionalInputs((prevState) => ({
      ...prevState,
      [option]: additionalInputs[option].set(Number(id), {
        [type]: Number(id),
        value: option === "checkboxValues" ? e.target.checked : e.target.value,
      }),
    }));
  };

  // create item

  const [disableCreate, setDisableCreate] = useState(false);
  const createItemBtn = (e) => {
    e.preventDefault();
    if (imageInputs.file === "") {
      setImageInputs((prevState) => ({
        ...prevState,
        error: "Image required",
      }));
    }

    if (validationName.passes()) {
      let data = {
        name: nameInputs.name,
        collection_id: id,
        tags: [],
      };

      if (imageInputs.file) {
        setDisableCreate(true);
        postImage(current_user.token, imageInputs.file).then((res) => {
          data = { ...data, imageId: res.id };
          if (selectedTags.oldTags.length > 0) {
            selectedTags.oldTags.map((el) => {
              data.tags.push(Number(el.value));
            });
          }
          Promise.all(
            selectedTags.newTags.map(async (item) => {
              return await postTags({ name: item.label }).then((res) => {
                return Number(res.id);
              });
            })
          ).then((arr) => {
            arr.map((id) => {
              data.tags.push(id);
            });

            createItem(data, token).then((res) => {
              let stringArr = [];
              for (let item of additionalInputs.stringValues.keys()) {
                stringArr.push({
                  item_id: Number(res.id),
                  ...additionalInputs.stringValues.get(item),
                });
              }

              let integerArr = [];
              for (let item of additionalInputs.integerValues.keys()) {
                integerArr.push({
                  item_id: Number(res.id),
                  ...additionalInputs.integerValues.get(item),
                });
              }

              let checkboxArr = [];
              for (let item of additionalInputs.checkboxValues.keys()) {
                checkboxArr.push({
                  item_id: Number(res.id),
                  ...additionalInputs.checkboxValues.get(item),
                });
              }

              if (stringArr.length > 0) {
                Promise.all(
                  stringArr.map(async (item) => {
                    const res = await createStringValue(item);
                  })
                );
              }
              if (integerArr.length > 0) {
                Promise.all(
                  integerArr.map(async (item) => {
                    const res = await createIntegerValue(item);
                  })
                );
              }

              if (checkboxArr.length > 0) {
                Promise.all(
                  checkboxArr.map(async (item) => {
                    const res = await createCheckboxValue(item);
                  })
                );
              }

              setOpen(false);
              setChanged(!changed);
              setTimeout(() => {
                setDisableCreate(false);
              }, 2000);
            });
          });
        });
      }
    } else {
      setNameInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
    }
  };

  const [action, setAction] = useState("");
  const [itemID, setItemID] = useState();
  const openModalForEdit = (e, row) => {
    console.log(row);
    setAction("Edit");
    setItemID(Number(row.id));
    setNameInputs((prevState) => ({
      ...prevState,
      name: row.name,
    }));
    setImageInputs((prevState) => ({
      ...prevState,
      preview: `${process.env.REACT_APP_BACKEND_API}/images/${row.image_id}/${row.image_url}`,
      previous: `${process.env.REACT_APP_BACKEND_API}/images/${row.image_id}/${row.image_url}`,
      image_id: row.image_id,
    }));

    let prevTags = [];
    row.tags.map((el) => {
      const founded = tagOptions.filter((elem) => elem.value == el);
      if (founded) {
        prevTags.push(...founded);
      }
    });
    setSelectedTags((prevState) => ({ ...prevState, oldTags: prevTags }));

    getStringValues(Number(row.id)).then((res) => {
      console.log(res);
      res.map((el) => {
        setAdditionalInputs((prevState) => ({
          ...prevState,
          stringValues: additionalInputs.stringValues.set(
            Number(el.string_id),
            {
              string_id: Number(el.string_id),
              value: el.value,
            }
          ),
        }));
      });
    });

    getIntegerValues(Number(row.id)).then((res) => {
      console.log(res);
      res.map((el) => {
        setAdditionalInputs((prevState) => ({
          ...prevState,
          integerValues: additionalInputs.integerValues.set(
            Number(el.integer_id),
            {
              integer_id: Number(el.integer_id),
              value: el.value,
            }
          ),
        }));
      });
    });

    getCheckboxValues(Number(row.id)).then((res) => {
      console.log(res);
      res.map((el) => {
        setAdditionalInputs((prevState) => ({
          ...prevState,
          checkboxValues: additionalInputs.checkboxValues.set(
            Number(el.checkbox_id),
            {
              checkbox_id: Number(el.integer_id),
              value: el.value,
            }
          ),
        }));
      });
    });

    setOpen(true);
  };

  const updateItemBtn = (e) => {
    e.preventDefault();

    if (validationName.passes()) {
      if (imageInputs.preview === imageInputs.previous) {
        let data = {
          name: nameInputs.name,
          image_id: Number(imageInputs.image_id),
          tags: [],
        };

        if (selectedTags.oldTags.length > 0) {
          selectedTags.oldTags.map((el) => {
            data.tags.push(Number(el.value));
          });
        }
        Promise.all(
          selectedTags.newTags.map(async (item) => {
            return await postTags({ name: item.label }).then((res) => {
              return Number(res.id);
            });
          })
        ).then((arr) => {
          console.log(arr, "jsjjs");
          arr.map((id) => {
            data.tags.push(id);
          });
          if (itemID) {
            updateItem(token, itemID, data).then((res) => {
              console.log(res);
              setOpen(false);
              setChanged(!changed);
            });
          }
        });
      } else {
        if (imageInputs.file === "") {
          setImageInputs((prevState) => ({
            ...prevState,
            error: "Image required",
          }));
        }
        if (imageInputs.file) {
          postImage(current_user.token, imageInputs.file).then((res) => {
            let data = {
              name: nameInputs.name,
              image_id: res.id,
              tags: [],
            };
            if (selectedTags.oldTags.length > 0) {
              selectedTags.oldTags.map((el) => {
                data.tags.push(Number(el.value));
              });
            }

            Promise.all(
              selectedTags.newTags.map(async (item) => {
                return await postTags({ name: item.label }).then((res) => {
                  return Number(res.id);
                });
              })
            ).then((arr) => {
              arr.map((id) => {
                data.tags.push(id);
              });
              if (itemID) {
                updateItem(token, itemID, data).then((res) => {
                  console.log(res);
                  setOpen(false);
                  setChanged(!changed);
                });
              }
            });
          });
        }
      }
    } else {
      setNameInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
    }
  };

  const deleteItemBtn = (e, id) => {
    e.preventDefault();
    deleteItem(token, id).then((res) => {
      console.log(res.status);
      if (res.status === 202) {
        let newData = data.filter((el) => el.id !== id);
        setData((prevState) => newData);
      }
    });
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
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Items</Typography>
        <Tooltip title="Add new item">
          <Button
            variant="contained"
            onClick={handleClickOpen}
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

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            maxWidth="400px"
          >
            <Typography color="rgb(52, 71, 103)">
              {action === "Create" ? "Create Item" : "Update Item"}
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
                <Typography variant="caption" color="#D32F2F" mt={1}>
                  {imageInputs.error}
                </Typography>
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
                      value={
                        additionalInputs.stringValues.get(Number(el.id)) &&
                        additionalInputs.stringValues.get(Number(el.id)).value
                      }
                      onChange={(e) =>
                        handleAdditionalInputs(
                          e,
                          el.id,
                          "stringValues",
                          "string_id"
                        )
                      }
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
                      type="date"
                      fullWidth
                      id="outlined-required"
                      size="small"
                      value={
                        additionalInputs.integerValues.get(Number(el.id)) &&
                        additionalInputs.integerValues.get(Number(el.id)).value
                      }
                      onChange={(e) =>
                        handleAdditionalInputs(
                          e,
                          el.id,
                          "integerValues",
                          "integer_id"
                        )
                      }
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
                          checked={
                            additionalInputs.checkboxValues.get(Number(el.id))
                              ? additionalInputs.checkboxValues.get(
                                  Number(el.id)
                                ).value
                              : null
                          }
                          onChange={(e) =>
                            handleAdditionalInputs(
                              e,
                              el.id,
                              "checkboxValues",
                              "checkbox_id"
                            )
                          }
                        />
                      }
                      label={el.name}
                    />
                  </Box>
                ))}
              </Box>
            )}

            <Box>
              <Typography
                variant="body2"
                mb={1}
                mt={2}
                color="rgb(52, 71, 103)"
              >
                Tags:
              </Typography>
              <CreatableSelect
                isMulti
                value={[...selectedTags.newTags, ...selectedTags.oldTags]}
                onChange={handleChange}
                options={tagOptions}
              />
            </Box>

            <Box my={3} display="flex" justifyContent={"flex-end"}>
              {action === "Edit" ? (
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
                  onClick={updateItemBtn}
                >
                  Update
                </Button>
              ) : (
                <Button
                  disabled={disableCreate}
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
                  onClick={createItemBtn}
                >
                  {disableCreate ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Create"
                  )}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleClose}
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
    </Box>
  );
}

export default TableItems;
