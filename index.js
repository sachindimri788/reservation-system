const express = require("express");
require("dotenv").config();
require("./config/dbConfig");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./Routes/indexRoute");
const { errorHandler } = require("./Utils/response");
const webhook = require("./Utils/webhook");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const options = {
  swaggerDefinition: swaggerDocument,
  apis: [],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/webhook", webhook);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listning at port number ${port}`);
});
