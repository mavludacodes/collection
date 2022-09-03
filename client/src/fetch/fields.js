const createStringValue = async (data) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/string-values`,
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
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const createIntegerValue = async (data) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/integer-values`,
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
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

const createCheckboxValue = async (data) => {
  const req = await fetch(
    `${process.env.REACT_APP_BACKEND_API}/api/checkbox-values`,
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
    const res = await req.json();
    return res;
  } catch (error) {
    console.log("error", error);
  }
};

export { createStringValue, createCheckboxValue, createIntegerValue };
