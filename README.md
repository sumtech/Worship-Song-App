This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Application Deployment

TODO: Add information

## Song Files

The application is using `.txt` files to store the song information.

### Format

The `.txt` files have two sections separated by a series of five or more `=` characters. The first section contains the metadata about the song while the second section has the lyric and chord information for the song.

```
Title: Break Every Chain
Author: Jesus Culture
Album: Awakening Live from Chicago
Key: A
Source: https://tabs.ultimate-guitar.com/tab/jesus-culture/break-every-chain-chords-1113828
==========

[Intro]
{F#m}{D}{A}{E}

[Chorus]
There is {F#m}power {D}in the name of {A}Jesus {E}
There is {F#m}power {D}in the name of {A}Jesus {E}
There is {F#m}power {D}in the name of {A}Jesus {E}

...
```

### Location of Files

#### Local

When doing development work on your local machine, the song files should be stored in the `<project_root>\song-files\` directory. Only `.txt` files will be read.

#### Deployed

For the deployed version in Azure, the files are stored in a storage account container.

|                 | Name              |
|-----------------|-------------------|
| Resource group  | rg-WorshipApps    |
| Storage account | worshipappstorage |
| File share      | f-worship-songs   |

### Automated Conversion

The files have the chords embedded in the lyrics. What is rendered in the site, and what other sites show, has the chords on a different line above where the words are located. I created a script to convert such a format to that used by this application.
1. Move the `new-song.txt` file (this is an example name) to the `\song-files\` directory. This files should have the chords listed on the lines above the lyrics.
2. Add square brackets around the section headings.
2. Update the file so the first line of the lyric/chord section is `fix me`. This text is required to validate that the update to the file is allowed.
3. Make a call to https://localhost:3000/api/songs/process/new-song.txt (i.e., enter that URL into a browser).
4. View the results at https://songs/new-song. Update the stored file as needed to make any needed alterations.