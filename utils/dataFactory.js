const { faker } = require('@faker-js/faker');

const stateCityMap = {
  'NCR': ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  'Haryana': ['Karnal', 'Panipat'],
  'Rajasthan': ['Jaipur', 'Jaiselmer']
};

const subjects = [
  'Maths', 'English', 'Physics', 'Chemistry', 'Computer Science', 
  'Commerce', 'Accounting', 'Economics', 'Arts', 'Social Studies', 
  'History', 'Civics'
];

const generateDataset = () => {
  const state = faker.helpers.arrayElement(Object.keys(stateCityMap));
  const city = faker.helpers.arrayElement(stateCityMap[state]);
  
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    mobile: faker.string.numeric(10),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    subject: faker.helpers.arrayElement(subjects),
    hobby: faker.helpers.arrayElement(['Sports', 'Reading', 'Music']),
    address: faker.location.streetAddress().replace(/\n/g, ' '),
    state: state,
    city: city
  };
};

module.exports = { generateDataset };

