function downloadPDF() {
    window.print();
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        downloadPDF();
    }
});