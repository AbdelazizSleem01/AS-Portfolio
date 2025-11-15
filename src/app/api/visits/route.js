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
      `https://api.ipgeolocation.io/ipgeo?apiKey=demo&ip=${ip}`, // Demo key for testing
    ];

    for (const serviceUrl of services) {
      try {
        console.log('Trying geolocation service:', serviceUrl);
        const response = await fetch(serviceUrl, {
          timeout: 5000, 
        });
        const data = await response.json();

        if (data.country && (data.city || data.region)) {
          return {
            country: data.country || data.country_name || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || data.region_name || 'Unknown',
            latitude: data.latitude || data.lat || 0,
            longitude: data.longitude || data.lon || 0,
          };
        }
      } catch (error) {
        console.error('Geolocation service failed:', serviceUrl, error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error fetching location:', error);
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
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?!.*\bPhone\b)/i.test(userAgent);

  let device = 'desktop';
  if (isTablet) device = 'tablet';
  else if (isMobile) device = 'mobile';

  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  let os = 'Unknown';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  return { device, browser, os };
};

export async function POST(request) {
  try {
    await connectDB();

    const { sessionId, url, referrer, userAgent, ip } = await request.json();

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
