const express = require('express');

function CreateApp() {
  require('./config/environment.config');
  const cors = require('cors');
  const morgan = require('morgan');
  const cookie_parser = require('cookie-parser');
  const chalk = require('chalk')
  const projectRoutes = require('./routes/Admin-Web-App/administrative/projects');
  const featuresRoutes = require('./routes/Admin-Web-App/administrative/features');
  const variableRoutes = require('./routes/Admin-Web-App/administrative/variables');
  const authRoutes = require('./routes/Admin-Web-App/authRoutes');
  const apiRouter = require('./routes/api/api-router');
  const appRouter = require('./routes/Admin-Web-App/appRouter');
  const app = express();

  // Express Middleware
  // const acceptedOrigins = [
  //     'http://localhost:5173',
  //     'https://opensourcefeaturetoggles.com',
  // ]
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  morgan.token('color-status', function (req, res) {
    const status = res.statusCode;

    // Apply color based on the response status code range
    if (status >= 500) return chalk.red(status);
    if (status >= 400) return chalk.yellow(status);
    if (status >= 300) return chalk.cyan(status);
    if (status >= 200) return chalk.green(status);
    return status; // Default to no color if none of the above
  });


  app.use(morgan(':date[web] :method :url :color-status :response-time ms - :res[content-length]'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookie_parser());

  // Routes
  app.use('/projects', projectRoutes);
  app.use('/features', featuresRoutes);
  app.use('/variables', variableRoutes);
  app.use('/auth', authRoutes);
  app.use('/api', apiRouter);
  app.use('/app', appRouter);

  return app;
}

module.exports = CreateApp;
