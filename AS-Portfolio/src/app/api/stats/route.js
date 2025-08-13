import connectDB from "../../../../lib/mongodb";
import Skill from "../../../../models/Skills";
import Subscription from "../../../../models/Subscription";
import Project from "../../../../models/Project";
import Certificate from "../../../../models/Certificate";
import Feedback from "../../../../models/Feedback";
import Post from "../../../../models/Post";
import Contact from "../../../../models/Contact";

export async function GET() {
  try {
    await connectDB();

    // Get counts for all collections
    const [
      skillsCount,
      subscriptionsCount,
      projectsCount,
      certificatesCount,
      feedbacksCount,
      postCount,
      contactCount,
    ] = await Promise.all([
      Skill.countDocuments(),
      Subscription.countDocuments(),
      Project.countDocuments(),
      Certificate.countDocuments(),
      Feedback.countDocuments(),
      Post.countDocuments(),
      Contact.countDocuments(),
    ]);

    // Helper function to group data by 5-day intervals
    const getGrowthData = async (Model) => {
      return Model.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $subtract: [
                    "$createdAt",
                    {
                      $mod: [
                        { $toLong: "$createdAt" },
                        5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
                      ],
                    },
                  ],
                },
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    };

    const [
      skillsDistribution,
      subscriptionGrowth,
      feedbackGrowth,
      projectGrowth,
      certificatesGrowth,
      postGrowth,
      contactGrowth,
    ] = await Promise.all([
      getGrowthData(Skill),
      getGrowthData(Subscription),
      getGrowthData(Feedback),
      getGrowthData(Project),
      getGrowthData(Certificate),
      getGrowthData(Post),
      getGrowthData(Contact),
    ]);

    return new Response(
      JSON.stringify({
        counts: {
          skills: skillsCount,
          subscriptions: subscriptionsCount,
          projects: projectsCount,
          certificates: certificatesCount,
          feedbacks: feedbacksCount,
          posts: postCount,
          contacts: contactCount,
        },
        growthData: {
          skillsDistribution,
          subscriptionGrowth,
          feedbackGrowth,
          projectGrowth,
          certificatesGrowth,
          postGrowth,
          contactGrowth,
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stats API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}