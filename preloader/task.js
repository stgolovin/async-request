document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const itemsContainer = document.getElementById('items');
  
    function showLoader() {
      loader.classList.add('loader_active');
    }
  
    function hideLoader() {
      loader.classList.remove('loader_active');
    }
  
    function loadCurrencyData() {
      showLoader();
  
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/slow-get-courses', true);
  
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
  
            for (const currencyCode in data.response.Valute) {
              const currency = data.response.Valute[currencyCode];
              const item = document.createElement('div');
              item.classList.add('item');
  
              const itemCode = document.createElement('div');
              itemCode.classList.add('item__code');
              itemCode.textContent = currency.CharCode;
              item.appendChild(itemCode);
  
              const itemValue = document.createElement('div');
              itemValue.classList.add('item__value');
              itemValue.textContent = currency.Value;
              item.appendChild(itemValue);
  
              const itemCurrency = document.createElement('div');
              itemCurrency.classList.add('item__currency');
              itemCurrency.textContent = 'руб.';
              item.appendChild(itemCurrency);
  
              itemsContainer.appendChild(item);
            }
  
            hideLoader();
          } catch (error) {
            console.error('Error parsing JSON:', error);
            hideLoader();
          }
        } else {
          console.error('Error loading currency data. Status:', xhr.status);
          hideLoader();
        }
      };
  
      xhr.onerror = function () {
        console.error('Error loading currency data. Network error.');
        hideLoader();
      };
  
      xhr.send();
    }
  
    loadCurrencyData();
  });
  