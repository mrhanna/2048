export function transpose(matrix: any[][]) {
    const ret: any[][] = Array(matrix[0].length).fill(undefined).map(() => Array(matrix.length).fill(undefined));

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            ret[j][i] = matrix[i][j];
        }
    }

    return ret;
}

export function reverse(matrix: any[][]) {
    return matrix.map((row) => [...row].reverse())
}

export function rot90(matrix: any[][]) {
    return reverse(transpose(matrix));
}

export function rot270(matrix: any[][]) {
    return transpose(reverse(matrix));
}