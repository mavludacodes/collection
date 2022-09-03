const getTags = async () => {
  const req = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/tags`, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset= UTF-8",
    },
  });
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const postTags = async (data) => {
  const req = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/tags`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset= UTF-8",
    },
    body: JSON.stringify(data),
  });
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export { getTags, postTags };
