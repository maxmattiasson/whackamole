import { Mole } from "./Mole.js";
// Centrera eventhantering via delegering på brädet (se vecko-materialet om addEventListener & bubbling).
// TODO-markeringar lämnar utrymme för egna lösningar.
export class Game {
  constructor({ boardEl, scoreEl, timeEl, missesEl }) {
    this.boardEl = boardEl;
    this.scoreEl = scoreEl;
    this.timeEl = timeEl;
    this.missesEl = missesEl;
    this.gridSize = 3;
    this.duration = 60; // sekunder
    this.state = {
      score: 0,
      misses: 0,
      timeLeft: this.duration,
      running: false,
    };
    this._tickId = null;
    this._spawnId = null;
    this.spawnTimer = 1200;
    this._activeMoles = new Set();
    this.handleBoardClick = this.handleBoardClick.bind(this);
  }
  init() {
    this.createGrid(this.gridSize);
    this.updateHud();
    // Eventdelegering: en lyssnare hanterar alla barn-noder.
    this.boardEl.addEventListener("click", this.handleBoardClick);
    this.boardEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") this.handleBoardClick(e);
    });
  }
  createGrid(size = 3) {
    this.boardEl.innerHTML = "";
    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("aria-label", `Hål ${i + 1}`);
      this.boardEl.appendChild(cell);
    }
  }
  start() {
    if (this.state.running) return;
    this.boardEl.classList.remove("unclickable");
    this.state.running = true;
    this.state.score = 0;
    this.state.misses = 0;
    this.state.timeLeft = this.duration;
    this.updateHud();
    // TODO: implementera spelloop
    // 1) setInterval: nedräkning av timeLeft
    this._tickId = setInterval(() => {
      this.state.timeLeft--;
      this.updateHud();

      if (this.state.timeLeft <= 0) {
        this.end();
      }
    }, 1000);

    this.spawnHandler();
  }
  reset() {
    clearTimeout(this._spawnId);
    this._spawnId = null;
    clearInterval(this._tickId);
    this._tickId = null;
    [...this._activeMoles].forEach((mole) => {
      mole.disappear();
      this._activeMoles.delete(mole);
    });
    this.state = {
      score: 0,
      misses: 0,
      timeLeft: this.duration,
      running: false,
    };
    this.updateHud();
  }
  spawnMole() {
    // TODO: välj slumpmässig tom cell och mounta en ny Mole

    const emptyCells = [
      ...this.boardEl.querySelectorAll(".cell:not(.has-mole)"),
    ];
    if (emptyCells.length === 0) return;

    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const mole = new Mole(cell, 900);

    this._activeMoles.add(mole);
    mole.appear(() => {
      console.log(this._activeMoles);
      console.log([...this._activeMoles]);

      this._activeMoles.delete(mole);
      this.state.misses++;
      this.updateHud(); /* miss om utgångutan träff? */
    });
  }
  handleBoardClick(e) {
    const cell = e.target.closest(".cell");
    if (!cell || !this.state.running) return;

    const mole = [...this._activeMoles].find((m) => m.cellEl === cell);
    console.log(mole);

    if (!mole) {
      this.state.misses++;
    } else {
      this.state.score++;
      mole.disappear();
      this._activeMoles.delete(mole);
    }
    this.updateHud();
  }
  updateHud() {
    this.scoreEl.textContent = `Poäng: ${this.state.score}`;
    this.timeEl.textContent = `Tid: ${this.state.timeLeft}`;
    this.missesEl.textContent = `Missar: ${this.state.misses}`;
  }
  spawnHandler() {
    const spawnFloor = 300;
    const spawnIncrement = 40; // High number = slower, low number = faster
    this.spawnTimer = Math.max(
      spawnFloor,
      (this.state.timeLeft / 2) * spawnIncrement
    );

    this.spawnMole();

    this._spawnId = setTimeout(() => this.spawnHandler(), this.spawnTimer);
  }

  end() {
    if (this.state.timeLeft <= 0) {
      clearTimeout(this._spawnId);
      this._spawnId = null;
      clearInterval(this._tickId);
      this._tickId = null;

      [...this._activeMoles].forEach((mole) => {
        mole.disappear();
        this._activeMoles.delete(mole);
      });
      this.state.running = false;

      this.boardEl.classList.add("unclickable");
      this.scoreEl.textContent = `Spelet över! Din poäng: ${this.state.score} ⭐  Dina missar: ${this.state.misses} 💣`;
      this.timeEl.textContent = "";
      this.missesEl.textContent = "";
    }
  }
}
