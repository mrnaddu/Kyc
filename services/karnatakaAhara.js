const fetchKarnatakaRationCard = async (rcNumber) => {
  // Mock implementation for ration card data fetching
  return {
    data: {
      rcNumber: rcNumber,
      members: [
        { id: '1', nameEn: 'John Doe', nameKn: 'ಜೋನ್ ಡೋ', aadhaarLast4: '1234' }
      ]
    }
  };
};

module.exports = {
  fetchKarnatakaRationCard
};