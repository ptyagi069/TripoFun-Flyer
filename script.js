function createContainerHTML(service, index) {
    const isOddIndex = index % 2 !== 0;
  
    if (isOddIndex) {
      return `
        <div class="container" style="margin-bottom: 10px;">
          <div class="row">
            <div class="col-md-4" style="border: 0.5px solid #ECECEC; border-radius: 20px; display: flex; justify-content: center; align-items: center;background-color: #F9F9F9;">
              <img src="https://cms.tripoculture.com/${service.image}" alt="${service.servicE_NAME}" style="max-width: 100%; height: 220px; object-fit: cover; border-radius: 10px;">
            </div>
            <div class="col-md-8" style="border: 0.5px solid #ECECEC; border-radius: 20px; background-color: #F9F9F9;">
              <div class="activity">
                <h5>Activity ${index + 1}</h5>
                <div class="addon-info">
                  <p style="font-size: 22px; font-weight: 500; line-height: 26px; width: 50%;float: left;">${service.servicE_NAME}</p>
                  <span style="color: #00ACEA; font-weight: 700;  font-size: 26px; float: right;">@ $${service.guestAmount} only</span>
                </div>
              </div>
              <div class="time-days">
              <p style="font-weight: 700;"><img src="images/clock.png" alt="" style="width: 30px; height: 30px; margin-right: 5px;"> ${service.duration}</p>
              <p style="font-weight: 700;"><img src="images/sunset.png" alt="" style="width: 30px; height: 30px; margin-right: 5px;">add on Day ${service.nO_OF_DAYS}</p>
            </div>
              <div class="content">
                <p style="font-size: 18px; font-weight: 400; line-height: 21px; padding: 10px;">${service.servicE_DESCRIPTION}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="container" style="margin-bottom: 10px;">
          <div class="row">
            <div class="col-md-8" style="border: 0.5px solid #ECECEC; border-radius: 20px; background-color: #F9F9F9;">
              <div class="activity">
                <h5>Activity ${index + 1}</h5>
                <div class="addon-info" >
                  <p style="font-size: 22px; font-weight: 500; line-height: 26px; width: 50%; float:left;">${service.servicE_NAME}</p>
                  <span style="color: #00ACEA; font-weight: 700; line-height: 26px; float : right;  font-size: 26px;">@ $${service.guestAmount} only</span>
                </div>
              </div>
              <div class="time-days">
                <p style="font-weight: 700;"><img src="images/clock.png" alt="" style="width: 30px; height: 30px; margin-right: 5px;"> ${service.duration}</p>
                <p style="font-weight: 700;"><img src="images/sunset.png" alt="" style="width: 30px; height: 30px; margin-right: 5px;">add on Day ${service.nO_OF_DAYS}</p>
              </div>
              <div class="content">
                <p style="font-size: 18px; font-weight: 400; line-height: 21px; padding: 10px;">${service.servicE_DESCRIPTION}</p>
              </div>
            </div>
            <div class="col-md-4" style="border: 0.5px solid #ECECEC; border-radius: 20px; display: flex; justify-content: center; align-items: center;background-color: #F9F9F9;">
              <img src="https://cms.tripoculture.com/${service.image}" alt="${service.servicE_NAME}" style="max-width: 100%; height: 220px; object-fit: cover; border-radius: 10px;">
            </div>
          </div>
        </div>
      `;
    }
  }
  
  async function fetchAddOnsDetails() {
    const loaderContainer = document.getElementById('loader');
    loaderContainer.style.display = 'flex';
  
    const apiUrl = 'https://mobileapi.cultureholidays.com/api/Holidays/GetAddOnsDetails';
    const requestData = {
      agentID: 'CHAGT000004000',
      pkG_ID: '9',
      year: '2024'
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch add-ons details');
      }
  
      const data = await response.json();
      const containerSection = document.querySelector('#dynamic-containers');
      containerSection.innerHTML = '';
  
      const dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        const service = data[i];
        const container = createContainerHTML(service, i);
        containerSection.innerHTML += container;
      }
  
      loaderContainer.style.display = 'none';
    } catch (error) {
      console.error('Error fetching add-ons details:', error);
      loaderContainer.style.display = 'none';
    }
  }
  
  async function fetchAndDisplayQRCode() {
    const apiUrl = 'https://apidev.cultureholidays.com/api/Account/GenrateQr';
    const agentId = 'CHAGT000004000';
    const emailId = 'Ocean.odysseys23@gmail.com';
    const packageId = '9';
    const tourDate = '15/06/2024';
    const amount = '1234';
    const depositAmount = '123';
    const ipAddress = '::1';
    const requestBody = {};
  
    const queryString = new URLSearchParams({
      agentid: agentId,
      emailid: emailId,
      packageid: packageId,
      tourdate: tourDate,
      Amount: amount,
      DepositAmount: depositAmount,
      ipaddress: ipAddress,
    }).toString();
  
    const fullUrl = `${apiUrl}?${queryString}`;
  
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      if (data.success && data.message.startsWith('data:image/png;base64,')) {
        const base64ImageData = data.message.replace('data:image/png;base64,', '');
        const qrImage = new Image();
        qrImage.src = 'data:image/png;base64,' + base64ImageData;
        qrImage.style.width = '150px';
        qrImage.style.borderRadius = '14px'
        qrImage.style.zIndex = '100'
  
        const imageContainer = document.getElementById('qrCodeContainer');
        imageContainer.appendChild(qrImage);
      } else {
        console.error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  }
  
  async function initializeApp() {
    try {
      await Promise.all([fetchAddOnsDetails(), fetchAndDisplayQRCode()]);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
  
  initializeApp();
  
  
  function downloadPoster() {
    const posterDiv = document.querySelector('.a4-wrapper');

    html2canvas(posterDiv, {
        allowTaint: true,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
    }).then(canvas => {
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'poster.png';

        // Append link to body and trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up: remove the download link from the body
        document.body.removeChild(downloadLink);
    }).catch(error => {
        console.error('Error generating poster:', error);
    });
}

const downloadBtn = document.getElementById('downloadPosterBtn');
downloadBtn.addEventListener('click', downloadPoster);

