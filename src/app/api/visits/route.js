import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Visit from '../../../../models/Visits';
import rateLimit from '../../../../lib/rateLimit';

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const getLocationFromIP = async (ip) => {
  try {
    if (
      !ip ||
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "unknown" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.")
    ) {
      return {
        country: "Local",
        city: "Local",
        region: "Local",
        latitude: 0,
        longitude: 0,
        countryCode: "Local",
        countryFlagEmoji: "🏠",
        countryFlagImg: null,
      };
    }

    // Try 1: ipapi.co
    try {
      const res = await fetchWithTimeout(`https://ipapi.co/${ip}/json/`, { timeout: 3000 });
      if (res.ok) {
        const data = await res.json();
        if (!data.error && data.city) {
          return {
            country: data.country_name || "Unknown",
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            countryCode: data.country_code || "Unknown",
            countryFlagEmoji: getFlagEmoji(data.country_code),
            countryFlagImg: data.country_code ? `https://flagcdn.com/w20/${data.country_code.toLowerCase()}.png` : null,
          };
        }
      }
    } catch (e) {
      console.warn("IP-API.co error:", e.message);
    }

    // Try 2: ipwho.is
    try {
      const res = await fetchWithTimeout(`https://ipwho.is/${ip}`, { 
        timeout: 3000,
        headers: { 'User-Agent': 'WebsiteAnalytics/1.0' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return {
            country: data.country || "Unknown",
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            countryCode: data.country_code || "Unknown",
            countryFlagEmoji: data.flag?.emoji || getFlagEmoji(data.country_code),
            countryFlagImg: data.flag?.img || `https://flagcdn.com/w20/${data.country_code?.toLowerCase() || 'xx'}.png`,
          };
        }
      }
    } catch (e) {
      console.warn("ipwho.is error:", e.message);
    }

  } catch (error) {
    console.warn("IP Lookup Error:", error.message);
  }

  // Fallback
  return {
    country: "Unknown",
    city: "Unknown",
    region: "Unknown",
    latitude: 0,
    longitude: 0,
    countryCode: "Unknown",
    countryFlagEmoji: "🌍",
    countryFlagImg: null,
  };
};

const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode === 'Unknown') return '🌍';
  if (countryCode === 'Local') return '🏠';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 0x1F1E6 - 65 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();

  let device = 'desktop';

  const tabletPatterns = [
    /ipad/i,
    /android.*tablet/i,
    /kindle/i,
    /playbook/i,
    /silk/i,
    /touchpad/i,
    /xoom/i,
    /transformer/i,
    /nook/i,
    /slate/i,
    /surface.*windows/i
  ];

  const isTablet = tabletPatterns.some(pattern => pattern.test(ua));
  if (isTablet) device = 'tablet';

  if (device === 'desktop') {
    const mobilePatterns = [
      /android.*mobile/i,
      /iphone/i,
      /ipod/i,
      /blackberry/i,
      /windows phone/i,
      /opera mini/i,
      /iemobile/i,
      /mobile/i,
      /webos/i,
      /samsung.*phone/i,
      /huawei.*phone/i,
      /motorola/i,
      /nokia/i,
      /sony.*phone/i,
      /lg.*phone/i,
      /xiaomi/i,
      /redmi/i,
      /poco/i,
      /vivo/i,
      /oppo/i,
      /realme/i,
      /oneplus/i
    ];

    const isMobile = mobilePatterns.some(pattern => pattern.test(ua));
    if (isMobile) device = 'mobile';
  }

  let browser = 'Unknown';
  const browserPatterns = [
    { pattern: /chrome|chromium|crios/i, name: 'Chrome' },
    { pattern: /firefox|fxios|fennec/i, name: 'Firefox' },
    { pattern: /safari/i, name: 'Safari' },
    { pattern: /edg|edge/i, name: 'Edge' },
    { pattern: /opr|opera/i, name: 'Opera' },
    { pattern: /msie|trident/i, name: 'Internet Explorer' },
    { pattern: /brave/i, name: 'Brave' },
    { pattern: /vivaldi/i, name: 'Vivaldi' },
    { pattern: /ucbrowser|uc browser/i, name: 'UC Browser' },
    { pattern: /samsungbrowser/i, name: 'Samsung Internet' }
  ];

  for (const { pattern, name } of browserPatterns) {
    if (pattern.test(ua)) {
      browser = name;
      break;
    }
  }

  let os = 'Unknown';
  const osPatterns = [
    { pattern: /windows nt/i, name: 'Windows' },
    { pattern: /macintosh|mac os x/i, name: 'macOS' },
    { pattern: /linux/i, name: 'Linux' },
    { pattern: /android/i, name: 'Android' },
    { pattern: /iphone|ipad|ipod/i, name: 'iOS' },
    { pattern: /cros/i, name: 'Chrome OS' }
  ];

  for (const { pattern, name } of osPatterns) {
    if (pattern.test(ua)) {
      os = name;
      break;
    }
  }

  return { device, browser, os };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || 'https://as-portfolio-ten.vercel.app' || 'https://www.abdelazizsleem.online' || 'https://abdelaziz-sleem.vercel.app')
    : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const isRateLimited = await limiter.check(ip, 10);

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: corsHeaders
        }
      );
    }

    const origin = request.headers.get('origin');
    if (process.env.NODE_ENV === 'production' &&
      origin &&
      process.env.NEXT_PUBLIC_ALLOWED_ORIGINS &&
      !process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(',').includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        {
          status: 403,
          headers: corsHeaders
        }
      );
    }

    await connectDB();

    const { sessionId, url, referrer, userAgent, duration } = await request.json();

    if (!sessionId || !url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    let ipAddress = ip;
    if (ipAddress === 'unknown') {
      ipAddress = request.headers.get('x-real-ip') ||
        request.headers.get('cf-connecting-ip') ||
        'unknown';
    }

    const location = await getLocationFromIP(ipAddress);

    const { device, browser, os } = parseUserAgent(userAgent);

    let visit = await Visit.findOne({ sessionId });

    const now = new Date();

    if (!visit) {
      visit = new Visit({
        ip: ipAddress,
        userAgent,
        location,
        sessionId,
        pageViews: [{
          url,
          timestamp: now,
          duration: duration || 0
        }],
        referrer: referrer || 'Direct',
        device,
        browser,
        os,
        sessionStart: now,
        lastActivity: now,
        totalDuration: duration || 0,
        isActive: true,
      });
    } else {
      visit.pageViews.push({
        url,
        timestamp: now,
        duration: duration || 0
      });
      visit.lastActivity = now;

      if (duration) {
        visit.totalDuration = (visit.totalDuration || 0) + duration;
      } else {
        const sessionDuration = Math.floor((now - new Date(visit.sessionStart)) / 1000);
        visit.totalDuration = sessionDuration;
      }

      if (ipAddress !== 'unknown' && visit.ip === 'unknown') {
        visit.ip = ipAddress;
      }

      if (visit.location.country === 'Unknown' && location.country !== 'Unknown') {
        visit.location = location;
      }
    }

    await visit.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Visit tracked successfully',
        visitId: visit._id
      },
      {
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('Error tracking visit:', error);

    return NextResponse.json(
      {
        error: 'Failed to track visit',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function GET(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const isRateLimited = await limiter.check(ip, 30);

    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: corsHeaders
        }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 8;
    const country = searchParams.get('country');
    const device = searchParams.get('device');
    const days = parseInt(searchParams.get('days')) || 30;

    const skip = (page - 1) * limit;

    let matchQuery = {};

    if (country && country !== 'all') {
      matchQuery['location.country'] = country;
    }

    if (device && device !== 'all') {
      matchQuery.device = device;
    }

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);
    matchQuery.createdAt = { $gte: dateFilter };

    const [
      totalVisitors,
      visitorsByCountry,
      avgSessionDuration,
      pageViewsOverTime,
      deviceBreakdown,
      browserBreakdown,
      topPages,
      recentVisits,
      totalVisitsCount
    ] = await Promise.all([
      Visit.distinct('sessionId', matchQuery).then(sessions => sessions.length),

      Visit.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$location.country',
            count: { $sum: 1 },
            countryCode: { $first: '$location.countryCode' },
            countryFlagEmoji: { $first: '$location.countryFlagEmoji' },
            countryFlagImg: { $first: '$location.countryFlagImg' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]),

      Visit.aggregate([
        {
          $match: {
            ...matchQuery,
            totalDuration: { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$totalDuration' },
            maxDuration: { $max: '$totalDuration' },
            minDuration: { $min: '$totalDuration' }
          }
        }
      ]),

      Visit.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC"
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),

      Visit.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$device',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),

      Visit.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$browser',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      Visit.aggregate([
        { $match: matchQuery },
        { $unwind: '$pageViews' },
        {
          $group: {
            _id: '$pageViews.url',
            count: { $sum: 1 },
            avgDuration: { $avg: '$pageViews.duration' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      Visit.find(matchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('ip location device browser os sessionStart totalDuration createdAt')
        .lean(),

      Visit.countDocuments(matchQuery)
    ]);

    const enhancedVisitorsByCountry = visitorsByCountry.map(country => ({
      ...country,
      country: country._id || 'Unknown',
      flag: country.countryFlagEmoji || getFlagEmoji(country.countryCode),
      countryFlagImg: country.countryFlagImg || null,
      countryCode: country.countryCode || 'Unknown'
    }));
    const stats = {
      totalPageViews: topPages.reduce((sum, page) => sum + page.count, 0),
      bounceRate: 0,
      newVsReturning: {
        new: Math.floor(totalVisitors * 0.7),
        returning: Math.floor(totalVisitors * 0.3)
      }
    };

    return NextResponse.json({
      totalVisitors,
      totalVisits: totalVisitsCount,
      avgSessionDuration: avgSessionDuration[0]?.avgDuration || 0,
      maxSessionDuration: avgSessionDuration[0]?.maxDuration || 0,
      minSessionDuration: avgSessionDuration[0]?.minDuration || 0,

      visitorsByCountry: enhancedVisitorsByCountry,
      pageViewsOverTime,
      deviceBreakdown,
      browserBreakdown,
      topPages,
      recentVisits,
      stats,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalVisitsCount / limit),
        totalItems: totalVisitsCount,
        hasNext: page < Math.ceil(totalVisitsCount / limit),
        hasPrev: page > 1
      },

      filters: {
        country,
        device,
        days
      },

      lastUpdated: new Date().toISOString(),
      dataRange: `${days} days`
    }, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
