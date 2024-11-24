const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const auth = require('../middleware/auth');

// Public routes should come before parameterized routes
router.get('/public', linkController.getPublicLinks);

// Protected routes
router.use(auth);

router.route('/')
  .get(linkController.getLinks)
  .post(linkController.createLink);

router.route('/:id')
  .get(linkController.getLink)
  .put(linkController.updateLink)
  .delete(linkController.deleteLink);

router.get('/:id/analytics', linkController.getLinkAnalytics);

module.exports = router;
