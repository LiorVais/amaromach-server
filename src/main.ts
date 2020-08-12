import 'module-alias/register';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import respond from 'koa-respond';
import MongoConnector from 'src/connectors/database-connector';
import logger from 'src/core/logger/Logger';
import Settings from 'src/core/config/Settings';
import { productsRouter } from './router/products-router';
import { errorMiddleware } from 'src/middlewares/error-handling';

const app = new Koa();
const settings = new Settings();
const mongoConnector = new MongoConnector(settings);

app.use(errorMiddleware);
app.use(respond());
app.use(bodyParser());
app.use(productsRouter.middleware());

app.on('error', (err, ctx) => {
  logger.error(`Got error code ${err.status} - message: ${err.message}`);
  err.originalError && logger.error(err.originalError.stack);
});

app.listen(settings.config.server.port, () => {
  logger.info(`Amaronach server is on http://localhost:${settings.config.server.port}/`);
});
