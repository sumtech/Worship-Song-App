import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import type { GetServerSideProps } from 'next';
import { getSongList } from '@/services/songs.service';
import type { SongSummary } from '@/services/songs.service';

type IProps = {
    songs: SongSummary[];
}

export const getServerSideProps: GetServerSideProps = async () => {
    const songs: SongSummary[] = await getSongList();

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
                                <li key={song.identifier}><a href={`/songs/${song.identifier}`}>{song.title}</a> by {song.author}</li>
                            ))
                        )}
                    </ul>
                </div>
            </main>
        </>
    )
}