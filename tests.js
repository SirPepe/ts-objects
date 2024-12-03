import { fishAdapter, lionAdapter, duckAdapter, eagleAdapter } from "./animals";

function stubTarget(energy) {
  return Object.create(Object.prototype, {
    energy: { writable: true, enumerable: true, value: energy },
    isAlive: {
      set: function () {},
      get: function () {
        return this.energy !== 0;
      },
    },
  });
}

function createAnimals() {
  return [
    { name: "Fish", adapter: fishAdapter, animal: fishAdapter(3) },
    { name: "Lion", adapter: lionAdapter, animal: lionAdapter(3) },
    { name: "Duck", adapter: duckAdapter, animal: duckAdapter(3) },
    { name: "Eagle", adapter: eagleAdapter, animal: eagleAdapter(3) },
  ];
}

QUnit.module("Creating animal objects", {
  beforeEach: function () {
    this.animals = createAnimals();
  },
});

QUnit.test("Adapter functions return animal objects", function (assert) {
  this.animals.forEach(({ name, adapter }) => {
    const energy = Math.ceil(Math.random() * 10);
    const instance = adapter(energy);
    assert.strictEqual(typeof instance, "object", name + " object is created");
    assert.strictEqual(
      instance.energy,
      energy,
      name + " object has an energy property that is correctly initialized"
    );
    assert.strictEqual(
      instance.distance,
      0,
      name + " object has a distance property that is correctly initialized"
    );
    assert.strictEqual(
      instance.isAlive,
      true,
      name + " object has isAlive === true"
    );
    assert.strictEqual(
      typeof instance.eat,
      "function",
      name + " object has a method eat()"
    );
  });
});

QUnit.test(
  "Adapters throw exceptions when given zero or negative energy",
  function (assert) {
    this.animals.forEach(({ name, adapter }) => {
      assert.throws(function () {
        adapter(0);
      }, name + " adapter throws an error when given zero energy");
      const negativeEnergy = Math.ceil(Math.random() * 10) * -1;
      assert.throws(function () {
        adapter(negativeEnergy);
      }, name +
        " adapter throws an error when given negative (" +
        negativeEnergy +
        ") energy");
    });
  }
);

QUnit.module("Life and death", {
  beforeEach: function () {
    this.animals = createAnimals();
  },
});

QUnit.test("Animals should die when their energy reaches 0", function (assert) {
  this.animals.forEach(({ name, animal }) => {
    animal.energy = 0;
    assert.strictEqual(animal.energy, 0, name + ": energy can be set to 0");
    assert.strictEqual(
      animal.isAlive,
      false,
      name + ": is dead when energy is 0"
    );
  });
});

QUnit.test(
  "Animals should die when their energy reaches less than 0",
  function (assert) {
    this.animals.forEach(({ name, animal }) => {
      animal.energy = Math.ceil(Math.random() * 10) * -1;
      assert.ok(
        animal.energy <= 0,
        name + ": energy can be set to less than 0"
      );
      assert.strictEqual(
        animal.isAlive,
        false,
        name + ": is dead when energy is set to less than 0"
      );
    });
  }
);

QUnit.module("Method eat()", {
  beforeEach: function () {
    this.animals = createAnimals();
  },
});

QUnit.test("eat() method eats target objects", function (assert) {
  this.animals.forEach(({ name, animal }) => {
    const target = stubTarget(1);
    animal.eat(target);
    assert.strictEqual(
      animal.energy,
      4,
      name + ": target's energy is added to own energy"
    );
    assert.strictEqual(
      target.energy,
      0,
      name + ": energy is taken away from the target"
    );
  });
});

QUnit.test(
  "eat() method throws exception when used on a dead animal",
  function (assert) {
    this.animals.forEach(({ name, animal }) => {
      animal.energy = 0;
      assert.throws(function () {
        animal.eat(stubTarget(1));
      }, name + ": eat method throws if dead");
    });
  }
);

createAnimals().forEach(({ name: eatingName, adapter: eatingAdapter }) => {
  createAnimals().forEach(({ name: eatenName, adapter: eatenAdapter }) => {
    if (eatingAdapter !== eatenAdapter) {
      QUnit.test(eatingName + " eats " + eatenName, (assert) => {
        const eating = eatingAdapter(5);
        const eaten = eatenAdapter(5);
        eating.eat(eaten);
        assert.strictEqual(
          eating.energy,
          10,
          eatingName + " eats " + eatenName
        );
        assert.strictEqual(
          eaten.energy,
          0,
          eatenName + " is eaten by " + eatingName
        );
        assert.strictEqual(
          eaten.isAlive,
          false,
          eatenName + " ends up dead after being eaten by " + eatingName
        );
      });
    }
  });
});

QUnit.test(
  "eat() method throws exception when called with the same species",
  function (assert) {
    assert.throws(function () {
      fishAdapter(10).eat(fishAdapter(10));
    }, "Fish does not eat fish");
    assert.throws(function () {
      lionAdapter(10).eat(lionAdapter(10));
    }, "Lion does not eat lions");
    assert.throws(function () {
      duckAdapter(10).eat(duckAdapter(10));
    }, "Duck does not eat ducks");
    assert.throws(function () {
      eagleAdapter(10).eat(eagleAdapter(10));
    }, "Eagle does not eat eagles");
  }
);

QUnit.module("Method walk()");

