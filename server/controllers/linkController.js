const Link = require('../models/Link');
const { generateShortCode, isValidShortCode } = require('../utils/shortCode');
const useragent = require('express-useragent');
const geoip = require('geoip-lite');

// Create a new shortened link
exports.createLink = async (req, res) => {
  try {
    const { originalUrl, title, tags, category, isPublic } = req.body;
    
    let shortCode;
    let isUnique = false;
    
    // Generate a unique short code
    while (!isUnique) {
      shortCode = generateShortCode();
      const existingLink = await Link.findOne({ shortCode });
      if (!existingLink) {
        isUnique = true;
      }
    }

    const link = new Link({
      user: req.user._id,
      originalUrl,
      shortCode,
      title,
      tags,
      category,
      isPublic
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all links for a user
exports.getLinks = async (req, res) => {
  try {
    const { search, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Count total documents for pagination
    const total = await Link.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get paginated results
    const links = await Link.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      links,
      totalPages,
      currentPage: page,
      totalLinks: total
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get a single link by ID
exports.getLink = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a link
exports.updateLink = async (req, res) => {
  try {
    const updates = req.body;
    
    // If shortCode is being updated, validate it
    if (updates.shortCode) {
      if (!isValidShortCode(updates.shortCode)) {
        return res.status(400).json({ 
          error: 'Invalid short code format. Please use 4-10 alphanumeric characters (a-z, A-Z, 0-9)' 
        });
      }
      // Check if the new shortCode is already in use
      const existingLink = await Link.findOne({ 
        shortCode: updates.shortCode,
        _id: { $ne: req.params.id } // Exclude current link
      });
      if (existingLink) {
        return res.status(400).json({ error: 'This short code is already in use' });
      }
    }
    
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get public links
exports.getPublicLinks = async (req, res) => {
  try {
    const { search, category, tag, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    
    const query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (tag) {
      query.tags = { $regex: tag, $options: 'i' };
    }

    console.log('Public Links Query:', query);
    const totalLinks = await Link.countDocuments(query);
    console.log('Total Public Links:', totalLinks);
    
    const links = await Link.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title originalUrl shortCode category tags analytics.clicks createdAt isPublic');
    
    console.log('Found Public Links:', links.length);
    
    res.json({
      links,
      totalPages: Math.ceil(totalLinks / limit),
      currentPage: page,
      totalLinks
    });
  } catch (error) {
    console.error('Error fetching public links:', error);
    res.status(400).json({ error: error.message });
  }
};

// Redirect to original URL and track analytics
exports.redirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    if (!isValidShortCode(shortCode)) {
      return res.status(400).json({ error: 'Invalid short code' });
    }

    const link = await Link.findOne({ shortCode });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    if (link.status !== 'active') {
      return res.status(410).json({ error: 'Link is no longer active' });
    }

    // Track analytics
    const ua = useragent.parse(req.headers['user-agent']);
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    
    // Update analytics
    link.analytics.clicks += 1;
    link.analytics.lastClicked = new Date();
    
    // Update referrer
    const referrer = req.get('Referrer') || 'Direct';
    const referrerIndex = link.analytics.referrers.findIndex(r => r.source === referrer);
    if (referrerIndex > -1) {
      link.analytics.referrers[referrerIndex].count += 1;
    } else {
      link.analytics.referrers.push({ source: referrer, count: 1 });
    }
    
    // Update location
    if (geo) {
      const locationIndex = link.analytics.locations.findIndex(l => l.country === geo.country);
      if (locationIndex > -1) {
        link.analytics.locations[locationIndex].count += 1;
      } else {
        link.analytics.locations.push({ country: geo.country, count: 1 });
      }
    }
    
    // Update device
    const device = ua.isMobile ? 'mobile' : ua.isTablet ? 'tablet' : 'desktop';
    const deviceIndex = link.analytics.devices.findIndex(d => d.deviceType === device);
    if (deviceIndex > -1) {
      link.analytics.devices[deviceIndex].count += 1;
    } else {
      link.analytics.devices.push({ deviceType: device, count: 1 });
    }

    await link.save();
    
    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get link analytics
exports.getLinkAnalytics = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(link.analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
