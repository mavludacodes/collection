import React from "react";

import { Container, Box, Grid } from "@mui/material";

import { useParams } from "react-router-dom";
function ItemPage() {
  const { id } = useParams();
  console.log(id);
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
          }}
        >
          kdkjd
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
            jkdkdj
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
            kdkd
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default ItemPage;
