import 'module-alias/register';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import respond from 'koa-respond';
import MongoConnector from 'src/connectors/database-connector';
import logger from 'src/core/logger/Logger';
import Settings from 'src/core/config/Settings';
import { productsRouter } from './router/products-router';

const app = new Koa();
const settings = new Settings();
const mongoConnector = new MongoConnector(settings);

app.use(respond());
app.use(bodyParser());
app.use(productsRouter.middleware());

app.listen(settings.config.server.port, () => {
  logger.info(`Amaronach server is on http://localhost:${settings.config.server.port}/`);
});
