const fs = require('fs');
const path = require('path');
const https = require('https');

const downloads = [
  // Hero
  { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&q=85', dest: 'public/images/hero/hero-slide-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85', dest: 'public/images/hero/hero-slide-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85', dest: 'public/images/hero/hero-slide-3.jpg' },

  // Properties
  { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80', dest: 'public/images/properties/villa-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', dest: 'public/images/properties/apartment-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', dest: 'public/images/properties/house-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80', dest: 'public/images/properties/interior-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80', dest: 'public/images/properties/property-gallery-fallback.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', dest: 'public/images/properties/property-placeholder.jpg' },

  // Lifestyle
  { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', dest: 'public/images/lifestyle/villas.jpg' },
  { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', dest: 'public/images/lifestyle/apartments.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', dest: 'public/images/lifestyle/houses.jpg' },
  { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', dest: 'public/images/lifestyle/waterfront.jpg' },
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', dest: 'public/images/lifestyle/plots.jpg' },
  { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', dest: 'public/images/lifestyle/commercial.jpg' },

  // Locations
  { url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', dest: 'public/images/locations/bengaluru.jpg' },
  { url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80', dest: 'public/images/locations/chennai.jpg' },
  { url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80', dest: 'public/images/locations/hyderabad.jpg' },
  { url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80', dest: 'public/images/locations/coimbatore.jpg' },
  { url: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80', dest: 'public/images/locations/mumbai.jpg' },
  { url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80', dest: 'public/images/locations/pune.jpg' },
  { url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', dest: 'public/images/locations/delhi.jpg' },
  { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', dest: 'public/images/locations/goa.jpg' },

  // Services
  { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', dest: 'public/images/services/service-buy.jpg' },
  { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', dest: 'public/images/services/service-rent.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', dest: 'public/images/services/service-sell.jpg' },
  { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', dest: 'public/images/services/service-commercial.jpg' },
  { url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80', dest: 'public/images/services/service-legal.jpg' },
  { url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80', dest: 'public/images/services/service-loan.jpg' },

  // About
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85', dest: 'public/images/about/about-story.jpg' },
  { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=85', dest: 'public/images/about/about-living.jpg' },

  // CTA
  { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=85', dest: 'public/images/cta/cta-banner.jpg' },

  // Testimonials
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', dest: 'public/images/testimonials/avatar-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', dest: 'public/images/testimonials/avatar-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', dest: 'public/images/testimonials/avatar-3.jpg' },

  // Auth
  { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80', dest: 'public/images/auth/auth-login.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', dest: 'public/images/auth/auth-register.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const fullDest = path.resolve(process.cwd(), dest);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    function get(currentUrl, redirectCount = 0) {
      if (redirectCount > 5) {
        return reject(new Error('Too many redirects for ' + currentUrl));
      }

      https.get(currentUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, redirectCount + 1);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Failed ${res.statusCode} for ${currentUrl}`));
        }

        const file = fs.createWriteStream(fullDest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(fullDest);
          console.log(`Downloaded ${dest} (${Math.round(stats.size / 1024)} KB)`);
          resolve();
        });
        file.on('error', (err) => {
          fs.unlink(fullDest, () => {});
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    }

    get(url);
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} assets...`);
  for (const item of downloads) {
    try {
      await download(item.url, item.dest);
    } catch (e) {
      console.error(`Error downloading ${item.dest}:`, e.message);
    }
  }
  console.log('All downloads completed!');
}

run();

