const registerUser = async (data) => {
  const req = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/users`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset= UTF-8",
    },
    body: JSON.stringify(data),
  });
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const loginUser = async (data) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/auth/login`,
    {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset= UTF-8",
      },
      body: JSON.stringify(data),
    }
  );
  try {
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const getUsers = async (token) => {
  const req = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/users`, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset= UTF-8",
      "auth-token": token,
    },
  });
  try {
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const blockUser = async (data, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/users/block`,
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
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const deleteUser = async (id, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/users/${id}`,
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

const changeUserRole = async (data, token) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/users/role`,
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
    const res = await req;
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export {
  registerUser,
  getUsers,
  loginUser,
  blockUser,
  deleteUser,
  changeUserRole,
};
