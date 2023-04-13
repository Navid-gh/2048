/*
In TypeScript, if you want to have private values in classes, you can declare them using the private keyword. 
However, these private variables must be initialized either during declaration or in the constructor of the class.

If you do not want to initialize the private variables during declaration or in the constructor, 
you can use the ! operator to tell TypeScript that you will ensure the variable is initialized before it is used. 
This is known as a non-null assertion operator.

Here's an example:

typescript
class MyClass {
  private myPrivateVariable!: string;

  public setMyPrivateVariable(value: string): void {
    this.myPrivateVariable = value;
  }

  public getMyPrivateVariable(): string {
    return this.myPrivateVariable;
  }
}
In the example above, myPrivateVariable is declared with the private keyword and the ! operator. 
This tells TypeScript that the variable is not initialized during declaration or in the constructor, 
but we will ensure that it is initialized before it is used.

We can then set the value of myPrivateVariable using the setMyPrivateVariable method, 
and retrieve its value using the getMyPrivateVariable method. Before calling either of these methods, 
we must ensure that myPrivateVariable has been initialized.
*/

export default class Tile {
  private tileElement: HTMLDivElement;
  private _x!: number;
  private _y!: number;
  private _value!: number;
  constructor(
    public tileContainer: HTMLDivElement,
    public myValue: number = Math.random() > 0.5 ? 4 : 2
  ) {
    this.tileElement = document.createElement("div");
    this.tileElement.classList.add("tile");
    tileContainer.append(this.tileElement);
    this.value = myValue;
  }

  set x(value: number) {
    this._x = value;
    this.tileElement.style.setProperty("--x", `${value}`);
  }
  set y(value: number) {
    this._y = value;
    this.tileElement.style.setProperty("--y", `${value}`);
  }

  //   so no what about our color and bg-color
  //for having smth relied and based on another thing its best to have setter and getter
  set value(v: number) {
    this._value = v;
    this.tileElement.textContent = `${v}`;
    const power = Math.log2(v);
    const bgLightness = 100 - power * 9; //as our power increase, our lightness decrease, and muliply to 9 is smth that we
    // tested to find the best number anf formula
    this.tileElement.style.setProperty("--bg--lightness", `${bgLightness}%`);
    this.tileElement.style.setProperty(
      "--text--lightness",
      `${bgLightness <= 50 ? 90 : 10}%`
    );
  }
  get value() {
    return this._value;
  }

  remove() {
    this.tileElement.remove();
  }

  waitForTrasitions(animation: boolean = false) {
    return new Promise((resolve) => {
      this.tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      );
    });
  }
}
