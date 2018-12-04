class Zomato {
  constructor() {
    this.api = 'f34b3e406a6b3fb10e07db48adb87928';
    this.header = {
      method: 'GET',
      headers: {
        'user-key': this.api,
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    };
  }
  async searchAPI(city, categoryID) {
    
    //category url
    const categoryURL = 'https://developers.zomato.com/api/v2.1/categories';
    //CITY URL
    const cityURL = 'https://developers.zomato.com/api/v2.1/cities?q= £(city)';

    //category data
    const categoryInfo = await fetch(categoryURL, this.header);
    const categoryJSON = await categoryInfo.json();
    const categories = await categoryJSON.categories;
    //search city
    const cityInfo = await fetch(cityURL, this.header);
    const cityJSON = await cityInfo.json();
    const cityLocation = await cityJSON.location_suggestions;

    let cityID = 0;

    if (cityLocation.length > 0) {
      cityID = await cityLocation[0].id
    }

    return {
      categories,
      cityID
    };


  }
}
class UI {
  constructor() {
    this.loader = document.querySelector('.loader');
    this.resterauntList = document.getElementById('restaurant-list')
  }
  addSelectOptions(categories) {
    const search = document.getElementById('searchCategory');
    let output = `<option value='0' selected>select category</option>`;
    categories.forEach(category => {
      output += `<option value="${category.categories.id}">${category.categories.name}
</option>`
    })
    search.innerHTML = output;
  }
  showFeedback(text) {
    const feedback = document.querySelector('.feedback');
    feedback.classList.add('showItem');
    feedback.innerHTML = `<p>enter values</p>`;
    setTimeout(() => {
      feedback.classList.remove('showItem');
    }, 3000)
  }

}
(function() {
  const searchForm = document.getElementById('searchForm');
  const searchCity = document.getElementById('searchCity');
  const searchCategory = document.getElementById('searchCategory');

  const zomato = new Zomato();

  const ui = new UI();

  //add select options
  document.addEventListener('DOMContentLoaded', () => {
    //logic goes here
    zomato.searchAPI().then(data => ui.addSelectOptions(data.categories));
  });

  //submit form
  searchForm.addEventListener('submit', event => {
    event.preventDefault();

    const city = searchCity.value.toLowerCase();
    const categoryID = parseInt(searchCategory.value);

    if (city === '' || categoryID === 0) {

      ui.showFeedback('please enter a city and select catagory')
    } else {
      //logic goes here
      zomato.searchAPI(city).then(cityData => {
        console.log(cityData);
      })


    }


  })

})();