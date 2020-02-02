import app from './app';
import config from './config';

app.listen(config.app.port, config.app.hostname, () =>
  console.log('express app started listening on ' + config.app.port + ':' +
    config.app.hostname),
);
