$(document).ready(function () {
  $.get('http://' + window.location.hostname + ':5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
        $('#api_status').addClass('available');
    } else {
        $('#api_status').removeClass('available');
    }
  });

  let selectedAmenities = {};

   $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if (this.checked) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }

    const amenityList = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenityList);
  });

  function fetchPlaces(data) {
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        data.forEach(place => {
          const article = $('<article></article>');
          const titleBox = $('<div></div>').addClass('title_box');
          const title = $('<h2></h2>').text(place.name);
          const price = $('<div></div>').addClass('price_by_night').text(`$${place.price_by_night}`);
          titleBox.append(title).append(price);

          const information = $('<div></div>').addClass('information');
          const maxGuests = $('<div></div>').addClass('max_guest').text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`);
          const numberRooms = $('<div></div>').addClass('number_rooms').text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`);
          const numberBathrooms = $('<div></div>').addClass('number_bathrooms').text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`);
          information.append(maxGuests).append(numberRooms).append(numberBathrooms);

          const description = $('<div></div>').addClass('description').html(place.description);
          article.append(titleBox).append(information).append(description);
          $('.places').append(article);
        });
      }
    });
  }

  fetchPlaces({});
  $('button').click(function () {
      const amenities = Object.keys(selectedAmenities);
      fetchPlaces({ amenities: amenities });
  });
});
