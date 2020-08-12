import 'module-alias/register';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import respond from 'koa-respond';
import koaLogger from 'koa-logger';
import nconf from 'nconf';
nconf.file({
  file: 'src/core/config/config.dev.json',
  logicalSeparator: '.',
});

import { initMongoLogs, initMongoConnection } from 'src/connectors/mongo-connector';
import logger from 'src/core/logger/Logger';
import { productsRouter } from './router/products-router';
import { errorMiddleware } from 'src/middlewares/error-handling';

const app = new Koa();
initMongoLogs();
initMongoConnection(nconf.get('db'));

app.use(errorMiddleware);
app.use(respond());
app.use(bodyParser());
app.use(
  koaLogger((str, args) => {
    logger.debug(str);
  }),
);
app.use(productsRouter.middleware());

app.on('error', (err, ctx) => {
  logger.error(`Got error code ${err.status} - message: ${err.message}`);
  err.originalError && logger.error(err.originalError.stack);
});

app.listen(nconf.get('server').port, () => {
  logger.info(`Amaromach server is on http://localhost:${nconf.get('server').port}/`);
});
