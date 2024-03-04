const express = require('express');
const router = express.Router();
const { ProtectAuthRoutes } = require('../../../middlewares/auth');
const {
  POST_change_production_status,
  POST_change_development_status,
  POST_delete_feature,
  POST_make_new_feature,
} = require('../../../controllers/Admin-Web-App/administrative/feature-controller');
const {
  RebuildDevCache,
  RebuildProdCache,
  RebuildBothCaches,
} = require('../../../helpers/caching/Cache-Handlers');

router.post(
  '/change-production-status',
  ProtectAuthRoutes,
  POST_change_production_status,
  RebuildProdCache,
);

router.post(
  '/change-development-status',
  ProtectAuthRoutes,
  POST_change_development_status,
  RebuildDevCache,
);

router.post(
  '/make-new-feature',
  ProtectAuthRoutes,
  POST_make_new_feature,
  RebuildBothCaches,
);

router.delete(
  '/delete-feature',
  ProtectAuthRoutes,
  POST_delete_feature,
  RebuildBothCaches,
);

module.exports = router;
