const marker = "fix me";

export const configureSongFileContents = (rawFileContents: string): string => {
    const fileContents = rawFileContents.replaceAll('\r\n', '\n').split('\n');
    if (fileContents[1].toLowerCase() !== marker) {
        throw "Marker not set. Configuration will not happen for this file."
    }

    const newFileContents: string[] = [];
    let previousLineWasChords: boolean = false;
    for (let i = 2; i < fileContents.length; i++) {
        // Check for section title.
        if (fileContents[i].trim().startsWith('[') && fileContents[i].trim().endsWith(']')) {
            newFileContents.push('');
            newFileContents.push(fileContents[i]);
            previousLineWasChords = false;
            continue;
        }

        // Check whether the previous line was chords.
        if (previousLineWasChords) {
            const chords = (fileContents[i - 1].match(/(\S{1,})/g) ?? []).reverse();
            let remainingChordLine = fileContents[i - 1];
            let newLine = fileContents[i].padEnd(remainingChordLine.length, ' ');
            chords.forEach(chord => {
                const lastChordIndex = remainingChordLine.lastIndexOf(chord);
                newLine = `${newLine.slice(0, lastChordIndex)}{${chord}}${newLine.slice(lastChordIndex)}`;
                remainingChordLine = remainingChordLine.slice(0, lastChordIndex);
            });

            newFileContents.push(newLine.trimEnd());
            previousLineWasChords = false;
            continue;
        }

        // Skip blank lines.
        if (!fileContents[i].trim()) {
            continue;
        }

        // Assume we are now at a chord line.
        previousLineWasChords = true;
    }

    return newFileContents.join('\r\n');
}