import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { getSingleItem } from "../../fetch/main";
import { getSingleTag } from "../../fetch/tags";
import {
  getItemStringFields,
  getItemIntegerFields,
  getItemCheckboxFields,
} from "../../fetch/fields";

function ItemPage() {
  const { id } = useParams();
  console.log(id);

  const [itemData, setItemData] = useState();
  const [tags, setTags] = useState();
  useEffect(() => {
    getSingleItem(id).then((res) => {
      setItemData(res);
      Promise.all(
        res.tags.map(async (id) => {
          return await getSingleTag(id).then((res) => {
            return res.tagname;
          });
        })
      ).then((arr) => {
        setTags(arr);
      });
    });
  }, []);

  const [stringValues, setStringValues] = useState();
  useEffect(() => {
    if (id) {
      getItemStringFields(id).then((res) => {
        setStringValues(res);
      });
    }
  }, [id]);

  const [integerValues, setIntegerValues] = useState();

  useEffect(() => {
    if (id) {
      getItemIntegerFields(id).then((res) => {
        setIntegerValues(res);
      });
    }
  }, [id]);

  const [checkboxValues, setCheckboxValues] = useState();

  useEffect(() => {
    if (id) {
      getItemCheckboxFields(id).then((res) => {
        setCheckboxValues(res);
      });
    }
  }, [id]);

  return (
    <Container maxWidth="md">
      <Box display="flex" m={3}>
        <Box
          sx={{
            m: "20px",
            height: "420px",
            width: "500px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 1px 20px 0 rgb(69 90 100 / 8%)",
            padding: "10px",
          }}
        >
          {itemData && (
            <img
              style={{ borderRadius: "20px" }}
              width={"100%"}
              src={`${process.env.REACT_APP_BACKEND_API}/images/${itemData.image_id}/${itemData.image_url}`}
              alt={itemData.name}
              loading="lazy"
            />
          )}

          <Box p={3}>
            <Typography
              sx={{
                color: "rgb(52, 71, 103);",
                fontWeight: 600,
                mr: "5px",
                textTransform: "capitalize",
              }}
            >
              Title:{" "}
              <span style={{ fontWeight: 500 }}>
                {itemData && itemData.title}
              </span>
            </Typography>

            <Typography
              sx={{
                color: "rgb(52, 71, 103);",
                fontWeight: 600,
                mr: "5px",
                textTransform: "capitalize",
              }}
            >
              Published:{" "}
              <span style={{ fontWeight: 500 }}>
                {itemData && itemData.created_at}
              </span>
            </Typography>
            <Typography
              sx={{
                color: "rgb(52, 71, 103);",
                fontWeight: 600,
                mr: "5px",
                textTransform: "capitalize",
              }}
            >
              Collection:{" "}
              <span style={{ fontWeight: 500 }}>
                {itemData && itemData.collection_name}
              </span>
            </Typography>
            <Typography
              sx={{
                color: "rgb(52, 71, 103);",
                fontWeight: 600,
                mr: "5px",
                textTransform: "capitalize",
              }}
            >
              Topic:{" "}
              <span style={{ fontWeight: 500 }}>
                {itemData && itemData.topic}
              </span>
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              mt: "20px",
              mb: "10px",
              height: "200px",
              width: "400px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 1px 20px 0 rgb(69 90 100 / 8%)",
            }}
          >
            <Box p={3}>
              {stringValues &&
                stringValues.map((el) => {
                  return (
                    <Box display="flex">
                      <Typography
                        sx={{
                          color: "rgb(52, 71, 103);",
                          fontWeight: 600,
                          mr: "5px",
                          textTransform: "capitalize",
                        }}
                      >
                        {el.name}:
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgb(52, 71, 103);",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {el.value}
                      </Typography>
                    </Box>
                  );
                })}

              {integerValues &&
                integerValues.map((el) => {
                  return (
                    <Box display="flex">
                      <Typography
                        sx={{
                          color: "rgb(52, 71, 103);",
                          fontWeight: 600,
                          mr: "5px",
                          textTransform: "capitalize",
                        }}
                      >
                        {el.name}:
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgb(52, 71, 103);",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {el.value}
                      </Typography>
                    </Box>
                  );
                })}

              {checkboxValues &&
                checkboxValues.map((el) => {
                  return (
                    <Box display="flex">
                      <Typography
                        sx={{
                          color: "rgb(52, 71, 103);",
                          fontWeight: 600,
                          mr: "5px",
                          textTransform: "capitalize",
                        }}
                      >
                        {el.name}:
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgb(52, 71, 103);",
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {el.value ? "yes" : "no"}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          </Box>
          <Box
            sx={{
              mt: "20px",
              mb: "10px",
              height: "200px",
              width: "400px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 1px 20px 0 rgb(69 90 100 / 8%)",
            }}
          >
            <Box p={3}>
              <Typography
                sx={{
                  mb: "15px",
                  color: "rgb(52, 71, 103);",
                  fontWeight: 600,
                }}
              >
                Tags:
              </Typography>
              <Stack direction="row" spacing={1}>
                {tags &&
                  tags.map((el) => {
                    return <Chip label={el} key={el}></Chip>;
                  })}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ItemPage;
