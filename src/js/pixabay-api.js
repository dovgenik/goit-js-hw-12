import axios from 'axios';

export { axiosCall };

function axiosCall(text, pageN, pageL, thenCall) {
  if (pageN > 0 && pageL > 0) {
    document.querySelector('.loader').classList.toggle('visually-hidden');
    axios
      .get('https://pixabay.com/api/', {
        params: {
          key: '49309273-01bbbdbc5dd72a8afdb67bc06',
          q: text,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: pageN,
          per_page: pageL,
        },
      })
      .then(response => {
        thenCall(response.data.hits);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        document.querySelector('.loader').classList.toggle('visually-hidden');
      });
  }
}
