document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const formData = new FormData();
  
    formData.append('file', file);
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/upload');
    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        console.log(progress)
        updateProgress(progress);
      }
    };
  
    xhr.onload = function() {
      if (xhr.status === 201) {
        console.log('File uploaded successfully!');
        updateProgress(100);
      } else {
        console.error('Error uploading file. Status:', xhr.status);
      }
    };
  
    xhr.onerror = function() {
      console.error('Error uploading file. Network error.');
    };
  
    xhr.send(formData);
  });
  
  function updateProgress(progress) {
    const progressBar = document.getElementById('progress');
    
    const updateInterval = 10;
    let currentValue = parseFloat(progressBar.value);
  
    if (isNaN(currentValue)) {
      currentValue = 0;
    }
  
    const increment = (progress - currentValue) / (1000 / updateInterval);
  
    const interval = setInterval(() => {
      currentValue += increment;
      progressBar.value = currentValue.toFixed(2);
  
      if (currentValue >= progress) {
        clearInterval(interval);
      }
    }, updateInterval);
  }