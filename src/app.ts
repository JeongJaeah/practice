import * as core from 'express-serve-static-core';

const createError = require('http-errors');
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import pageRouter from "./routes/page/pageRouter";

const { createPools } = require('./modules/db/dbPool');

let server: http.Server;

const app = express();

// app.use(helmet());

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', pageRouter);

/* catch 404 */
app.use(function(req: Request, res: Response, next: NextFunction) {
  // 404 미들웨어
  next(createError(404));
});

/* Error Handler */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error.html');
});


async function startServer(app: core.Express) {
  const pool = await createPools();
  app.locals.pool = pool;

  // start the server
  server = app.listen(8080, () => {
    if (process?.send) {
      process.send('ready');
    }
    console.log(`
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃   Server listening on port: 8080   ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    `);
  });
}

startServer(app);

console.log(1)