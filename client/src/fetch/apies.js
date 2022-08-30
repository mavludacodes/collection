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

const createStringField = async (data, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/string-fields`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
      body: JSON.stringify(data),
    }
  );
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const createIntegerField = async (data, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/integer-fields`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
      body: JSON.stringify(data),
    }
  );
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const createCheckboxField = async (data, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/checkbox-fields`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
      body: JSON.stringify(data),
    }
  );
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const deleteStringField = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/string-fields/${id}`,
    {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const deleteIntegerField = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/integer-fields/${id}`,
    {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const deleteCheckboxField = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/checkbox-fields/${id}`,
    {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const updateStringField = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/string-fields/${id}`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const updateIntegerField = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/integer-fields/${id}`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const updateCheckboxField = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/checkbox-fields/${id}`,
    {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
        "auth-token": token,
      },
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export {
  getCategories,
  postImage,
  createStringField,
  createIntegerField,
  createCheckboxField,
  deleteStringField,
  deleteIntegerField,
  deleteCheckboxField,
  updateStringField,
  updateIntegerField,
  updateCheckboxField,
};
