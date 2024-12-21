// ユーザーのテーマ設定を検出
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 現在のテーマを保持する
let currentTheme = systemTheme ? 'dark' : 'light';

// 初期テーマを適用
document.body.classList.toggle('dark-mode', currentTheme === 'dark');

// テーマを切り替える関数
function toggleTheme() {
    currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', currentTheme === 'dark');
}

// コンソールで操作方法を表示
console.log("ライトモードとダークモードを切り替えるには以下をコンソールに入力してください:");
console.log("1. ライトモードに切り替え: document.body.classList.remove('dark-mode')");
console.log("2. ダークモードに切り替え: document.body.classList.add('dark-mode')");