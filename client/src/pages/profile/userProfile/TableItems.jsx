import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { LabelContext } from "../index";
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

import { getItems } from "../../../fetch/apies";

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
  useEffect(() => {
    setState((state) => ({
      ...state,
      label: "My Items",
      sublabel: "Recently created items",
    }));
    getItems(token, id).then((res) => {
      setData(res);
    });
  }, []);

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
      <DataTable
        columns={columns}
        data={data}
        pagination
        // onSelectedRowsChange={handleChange}
        // clearSelectedRows={toggledClearRows}
      />
    </Box>
  );
}

export default TableItems;
