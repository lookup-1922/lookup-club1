let currentQuestionIndex = 0; // 現在の問題番号を保持する変数
let result = []; //結果を保持する配列

$(document).ready(function () {
    displayWelcome(); //最初の表示処理

    // questionListのクリックイベントの設定
    $(".questionList").on("click", "li", function () {
        let index = $(this).index(); // クリックされたリストのインデックスを取得
        displayQuestion(index); // クリックされた問題を表示
        currentQuestionIndex = index; // 現在の問題番号を更新
    });
});

// 最初の説明の表示
function displayWelcome() {
    currentQuestionIndex = 0;
    result = Array(questions.length).fill(-1);
    $(".content, .answer, .selection, .questionList").empty();
    $(".content").html("右下の「次の問題へ」を押してスタートしてね。");
    $(".answer").html("解答表示エリア");
    $(".questionList").html("問題リスト");
    $("#next").off("click").click(function () {
        displayQuestionList(); // qustionListを表示
        displayQuestion(0);
    });
}

function displayQuestion(index) {
    let questionData = questions[index];
    $(".content").html(questionData.question); // 問題の表示
    $(".answer").html("回答の待機中です。");
    $(".selection").empty(); // 選択肢をクリア
    // 選択肢を表示
    for (let i = 0; i < questionData.choices.length; i++) {
        $(".selection").append("<p><button class=\"choice\">" + questionData.choices[i] + "</button></p>");
    }
    answeringQuestion(questionData);
}

function answeringQuestion(questionData) {
    // 選択肢のボタンがクリックされた時の処理
    $(".choice").click(function () {
        let selectedAnswer = $(".choice").index(this); // 選択された選択肢のインデックス
        let explanation = "あなたの回答：" + questionData.choices[selectedAnswer] + "<br>" + questionData.explanation;
        if (selectedAnswer === questionData.correctAnswer) {
            $(".answer").html("正解(OK)<br>" + explanation); // 正解の場合の表示
            result[currentQuestionIndex] = true;
        } else {
            $(".answer").html("不正解(NG)<br>" + explanation); // 不正解の場合の表示
            result[currentQuestionIndex] = false;
        }
        $(".selection").empty();
    });
    // 「次へ」ボタンのクリックイベントの設定
    $("#next").off("click").click(function () {
        toNext();
    });
}

function toNext() {
    currentQuestionIndex++; // 現在の問題番号をインクリメント
    if (currentQuestionIndex < result.length) { // 次の問題があるかチェック
        displayQuestion(currentQuestionIndex); // 次の問題を表示
    } else if (result.indexOf(-1) === -1) {
        let existCheck = window.confirm("これが最後の問題です。終了しますか？"); // 最後の問題の場合はアラートを表示
        if (existCheck == true) {
            displayResult();
        } else {
            currentQuestionIndex = result.length - 1; // 現在の問題番号を最後の問題の番号に設定
        }
    } else {
        alert("未回答の問題があります。");
        currentQuestionIndex = result.indexOf(-1); // 現在の問題番号を最後の問題の番号に設定
        displayQuestion(currentQuestionIndex);
    }
}

// questionListの表示
function displayQuestionList() {
    $(".questionList").empty(); // Qlistをクリア
    // 各問題のタイトルをQlistに追加
    for (let i = 0; i < questions.length; i++) {
        $(".questionList").append("<li>" + "問題" + (i + 1) + "</li>"); // 問題の番号を表示
    }
}

// 結果の表示
function displayResult() {
    currentQuestionIndex = 0;
    let countTrue = result.filter(value => value === true).length;
    let resultReport = countTrue / result.length * 100 + "%";
    $(".content, .answer, .selection, .questionList").empty();
    $(".content").html("あなたのスコア：" + resultReport);
    $(".answer").html("おめでとう");
    $(".questionList").html("問題リスト");
    $("#next").off("click").click(function () {
        displayWelcome();
    });
}