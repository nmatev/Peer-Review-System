export const config = {
  jwtSecret: 'VerySecr3t!',
  expiresIn: 3600 * 24 * 7,  // one week,
  workItemVoteCounter: 2, // number of reviewers to vote and change the work-item status to "Accepted"
};
