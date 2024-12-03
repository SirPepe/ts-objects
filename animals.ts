/*
  TypeScript Objects
  ==================

  0. The adapter functions get passed the starting energy for the respective
     animals and should return an animal instance
  1. Common properties on all animals:
     1.1. Boolean isAlive (false if energy <= 0, true if energy > 0)
     1.2. Number energy (animals get initialized with an energy > 0)
     1.3. Number distance (starts with 0 for every animal)
     1.4. Function eat(other)
          1.4 a) energy is taken from other and added to own energy
          1.4 b) throws error when trying to eat an animal of the same species
          1.4 c) throws error if used on a dead animal
          1.4 d) throws error if the target has no useable energy (number > 0)
  2. Creating an animal instance with 0 energy should throw an error
  3. The following move methods can exist on animals:
     3.1. walk(d) returns ths string "Walking!"
     3.2. fly(d) returns ths string "Flying!"
     3.3. swim(d) returns ths string "Swimming!"
     3.4. d is added to the own distance value
     3.5. throws error if used on a dead animal
     3.6. throws error if distance is not a number > 0
  4. The following table explains which move methods should be available on
     which species:

     |-------------------------------|
     |       | walk  | fly   | swim  |
     |-------------------------------|
     | Fish  |       |       |   X   |
     |-------------------------------|
     | Lion  |   X   |       |       |
     |-------------------------------|
     | Duck  |   X   |   X   |   X   |
     |-------------------------------|
     | Eagle |   X   |   X   |       |
     |-------------------------------|
*/

export const fishAdapter = (energy: number): any => {
  return; // return a fish here!
};

export const lionAdapter = (energy: number): any => {
  return; // return a lion here!
};

export const duckAdapter = (energy: number): any => {
  return; // return a duck here!
};

export const eagleAdapter = (energy: number): any => {
  return; // return an eagle here!
};
