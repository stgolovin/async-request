document.addEventListener('DOMContentLoaded', () => {
  const pollTitle = document.getElementById('poll__title');
  const pollAnswers = document.getElementById('poll__answers');
  let currentPollId; 
  
  function displayPollQuestion(pollData) {
    pollTitle.innerText = pollData.title;

    pollAnswers.innerHTML = '';
    pollData.answers.forEach((answer, index) => {
      const answerButton = document.createElement('button');
      answerButton.classList.add('poll__answer');
      answerButton.innerText = answer;

      answerButton.addEventListener('click', () => {
        castVote(currentPollId, index);
        displayResults(currentPollId);
        answerButton.style.backgroundColor = 'blue';
        answerButton.style.color = 'white';
      });

      pollAnswers.appendChild(answerButton);
    });
  }

  function displayThankYouMessage() {
    alert('Спасибо, ваш голос засчитан!');
  }

  function castVote(pollId, answerIndex) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/poll');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
      if (xhr.status === 201) {
        displayThankYouMessage();
      } else {
        console.error('Error casting vote. Status:', xhr.status);
      }
    };

    xhr.onerror = function () {
      console.error('Error casting vote. Network error.');
    };

    const params = `vote=${pollId}&answer=${answerIndex}`;
    xhr.send(params);
  }

  function displayResults(pollId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/poll');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
      if (xhr.status === 201) {
        const response = JSON.parse(xhr.responseText);
        console.log(response.stat)
        displayResultsOnScreen(response.stat);
      } else {
        console.error('Error getting voting results. Status:', xhr.status);
      }
    };

    xhr.onerror = function () {
      console.error('Error getting voting results. Network error.');
    };

    const params = `vote=${pollId}&answer=all`;
    xhr.send(params);
  }

  function displayResultsOnScreen(results) {
    pollAnswers.innerHTML = '';

    results.forEach((result) => {
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
  
      const votesPercentage = document.createElement('span');
      votesPercentage.innerText = `${result.answer}: ${Math.round((result.votes / getTotalVotes(results)) * 100)}%`;
     
      resultItem.appendChild(votesPercentage);
      pollAnswers.appendChild(resultItem);
    });
  }
  
  function getTotalVotes(results) {
    let totalVotes = 0;
    results.forEach((result) => {
      totalVotes += result.votes;
    });
    return totalVotes;
  }

  function loadPollData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/poll');

    xhr.onload = function () {
      if (xhr.status === 200) {
        const pollData = JSON.parse(xhr.responseText);
        displayPollQuestion(pollData.data);
        currentPollId = pollData.id;
      } else {
        console.error('Error loading poll data. Status:', xhr.status);
      }
    };

    xhr.onerror = function () {
      console.error('Error loading poll data. Network error.');
    };

    xhr.send();
  }

  loadPollData();
});
