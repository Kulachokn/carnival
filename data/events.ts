// Temporary mock data for events
export const events = [
  {
    id: '1',
    title: 'Der große Kölsche Countdown',
    date: new Date().toISOString(), // today
    location: 'Tanzbrunnen',
    category: 'option1',
    image: require('../assets/countdown.jpg'),
  },
  {
    id: '2',
    title: 'Kostümball',
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    location: 'Stadthalle',
    category: 'option2',
    image: require('../assets/countdown.jpg'),
  },
  {
    id: '3',
    title: 'Kinderkarneval',
    date: new Date(Date.now() + 2 * 86400000).toISOString(), // day after tomorrow
    location: 'Bürgerzentrum',
    category: 'option3',
    image: require('../assets/countdown.jpg'),
  },
  {
    id: '4',
    title: 'Rosenmontagszug',
    date: '2025-02-11T19:30:00',
    location: 'Innenstadt',
    category: 'option1',
    image: require('../assets/countdown.jpg'),
  },
  {
    id: '5',
    title: 'Aftershow Party',
    date: '2025-01-20T19:30:00',
    location: 'Tanzbrunnen',
    category: 'option2',
    image: require('../assets/countdown.jpg'),
  },
  {
    id: '6',
    title: 'Große Sitzung',
    date: '2025-09-14T13:00:00',
    location: 'Theater am Tanzbrunnen Rheinpark 1, 50733 Köln',
    category: 'option3',
    image: require('../assets/countdown.jpg'),
  },
];