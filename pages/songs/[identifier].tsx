import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, MenuItem, Select } from '@mui/material'
import styles from '@/styles/Home.module.css'
import { getSongDataFromFileContents } from '@/services/songsService'
import type { SongData } from '@/services/songsService'
import { Key, KeyMap } from '@/services/keys'
import { SongFileData, getSongFileContents } from '@/services/songFileService'

type IProps = {
    songData: SongData
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { identifier } = context.query;
    if (!identifier) {
        return { props: { song: null } };
    }

    if (Array.isArray(identifier)) {
        return { props: { song: null } };
    }

    let fileContents: SongFileData;
    try {
        fileContents = await getSongFileContents(identifier);
    } catch {
        return { props: { song: null } };
    }

    const songData = getSongDataFromFileContents(fileContents, { chordClassName: styles.chord });
    return {
        props: {
            songData: songData,
        }
    }
}

export default function SongPage({ songData }: IProps) {
    const [song, setSong] = useState<SongData>(songData)
    const [showChords, setShowChords] = useState(true);
    const [selectedKey, setSelectedKey] = useState(song.mainKey)

    const title = song.metadata.title;
    const author = song.metadata.authors || song.metadata.author;

    const { push, query } = useRouter();

    useEffect(() => {
        const key = query?.key as string;
        if (!key) return;
        const keyValue = KeyMap[key];
        if (!keyValue) return;
        handleKeyChange(keyValue);
    }, [])

    const keys = Object.keys(Key)
        .filter((key) => !isNaN(key as any))
        .map((key) => ({ key: key, label: Key[key as any] }));

    const onToggleChords = () => {
        setShowChords(!showChords);
    }

    const handleKeyChange = (newKeyValue: string | number) => {
        const newKey = Number(newKeyValue);
        setSelectedKey(newKey);

        const transposedSong = getSongDataFromFileContents(song.originalSongFileData, { chordClassName: styles.chord, newKey });
        setSong(transposedSong);

        push({ query: { ...query, key: Key[newKey] } }, undefined, { shallow: true });
    }

    return (
        <>
            <Head>
                <title>{title} | Song Lyrics and Chords</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div style={{ float: 'right' }}>
                    {
                        selectedKey || selectedKey === 0 ?
                            <Select label="Key" value={selectedKey} onChange={(event) => handleKeyChange(event.target.value)}>
                                {keys.map((key) => (
                                    <MenuItem key={key.key} value={key.key}>{key.label}</MenuItem>
                                ))}
                            </Select> : null
                    }

                    <Button onClick={onToggleChords}>{showChords ? 'Hide Chords' : 'Show Chords'}</Button>
                    <Link href="/songs">Songs</Link>
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
                                    section.chordedLines.map((item, index) => (
                                        <pre key={index} className={styles.line} dangerouslySetInnerHTML={{ __html: item }}></pre>
                                    )) :
                                    section.lyricLines.map((item, index) => (
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