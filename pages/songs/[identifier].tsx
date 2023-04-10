import { GetServerSideProps } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { getFileContents, getSongDataFromFileContents } from '@/services/songs.service'
import type { SongData } from '@/services/songs.service'

type IProps = {
    song: SongData
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { identifier } = context.query;
    if (!identifier) {
        return { props: { song: null } };
    }

    if (Array.isArray(identifier)) {
        return { props: { song: null } };
    }

    let fileContents: string;
    try {
        fileContents = await getFileContents(identifier);
    } catch {
        return { props: { song: null } };
    }

    const songData = getSongDataFromFileContents(fileContents, { chordStyle: styles.chord });
    return {
        props: {
            song: songData,
        }
    }
}

export default function SongPage({ song }: IProps) {
    const title = song.metadata.title || '<<title goes here>>';
    const author = song.metadata.authors || song.metadata.author || '<<author goes here>>';

    return (
        <>
            <Head>
                <title>{title} | Song Lyrics and Chords</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>{title}</h1>
                <h2>{author}</h2>
                {song.metadata.album ? <h3>{song.metadata.album}</h3> : null}
                {song.metadata.publisher ? <h3>{song.metadata.publisher}</h3> : null}
                {song.metadata.copyright ? <h3>{song.metadata.copyright}</h3> : null}

                {(
                    song.sections.map((section, index) => (
                        <div key={index} className={styles.songSection}>
                            <h3>{section.title}</h3>
                            {
                                section.styledContent.map((item, index) => (
                                    <pre key={index} className={styles.line} dangerouslySetInnerHTML={{ __html: item }}></pre>
                                ))
                            }
                        </div>
                    ))
                )}
            </main>
        </>
    )
}