function main() {
    const inputNumber = parseInt(document.getElementById("number").value);

    if (!isNaN(inputNumber)) { // 入力が数値であることを確認
        let divisor = findDivisor(inputNumber);
        let mersennePrimes = mersennePrimesChcker(inputNumber, divisor);
        let perfectNumber = perfectNumberChcker(inputNumber, divisor);

        // 約数の結果を表示
        const divisorElement = document.getElementById("divisor");
        divisorElement.innerHTML = `約数: ${divisor.join(', ')}`;
        // メルセンヌ素数の結果を表示
        const mersennePrimesElement = document.getElementById("mersennePrimes");
        mersennePrimesElement.innerHTML = `メルセンヌ素数: ${mersennePrimes}`;
        // 完全数の結果を表示
        const perfectNumberElement = document.getElementById("perfectNumber");
        perfectNumberElement.innerHTML = `完全数: ${perfectNumber}`;
    } else {
        alert("有効な数字を入力してください。");
    }
}

function findDivisor(n) {
    const ret = []; // 結果を格納する配列
  
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) {
        ret.push(i); // 約数を追加
        if (i * i !== n) ret.push(n / i); // 平方根でない場合、対応する約数を追加
      }
    }
  
    ret.sort((a, b) => a - b); // 昇順にソート
    return ret; // 約数の配列を返す
  }

function mersennePrimesChcker(number, divisor) { //メルセンヌ素数かを判定する関数
    if ((number + 1 & number) === 0) {
        // 約数の配列が与えられているかを確認
        if (Array.isArray(divisor) && divisor.length > 0) {
            // 約数が2と自身のみであるかを確認
            if (divisor.length === 2 && divisor.includes(1) && divisor.includes(number)) {
                return true; // メルセンヌ素数である
            }
        }
    }
    return false; // メルセンヌ素数でない
}

function perfectNumberChcker(number, divisor) { //完全数かを判定する関数
    let sumDivisors = divisor.reduce((sum, current) => sum + current, 0); // 約数の合計を求める

    if (number * 2 === sumDivisors) {
        return true;
    } else {
        return false;
    }
}