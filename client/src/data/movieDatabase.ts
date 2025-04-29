import { Movie } from '../types/Movie';

// Extensive database of movies from 2000-2025
export const movieDatabase: Movie[] = [
  // 2023-2025 Movies
  {
    id: '1001',
    title: 'Dune: Part Two',
    image: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    year: '2024',
    rating: 8.5,
    genre: ['Sci-Fi', 'Adventure'],
    description: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.'
  },
  {
    id: '1002',
    title: 'Oppenheimer',
    image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    year: '2023',
    rating: 8.4,
    genre: ['Drama', 'History', 'Thriller'],
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
  },
  {
    id: '1003',
    title: 'Barbie',
    image: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi8Kzi7SjO0FM.jpg',
    year: '2023',
    rating: 7.2,
    genre: ['Comedy', 'Adventure', 'Fantasy'],
    description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.'
  },
  {
    id: '1004',
    title: 'Killers of the Flower Moon',
    image: 'https://image.tmdb.org/t/p/w500/8sMmAmN2x9VGoJ3PGXKSDzZ0VPQ.jpg',
    year: '2023',
    rating: 7.8,
    genre: ['Crime', 'Drama', 'History'],
    description: 'When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one—until the FBI steps in to unravel the mystery.'
  },
  {
    id: '1005',
    title: 'Poor Things',
    image: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    year: '2023',
    rating: 8.0,
    genre: ['Science Fiction', 'Romance', 'Comedy'],
    description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.'
  },
  {
    id: '1006',
    title: 'Furiosa: A Mad Max Saga',
    image: 'https://image.tmdb.org/t/p/w500/8tBh0diczsKxQqzrs3IpIEW09Z7.jpg',
    year: '2024',
    rating: 7.1,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    description: 'As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.'
  },
  {
    id: '1007',
    title: 'The Batman',
    image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    year: '2022',
    rating: 7.7,
    genre: ['Crime', 'Mystery', 'Action'],
    description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.'
  },
  {
    id: '1008',
    title: 'Spider-Man: Across the Spider-Verse',
    image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    year: '2023',
    rating: 8.4,
    genre: ['Animation', 'Action', 'Adventure'],
    description: 'After reuniting with Gwen Stacy, Brooklyn\'s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.'
  },
  {
    id: '1009',
    title: 'Inside Out 2',
    image: 'https://image.tmdb.org/t/p/w500/yRt7MGBElkLQOYSvLTcTUku0Bub.jpg',
    year: '2024',
    rating: 8.0,
    genre: ['Animation', 'Comedy', 'Adventure'],
    description: 'Follow Riley in her teenage years as new emotions join the mix, causing chaos in the control center of her mind.'
  },
  {
    id: '1010',
    title: 'Deadpool & Wolverine',
    image: 'https://image.tmdb.org/t/p/w500/kqFqzBPuWDcK8u7EZj6iBC5lTlO.jpg',
    year: '2024',
    rating: 7.8,
    genre: ['Action', 'Comedy', 'Science Fiction'],
    description: 'Wolverine is recovering from his injuries when he is approached by the loudmouth mercenary Deadpool to join forces.'
  },

  // 2015-2022 Movies
  {
    id: '1011',
    title: 'Dune',
    image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    year: '2021',
    rating: 7.9,
    genre: ['Science Fiction', 'Adventure'],
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.'
  },
  {
    id: '1012',
    title: 'Parasite',
    image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    year: '2019',
    rating: 8.5,
    genre: ['Thriller', 'Drama', 'Comedy'],
    description: 'All unemployed, Ki-taek and his family take peculiar interest in the wealthy and glamorous Parks, as they ingratiate themselves into their lives and get entangled in an unexpected incident.'
  },
  {
    id: '1013',
    title: 'Avengers: Endgame',
    image: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    year: '2019',
    rating: 8.4,
    genre: ['Adventure', 'Science Fiction', 'Action'],
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.'
  },
  {
    id: '1014',
    title: 'Joker',
    image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    year: '2019',
    rating: 8.2,
    genre: ['Crime', 'Thriller', 'Drama'],
    description: 'During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.'
  },
  {
    id: '1015',
    title: 'The Revenant',
    image: 'https://image.tmdb.org/t/p/w500/ji3ecJphATlVgWNY0B0RVXZizdf.jpg',
    year: '2015',
    rating: 7.8,
    genre: ['Western', 'Drama', 'Adventure'],
    description: 'In the 1820s, a frontiersman, Hugh Glass, sets out on a path of vengeance against those who left him for dead after a bear mauling.'
  },
  {
    id: '1016',
    title: 'Everything Everywhere All at Once',
    image: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    year: '2022',
    rating: 8.0,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.'
  },
  {
    id: '1017',
    title: 'The Grand Budapest Hotel',
    image: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrOo.jpg',
    year: '2014',
    rating: 8.1,
    genre: ['Comedy', 'Drama'],
    description: 'The adventures of Gustave H, a legendary concierge at a famous hotel from the fictional Republic of Zubrowka between the first and second World Wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.'
  },
  {
    id: '1018',
    title: 'Interstellar',
    image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    year: '2014',
    rating: 8.4,
    genre: ['Adventure', 'Drama', 'Science Fiction'],
    description: 'Interstellar chronicles the adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.'
  },
  {
    id: '1019',
    title: 'Get Out',
    image: 'https://image.tmdb.org/t/p/w500/qbaIHiSgRuqDsWLG5PxNEHmDw5w.jpg',
    year: '2017',
    rating: 7.7,
    genre: ['Horror', 'Thriller', 'Mystery'],
    description: 'Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family\'s overly accommodating behavior as nervous attempts to deal with their daughter\'s interracial relationship, but as the weekend progresses, a series of increasingly disturbing discoveries lead him to a truth that he never could have imagined.'
  },
  {
    id: '1020',
    title: 'Inception',
    image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    year: '2010',
    rating: 8.4,
    genre: ['Action', 'Science Fiction', 'Adventure'],
    description: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.'
  },

  // 2000-2014 Movies
  {
    id: '1021',
    title: 'Avatar',
    image: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
    year: '2009',
    rating: 7.5,
    genre: ['Action', 'Adventure', 'Fantasy'],
    description: 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.'
  },
  {
    id: '1022',
    title: 'The Dark Knight',
    image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    year: '2008',
    rating: 8.5,
    genre: ['Action', 'Crime', 'Drama'],
    description: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.'
  },
  {
    id: '1023',
    title: 'The Lord of the Rings: The Return of the King',
    image: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    year: '2003',
    rating: 8.5,
    genre: ['Adventure', 'Fantasy', 'Action'],
    description: 'Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron\'s forces. Meanwhile, Frodo and Sam take the ring closer to the heart of Mordor, the dark lord\'s realm.'
  },
  {
    id: '1024',
    title: 'Spirited Away',
    image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    year: '2001',
    rating: 8.5,
    genre: ['Animation', 'Family', 'Fantasy'],
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.'
  },
  {
    id: '1025',
    title: 'No Country for Old Men',
    image: 'https://image.tmdb.org/t/p/w500/6d5XOczc226jECq0LIX0siKtgaxZ.jpg',
    year: '2007',
    rating: 8.0,
    genre: ['Crime', 'Drama', 'Thriller'],
    description: 'Llewelyn Moss stumbles upon dead bodies, $2 million and a hoard of heroin in a Texas desert, but methodical killer Anton Chigurh comes looking for it, with local sheriff Ed Tom Bell hot on his trail. The roles of prey and predator blur as the violent pursuit of money and justice collide.'
  },
  {
    id: '1026',
    title: 'The Social Network',
    image: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
    year: '2010',
    rating: 7.7,
    genre: ['Drama'],
    description: 'On a fall night in 2003, Harvard undergrad and computer programming genius Mark Zuckerberg sits down at his computer and heatedly begins working on a new idea. In a fury of blogging and programming, what begins in his dorm room as a small site among friends soon becomes a global social network and a revolution in communication.'
  },
  {
    id: '1027',
    title: 'The Matrix',
    image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    year: '1999',
    rating: 8.1,
    genre: ['Action', 'Science Fiction'],
    description: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.'
  },
  {
    id: '1028',
    title: 'Gladiator',
    image: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    year: '2000',
    rating: 8.2,
    genre: ['Action', 'Drama', 'Adventure'],
    description: 'In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus is one of the Roman army\'s most capable and trusted generals and a key advisor to the emperor. As Marcus\' devious son Commodus ascends to the throne, Maximus is set to be executed. He escapes, but is captured by slave traders and put into the games as a gladiator.'
  },
  {
    id: '1029',
    title: 'Memento',
    image: 'https://image.tmdb.org/t/p/w500/yuNs09hvpHVU1cBTCAk9zxsL2oW.jpg',
    year: '2000',
    rating: 8.2,
    genre: ['Mystery', 'Thriller'],
    description: 'Leonard Shelby is tracking down the man who raped and murdered his wife. The difficulty of locating his wife\'s killer, however, is compounded by the fact that he suffers from a rare, untreatable form of short-term memory loss.'
  },
  {
    id: '1030',
    title: 'Eternal Sunshine of the Spotless Mind',
    image: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
    year: '2004',
    rating: 8.1,
    genre: ['Science Fiction', 'Drama', 'Romance'],
    description: 'Joel Barish, heartbroken that his girlfriend underwent a procedure to erase him from her memory, decides to do the same. However, as he watches his memories of her fade away, he realizes that he still loves her, and may be too late to correct his mistake.'
  },
  
  // Adding more 2020-2025 movies
  {
    id: '1031',
    title: 'Godzilla x Kong: The New Empire',
    image: 'https://image.tmdb.org/t/p/w500/bQ2ywkddCBMnQTpAMg5sILWN4Vj.jpg',
    year: '2024',
    rating: 7.0,
    genre: ['Action', 'Science Fiction', 'Adventure'],
    description: 'Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.'
  },
  {
    id: '1032',
    title: 'Challengers',
    image: 'https://image.tmdb.org/t/p/w500/wD5uuxU50rScsFWsxcwGGLK19yZ.jpg',
    year: '2024',
    rating: 7.2,
    genre: ['Drama', 'Romance'],
    description: 'A tennis drama film directed by Luca Guadagnino, starring Zendaya, Josh O\'Connor, and Mike Faist.'
  },
  {
    id: '1033',
    title: 'Kingdom of the Planet of the Apes',
    image: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg',
    year: '2024',
    rating: 7.0,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    description: 'Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he\'s been taught about the past.'
  },
  {
    id: '1034',
    title: 'The Garfield Movie',
    image: 'https://image.tmdb.org/t/p/w500/oYHGlkzYYkvXMW01K5nZkNOtcrQ.jpg',
    year: '2024',
    rating: 6.4,
    genre: ['Animation', 'Comedy', 'Family'],
    description: 'Garfield, the world-famous, Monday-hating, lasagna-loving indoor cat, is about to have a wild outdoor adventure.'
  },
  {
    id: '1035',
    title: 'No One Will Save You',
    image: 'https://image.tmdb.org/t/p/w500/ehGIDAMaYy6Eg0o8ga0oqtBVXJQ.jpg',
    year: '2023',
    rating: 7.0,
    genre: ['Horror', 'Thriller', 'Science Fiction'],
    description: 'An exiled anxiety-ridden homebody must battle an alien who\'s taken up residence in her house.'
  },
  {
    id: '1036',
    title: 'A Quiet Place Part II',
    image: 'https://image.tmdb.org/t/p/w500/4q2hz2m8hubgvijz8Ez0T2Os2Yv.jpg',
    year: '2021',
    rating: 7.3,
    genre: ['Science Fiction', 'Horror', 'Thriller'],
    description: 'Following the events at home, the Abbott family now face the terrors of the outside world. Forced to venture into the unknown, they realize the creatures that hunt by sound are not the only threats lurking beyond the sand path.'
  },
  {
    id: '1037',
    title: 'Top Gun: Maverick',
    image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    year: '2022',
    rating: 8.3,
    genre: ['Action', 'Drama'],
    description: 'After more than thirty years of service as one of the Navy\'s top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.'
  },
  {
    id: '1038',
    title: 'Avatar: The Way of Water',
    image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    year: '2022',
    rating: 7.6,
    genre: ['Science Fiction', 'Adventure', 'Action'],
    description: 'Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, and the battles they fight to stay alive.'
  },
  {
    id: '1039',
    title: 'The Banshees of Inisherin',
    image: 'https://image.tmdb.org/t/p/w500/4yFG6cSPaCaPhyJ1vtGOtMD1yln.jpg',
    year: '2022',
    rating: 7.5,
    genre: ['Drama', 'Comedy'],
    description: 'Two lifelong friends find themselves at an impasse when one abruptly ends their relationship, with alarming consequences for both of them.'
  },
  {
    id: '1040',
    title: 'Tár',
    image: 'https://image.tmdb.org/t/p/w500/gFTe8RG1lJYg0U5h9wh7P5gkTCE.jpg',
    year: '2022',
    rating: 7.2,
    genre: ['Drama', 'Music'],
    description: 'Set in the international world of Western classical music, the film centers on Lydia Tár, widely considered one of the greatest living composer-conductors and first-ever female music director of a major German orchestra.'
  },

  // Adding more 2015-2019 movies
  {
    id: '1041',
    title: 'Blade Runner 2049',
    image: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    year: '2017',
    rating: 7.5,
    genre: ['Science Fiction', 'Drama'],
    description: 'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what\'s left of society into chaos.'
  },
  {
    id: '1042',
    title: 'Mad Max: Fury Road',
    image: 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroW8zQn.jpg',
    year: '2015',
    rating: 8.0,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    description: 'An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life.'
  },
  {
    id: '1043',
    title: 'The Favourite',
    image: 'https://image.tmdb.org/t/p/w500/cwBq0onfmeilU5xgqNNjJAMPfpw.jpg',
    year: '2018',
    rating: 7.5,
    genre: ['Drama', 'History', 'Comedy'],
    description: 'In early 18th century England, a frail Queen Anne occupies the throne and her close friend, Lady Sarah, governs the country in her stead. When a new servant, Abigail, arrives, her charm endears her to Sarah.'
  },
  {
    id: '1044',
    title: 'The Shape of Water',
    image: 'https://image.tmdb.org/t/p/w500/k4FwHlMhuRR5BISY2Gm2QZHlH5Q.jpg',
    year: '2017',
    rating: 7.3,
    genre: ['Drama', 'Fantasy', 'Romance'],
    description: 'At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity.'
  },
  {
    id: '1045',
    title: 'The Irishman',
    image: 'https://image.tmdb.org/t/p/w500/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg',
    year: '2019',
    rating: 7.7,
    genre: ['Crime', 'Drama'],
    description: 'World War II veteran and mob hitman Frank "The Irishman" Sheeran reflects on his life crime, including the hits he performed for mafioso Russell Bufalino and his long friendship with union leader Jimmy Hoffa.'
  },
  {
    id: '1046',
    title: 'La La Land',
    image: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    year: '2016',
    rating: 7.9,
    genre: ['Romance', 'Drama', 'Music'],
    description: 'Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail party gigs in dingy bars, but as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair.'
  },
  {
    id: '1047',
    title: 'Arrival',
    image: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
    year: '2016',
    rating: 7.9,
    genre: ['Science Fiction', 'Drama', 'Mystery'],
    description: 'Taking place after alien crafts land around the world, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.'
  },
  {
    id: '1048',
    title: 'Moonlight',
    image: 'https://image.tmdb.org/t/p/w500/qAwFbszz0kc7eJZHrp9sDPV5TjB.jpg',
    year: '2016',
    rating: 7.4,
    genre: ['Drama'],
    description: 'The tender, heartbreaking story of a young man\'s struggle to find himself, told across three defining chapters in his life as he experiences the ecstasy, pain, and beauty of falling in love, while grappling with his own sexuality.'
  },
  {
    id: '1049',
    title: 'Roma',
    image: 'https://image.tmdb.org/t/p/w500/hZX6ILyQhCOYhzZtmMjXYJXYpfB.jpg',
    year: '2018',
    rating: 7.7,
    genre: ['Drama'],
    description: 'In 1970s Mexico City, two domestic workers help a mother of four while her husband is away for an extended period of time.'
  },
  {
    id: '1050',
    title: 'Coco',
    image: 'https://image.tmdb.org/t/p/w500/eKi8dIrr8voobbaGzDpe8w0PVbC.jpg',
    year: '2017',
    rating: 8.2,
    genre: ['Animation', 'Family', 'Fantasy'],
    description: 'Despite his family\'s baffling generations-old ban on music, Miguel dreams of becoming an accomplished musician like his idol, Ernesto de la Cruz. Desperate to prove his talent, Miguel finds himself in the stunning and colorful Land of the Dead following a mysterious chain of events.'
  },

  // Adding more 2010-2014 movies
  {
    id: '1051',
    title: 'The Wolf of Wall Street',
    image: 'https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg',
    year: '2013',
    rating: 8.0,
    genre: ['Crime', 'Drama', 'Comedy'],
    description: 'A New York stockbroker refuses to cooperate in a large securities fraud case involving corruption on Wall Street, corporate banking world and mob infiltration.'
  },
  {
    id: '1052',
    title: 'Her',
    image: 'https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg',
    year: '2013',
    rating: 7.9,
    genre: ['Romance', 'Science Fiction', 'Drama'],
    description: 'In the not so distant future, Theodore, a lonely writer, purchases a newly developed operating system designed to meet the user\'s every need. To Theodore\'s surprise, a romantic relationship develops between him and his operating system.'
  },
  {
    id: '1053',
    title: 'Gravity',
    image: 'https://image.tmdb.org/t/p/w500/wmUeEacLwI1Dzf6y2yshzYIKYYE.jpg',
    year: '2013',
    rating: 7.2,
    genre: ['Science Fiction', 'Thriller', 'Drama'],
    description: 'Dr. Ryan Stone, a brilliant medical engineer on her first Shuttle mission, with veteran astronaut Matt Kowalsky in command of his last flight before retiring. But on a seemingly routine spacewalk, disaster strikes.'
  },
  {
    id: '1054',
    title: 'The Avengers',
    image: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    year: '2012',
    rating: 7.7,
    genre: ['Action', 'Adventure', 'Science Fiction'],
    description: 'When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster.'
  },
  {
    id: '1055',
    title: 'Toy Story 3',
    image: 'https://image.tmdb.org/t/p/w500/mMltbSxwEdNE4Cv8QYLpzkHWTDo.jpg',
    year: '2010',
    rating: 8.0,
    genre: ['Animation', 'Family', 'Comedy'],
    description: 'Woody, Buzz, and the rest of Andy\'s toys haven\'t been played with in years. With Andy about to go to college, the gang find themselves accidentally left at a nefarious day care center. The toys must band together to escape and return home to Andy.'
  },

  // Adding more 2000-2009 movies
  {
    id: '1056',
    title: 'There Will Be Blood',
    image: 'https://image.tmdb.org/t/p/w500/fa0RDkAlCec0STeMNAhPaF89q6U.jpg',
    year: '2007',
    rating: 8.1,
    genre: ['Drama'],
    description: 'Ruthless silver miner, turned oil prospector, Daniel Plainview, moves to oil-rich California. Using his son to project a trustworthy, family-man image, Plainview cons local landowners into selling him their valuable properties for a pittance.'
  },
  {
    id: '1057',
    title: 'The Departed',
    image: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yEbqon11KlXCGAzY.jpg',
    year: '2006',
    rating: 8.2,
    genre: ['Drama', 'Thriller', 'Crime'],
    description: 'To take down South Boston\'s Irish Mafia, the police send in one of their own to infiltrate the underworld, not realizing the syndicate has done likewise.'
  },
  {
    id: '1058',
    title: 'The Prestige',
    image: 'https://image.tmdb.org/t/p/w500/bdN3gXuYP5OX5random.jpg',
    year: '2006',
    rating: 8.1,
    genre: ['Drama', 'Mystery', 'Thriller'],
    description: 'A mysterious story of two magicians whose intense rivalry leads them on a life-long battle for supremacy -- full of obsession, deceit and jealousy with dangerous and deadly consequences.'
  },
  {
    id: '1059',
    title: 'City of God',
    image: 'https://image.tmdb.org/t/p/w500/k7eYdWvhYt6nUH0KLvZGq83kNS.jpg',
    year: '2002',
    rating: 8.4,
    genre: ['Crime', 'Drama'],
    description: 'City of God depicts the raw violence in the ghettos of Rio de Janeiro.'
  },
  {
    id: '1060',
    title: 'WALL·E',
    image: 'https://image.tmdb.org/t/p/w500/85qfkm399zHHXbyvvMOhGB4t4Ee.jpg',
    year: '2008',
    rating: 8.0,
    genre: ['Animation', 'Family', 'Science Fiction'],
    description: 'WALL·E is the last robot left on an Earth that has been overrun with garbage and all humans have fled to outer space. For 700 years he has continued to try and clean up the mess, but has developed some rather interesting human-like qualities. When a ship arrives with a sleek new type of robot, WALL·E thinks he\'s finally found a friend and stows away on the ship when it leaves.'
  }
  
  // ... more movies can be added here
];

// Helper functions for getting filtered movies
export const getMoviesByYear = (startYear: number, endYear: number): Movie[] => {
  return movieDatabase.filter(movie => {
    const movieYear = parseInt(movie.year);
    return movieYear >= startYear && movieYear <= endYear;
  });
};

export const getMoviesByGenre = (genre: string): Movie[] => {
  return movieDatabase.filter(movie => 
    movie.genre && movie.genre.includes(genre)
  );
};

export const getTopRatedMovies = (limit: number = 10): Movie[] => {
  return [...movieDatabase]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getRecentMovies = (limit: number = 10): Movie[] => {
  return [...movieDatabase]
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, limit);
}; 