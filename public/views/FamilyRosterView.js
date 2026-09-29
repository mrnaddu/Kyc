class FamilyRosterView {
  constructor() {
    this.apiService = require('../utils/api');
  }

  getFamilyMembers(cardData) {
    return cardData.members || [];
  }
}

module.exports = FamilyRosterView;