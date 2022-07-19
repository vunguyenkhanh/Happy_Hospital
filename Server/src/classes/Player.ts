import { Agent } from './Agent'
import { Agv } from './Agv'
import { AutoAgv } from './autoAgv'
import { GameObject } from './GameObject'
const socketEvents = require('../socketEvents')
import { Position } from './position'
import { Socket } from 'socket.io'
import { AstarSearch } from '../algorithm/astar'

export class Player {
  public agv: Agv
  public autoAgvs: AutoAgv[]
  public agents: Agent[]
  public groundPos: Position[] = []
  public doorPos: Position[] = []
  public defaultListTile: Array<Array<null | string>> = []
  public listTile: Array<Array<null | string>> = []
  public busyGrid: Record<number, Record<number, boolean>> = {}
  public astar: AstarSearch

  setBusyGridState(x, y, state: boolean) {
    if (!x || !y) return
    if (!this.busyGrid[x]) this.busyGrid[x] = {}
    this.busyGrid[x][y] = state
  }
  getBusyGridState(x, y) {
    return this.busyGrid[x][y]
  }

  constructor(groundPos: Position[], doorPos: Position[], pathPos: Position[]) {
    this.agv = new Agv(0, 0, 0, 0, '', '', 0, 0)
    this.autoAgvs = []
    this.agents = []
    this.doorPos = doorPos
    this.astar = new AstarSearch(52, 28, groundPos, pathPos)
  }

  public addGameObject(
    {
      x,
      y,
      width,
      height,
      serverId,
      gameObjectType,
      gameObjectAttrs,
      desX,
      desY,
      clientId,
    }: GameObject,
    socket: Socket
  ) {
    switch (gameObjectType) {
      case socketEvents.gameObjectType.agv:
        this.agv = new Agv(
          x,
          y,
          width,
          height,
          serverId,
          '',
          desX || 0,
          desY || 0
        )
        break
      case socketEvents.gameObjectType.autoAgv:
        this.autoAgvs.push(
          new AutoAgv(x, y, width, height, serverId, clientId || '')
        )
        break
      case socketEvents.gameObjectType.agent:
        if (gameObjectAttrs)
          this.agents.push(
            new Agent(
              x,
              y,
              width,
              height,
              serverId,
              gameObjectAttrs,
              this.groundPos,
              socket,
              clientId || '',
              desX || 0,
              desY || 0,
              this.astar
            )
          )
        break
      default:
    }
  }

  // agents can randomly disapear
  public deleteAgent(serverId: string) {
    let index = -1
    for (let i = 0; i < this.agents.length; i++) {
      if (this.agents[i].serverId === serverId) {
        index = i
        break
      }
    }

    if (index !== -1) this.agents.splice(index, 1)
  }

  public updateAllGameObjects(
    agvInfo: { x: number; y: number }[],
    autoAgvsInfo: { x: number; y: number; serverId: string }[],
    agentsInfo: { x: number; y: number; serverId: string }[]
  ) {
    this.agv.x = agvInfo[0].x
    this.agv.y = agvInfo[0].y
    let i = 0
    autoAgvsInfo.forEach((info) => {
      const currentTmp = this.autoAgvs[i]
      currentTmp.x = info.x
      currentTmp.y = info.y
      currentTmp.serverId = info.serverId
      i++
    })

    i = 0
    agentsInfo.forEach((info) => {
      const currentTmp = this.agents[i]
      currentTmp.x = info.x
      currentTmp.y = info.y
      currentTmp.serverId = info.serverId
      i++
    })
  }
}
