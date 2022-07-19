import { Socket } from 'socket.io'
import { Agent } from './Agent'
import { movingGameObject } from './movingGameObject'
import { Agv } from './Agv'
import * as socketEvents from '../socketEvents'
import { Position } from './position'

export class Physic {
  constructor() {}

  // return a list (array) of overlapped agvs serverId with the list of agents
  public checkOverlap(
    agvs: movingGameObject[],
    agents: Agent[],
    socket: Socket
  ): {
    agvServerId: string
    overlappedAgents: { agentServerId: string }[]
  }[] {
    let overlappedAgvs: {
      agvServerId: string
      overlappedAgents: { agentServerId: string }[]
    }[] = []

    agvs.forEach((agv) => {
      let currentAgvOverlapped = false
      let overLappedAgents: { agentServerId: string }[] = []

      agents.forEach((agent) => {
        if (
          this.isOverLapped(
            {
              minAx: agv.x,
              minAy: agv.y,
              maxAx: agv.x + agv.sizeWidth,
              maxAy: agv.y + agv.sizeHeight,
            },
            {
              minBx: agent.x,
              minBy: agent.y,
              maxBx: agent.x + agent.sizeWidth,
              maxBy: agent.y + agent.sizeHeight,
            }
          )
        ) {
          currentAgvOverlapped = true
          overLappedAgents.push({ agentServerId: agent.serverId })
          // if (
          //   agent.desX === Math.floor(agv.x / 32) &&
          //   agent.desY === Math.floor(agv.y / 32)
          // ) {
          //   socket.emit(socketEvents.events.sendAgentPathToClient, {
          //     id: agent.id,
          //     vertexs: [],
          //     end: true,
          //   })
          // } else {
          //   agent.recal(
          //     new Position(Math.floor(agent.x / 32), Math.floor(agent.y / 32)),
          //     socket
          //   )
          // }
          if (agv.clientId) {
            console.log(
              `AAGV ${agv.clientId} đã va chạm với agent ${agent.clientId}`
            )
          } else {
            console.log(`mAGV đã va chạm với agent ${agent.clientId}`)
          }
        }
      })

      if (currentAgvOverlapped) {
        overlappedAgvs.push({
          agvServerId: agv.serverId,
          overlappedAgents: overLappedAgents,
        })
      }
    })

    return overlappedAgvs
  }

  public checkAgentOverlap(agents: Agent[], socket: Socket) {
    const ignoreAgent = new Set<string>()
    agents.forEach((agent) => {
      if (ignoreAgent.has(agent.serverId)) {
        return
      }
      agents.forEach((agent2) => {
        if (ignoreAgent.has(agent2.serverId)) {
          return
        }
        if (agent.serverId !== agent2.serverId) {
          if (
            this.isOverLapped(
              {
                minAx: agent.x,
                minAy: agent.y,
                maxAx: agent.x + agent.sizeWidth,
                maxAy: agent.y + agent.sizeHeight,
              },
              {
                minBx: agent2.x,
                minBy: agent2.y,
                maxBx: agent2.x + agent2.sizeWidth,
                maxBy: agent2.y + agent2.sizeHeight,
              }
            )
          ) {
            ignoreAgent.add(agent.serverId)
            ignoreAgent.add(agent2.serverId)
            console.log(
              `Agent ${agent.clientId} đã va chạm với agent ${agent2.clientId}`
            )
          }
        }
      })
    })
  }

  public checkFinish(agv: Agv) {
    if (
      Math.floor(agv.x / 32) === Math.floor(agv.desX / 32) &&
      Math.floor(agv.y / 32) === Math.floor(agv.desY / 32)
    ) {
      return true
    }
    return false
  }

  // check is overLapped box 1 and box 2
  private isOverLapped(
    {
      minAx,
      minAy,
      maxAx,
      maxAy,
    }: { minAx: number; minAy: number; maxAx: number; maxAy: number },
    {
      minBx,
      minBy,
      maxBx,
      maxBy,
    }: { minBx: number; minBy: number; maxBx: number; maxBy: number }
  ): boolean {
    // Check for the cases where the rectangles are definitely not intersecting.
    // If none of these cases are true then the rectangles must intersect. i.e.:

    let aLeftOfB = maxAx < minBx
    let aRightOfB = minAx > maxBx
    let aAboveB = minAy > maxBy
    let aBelowB = maxAy < minBy

    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB)
  }
}
