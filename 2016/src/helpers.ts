export function calcFreqDist(token: string[]): Map<string, number> {
    return token.reduce((freqDist, val) => {
        if (freqDist.has(val)) {
            freqDist.set(val, freqDist.get(val) as number + 1)
        } else {
            freqDist.set(val, 1)
        }

        return freqDist
    }, new Map() as Map<string, number>)
}

export function reverseString(string: string): string {
    return [...string].reverse().join("")
}
