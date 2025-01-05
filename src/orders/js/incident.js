window.onload = function () {

    const comment = document.getElementById('comment');
    const charCount = document.getElementById('charCount');
    comment.addEventListener('input', () => {
        charCount.textContent = comment.value.length;
    });
}