QUnit.test("Fish should not have a walk() method", function (assert) {
  [{ name: "Fish", animal: fishAdapter(3) }].forEach(function ({
    name,
    animal,
  }) {
    assert.strictEqual(
      typeof animal.walk,
      "undefined",
      "NOT present on " + name
    );
  });
});

QUnit.test("walk() method on animals that can walk", function (assert) {
  [
    { name: "Lion", animal: lionAdapter(3) },
    { name: "Duck", animal: duckAdapter(3) },
    { name: "Eagle", animal: eagleAdapter(3) },
  ].forEach(function ({ name, animal }) {
    assert.strictEqual(typeof animal.walk, "function", "present on " + name);
    const result = animal.walk(1);
    assert.strictEqual(animal.distance, 1, name + " moves the distance");
    assert.strictEqual(result, "Walking!", "Method returns the correct string");
  });
});

QUnit.test(
  "walk() method requires a non-zero numeric distance argument",
  function (assert) {
    [
      { name: "Lion", animal: lionAdapter(3) },
      { name: "Duck", animal: duckAdapter(3) },
      { name: "Eagle", animal: eagleAdapter(3) },
    ].forEach(function ({ name, animal }) {
      assert.throws(function () {
        animal.walk(0);
      }, name + ": method throws when called with zero distance");
      assert.throws(function () {
        animal.walk(-1);
      }, name + ": method throws when called with negative distance");
    });
  }
);

QUnit.test(
  "walk() method throws when called on dead animals",
  function (assert) {
    [
      { name: "Lion", animal: lionAdapter(3) },
      { name: "Duck", animal: duckAdapter(3) },
      { name: "Eagle", animal: eagleAdapter(3) },
    ].forEach(function ({ name, animal }) {
      animal.energy = 0;
      assert.throws(function () {
        animal.walk(3);
      }, name + ": method throws when dead");
    });
  }
);

QUnit.module("Method fly()");

QUnit.test("Fish and lion should not have a fly() method", function (assert) {
  [
    { name: "Fish", animal: fishAdapter(1) },
    { name: "Lion", animal: fishAdapter(2) },
  ].forEach(function ({ name, animal }) {
    assert.strictEqual(
      typeof animal.fly,
      "undefined",
      "NOT present on " + name
    );
  });
});

QUnit.test("fly() method on animals that can fly", function (assert) {
  [
    { name: "Duck", animal: duckAdapter(3) },
    { name: "Eagle", animal: eagleAdapter(3) },
  ].forEach(function ({ name, animal }) {
    assert.strictEqual(typeof animal.fly, "function", "present on " + name);
    const result = animal.fly(1);
    assert.strictEqual(animal.distance, 1, name + " moves the distance");
    assert.strictEqual(result, "Flying!", "Method returns the correct string");
  });
});

QUnit.test(
  "fly() method requires a nun-zero numeric distance argument",
  function (assert) {
    [
      { name: "Duck", animal: duckAdapter(3) },
      { name: "Eagle", animal: eagleAdapter(3) },
    ].forEach(function ({ name, animal }) {
      assert.throws(function () {
        animal.fly(0);
      }, name + ": method throws when called with zero distance");
      assert.throws(function () {
        animal.fly(-1);
      }, name + ": method throws when called with negative distance");
    });
  }
);

QUnit.test(
  "fly() method throws when called on dead animals",
  function (assert) {
    [
      { name: "Duck", animal: duckAdapter(3) },
      { name: "Eagle", animal: eagleAdapter(3) },
    ].forEach(function ({ name, animal }) {
      animal.energy = 0;
      assert.throws(function () {
        animal.fly(3);
      }, name + ": method throws when dead");
    });
  }
);

QUnit.module("Method swim()");

QUnit.test("Lion and eagle should not have a swim() method", function (assert) {
  [
    { name: "Lion", animal: lionAdapter(2) },
    { name: "Eagle", animal: eagleAdapter(3) },
  ].forEach(function ({ name, animal }) {
    assert.strictEqual(
      typeof animal.swim,
      "undefined",
      "NOT present on " + name
    );
  });
});

QUnit.test("swim() method on animals that can swim", function (assert) {
  [
    { name: "Fish", animal: fishAdapter(1) },
    { name: "Duck", animal: duckAdapter(3) },
  ].forEach(function ({ name, animal }) {
    assert.strictEqual(typeof animal.swim, "function", "present on " + name);
    const result = animal.swim(1);
    assert.strictEqual(animal.distance, 1, name + " moves the distance");
    assert.strictEqual(
      result,
      "Swimming!",
      "Method returns the correct string"
    );
  });
});

QUnit.test(
  "swim() method requires a nun-zero numeric distance argument",
  function (assert) {
    [
      { name: "Fish", animal: fishAdapter(1) },
      { name: "Duck", animal: duckAdapter(3) },
    ].forEach(function ({ name, animal }) {
      assert.throws(function () {
        animal.swim(0);
      }, name + ": method throws when called with zero distance");
      assert.throws(function () {
        animal.swim(-1);
      }, name + ": method throws when called with negative distance");
    });
  }
);

QUnit.test(
  "swim() method throws when called on dead animals",
  function (assert) {
    [
      { name: "Fish", animal: fishAdapter(1) },
      { name: "Duck", animal: duckAdapter(3) },
    ].forEach(function ({ name, animal }) {
      animal.energy = 0;
      assert.throws(function () {
        animal.swim(3);
      }, name + ": method throws when dead");
    });
  }
);
