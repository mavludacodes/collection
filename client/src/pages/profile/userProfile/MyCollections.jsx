import { Box } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";

import CollectionCard from "../../../components/card/CollectionCard";
import { getCollections } from "../../../fetch/apies";

import { LabelContext } from "../index";

function MyCollections() {
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const [state, setState] = useContext(LabelContext);

  const [collections, setCollections] = useState([]);
  useEffect(() => {
    setState((state) => ({
      ...state,
      label: "My Collections",
      sublabel: "Recently created collections",
    }));
    getCollections(current_user.token, current_user.id).then((res) => {
      setCollections(res);
    });
  }, []);

  return (
    <Box display="flex" flexWrap="wrap">
      {collections &&
        collections.map((collection) => (
          <Box key={collection.id} sx={{ mr: "30px", mb: "35px" }}>
            <CollectionCard
              collection={collection}
              collections={collections}
              setCollections={setCollections}
            />
          </Box>
        ))}
    </Box>
  );
}

export default MyCollections;
