
const add = (num1, num2) => {
  const n1 = String(num1);
  const n2 = String(num2);

  let r1, r2;
  try {
    r1 = n1.split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = n2.split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }

  const c = Math.abs(r1 - r2);
  const m = Math.pow(10, Math.max(r1, r2));
  let v1, v2;
  if (c > 0) {
    const cm = Math.pow(10, c);
    if (r1 > r2) {
      v1 = Number(n1.replace(".", ""));
      v2 = Number(n2.replace(".", "")) * cm;
    } else {
      v1 = Number(n1.replace(".", "")) * cm;
      v2 = Number(n2.replace(".", ""));
    }
  } else {
    v1 = Number(n1.replace(".", ""));
    v2 = Number(n2.replace(".", ""));
  }
  return (v1 + v2) / m;
}

const subtract = (num1, num2) => {
  let r1, r2;
  try {
    r1 = num1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }

  const m = Math.pow(10, Math.max(r1, r2));
  const n = (r1 >= r2) ? r1 : r2;
  return Number(((num1 * m - num2 * m) / m).toFixed(n));
}

const multiply = (num1, num2) => {
  let m = 0;
  const s1 = String(num1), s2 = String(num2);
  try {
    m += s1.split(".")[1].length;
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length;
  } catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

const divide = (num1, num2) => {
  let t1 = 0, t2 = 0;
  try {
    t1 = num1.toString().split(".")[1].length;
  } catch (e) {
  }
  try {
    t2 = num2.toString().split(".")[1].length;
  } catch (e) {
  }
  const r1 = Number(num1.toString().replace(".", ""));
  const r2 = Number(num2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

export { add, subtract, multiply, divide }
