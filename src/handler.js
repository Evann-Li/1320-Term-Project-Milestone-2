const { parse } = require("url");
const { DEFAULT_HEADER } = require("./util/util.js");
const controller = require("./controller");
const { createReadStream } = require("fs");
const path = require("path");
const formidable = require("formidable");

// Import Express if not already done
const express = require('express');
const app = express();

// Define static files directory
app.use('/photos', express.static(path.join(__dirname, 'photos')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/views', express.static(path.join(__dirname, 'views')));

const allRoutes = {
  // GET: localhost:3000/
  "/:get": (request, response) => {
    controller.getHomePage(request, response);
  },
  // GET: localhost:3000/form
  "/form:get": (request, response) => {
    controller.getFormPage(request, response);
  },
  // POST: localhost:3000/form
  "/form:post": (request, response) => {
    controller.sendFormData(request, response);
  },
  // POST: localhost:3000/images
  "/images:post": (request, response) => {
    controller.uploadImages(request, response);
  },
  // GET: localhost:3000/feed
  // Shows Instagram profile for a given user
  "/feed:get": (request, response) => {
    controller.getFeed(request, response);
  },
  // GET: localhost:3000/john.html
  "/john.html:get": (request, response) => {
    // You should define the logic for serving john.html here
    const filePath = path.join(__dirname, "views", "john.html");
    createReadStream(filePath, "utf8").pipe(response);
  },
  // GET: localhost:3000/sandra.html
  "/sandra.html:get": (request, response) => {
    // You should define the logic for serving john.html here
    const filePath = path.join(__dirname, "views", "sandra.html");
    createReadStream(filePath, "utf8").pipe(response);
  },
  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    createReadStream(path.join(__dirname, "views", "404.html"), "utf8").pipe(response);
  },
};

function handler(request, response) {
  const { url, method } = request;

  const { pathname } = parse(url, true);

  // Check if the requested URL starts with /photos
  if (pathname.startsWith('/photos') || pathname.startsWith('/styles') || pathname.startsWith('/views')) {
    // Serve static files using Express static middleware
    return app(request, response);
  }

  const key = `${pathname}:${method.toLowerCase()}`;
  const chosen = allRoutes[key] || allRoutes.default;

  return Promise.resolve(chosen(request, response)).catch(handlerError(response));
}

function handlerError(response) {
  return (error) => {
    console.log("Something bad has happened**", error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internet server error!!" }));
    return response.end();
  };
}

module.exports = handler;
