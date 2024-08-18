function run_check() {
    let data = 0;
    let result = false;

    data = parseInt(document.getElementById("inputNumber").value);
    result = is_prime(data);

    document.getElementById("result").innerHTML = "is prime:" + result;
    document.getElementById("time").innerHTML = "last test:" + Date();

    if (result == true) {
        console.log("This is prime:" + data);
    }
}

function is_prime(number) {
    if (number <= 1) {
        return false;
    }
    if (number == 2 || number == 3) {
        return true;
    }
    if (number % 2 == 0 || number % 3 == 0) {
        return false;
    }

    let i = 5;
    while (i * i <= number) {
        if (number % i == 0 || number % (i + 2) == 0) {
            return false;
        }
        i += 6;
    }

    return true;

}