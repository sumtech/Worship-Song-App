import { Song } from './songs.model';

// Represents an artist.
export type Artist = {
    // The unique identifier for the artist.
    id: number;

    // The first name of the artist.
    firstName: string;

    // The last name of the artist.
    lastName: string;

    // The full name of the artist.
    name: string;

    // The songs to which the artist has contributed.
    songs: Song[];
}
