// main agv

export class movingGameObject {
  public x: number = 0
  public y: number = 0
  public sizeHeight: number = 0
  public sizeWidth: number = 0
  public serverId: string = ''
  public clientId: string = ''

  constructor(
    x: number,
    y: number,
    sizeWidth: number,
    sizeHeight: number,
    serverId: string,
    clientId: string
  ) {
    this.x = x
    this.y = y
    this.sizeWidth = sizeWidth
    this.sizeHeight = sizeHeight
    this.serverId = serverId
    this.clientId = clientId
  }
}
