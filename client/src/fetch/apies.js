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

export { getCategories };
