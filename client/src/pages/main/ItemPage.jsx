import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, Typography } from "@mui/material";
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
          <Typography>
            Title:
            {itemData && itemData.title}
          </Typography>
          <Typography>Published: {itemData && itemData.created_at}</Typography>
          <Typography>
            Collection: {itemData && itemData.collection_name}
          </Typography>
          <Typography>Topic: {itemData && itemData.topic}</Typography>
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
            {stringValues &&
              stringValues.map((el) => {
                return (
                  <Typography>
                    {el.name}: {el.value}
                  </Typography>
                );
              })}

            {integerValues &&
              integerValues.map((el) => {
                return (
                  <Typography>
                    {el.name}: {el.value}
                  </Typography>
                );
              })}

            {checkboxValues &&
              checkboxValues.map((el) => {
                return (
                  <Typography>
                    {el.name}: {el.value ? "Yes" : "No"}
                  </Typography>
                );
              })}
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
            <Typography>Tags:</Typography>
            {tags &&
              tags.map((el) => {
                return <Typography key={el}>{el}</Typography>;
              })}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ItemPage;
