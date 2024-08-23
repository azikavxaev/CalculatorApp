export function parenthesisIsNeeded(a) {
  // const name = a.join("").toString();
  let countA = 0;
  let countB = 0;
  for (let i = 0; i <= a.length; i++) {
    if (a[i] == "(") {
      countA++;
    } else if (a[i] == ")") {
      countB++;
    }
  }
  return countA > countB;
}
