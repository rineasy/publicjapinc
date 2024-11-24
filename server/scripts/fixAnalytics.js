const mongoose = require('mongoose');
require('dotenv').config();

const Link = require('../models/Link');

async function fixAnalytics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const links = await Link.find({});
    console.log(`Found ${links.length} links to process`);

    for (const link of links) {
      // Fix devices array
      if (link.analytics && link.analytics.devices) {
        const fixedDevices = link.analytics.devices.map(device => {
          if (typeof device === 'object' && device.type) {
            // Convert old format to new format
            return {
              deviceType: device.type,
              count: device.count || 1
            };
          } else if (typeof device === 'object' && device.deviceType) {
            // Already in correct format
            return device;
          } else {
            // Default format
            return {
              deviceType: 'unknown',
              count: 1
            };
          }
        });

        link.analytics.devices = fixedDevices;
        await link.save();
        console.log(`Fixed analytics for link: ${link.shortCode}`);
      }
    }

    console.log('Analytics fix completed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing analytics:', error);
    process.exit(1);
  }
}

fixAnalytics();
