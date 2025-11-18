import connectDB from "../../../../lib/mongodb";
import Visit from "../../../../models/Visits";

const getLocationFromIP = async (ip) => {
  try {
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'unknown' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return {
        country: 'Local',
        city: 'Local',
        region: 'Local',
        latitude: 0,
        longitude: 0,
      };
    }

    const services = [
      `https://ipapi.co/${ip}/json/`,
      `https://ip-api.com/json/${ip}?fields=country,city,region,lat,lon`,
      `https://api.ipgeolocation.io/ipgeo?apiKey=demo&ip=${ip}`,
      `https://api.ipify.org?format=json&ip=${ip}`,
      `https://ipwho.is/${ip}?output=json`,
    ];

    for (const serviceUrl of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch(serviceUrl, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        const data = await response.json();

        let country = data.country || data.country_name || data.country_code;
        let city = data.city;
        let region = data.region || data.region_name;
        let latitude = data.latitude || data.lat;
        let longitude = data.longitude || data.lon;

        if (data.country_code && !country) {
          country = data.country_code;
        }
        if (data.region_code && !region) {
          region = data.region_code;
        }

        if (country) {
          return {
            country: country.toUpperCase(),
            city: city || 'Unknown',
            region: region || 'Unknown',
            latitude: latitude || 0,
            longitude: longitude || 0,
          };
        }
      } catch (error) {
        console.log(`Geolocation service failed: ${serviceUrl} - ${error.message}`);
        continue;
      }
    }

    console.log(`Failed to geolocate IP: ${ip}`);
  } catch (error) {
    console.error('Error in getLocationFromIP:', error);
  }

  return {
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    latitude: 0,
    longitude: 0,
  };
};

const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();

  let device = 'desktop';

  const tabletPatterns = [
    /\bipad\b/,
    /\bandroid\b.*\btablet\b/,
    /\bkindle\b/,
    /\bplaybook\b/,
    /\bsilk\b/,
    /\btouchpad\b/,
    /\bxoom\b/,
    /\btransformer\b/,
    /\bnook\b/,
    /\bslate\b/,
    /\bsurface\b.*\bwindows\b/
  ];

  const isTablet = tabletPatterns.some(pattern => pattern.test(ua));
  if (isTablet) {
    device = 'tablet';
  }

  if (device !== 'tablet') {
    const mobilePatterns = [
      /\bandroid\b.*\bmobile\b/,
      /\biphone\b/,
      /\bipod\b/,
      /\bblackberry\b/,
      /\bie.*mobile\b/,
      /\bopera.*mini\b/,
      /\bmobile\b/,
      /\bwebos\b/,
      /\bsamsung\b.*\bphone\b/,
      /\bhuawei\b.*\bphone\b/,
      /\bmotorola\b/,
      /\bnokia\b/,
      /\bsony\b.*\bphone\b/,
      /\blg\b.*\bphone\b/
    ];

    const isMobile = mobilePatterns.some(pattern => pattern.test(ua));
    if (isMobile) {
      device = 'mobile';
    }
  }

  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg/') && !ua.includes('opr/')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox') && !ua.includes('seamonkey')) {
    browser = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android')) {
    browser = 'Safari';
  } else if (ua.includes('edg/')) {
    browser = 'Edge';
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera';
  } else if (ua.includes('msie') || ua.includes('trident')) {
    browser = 'Internet Explorer';
  }

  let os = 'Unknown';
  if (ua.includes('windows nt')) os = 'Windows';
  else if (ua.includes('macintosh') || ua.includes('mac os x')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) os = 'iOS';
  else if (ua.includes('cros')) os = 'Chrome OS';

  return { device, browser, os };
};

export async function POST(request) {
  try {
    await connectDB();

    const { sessionId, url, referrer, userAgent } = await request.json();

    let ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             request.ip ||
             'unknown';

    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    const location = await getLocationFromIP(ip);

    const { device, browser, os } = parseUserAgent(userAgent);

    let visit = await Visit.findOne({ sessionId });

    if (!visit) {
      visit = new Visit({
        ip,
        userAgent,
        location,
        sessionId,
        pageViews: [{ url, timestamp: new Date() }],
        referrer,
        device,
        browser,
        os,
      });
    } else {
      visit.pageViews.push({ url, timestamp: new Date() });
    }

    await visit.save();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return new Response(JSON.stringify({ error: "Failed to track visit" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const totalVisitors = await Visit.distinct('sessionId').then(sessions => sessions.length);

    const visitorsByCountry = await Visit.aggregate([
      { $group: { _id: '$location.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const visitorsByCity = await Visit.aggregate([
      { $group: { _id: { country: '$location.country', city: '$location.city' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const avgSessionDuration = await Visit.aggregate([
      { $match: { totalDuration: { $gt: 0 } } },
      { $group: { _id: null, avgDuration: { $avg: '$totalDuration' } } }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pageViewsOverTime = await Visit.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const deviceBreakdown = await Visit.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]);

    const browserBreakdown = await Visit.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } }
    ]);

    const topPages = await Visit.aggregate([
      { $unwind: '$pageViews' },
      { $group: { _id: '$pageViews.url', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const recentVisits = await Visit.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('ip location device browser sessionStart totalDuration');

    return new Response(
      JSON.stringify({
        totalVisitors,
        visitorsByCountry,
        visitorsByCity,
        avgSessionDuration: avgSessionDuration[0]?.avgDuration || 0,
        pageViewsOverTime,
        deviceBreakdown,
        browserBreakdown,
        topPages,
        recentVisits,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch analytics" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
