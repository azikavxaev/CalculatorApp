export function dotCanBeAdded(firstValue) {
  let count = 0;
  for (let i = 0; i < firstValue.length; i++) {
    if (firstValue[i] == ".") {
      {
        count = count + 1;
      }
    } else if (
      ["-", "+", "×", "/", "%", "^", ")"].includes(firstValue[i]) &&
      count == 1
    ) {
      count = count - 1;
    }
  }

  console.log(count);
  return count < 1;
}
