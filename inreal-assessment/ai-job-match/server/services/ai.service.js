const { Configuration, OpenAIApi } = require('openai');
const config = require('../config/default');
const Job = require('../models/Job');

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

/**
 * Get recommended jobs for a user based on their profile
 * @param {Object} profile - User profile data
 * @param {Array} jobs - Available jobs
 * @returns {Array} - Array of recommended jobs with scores
 */
exports.getJobRecommendations = async (profile, jobs) => {
  try {
    // Format user profile for AI prompt
    const userProfileText = `
      User Profile:
      - Years of Experience: ${profile.yearsOfExperience}
      - Location: ${profile.location}
      - Skills: ${profile.skills.join(', ')}
      - Preferred Job Type: ${profile.preferredJobType}
      ${profile.title ? `- Current Title: ${profile.title}` : ''}
      ${profile.bio ? `- Bio: ${profile.bio}` : ''}
    `;

    // Format jobs for AI prompt
    const jobsText = jobs.map((job, index) => `
      Job ${index + 1}:
      - ID: ${job._id}
      - Title: ${job.title}
      - Company: ${job.company}
      - Location: ${job.location}
      - Job Type: ${job.jobType}
      - Required Skills: ${job.skills.join(', ')}
      - Experience Required: ${job.experience || 'Not specified'}
      - Description: ${job.description.substring(0, 200)}...
    `).join('\n');

    // Create the AI prompt
    const prompt = `
      You are an AI-powered job matcher. Based on the user profile and available jobs below, 
      identify the top 3 most suitable jobs for the user.
      
      ${userProfileText}
      
      Available Jobs:
      ${jobsText}
      
      For each recommended job, provide:
      1. Job ID
      2. Match score (0-100)
      3. Brief explanation of why this job is a good match for the user
      
      Return the recommendations in the following JSON format:
      {
        "recommendations": [
          {
            "jobId": "job_id_here",
            "matchScore": score_number_here,
            "explanation": "explanation_text_here"
          },
          ...
        ]
      }
      
      Provide only the JSON response without any additional text.
    `;

    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a job matching assistant that analyzes user profiles and job listings to find the best matches. Respond only with the requested JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    // Parse AI response
    const aiResponse = response.data.choices[0].message.content.trim();
    
    // Extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const jsonResponse = jsonMatch ? JSON.parse(jsonMatch[0]) : { recommendations: [] };
    
    // Get recommended job details
    const recommendedJobs = [];
    
    for (const rec of jsonResponse.recommendations) {
      const job = jobs.find(j => j._id.toString() === rec.jobId);
      if (job) {
        recommendedJobs.push({
          job,
          matchScore: rec.matchScore,
          explanation: rec.explanation
        });
      }
    }
    
    return recommendedJobs;
  } catch (error) {
    console.error('Error getting job recommendations:', error);
    throw error;
  }
};