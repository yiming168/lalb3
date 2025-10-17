// Acknowledgement: This file includes changes assisted by ChatGPT (OpenAI).
module.exports = {
  // User-facing and configuration strings for EN locale
  greetTemplate:
    "Hello %1, What a beautiful day. Server current date and time is",
  CONTENT_TYPE: {
    HTML_UTF8: "text/html; charset=utf-8",
    TEXT_UTF8: "text/plain; charset=utf-8",
  },
  ENCODING: {
    UTF8: "utf8",
  },
  HTTP_METHOD: {
    GET: "GET",
  },
  PROTOCOL: {
    HTTP: "http",
  },
  ROUTE_BASES: ["/COMP4537/labs/3", "/COMP4537/lab3", ""],
  ROUTES: {
    GET_DATE: "getDate",
    WRITE_FILE: "writeFile",
    READ_FILE: "readFile",
  },
  QUERY: {
    NAME: "name",
    TEXT: "text",
  },
  FILENAMES: {
    APPEND_TARGET: "file.txt",
  },
  DEFAULTS: {
    NAME: "Guest",
    COLOR: "blue",
  },
  MESSAGES: {
    METHOD_NOT_ALLOWED: "Method Not Allowed",
    BAD_REQUEST_MISSING_TEXT: "Bad Request: missing 'text' query parameter",
    INTERNAL_WRITE_ERROR: "Internal Server Error while writing to file",
    INTERNAL_READ_ERROR: "Internal Server Error while reading file",
    APPENDED_PREFIX: "Appended to file: ",
    NOT_FOUND: "404 Not Found",
  },
  NEWLINE: "\n",
  HEADERS: {
    CONTENT_TYPE: "Content-Type",
  },
  ERROR_CODES: {
    ENOENT: "ENOENT",
  },
  SERVER_MESSAGES: {
    START_LISTENING: "Server is listening on port %1",
  },
  JOINERS: {
    DATE: " ",
  },
};
