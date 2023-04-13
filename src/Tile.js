export default class Tile {
    constructor(tileContainer, myValue = Math.random() > 0.5 ? 4 : 2) {
        this.tileContainer = tileContainer;
        this.myValue = myValue;
        this.tileElement = document.createElement("div");
        this.tileElement.classList.add("tile");
        tileContainer.append(this.tileElement);
        this.value = myValue;
    }
    set x(value) {
        this._x = value;
        this.tileElement.style.setProperty("--x", `${value}`);
    }
    set y(value) {
        this._y = value;
        this.tileElement.style.setProperty("--y", `${value}`);
    }
    set value(v) {
        this._value = v;
        this.tileElement.textContent = `${v}`;
        const power = Math.log2(v);
        const bgLightness = 100 - power * 9;
        this.tileElement.style.setProperty("--bg--lightness", `${bgLightness}%`);
        this.tileElement.style.setProperty("--text--lightness", `${bgLightness <= 50 ? 90 : 10}%`);
    }
    get value() {
        return this._value;
    }
    remove() {
        this.tileElement.remove();
    }
    waitForTrasitions(animation = false) {
        return new Promise((resolve) => {
            this.tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {
                once: true,
            });
        });
    }
}
//# sourceMappingURL=Tile.js.map