import { Physics } from 'phaser'
import { Constant } from '../Constant'
import { MainScene } from '../scenes'

export class Actor extends Physics.Arcade.Sprite {
  private static _id = 0
  private agvID: number
  protected expectedTime: number = 0
  public collidedActors: Set<Actor>

  constructor(
    scene: MainScene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.getBody().setCollideWorldBounds(true)

    if (texture == 'agv') {
      Actor._id++
      this.agvID = Actor._id
    } else {
      this.agvID = -1 //Ám chỉ đây là agent
    }
    this.collidedActors = new Set()
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body
  }

  public getAgvID(): number {
    return this.agvID
  }

  public getExpectedTime(): number {
    return this.expectedTime
  }

  public estimateArrivalTime(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    this.expectedTime =
      this.getSnene().sec +
      Math.floor(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) * 0.085)
  }

  public writeDeadline(table: Phaser.GameObjects.Text): void {
    if (this.agvID != -1) {
      var enter = ''
      if (table.text.length > 0) enter = '\n'
      table.text =
        'DES_' +
        this.agvID +
        ': ' +
        Constant.secondsToHMS(this.expectedTime) +
        ' ± ' +
        Constant.DURATION +
        enter +
        table.text
    }
  }

  public eraseDeadline(table: Phaser.GameObjects.Text): void {
    if (this.agvID != -1) {
      var enter = ''
      if (table.text.length > 0) enter = '\n'
      let erasedStr: string =
        'DES_' +
        this.agvID +
        ': ' +
        Constant.secondsToHMS(this.expectedTime) +
        ' ± ' +
        Constant.DURATION +
        enter
      table.text = table.text.replace(erasedStr, '')
    }
  }

  public freeze(actor: Actor) {
    this.collidedActors.add(actor)
  }
  public getSnene() {
    return this.scene as MainScene
  }
}
