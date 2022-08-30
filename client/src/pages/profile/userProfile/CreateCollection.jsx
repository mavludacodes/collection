import React, { useState, useRef, useEffect } from "react";
import Validator from "validatorjs";
import {
  Box,
  Grid,
  TextField,
  Typography,
  InputBase,
  Button,
  Chip,
  InputAdornment,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreateIcon from "@mui/icons-material/Create";
import AddIcon from "@mui/icons-material/Add";
import Check from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AdditionalFieldTypography from "../components/AdditionalFieldTypography";

import {
  getCategories,
  postImage,
  createCollection,
  createStringField,
  createIntegerField,
  createCheckboxField,
  deleteStringField,
  deleteIntegerField,
  deleteCheckboxField,
  updateStringField,
  updateIntegerField,
  updateCheckboxField,
} from "../../../fetch/apies";

function CreateCollection() {
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, []);

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

  // description
  const [descriptionInputs, setDescriptionInputs] = useState({
    description: "",
    rule: "required",
    startValidate: false,
  });

  const validationDescription = new Validator(
    { description: descriptionInputs.description },
    { description: descriptionInputs.rule }
  );

  const handleDescription = (e) => {
    setDescriptionInputs((prevState) => ({
      ...prevState,
      description: e.target.value,
      startValidate: true,
    }));
  };

  // category
  const [categoryInputs, setCategoryInputs] = useState({
    category: "",
    rule: "required",
    startValidate: false,
  });

  const validationCategory = new Validator(
    { category: categoryInputs.category },
    { category: categoryInputs.rule }
  );

  const handleCategory = (e) => {
    setCategoryInputs((prevState) => ({
      ...prevState,
      category: e.target.value,
      startValidate: true,
    }));
  };

  // Additional fields
  const stringRef = useRef("");
  const [stringTyping, setStringTyping] = useState(false);
  const [stringFields, setStringFields] = useState([]);

  const dateRef = useRef("");
  const [dateTyping, setDateTyping] = useState(false);
  const [dateFields, setDateFields] = useState([]);

  const boolRef = useRef("");
  const [boolTyping, setBoolTyping] = useState(false);
  const [booleanFields, setBooleanFields] = useState([]);

  const handleStringInput = (e) => {
    if (e.target.value.length > 0) {
      setStringTyping(true);
    } else {
      setStringTyping(false);
    }
  };

  const handleStringField = (e) => {
    e.preventDefault();
    console.log(stringRef.current.value);
    const data = { name: stringRef.current.value };
    createStringField(data, current_user.token).then((res) => {
      console.log(res);
      setStringFields((prevState) => [...prevState, res]);
      setStringTyping(false);
      stringRef.current.value = "";
    });
  };

  const deleteStringFieldBtn = (e, id) => {
    e.preventDefault();
    console.log(id);
    deleteStringField(id, current_user.token).then((res) => {
      console.log(res);
      const newStringFields = stringFields.filter((el) => el.id !== id);
      setStringFields((prevState) => [...newStringFields]);
    });
  };

  const handleDateInput = (e) => {
    if (e.target.value.length > 0) {
      setDateTyping(true);
    } else {
      setDateTyping(false);
    }
  };

  const handleDateField = (e) => {
    e.preventDefault();
    console.log(dateRef.current.value);
    const data = { name: dateRef.current.value };
    createIntegerField(data, current_user.token).then((res) => {
      console.log(res);
      setDateFields((prevState) => [...prevState, res]);
      setDateTyping(false);
      dateRef.current.value = "";
    });
  };

  const deleteDateFieldBtn = (e, id) => {
    e.preventDefault();
    console.log(id);
    deleteIntegerField(id, current_user.token).then((res) => {
      console.log(res);
      const newDateFields = dateFields.filter((el) => el.id !== id);
      setDateFields((prevState) => [...newDateFields]);
    });
  };

  const handleBooleanInput = (e) => {
    if (e.target.value.length > 0) {
      setBoolTyping(true);
    } else {
      setBoolTyping(false);
    }
  };

  const handleBooleanField = (e) => {
    e.preventDefault();
    console.log(boolRef.current.value);
    const data = { name: boolRef.current.value };
    createCheckboxField(data, current_user.token).then((res) => {
      console.log(res);
      setBooleanFields((prevState) => [...prevState, res]);
      setBoolTyping(false);
      boolRef.current.value = "";
    });
  };

  const deleteBooleanFieldBtn = (e, id) => {
    e.preventDefault();
    console.log(id);
    deleteCheckboxField(id, current_user.token).then((res) => {
      console.log(res);
      const newBooleanFields = booleanFields.filter((el) => el.id !== id);
      setBooleanFields((prevState) => [...newBooleanFields]);
    });
  };

  const createCollectionBtn = (e) => {
    e.preventDefault();
    if (imageInputs.file === "") {
      setImageInputs((prevState) => ({
        ...prevState,
        error: "Image required",
      }));
    }
    if (
      validationName.passes() &&
      validationDescription.passes() &&
      validationCategory.passes()
    ) {
      let data = {
        userId: current_user.id,
        name: nameInputs.name,
        description: descriptionInputs.description,
        categoryId: categoryInputs.category,
        checkbox_fields: booleanFields.map((el) => Number(el.id)),
        integer_fields: dateFields.map((el) => Number(el.id)),
        string_fields: stringFields.map((el) => Number(el.id)),
      };

      if (imageInputs.file) {
        postImage(current_user.token, imageInputs.file).then((res) => {
          console.log(res);
          data = { ...data, imageId: res.id };

          createCollection(data, current_user.token).then((res) => {
            console.log(res);
            // console.log(data, "jjj");
          });
        });
      }
    } else {
      setNameInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
      setDescriptionInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
      setCategoryInputs((prevState) => ({
        ...prevState,
        startValidate: true,
      }));
    }
  };

  return (
    <Box component="form" autoComplete="off">
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Typography variant="body2" mb={1} color="rgb(52, 71, 103)">
              Collection Image:
            </Typography>

            <label htmlFor="collection-image">
              <Box
                height="235px"
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
          <FormControl fullWidth>
            <Typography variant="body2" mb={1} mt={2} color="rgb(52, 71, 103)">
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
              {nameInputs.startValidate && validationName.errors.first("name")}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <Typography variant="body2" mb={1} mt={2} color="rgb(52, 71, 103)">
              Description:
            </Typography>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              multiline
              rows={4}
              value={descriptionInputs.description}
              onChange={handleDescription}
              error={
                descriptionInputs.startValidate &&
                (validationDescription.passes() === true ? false : true)
              }
            />
            <FormHelperText error sx={{ ml: 0 }}>
              {descriptionInputs.startValidate &&
                validationDescription.errors.first("description")}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <Typography variant="body2" mb={1} mt={2} color="rgb(52, 71, 103)">
              Topic:
            </Typography>
            <Select
              fullWidth
              size="small"
              value={categoryInputs.category}
              onChange={handleCategory}
              error={
                categoryInputs.startValidate &&
                (validationCategory.passes() === true ? false : true)
              }
            >
              {categories.length > 0 &&
                categories.map((el) => (
                  <MenuItem sx={{ color: "#919aa3" }} value={el.id} key={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText error sx={{ ml: 0 }}>
              {categoryInputs.startValidate &&
                validationCategory.errors.first("category")}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <AdditionalFieldTypography
            variant="body2"
            title="Add additional fields:"
            marginLeft={true}
          />
          <Box my={2}>
            <Box display="flex">
              <CreateIcon fontSize="small" sx={{ color: "rgb(52, 71, 103)" }} />
              <AdditionalFieldTypography
                variant="subtitle2"
                title="String fields"
              />
            </Box>
            {stringFields &&
              stringFields.map((el) => (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={5}
                  mt={1}
                  key={el.id}
                >
                  <CreateIcon
                    fontSize="12px"
                    sx={{ color: "rgb(52, 71, 103)" }}
                  />
                  <AdditionalFieldTypography
                    variant="subtitle2"
                    title={el.name}
                  />
                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: "rgb(52, 71, 103)", cursor: "pointer" }}
                    onClick={(e) => deleteStringFieldBtn(e, el.id)}
                  />
                </Box>
              ))}
            {stringFields && stringFields.length < 3 && (
              <Box display="flex" alignItems="center" ml={5}>
                {stringTyping ? (
                  <CreateIcon fontSize="12px" sx={{ color: "#aeaeae" }} />
                ) : (
                  <AddIcon fontSize="12px" sx={{ color: "#aeaeae" }} />
                )}
                <InputBase
                  sx={{ ml: 1, fontSize: "14px", color: "#aeaeae" }}
                  inputRef={stringRef}
                  placeholder="New item"
                  onChange={handleStringInput}
                  endAdornment={
                    stringTyping && (
                      <InputAdornment position="end">
                        <Check
                          fontSize="small"
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => handleStringField(e)}
                        />
                      </InputAdornment>
                    )
                  }
                />
              </Box>
            )}
          </Box>
          <Box my={2}>
            <Box display="flex">
              <CalendarMonthIcon
                fontSize="small"
                sx={{ color: "rgb(52, 71, 103)" }}
              />
              <AdditionalFieldTypography
                variant="subtitle2"
                title="Date fields"
              />
            </Box>
            {dateFields &&
              dateFields.map((el) => (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={5}
                  mt={1}
                  key={el.id}
                >
                  <CalendarMonthIcon
                    fontSize="12px"
                    sx={{ color: "rgb(52, 71, 103)" }}
                  />
                  <AdditionalFieldTypography
                    variant="subtitle2"
                    title={el.name}
                  />
                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: "rgb(52, 71, 103)", cursor: "pointer" }}
                    onClick={(e) => deleteDateFieldBtn(e, el.id)}
                  />
                </Box>
              ))}
            {dateFields && dateFields.length < 3 && (
              <Box display="flex" alignItems="center" ml={5} mt={1}>
                {dateTyping ? (
                  <CalendarMonthIcon
                    fontSize="12px"
                    sx={{ color: "#aeaeae" }}
                  />
                ) : (
                  <AddIcon fontSize="12px" sx={{ color: "#aeaeae" }} />
                )}
                <InputBase
                  sx={{ ml: 1, fontSize: "14px", color: "#aeaeae" }}
                  inputRef={dateRef}
                  placeholder="New item"
                  onChange={handleDateInput}
                  endAdornment={
                    dateTyping && (
                      <InputAdornment position="end">
                        <Check
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => handleDateField(e)}
                        />
                      </InputAdornment>
                    )
                  }
                />
              </Box>
            )}
          </Box>
          <Box my={2}>
            <Box display="flex">
              <CheckBoxIcon
                fontSize="small"
                sx={{ color: "rgb(52, 71, 103)" }}
              />
              <AdditionalFieldTypography
                variant="subtitle2"
                title="CheckBox fields"
              />
            </Box>
            {booleanFields &&
              booleanFields.map((el) => (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={5}
                  mt={1}
                  key={el.id}
                >
                  <CheckBoxIcon
                    fontSize="12px"
                    sx={{ color: "rgb(52, 71, 103)" }}
                  />
                  <AdditionalFieldTypography
                    variant="subtitle2"
                    title={el.name}
                  />
                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: "rgb(52, 71, 103)", cursor: "pointer" }}
                    onClick={(e) => deleteBooleanFieldBtn(e, el.id)}
                  />
                </Box>
              ))}
            {booleanFields && booleanFields.length < 3 && (
              <Box display="flex" alignItems="center" ml={5} mt={1}>
                {boolTyping ? (
                  <CheckBoxIcon fontSize="12px" sx={{ color: "#aeaeae" }} />
                ) : (
                  <AddIcon fontSize="12px" sx={{ color: "#aeaeae" }} />
                )}
                <InputBase
                  sx={{ ml: 1, fontSize: "14px", color: "#aeaeae" }}
                  inputRef={boolRef}
                  placeholder="New item"
                  onChange={handleBooleanInput}
                  endAdornment={
                    boolTyping && (
                      <InputAdornment position="end">
                        <Check
                          sx={{ cursor: "pointer" }}
                          onClick={(e) => handleBooleanField(e)}
                        />
                      </InputAdornment>
                    )
                  }
                />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            sx={{
              background: "rgb(52, 71, 103)",
              textTransform: "none",
              boxShadow: "none",
              "&:hover, &:active, &:focus": {
                boxShadow: "none",
                backgroundColor: "rgba(52, 71, 103, 0.9)",
              },
            }}
            onClick={(e) => createCollectionBtn(e)}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreateCollection;
