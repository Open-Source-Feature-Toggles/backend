const express = require('express');

function CreateApp() {
  require('./config/environment.config');
  const cors = require('cors');
  const morgan = require('morgan');
  const cookie_parser = require('cookie-parser');
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
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookie_parser());

  app.use((req, res, next) => {
    console.log(req.ip)
    next()
  })


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
