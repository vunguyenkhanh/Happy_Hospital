import { Node2D, StateOfNode2D } from '../node'
import { HybridState } from './HybridState'
import { AutoAgv } from '../AutoAgv'
import { IdleState } from './IdleState'
import { MainScene } from '../../scenes/main'
import { Constant } from '../../Constant'
import { WaitingDuration } from '../statistic/waitingPeriod'

export class RunningState extends HybridState {
  public _isLastMoving?: boolean
  private _agvIsDestroyed?: boolean

  constructor(isLastMoving: boolean = false) {
    super()
    this._isLastMoving = isLastMoving
    this._agvIsDestroyed = false
  }

  public move(agv: AutoAgv): void {
    if (this._agvIsDestroyed)
      //|| this._isEliminated)
      return
    // nếu không có đường đi đến đích thì không làm gì
    if (!agv.path) {
      return
    }
    if (agv.isDisable) {
      agv.setVelocity(0, 0)
      return
    }
    if (agv.cur == agv.path.length - 1) {
      // nếu đã đến đích thì không làm gì
      agv.setVelocity(0, 0)
      if (this._isLastMoving) {
        const mainScene = agv.scene as MainScene
        mainScene.autoAgvs.delete(agv)
        mainScene.forcasting?.rememberDoneAutoAgv(agv.getAgvID())
        this._agvIsDestroyed = true
        agv.destroy()
        return
      } else {
        agv.hybridState = new IdleState(performance.now())
      }
      return
    }
    // nodeNext: nút tiếp theo cần đến
    if (agv.cur + 1 >= agv.path.length) {
      console.log('Loi roi do: ' + (agv.cur + 1))
    }
    const nodeNext: Node2D =
      agv.graph.nodes[agv.path[agv.cur + 1].x][agv.path[agv.cur + 1].y]
    //Khoảng cách của autoAgv với các actors khác đã va chạm
    const shortestDistance = Constant.minDistance(agv, agv.collidedActors)

    /**
     * nếu nút tiếp theo đang ở trạng thái bận
     * thì Agv chuyển sang trạng thái chờ
     */
    if (
      nodeNext.state == StateOfNode2D.BUSY ||
      shortestDistance < Constant.SAFE_DISTANCE
    ) {
      agv.setVelocity(0, 0)
      if (agv.waitT) return
      agv.waitT = performance.now()
      agv
        .getSnene()
        .forcasting?.addDuration(
          agv.getAgvID(),
          new WaitingDuration(Math.floor(agv.waitT / 1000))
        )
    } else {
      /*
       * Nếu tất cả các actor đều cách autoAgv một khoảng cách an toàn
       */
      if (shortestDistance >= Constant.SAFE_DISTANCE) {
        //Thì gỡ hết các actors trong danh sách đã gây ra va chạm
        agv.collidedActors.clear()
      }
      /**
       * nếu Agv từ trạng thái chờ -> di chuyển
       * thì cập nhật u cho node hiện tại
       */
      if (agv.waitT) {
        agv.curNode.setU((performance.now() - agv.waitT) / 1000)
        ;(agv.scene as MainScene).forcasting?.updateDuration(
          agv.getAgvID(),
          Math.floor(agv.waitT / 1000),
          Math.floor(performance.now() / 1000)
        )
        agv.waitT = 0
      }
      // di chuyển đến nút tiếp theo
      if (
        Math.abs(agv.x - nodeNext.x * 32) > 1 ||
        Math.abs(agv.y - nodeNext.y * 32) > 1
      ) {
        const nextObjectName = agv
          .getSnene()
          .getBusyGridState(nodeNext.x, nodeNext.y)
        if (nextObjectName) {
          const splitName = nextObjectName.split('_')
          const firstObject = splitName[0]
          if (firstObject === 'agent') {
            const agent = agv.getSnene().getAgentByID(+splitName[1])
            if (agent)
              if (
                agent.nextPos?.x === nodeNext.x &&
                agent.nextPos?.y === nodeNext.y
              )
                return
            agv.getSnene().setBusyGridState(nodeNext.x, nodeNext.y, null)
            agv.scene.physics.moveTo(agv, nodeNext.x * 32, nodeNext.y * 32, 32)
          } else if (firstObject === 'agv') {
            const busyAgv = agv.getSnene().getAgvById(+splitName[1])
            if (busyAgv) {
              if (busyAgv.getExpectedTime() < agv.getExpectedTime()) return
              busyAgv.handleOverlap()
            }
            agv.getSnene().setBusyGridState(nodeNext.x, nodeNext.y, null)
            agv.scene.physics.moveTo(agv, nodeNext.x * 32, nodeNext.y * 32, 32)
          } else {
            const mAgv = agv.getSnene().getMainAgv()
            if (mAgv.getExpectedTime() < agv.getExpectedTime()) return
            mAgv.handleOverlap(false)
          }
          return
        }
        agv.scene.physics.moveTo(agv, nodeNext.x * 32, nodeNext.y * 32, 32)
      } else {
        /**
         * Khi đã đến nút tiếp theo thì cập nhật trạng thái
         * cho nút trước đó, nút hiện tại và Agv
         */
        agv.curNode.setState(StateOfNode2D.EMPTY)
        agv.getSnene().setBusyGridState(agv.curNode.x, agv.curNode.y, null)
        agv.curNode = nodeNext
        agv
          .getSnene()
          .setBusyGridState(
            agv.curNode.x,
            agv.curNode.y,
            'agv_' + agv.getAgvID()
          )
        agv.curNode.setState(StateOfNode2D.BUSY)
        agv.cur++
        agv.setX(agv.curNode.x * 32)
        agv.setY(agv.curNode.y * 32)
        agv.setVelocity(0, 0)
        agv.stepsMoved++
        // cap nhat lai duong di Agv moi 10 buoc di chuyen;
        // hoac sau 10s di chuyen
        if (
          agv.stepsMoved % 10 == 0 ||
          performance.now() - agv.timesMoved > 10000
        ) {
          agv.timesMoved = performance.now()
          agv.cur = 0
          agv.path = agv.calPathAStar(agv.curNode, agv.endNode)
        }
      }
    }
  }
}
