import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { getSongFileContents, getSongDataFromFileContents } from '@/services/songs.service'
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
        fileContents = await getSongFileContents(identifier);
    } catch {
        return { props: { song: null } };
    }

    const songData = getSongDataFromFileContents(fileContents, { chordClassName: styles.chord });
    return {
        props: {
            song: songData,
        }
    }
}

export default function SongPage({ song }: IProps) {
    const [showChords, setShowChords] = useState(true);

    const title = song.metadata.title;
    const author = song.metadata.authors || song.metadata.author;

    const onToggleChords = () => {
        setShowChords(!showChords);
    }

    return (
        <>
            <Head>
                <title>{title} | Song Lyrics and Chords</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div style={{ float: 'right' }}>
                    <button onClick={onToggleChords}>{showChords ? 'Hide Chords' : 'Show Chords'}</button>
                </div>
                <h1 className={styles.songTitle}>{title}</h1>
                <div className={styles.songAuthor}>{author}</div>
                {song.metadata.album ? <div className={styles.songMetadata}>{song.metadata.album}</div> : null}
                {song.metadata.publisher ? <div className={styles.songMetadata}>{song.metadata.publisher}</div> : null}
                {song.metadata.copyright ? <div className={styles.songMetadata}>{song.metadata.copyright}</div> : null}

                {(
                    song.sections.map((section, index) => (
                        <div key={index} className={styles.songSection}>
                            <h2>{section.title}</h2>
                            {
                                showChords ?
                                    section.styledContent.map((item, index) => (
                                        <pre key={index} className={styles.line} dangerouslySetInnerHTML={{ __html: item }}></pre>
                                    )) :
                                    section.lyrics.map((item, index) => (
                                        <pre key={index} className={styles.line}>{item}</pre>
                                    ))
                            }
                        </div>
                    ))
                )}
            </main>
        </>
    )
}