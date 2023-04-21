import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { getSongListSummaries } from '@/services/songsService';
import type { SongSummary } from '@/services/songsService';
import { getSongListFileContents } from '@/services/songFileService';

type IProps = {
    songs: SongSummary[];
}

export const getServerSideProps: GetServerSideProps = async () => {
    const songListFileContents = await getSongListFileContents();
    const songs: SongSummary[] = await getSongListSummaries(songListFileContents);

    return {
        props: {
            songs: songs,
        }
    }
}

export default function SongListPage({ songs }: IProps) {
    return (
        <>
            <Head>
                <title>List of Songs</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div>
                    <h1>Songs</h1>
                    <ul>
                        {(
                            songs.map(song => (
                                <li key={song.identifier}><Link href={`/songs/${song.identifier}`}>{song.title}</Link> by {song.author}</li>
                            ))
                        )}
                    </ul>
                </div>
            </main>
        </>
    )
}