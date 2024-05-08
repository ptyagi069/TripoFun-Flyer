function downloadPoster() {
    const posterDiv = document.querySelector('.a4-wrapper');

    html2canvas(posterDiv).then(canvas => {
        const dataUrl = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'poster.png'; 

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
    });
}

const downloadBtn = document.getElementById('downloadPosterBtn');
downloadBtn.addEventListener('click', downloadPoster);