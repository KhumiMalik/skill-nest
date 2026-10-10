import type { Album } from "@/features/gallery";
import type { Photo } from "@/lib/api/schemas";
import { placeholderImage } from "../utils";

/** A gallery photo: 1400x1000 so the lightbox has a large image; tiles get smaller versions from next/image. */
function photo(label: string, alt: string, caption?: string): Photo {
  return { image: placeholderImage(1400, 1000, label, alt), caption };
}

type AlbumData = Omit<Album, "photoCount" | "cover">;

/** Albums, newest first. `cover` and `photoCount` are derived from the photos, as the backend would. */
const albumData: AlbumData[] = [
  {
    slug: "harvest-festival-2026",
    title: "Harvest Festival 2026",
    description: "The Junior School's harvest assembly and the food collection for the Greenfield Food Bank.",
    date: "2026-10-02",
    photos: [
      photo(
        "Harvest 1",
        "Reception children carrying baskets of vegetables to the stage",
        "Reception lead the procession",
      ),
      photo("Harvest 2", "Year 2 pupils singing at the harvest assembly"),
      photo("Harvest 3", "Boxes of donated food stacked in the hall", "Over 900 items were donated this year"),
      photo("Harvest 4", "Volunteers from the food bank loading a van"),
      photo("Harvest 5", "Year 4 pupils reading their harvest poems"),
      photo("Harvest 6", "Parents and children at the harvest assembly"),
    ],
  },
  {
    slug: "welcome-back-picnic-2026",
    title: "Welcome Back Family Picnic",
    description: "Families old and new met on the school field to start the year with games, music and food.",
    date: "2026-09-06",
    photos: [
      photo("Picnic 1", "Families sitting on picnic blankets on the school field"),
      photo("Picnic 2", "Children taking part in a sack race", "Sack races for every age"),
      photo("Picnic 3", "The jazz band playing under a gazebo"),
      photo("Picnic 4", "A teacher running the tug of war"),
      photo("Picnic 5", "Parents' Association volunteers serving ice cream"),
      photo("Picnic 6", "A family photo in front of the main house"),
      photo("Picnic 7", "Children with face paint"),
      photo("Picnic 8", "The Head welcoming new families"),
    ],
  },
  {
    slug: "campus-and-grounds",
    title: "Campus & Grounds",
    description: "Our forty-acre campus through the seasons, from the 1920s Main House to the new Science Centre.",
    date: "2026-09-01",
    photos: [
      photo("Main House", "The Main House in autumn sunshine", "Main House, built in 1924"),
      photo("Science Centre", "The glass front of the Science & Innovation Centre", "The Science & Innovation Centre"),
      photo("Library", "The library reading room with tall windows", "The library reading room"),
      photo("Playing fields", "The playing fields with the pavilion in the distance", "The playing fields"),
      photo("Theatre", "The theatre auditorium with red seats", "The 400-seat theatre"),
      photo("Walled garden", "The walled garden in bloom", "The walled garden, looked after by the eco-club"),
      photo("Forest school", "A clearing in the woods used for forest school", "Forest school"),
      photo("Pool", "The swimming pool viewed from the gallery", "The 25-metre pool"),
    ],
  },
  {
    slug: "summer-arts-exhibition-2026",
    title: "Summer Arts Exhibition 2026",
    description: "Highlights from the annual exhibition, including GCSE and A Level portfolios.",
    date: "2026-06-25",
    photos: [
      photo("Exhibition 1", "Large abstract paintings hanging in the studio", "A Level paintings"),
      photo("Exhibition 2", "Ceramic vases on display plinths", "Year 10 ceramics"),
      photo("Exhibition 3", "Visitors looking at a photography wall"),
      photo("Exhibition 4", "A sculpture made from recycled materials", "Year 8 sculpture project"),
      photo("Exhibition 5", "Junior School self-portraits pinned to a board"),
      photo("Exhibition 6", "A student explaining her work to visitors"),
    ],
  },
  {
    slug: "sports-day-2026",
    title: "Sports Day 2026",
    description: "Track and field for every year group, finishing with the inter-house relay finals.",
    date: "2026-06-19",
    photos: [
      photo("Sports Day 1", "Pupils sprinting on the athletics track", "Year 9 100 metres final"),
      photo("Sports Day 2", "A pupil clearing the high jump bar"),
      photo("Sports Day 3", "Junior pupils in the egg and spoon race"),
      photo("Sports Day 4", "House supporters cheering in the stands"),
      photo("Sports Day 5", "The relay baton changeover", "Inter-house relay finals"),
      photo("Sports Day 6", "Winners holding the house trophy", "Fry House won the trophy for the third year running"),
      photo("Sports Day 7", "Parents watching from the spectator area"),
    ],
  },
  {
    slug: "spring-musical-2026",
    title: "Spring Musical: Oliver!",
    description: "Over 80 pupils on stage and in the orchestra pit for three sold-out performances.",
    date: "2026-03-19",
    photos: [
      photo("Oliver 1", "The cast performing a song on stage", "Food, Glorious Food"),
      photo("Oliver 2", "A pupil playing Fagin"),
      photo("Oliver 3", "The orchestra in the pit"),
      photo("Oliver 4", "The full cast taking a bow", "Curtain call on the final night"),
      photo("Oliver 5", "Make-up being applied backstage"),
    ],
  },
  {
    slug: "science-week-2026",
    title: "Science Week 2026",
    description: "Experiments, a visiting planetarium and the Year 8 rocket launch on the playing fields.",
    date: "2026-03-09",
    photos: [
      photo("Science Week 1", "A rocket launching from the playing fields", "The Year 8 rocket launch"),
      photo("Science Week 2", "Pupils inside the inflatable planetarium"),
      photo("Science Week 3", "A chemistry demonstration with coloured flames"),
      photo("Science Week 4", "Junior pupils examining minibeasts with magnifying glasses"),
      photo("Science Week 5", "Sixth Formers presenting their research posters"),
      photo("Science Week 6", "A visiting scientist answering questions"),
    ],
  },
  {
    slug: "year-6-residential-2025",
    title: "Year 6 Residential Trip",
    description: "Five days of kayaking, climbing and team challenges in the Lake District.",
    date: "2025-06-09",
    photos: [
      photo("Residential 1", "Pupils kayaking on a lake", "Kayaking on Derwentwater"),
      photo("Residential 2", "A pupil climbing an outdoor rock face"),
      photo("Residential 3", "A group at the top of a hill", "The summit of Catbells"),
      photo("Residential 4", "Pupils building a raft"),
      photo("Residential 5", "A campfire in the evening"),
    ],
  },
];

export const albums: Album[] = albumData.map((album) => ({
  ...album,
  cover: album.photos[0]?.image ?? placeholderImage(800, 600, album.title, ""),
  photoCount: album.photos.length,
}));
