function getGraph(matrix: string[][]) {
  const nodes = new Set<string>()
  matrix.forEach((row, x) =>
    row.forEach((cell, y) => {
      if (cell === "#") return
      if (
        (matrix[x + 1][y] === "." && matrix[x][y - 1] === "." && matrix[x + 1][y - 1] === "#") ||
        (matrix[x + 1][y] === "." && matrix[x][y + 1] === "." && matrix[x + 1][y + 1] === "#") ||
        (matrix[x - 1][y] === "." && matrix[x][y - 1] === "." && matrix[x - 1][y - 1] === "#") ||
        (matrix[x - 1][y] === "." && matrix[x][y + 1] === "." && matrix[x - 1][y + 1] === "#") ||
        cell === "S" ||
        cell === "E"
      ) {
        nodes.add([x, y].toString())
      }
    })
  )

  const graph = new Map<string, string[]>()
  nodes.forEach((node) => {
    graph.set(node, [])
    const queue1 = [node]
    const visited1 = new Set<string>()
    while (queue1.length) {
      const position = queue1.shift()

      if (visited1.has(position)) continue
      visited1.add(position)

      if (nodes.has(position) && position !== node) {
        graph.get(node).push(position)
        continue
      }

      const [x, y] = position.split(",").map(Number)
      const cell = matrix[x][y]
      if (cell === "#") continue

      queue1.push([x + 1, y].toString())
      queue1.push([x - 1, y].toString())
      queue1.push([x, y + 1].toString())
      queue1.push([x, y - 1].toString())
    }
  })

  return graph
}
