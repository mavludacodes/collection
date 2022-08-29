const getCategories = async () => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/categories`,
    {
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
      },
    }
  );
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const postImage = async (token, file) => {
  var formData = new FormData();
  formData.append("img", file);
  const req = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/upload`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "auth-token": token,
    },
    body: formData,
  });
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export { getCategories, postImage };
