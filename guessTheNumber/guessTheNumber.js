//ゲーム中に変化しないグローバル変数を宣言

let gameStatus = false;//ゲームが実行中かを判定する用の変数
let number;//ランダムに生成された数字を代入する変数
let numberDivisor = [];//ランダムに生成された数字の約数を代入する配列
let startTime;//開始時刻を代入する変数
let endTime;//終了時刻を代入する変数

//ゲーム中に変化するグローバル変数を宣言

let playerNumber = null;// playerが予想した数を代入する変数
let historyPlayerNumber = [];// 変数playerNumberを代入する配列
let playerDivisor = null;// playerが予想した約数を代入する変数
let truePlayerDivisor = [];// 変数playerDivisorの内、変数numberDivisorに含まれる数を代入する配列
let falsePlayerDivisor = [];// 変数playerDivisorの内、変数numberDivisorに含まれない数を代入する配列
let currentRequest;//ゲームが現在要求する数字の種類

function gameStart() {
    gameStatus = true;
    startTime = performance.now();

    number = Math.floor(Math.random() * 100);
    let primeNumber = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    if (primeNumber.includes(number) == true) {
        number = Math.floor(Math.random() * 100);
    }
    console.log(number);
    numberDivisor = findDivisor(number);

    currentRequest = "divisor";
    document.getElementById("currentRequest").innerHTML = "約数の予想を入力：";
    document.getElementById("information").innerHTML = "あなたの回答を待っています。";

    let cheatTool = document.getElementById("cheatTool").checked;
    if (cheatTool === true) {
        document.getElementById("cheatToolHint").innerHTML = "ヒント:約数の個数は " + numberDivisor.length;
    }
}

function gameSunset() {
    gameStatus = false;
    endTime = performance.now();

    let time = endTime - startTime;
    time = convertMillisecondsToTime(time);

    document.getElementById("inputNumber").value = "";

    document.getElementById("information").innerHTML = "<p>正解は" + number + "です。プレイ時間は" + time + "です。</p><p>約数は" + numberDivisor + "です。</p>";
    document.getElementById("truePlayerDivisor").innerHTML = "約数である:";
    document.getElementById("falsePlayerDivisor").innerHTML = "約数ではない:";
    document.getElementById("historyPlayerNumber").innerHTML = "これまでの回答:";
    document.getElementById("cheatToolHint").innerHTML = "ヒント：";

    playerNumber = null;
    historyPlayerNumber = [];
    playerDivisor = null;
    truePlayerDivisor = [];
    falsePlayerDivisor = [];
}

function sendNumber() {
    let inputNumber = parseInt(document.getElementById("inputNumber").value);
    document.getElementById("inputNumber").value = "";

    if (gameStatus === true && !isNaN(inputNumber) && currentRequest === "divisor") { //約数の予想を求めている場合
        playerDivisor = inputNumber;

        if (numberDivisor.includes(playerDivisor) === true) { //約数の予想が正しい場合
            document.getElementById("information").innerHTML = playerDivisor + "は約数です。";

            truePlayerDivisor.push(playerDivisor);
            truePlayerDivisor = ascendingOrder(truePlayerDivisor);
            document.getElementById("truePlayerDivisor").innerHTML = `約数である: ${truePlayerDivisor.join(', ')}`;

        } else if (numberDivisor.includes(playerDivisor) === false) { //約数の予想が間違っている場合
            document.getElementById("information").innerHTML = playerDivisor + "は約数ではありません。";

            falsePlayerDivisor.push(playerDivisor);
            falsePlayerDivisor = ascendingOrder(falsePlayerDivisor);
            document.getElementById("falsePlayerDivisor").innerHTML = `約数ではない: ${falsePlayerDivisor.join(', ')}`;
        }

        currentRequest = "number";
        document.getElementById("currentRequest").innerHTML = "数字の予想を入力：";

    } else if (gameStatus === true && !isNaN(inputNumber) && currentRequest === "number") { //数字の予想を求めている場合
        playerNumber = inputNumber;
        historyPlayerNumber.push(playerNumber);
        historyPlayerNumber = ascendingOrder(historyPlayerNumber);
        document.getElementById("historyPlayerNumber").innerHTML = `これまでの回答: ${historyPlayerNumber.join(', ')}`;

        if (number !== playerNumber) { //数字の予想が間違っている場合
            document.getElementById("information").innerHTML = playerNumber + "ではないです。";

            let cheatTool = document.getElementById("cheatTool").checked;
            if (cheatTool === true && playerNumber < number) { //チートが有効で数字が小さい場合
                document.getElementById("cheatToolHint").innerHTML = "ヒント:答えは" + playerNumber +"より大きいです。";
            } else if (cheatTool === true && playerNumber > number) { //チートが有効で数字が大きい場合
                document.getElementById("cheatToolHint").innerHTML = "ヒント:答えは" + playerNumber +"より小さいです。";
            }

        } else if (number === playerNumber) { //数字の予想が正しい場合
            gameSunset();
        }

        currentRequest = "divisor";
        document.getElementById("currentRequest").innerHTML = "約数の予想を入力：";

    } else if (gameStatus === false) { // ゲームが実行されていない場合
        alert("ゲームが実行されていません。");

    } else if (isNaN(inputNumber)) { // 有効な数字が入力されていない場合
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

function ascendingOrder(arr) {
    return arr.sort(function (first, second) {
        if (first > second) {
            return 1;
        } else if (first < second) {
            return -1;
        } else {
            return 0;
        }
    });
}

function convertMillisecondsToTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
