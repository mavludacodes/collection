import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import CollectionCard from "../../../components/card/CollectionCard";
import { getCollections } from "../../../fetch/apies";
function MyCollections() {
  const current_user = JSON.parse(localStorage.getItem("current_user"));

  const [collections, setCollections] = useState();
  useEffect(() => {
    getCollections(current_user.token, current_user.id).then((res) => {
      setCollections(res);
    });
  }, []);

  return (
    <Box display="flex" flexWrap="wrap">
      {collections &&
        collections.map((collection) => (
          <Box sx={{ mr: "30px", mb: "35px" }}>
            <CollectionCard collection={collection} />
          </Box>
        ))}
    </Box>
  );
}

export default MyCollections;
