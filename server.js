// Acknowledgement: This file includes changes assisted by ChatGPT (OpenAI).
`use strict`;

const http = require("http");
const fs = require("fs");
const path = require("path");
const Utils = require("./modules/utils");
const STRINGS = require("./lang/en/en");
const { PORT, HOST, STATUS } = require("./modules/constants");

class ServerApp {
  constructor(port = PORT, host = HOST) {
    this.port = port;
    this.host = host;
    this.server = http.createServer(this.requestHandler.bind(this));
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(
        STRINGS.SERVER_MESSAGES.START_LISTENING.replace("%1", this.port)
      );
    });
  }

  requestHandler(req, res) {
    if (req.method !== STRINGS.HTTP_METHOD.GET) {
      res.writeHead(STATUS.METHOD_NOT_ALLOWED, {
        [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
      });
      res.end(STRINGS.MESSAGES.METHOD_NOT_ALLOWED);
      return;
    }

    const urlObj = new URL(
      req.url,
      `${STRINGS.PROTOCOL.HTTP}://${req.headers.host}`
    );
    const pathname = this.normalizePath(urlObj.pathname);
    const { searchParams } = urlObj;

    // Route: getDate (supports configured base paths)
    if (this.isExactRoute(pathname, STRINGS.ROUTES.GET_DATE)) {
      const name =
        searchParams.get(STRINGS.QUERY.NAME) || STRINGS.DEFAULTS.NAME;
      const dateStr = Utils.getDateString();
      const htmlContent = Utils.renderStyledText(
        name,
        STRINGS.greetTemplate,
        dateStr,
        STRINGS.DEFAULTS.COLOR,
        STRINGS.JOINERS.DATE
      );
      res.writeHead(STATUS.OK, {
        [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.HTML_UTF8,
      });
      res.end(htmlContent);
      return;
    }

    // Route: writeFile (append text to file)
    if (this.isExactRoute(pathname, STRINGS.ROUTES.WRITE_FILE)) {
      const text = searchParams.get(STRINGS.QUERY.TEXT);
      if (text === null) {
        res.writeHead(STATUS.BAD_REQUEST, {
          [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
        });
        res.end(STRINGS.MESSAGES.BAD_REQUEST_MISSING_TEXT);
        return;
      }
      const filePath = path.join(__dirname, STRINGS.FILENAMES.APPEND_TARGET);
      fs.appendFile(
        filePath,
        `${text}${STRINGS.NEWLINE}`,
        STRINGS.ENCODING.UTF8,
        (err) => {
          if (err) {
            console.error(err);
            res.writeHead(STATUS.INTERNAL_SERVER_ERROR, {
              [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
            });
            res.end(STRINGS.MESSAGES.INTERNAL_WRITE_ERROR);
            return;
          }
          res.writeHead(STATUS.OK, {
            [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
          });
          res.end(
            `${STRINGS.MESSAGES.APPENDED_PREFIX}${path.basename(filePath)}`
          );
        }
      );
      return;
    }

    // Route: readFile/<filename>
    const readFileName = this.matchReadFile(pathname);
    if (readFileName) {
      const safeName = path.basename(readFileName);
      const filePath = path.join(__dirname, safeName);
      fs.readFile(filePath, STRINGS.ENCODING.UTF8, (err, data) => {
        if (err) {
          if (err.code === STRINGS.ERROR_CODES.ENOENT) {
            res.writeHead(STATUS.NOT_FOUND, {
              [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
            });
            res.end(`${STRINGS.MESSAGES.NOT_FOUND}: ${safeName}`);
          } else {
            console.error(err);
            res.writeHead(STATUS.INTERNAL_SERVER_ERROR, {
              [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
            });
            res.end(STRINGS.MESSAGES.INTERNAL_READ_ERROR);
          }
          return;
        }
        res.writeHead(STATUS.OK, {
          [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
        });
        res.end(data);
      });
      return;
    }

    // Fallback 404
    res.writeHead(STATUS.NOT_FOUND, {
      [STRINGS.HEADERS.CONTENT_TYPE]: STRINGS.CONTENT_TYPE.TEXT_UTF8,
    });
    res.end(STRINGS.MESSAGES.NOT_FOUND);
  }

  // Normalize by removing trailing slashes (except root)
  normalizePath(p) {
    if (p.length > 1 && p.endsWith("/")) return p.replace(/\/+$/g, "");
    return p;
  }

  // Build all acceptable absolute paths for a route segment
  buildPathsFor(segment) {
    return STRINGS.ROUTE_BASES.map((b) =>
      b ? `${b}/${segment}` : `/${segment}`
    );
  }

  // Does pathname match a route exactly (with any base)?
  isExactRoute(pathname, segment) {
    const candidates = this.buildPathsFor(segment);
    return candidates.includes(pathname);
  }

  // If pathname matches any readFile prefix, return filename; else null
  matchReadFile(pathname) {
    const prefixes = STRINGS.ROUTE_BASES.map((b) =>
      b ? `${b}/${STRINGS.ROUTES.READ_FILE}/` : `/${STRINGS.ROUTES.READ_FILE}/`
    );
    for (const prefix of prefixes) {
      if (pathname.startsWith(prefix)) {
        return decodeURIComponent(pathname.slice(prefix.length));
      }
    }
    return null;
  }
}

new ServerApp(PORT).start();
