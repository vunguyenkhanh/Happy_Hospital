import { Position } from '../classes/position'
class Spot {
  public i: number
  public j: number

  // number to compare
  public f: number

  // number of steps from start to this node
  public g: number

  // Length to destination
  public h: number
  public neighbors: Spot[] = []
  public previous?: Spot
  constructor(i: number, j: number) {
    this.i = i
    this.j = j
    this.f = 0
    this.g = 0
    this.h = 0
  }

  public addNeighbors(ableSpot: Spot[]): void {
    for (let k = 0; k < ableSpot.length; k++) {
      if (this.i + 1 == ableSpot[k].i && this.j == ableSpot[k].j) {
        this.neighbors.push(ableSpot[k])
      } else if (this.i == ableSpot[k].i && this.j + 1 == ableSpot[k].j) {
        this.neighbors.push(ableSpot[k])
      } else if (this.i - 1 == ableSpot[k].i && this.j == ableSpot[k].j) {
        this.neighbors.push(ableSpot[k])
      } else if (this.i == ableSpot[k].i && this.j - 1 == ableSpot[k].j) {
        this.neighbors.push(ableSpot[k])
      }
    }
  }

  public equal(spot: Spot): boolean {
    if (this.i === spot.i && this.j === spot.j) return true
    return false
  }
}

export class Astar {
  public width: number
  public height: number
  public start: Spot
  public end: Spot
  public ableSpot: Spot[]
  public grid: Spot[][]
  public path: Spot[] = []

  constructor(
    width: number,
    height: number,
    startPos: Position,
    endPos: Position,
    ablePos: Position[]
  ) {
    this.width = width
    this.height = height
    this.start = new Spot(startPos.x, startPos.y)
    this.end = new Spot(endPos.x, endPos.y)
    this.grid = new Array(width)

    for (let i = 0; i < width; i++) {
      this.grid[i] = []
      for (let j = 0; j < height; j++) {
        this.grid[i][j] = new Spot(i, j)
      }
    }

    this.ableSpot = []
    for (let i = 0; i < ablePos.length; i++) {
      this.ableSpot.push(this.grid[ablePos[i].x][ablePos[i].y])
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        this.grid[i][j].addNeighbors(this.ableSpot)
      }
    }
  }

  //calculate the distance between two spots
  private heuristic(spot1: Spot, spot2: Spot): number {
    return Math.sqrt((spot1.i - spot2.i) ** 2 + (spot1.j - spot2.j) ** 2)
  }

  //check if the spot is in the array
  private isInclude(spot: Spot, spots: Spot[]): boolean {
    for (let i = 0; i < spots.length; i++) {
      if (spot.i === spots[i].i && spot.j === spots[i].j) return true
    }
    return false
  }

  public cal(): Position[] | undefined {
    const openSet: Spot[] = []

    // Array of spots that will not selected
    const closeSet: Spot[] = []

    openSet.push(this.grid[this.start.i][this.start.j])
    while (openSet.length > 0) {
      let winner = 0
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i
        }
      }
      const current = openSet[winner]

      if (openSet[winner].equal(this.end)) {
        let cur: Spot = this.grid[this.end.i][this.end.j]
        this.path.push(cur)
        while (cur.previous != undefined) {
          this.path.push(cur.previous)
          cur = cur.previous
        }
        this.path.reverse()
        const result: Position[] = []
        for (let k = 0; k < this.path.length; k++) {
          result.push(new Position(this.path[k].i, this.path[k].j))
        }
        return result
      }

      // not able to move current position
      openSet.splice(winner, 1)
      // add current position to unable set
      closeSet.push(current)

      const neighbors: Spot[] = current.neighbors

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i]
        if (!this.isInclude(neighbor, closeSet)) {
          const tempG = current.g + 1
          if (this.isInclude(neighbor, openSet)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG
            }
          } else {
            neighbor.g = tempG
            openSet.push(neighbor)
          }
          neighbor.h = this.heuristic(neighbor, this.end)
          neighbor.f = neighbor.h + neighbor.g
          neighbor.previous = current
        } else {
          const tempG = current.g + 1
          if (tempG < neighbor.g) {
            openSet.push(neighbor)
            const index = closeSet.indexOf(neighbor)
            if (index > -1) {
              closeSet.splice(index, 1)
            }
          }
        }
      }
    }
    console.log('Path not found!')
    return undefined
  }

  public getAvoidPath(position: Position, nextPosition: Position) {
    const currentSpot = this.grid[position.x][position.y]
    console.log(currentSpot)
    // console.log(this.grid)
  }
}
