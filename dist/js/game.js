export default class gameObj {
  constructor() {
    this._active = false;
    this._p1AllTime = 0;
    this._cpAllTime = 0;
    this._p1Session = 0;
    this._cpSession = 0;
  }

  getActiveStatus() {
    return this._active;
  }

  startGame() {
    this._active = true;
  }
  endGame() {
    this._active = false;
  }

  getP1AllTime() {
    return this._p1AllTime;
  }
  setP1AllTime(p1) {
    this._p1AllTime = p1;
  }

  getCpAllTime() {
    return this._cpAllTime;
  }
  setCpAllTime(cp) {
    this._cpAllTime = cp;
  }

  getP1Session() {
    return this._p1Session;
  }

  getCpSession() {
    return this._cpSession;
  }

  p1Wins() {
    this._p1Session += 1;
  }

  cpWins() {
    this._cpSession += 1;
  }
}
