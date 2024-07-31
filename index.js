const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(morgan("combined"));

const PORT = 3005;

app.use("/bookingservice", async (req, res, next) => {
  try {
    const response = await axios.get(
      "http://localhost:3001/api/v1/isAuthenticated",
      {
        headers: {
          "x-access-token": req.headers["x-access-token"],
        },
      }
    );
    if (response.data.success) {
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorised",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorised",
      err: error,
    });
  }
});

app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: "http://localhost:3002/",
    changeOrigin: true,
  })
);
app.get("/home", (req, res) => {
  return res.json({ message: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
