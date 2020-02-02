import config from './config';
import Application from './app';

new Application(config).express.listen(config.app.port, config.app.hostname, () =>
  console.log('express app started listening on ' + config.app.hostname + ':' +
    config.app.port),
);
