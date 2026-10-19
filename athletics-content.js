// Edit this file to add results, historical PBs, or a new banner. See README.md.
// Dates: YYYY-MM-DD. Times: seconds, mm:ss.ss, or hh:mm:ss.ss; DQ/DNF/NT also work.
// distanceMeters + gait group equivalent events across surfaces (5000m = 5km).
// points are manual; null means unknown/not awarded. Never use 0 as a placeholder.
window.ATHLETICS_CONTENT = {
  profile: {
    intro: 'Tyler Wilson · Canadian race walker. A record of races, progress, and time on the track.',
    banner: 'content/photos/athletics-track.svg',
    bannerAlt: '',
    worldAthletics: 'https://worldathletics.org/athletes/canada/tyler-wilson-14899643',
    archiveIntro: 'Track, road, and cross country results, one start at a time. The archive currently includes my five World Athletics-listed races from 2026.'
  },
  // Historical PBs let you show career bests before entering your full race history.
  // New eligible race results automatically improve these bests when faster.
  // Verified on the World Athletics profile, 19 October 2026.
  personalBests: [
    { date: '2026-07-14', event: '3000m race walk', distanceMeters: 3000, gait: 'walk', surface: 'track', performance: '12:45.32', location: 'Swangard Stadium, Burnaby, CAN', notes: ['PB'] },
    { date: '2025-05-22', event: '5000m race walk', distanceMeters: 5000, gait: 'walk', surface: 'track', performance: '20:49.23', location: 'Wildcat Track, Marion, IN, USA', notes: ['PB'] },
    { date: '2025-07-04', event: '10,000m race walk', distanceMeters: 10000, gait: 'walk', surface: 'track', performance: '43:44.96', location: 'Percy Perry Stadium, Coquitlam, CAN', notes: ['PB'] },
    { date: '2025-08-02', event: '20,000m race walk', distanceMeters: 20000, gait: 'walk', surface: 'track', performance: '1:30:56.74', location: 'Terry Fox AF, Ottawa, CAN', notes: ['PB'] },
    { date: '2026-01-11', event: 'Half marathon race walk', distanceMeters: 21097.5, gait: 'walk', surface: 'road', performance: '1:31:57', location: 'Trolley Square, Santee, CA, USA', notes: ['PB', 'NR'] }
  ],
  races: [
    {
      date: '2026-07-14',
      event: '3000m race walk', distanceMeters: 3000, gait: 'walk', surface: 'track',
      performance: '12:45.32', performanceNote: '',
      competition: 'The Jerome Classic', location: 'Swangard Stadium, Burnaby, CAN',
      points: 929, place: 2,
      resultsUrl: 'https://worldathletics.org/competition/calendar-results/results/7229527?eventId=10229776',
      notes: ['PB']
    },
    {
      date: '2026-07-03',
      event: '10,000m race walk', distanceMeters: 10000, gait: 'walk', surface: 'track',
      performance: '46:43.16', performanceNote: '',
      competition: 'BC Athletics Outdoor Track & Field Championships', location: 'Percy Perry Stadium, Coquitlam, CAN',
      points: 857, place: 2,
      resultsUrl: 'https://worldathletics.org/competition/calendar-results/results/7241242?eventId=10229637',
      notes: []
    },
    {
      date: '2026-04-12',
      event: 'Half marathon race walk', distanceMeters: 21097.5, gait: 'walk', surface: 'road',
      performance: 'NT', performanceNote: '',
      competition: 'Caixa World Athletics Race Walking Team Championships Brasilia 26', location: 'Brasilia, BRA',
      // The profile lists place 72 but no score for this NT result.
      points: null, place: 72,
      resultsUrl: 'https://worldathletics.org/competition/calendar-results/results/7226164?eventId=10230472',
      notes: []
    },
    {
      date: '2026-03-28',
      event: '5000m race walk', distanceMeters: 5000, gait: 'walk', surface: 'track',
      performance: 'DNF', performanceNote: '',
      competition: 'UBC Open', location: 'Rashpal Dhillon Oval, Vancouver, CAN',
      points: null, place: null,
      resultsUrl: 'https://worldathletics.org/competition/calendar-results/results/7238417?eventId=10229644',
      notes: []
    },
    {
      date: '2026-01-11',
      event: 'Half marathon race walk', distanceMeters: 21097.5, gait: 'walk', surface: 'road',
      performance: '1:31:57', performanceNote: '',
      competition: 'USATF International Invitational Race Walk & National Race Walk Marathon Championships', location: 'Trolley Square, Santee, CA, USA',
      points: 1059, place: 4,
      resultsUrl: 'https://worldathletics.org/competition/calendar-results/results/7233058?eventId=10230472',
      notes: ['PB', 'NR']
    }
  ]
};
