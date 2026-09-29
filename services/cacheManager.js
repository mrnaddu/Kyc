/**
 * Cache Management Service (Disabled - Direct Live API Calls)
 * Always queries ahara.karnataka.gov.in directly without disk or memory caching.
 */

function getCard(rcNumber) {
  return { hit: false, isStale: true };
}

function setCard(rcNumber, liveData) {
  return false;
}

function updateMemberKycStatus(rcNumber, memberId, certPayload) {
  return false;
}

function invalidateCard(rcNumber) {
  return false;
}

module.exports = {
  getCard,
  setCard,
  updateMemberKycStatus,
  invalidateCard
};
