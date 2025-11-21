let people = JSON.parse(localStorage.getItem("nenga_people") || "[]");
let loadedImageFile = null;

// 画像読み込み
document.getElementById("imageInput").addEventListener("change", (e) => {
    loadedImageFile = e.target.files[0];
});

// 名簿追加
function addPerson() {
    const name = document.getElementById("nameInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();

    if (!name) {
        alert("名前を入力してください");
        return;
    }

    people.push({ name, message });
    savePeople();
    renderPeople();

    document.getElementById("nameInput").value = "";
    document.getElementById("messageInput").value = "";
}

// 保存
function savePeople() {
    localStorage.setItem("nenga_people", JSON.stringify(people));
}

// 名簿描画
function renderPeople() {
    const list = document.getElementById("personList");
    list.innerHTML = "";

    people.forEach((p, i) => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded-xl shadow flex flex-col gap-2";

        div.innerHTML = `
      <div class="text-lg font-semibold">${p.name}</div>
      <div class="text-neutral-700">${p.message ? p.message : "（メッセージなし）"}</div>

      <div class="flex gap-2 mt-2">
        <button
          onclick="sharePerson(${i})"
          class="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
        >
          共有
        </button>
        <button
          onclick="deletePerson(${i})"
          class="flex-1 py-2 bg-neutral-400 text-white rounded-lg font-semibold hover:bg-neutral-500"
        >
          削除
        </button>
      </div>
    `;

        list.appendChild(div);
    });
}

function deletePerson(i) {
    if (!confirm("削除しますか？")) return;
    people.splice(i, 1);
    savePeople();
    renderPeople();
}

// 共有
async function sharePerson(index) {
    if (!loadedImageFile) {
        alert("先に画像を読み込んでください");
        return;
    }

    const person = people[index];
    const text = person.message
        ? `${person.name}さん\n${person.message}`
        : `${person.name}さん`;

    try {
        await navigator.share({
            files: [loadedImageFile],
            text,
        });
    } catch (e) {
        console.error("共有エラー:", e);
    }
}

// CSVエクスポート
function exportCSV() {
    const rows = ["name,message"];
    people.forEach(p => {
        const escaped = p.message.replace(/"/g, '""');
        rows.push(`"${p.name}","${escaped}"`);
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nenga_backup.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// CSVインポート
function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const lines = reader.result.split("\n").slice(1);
        const newPeople = [];

        lines.forEach(line => {
            if (!line.trim()) return;
            const parts = line.match(/"([^"]*)","([^"]*)"/);
            if (parts) {
                newPeople.push({
                    name: parts[1],
                    message: parts[2],
                });
            }
        });

        people = newPeople;
        savePeople();
        renderPeople();
        alert("CSVを読み込みました");
    };
    reader.readAsText(file);
}

renderPeople();
