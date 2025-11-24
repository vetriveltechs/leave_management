let allLocations = [];
let filteredLocations = [];
let currentPage = 1;
let pageSize = 5;

function loadLocations() {
    $.ajax({
        url: '/api/locations/',
        type: 'GET',
        success: function (response) {
            allLocations = response;
            filteredLocations = [...allLocations];
            renderTable();
        },
        error: function () {
            $('#location_table tbody').html('<tr><td colspan="8" class="text-center text-danger">Error loading locations.</td></tr>');
        }
    });
}

function filterLocations() {
    const searchCountry = $('#search_country_id').val();
    const searchState   = $('#search_state_id').val();
    const searchCity    = $('#search_city_id').val();
    const searchStatus  = $('#active_flag').val();

    filteredLocations = allLocations.filter(item => {
        const matchCountry = !searchCountry || item.country == searchCountry;
        const matchState = !searchState || item.state == searchState;
        const matchCity = !searchCity || item.city == searchCity;
        const matchStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchCountry && matchState && matchCity && matchStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    let total = filteredLocations.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredLocations.slice(start, end);

    $('#location_table tbody').empty();

    if (pageData.length === 0) {
        $('#location_table tbody').append('<tr><td colspan="8" class="text-center">No records found</td></tr>');
        return;
    }

    pageData.forEach(item => {
        let statusBadge = item.active_flag === 'Y'
            ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
            : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>";

        let row = `
        <tr>
            <td class="text-center">
                <div class='dropdown'>
                    <button class='btn btn-outline-info btn-sm dropdown-toggle' data-toggle='dropdown'>Action</button>
                    <ul class='dropdown-menu dropdown-menu-right'>
                        <li><a href='javascript:void(0)' onclick='editLocation(${item.id})'><i class='fa fa-pencil'></i> Edit</a></li>
                        <li><a href='javascript:void(0)' onclick='viewLocation(${item.id})'><i class='fa fa-eye'></i> View</a></li>
                        <li>${item.active_flag === 'Y'
                            ? `<a href='javascript:void(0)' onclick='toggleStatus(${item.id}, "N")'><i class="fa fa-ban"></i> Inactive</a>`
                            : `<a href='javascript:void(0)' onclick='toggleStatus(${item.id}, "Y")'><i class="fa fa-check"></i> Active</a>`}</li>
                    </ul>
                </div>
            </td>
            <td>${item.country_name || ''}</td>
            <td>${item.state_name || ''}</td>
            <td>${item.city_name || ''}</td>
            <td>${item.location_name}</td>
            <td>${item.description || ''}</td>
            <td>${statusBadge}</td>
        </tr>`;
        $('#location_table tbody').append(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (totalPages <= 1) {
        $('#pagination').empty();
        return;
    }

    let html = `<nav><ul class="pagination pagination-sm justify-content-end">`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a href="#" class="page-link page-num" data-page="${i}">${i}</a>
                 </li>`;
    }
    html += `</ul></nav>`;
    $('#pagination').html(html);
}

$(document).on('click', '.page-num', function (e) {
    e.preventDefault();
    currentPage = parseInt($(this).data('page'));
    renderTable();
});

$('#pageSize').on('change', function () {
    pageSize = parseInt($(this).val());
    renderTable();
});

$('#search_country_id, #search_state_id, #search_city_id, #active_flag').on('change', filterLocations);

$('#locationForm').on('submit', function (e) {
    e.preventDefault();

    let id = $('#location_id').val();
    let url = '/api/locations/';
    let type = 'POST';
    let successMessage = 'Location saved successfully.';

    if (id) {
        url += id + '/';
        type = 'PUT';
        successMessage = 'Location updated successfully.';
    }

    const payload = {
        country: $('#country_id').val(),
        state: $('#state_id').val(),
        city: $('#city_id').val(),
        location_name: $('#location_name').val(),
        description: $('#description').val()
    };

    $.ajax({
        url: url,
        type: type,
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(payload),
        success: function () {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: successMessage,
                showConfirmButton: false,
                timer: 3000
            });
            $('#locationForm')[0].reset();
            $('#location_id').val('');
            $('#page_title').html('<b>Create Location</b>');
            loadLocations();
        },
        error: function (xhr) {
            let errorMsg = 'Error saving location!';
            if (xhr.responseJSON && xhr.responseJSON.location_name) {
                errorMsg = xhr.responseJSON.location_name[0];
            }
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: errorMsg,
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
});

function editLocation(id) {
    $('.country_id').removeClass('errorClass');
    $('.state_id').removeClass('errorClass');
    $('.city_id').removeClass('errorClass');
    $('.location_name').removeClass('errorClass');
    $.ajax({
        url: '/api/locations/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>Edit Location</b>');
            $('#location_id').val(data.id);
            $('#country_id').val(data.country);
            $('#location_name').val(data.location_name);
            $('#description').val(data.description);

            loadEditStates(data.country, data.state, 'Edit');

            loadEditCities(data.country, data.state, data.city, 'Edit');
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching location!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function viewLocation(id) {
    $('.country_id').removeClass('errorClass');
    $('.state_id').removeClass('errorClass');
    $('.city_id').removeClass('errorClass');
    $('.location_name').removeClass('errorClass');
    $.ajax({
        url: '/api/locations/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>View Location</b>');
            $('#location_id').val(data.id);
            $('#country_id').val(data.country).prop('disabled', true);
            $('#location_name').val(data.location_name).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);

            loadEditStates(data.country, data.state, data.city, 'View');

            loadEditCities(data.country, data.state, data.city, 'View');
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching location!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}



function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/locations/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function () {
            let loc = allLocations.find(d => d.id === id);
            if (loc) loc.active_flag = newStatus;
            filterLocations();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error updating status!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

// Cascading dropdowns
$('#country_id').on('change', function () {
    const countryId     = $(this).val();
    const stateDropdown = $('#state_id');
    loadStates(countryId, stateDropdown);
});

$('#state_id').on('change', function () {
    const stateId       = $(this).val();
    const cityDropdown  = $('#city_id');
    loadCityList(stateId, cityDropdown);
});

// When search country changes → load search_state_id
$('#search_country_id').on('change', function () {
    const countryId         = $(this).val();
    const stateDropdown     = $('#search_state_id');
    const cityDropdown      = $('#search_city_id');
    cityDropdown.html('<option value="">- Select -</option>');
    loadStates(countryId, stateDropdown);
});

$('#search_state_id').on('change', function () {
    const stateId       = $(this).val();
    const cityDropdown  = $('#search_city_id');
    loadCityList(stateId, cityDropdown);
});

// Common reusable function
function loadStates(countryId, stateDropdown, selectedState = null, selectedCity = null, mode = null) {
    stateDropdown.html('<option value="">Loading...</option>');

    if (countryId) {
        $.ajax({
            url: '/get_states_by_country',
            type: 'GET',
            data: { country_id: countryId },
            success: function (response) {
                stateDropdown.empty().append('<option value="">- Select -</option>');
                if (response.states && response.states.length > 0) {
                    response.states.forEach(state => {
                        stateDropdown.append(`<option value="${state.id}">${state.state_name}</option>`);
                    });
                } else {
                    stateDropdown.append('<option value="">No states found</option>');
                }

                // ✅ Auto-select state if provided
                if (selectedState) {
                    stateDropdown.val(selectedState);
                    const cityDropdown = (mode === 'Edit' || mode === 'View') ? $('#city_id') : $('#search_city_id');
                    loadCityList(selectedState, cityDropdown, selectedCity);
                }
            },
            error: function () {
                stateDropdown.html('<option value="">Error loading states</option>');
            }
        });
    } else {
        stateDropdown.html('<option value="">- Select -</option>');
    }
}


function loadCityList(stateId, cityDropdown, selectedCity = null) {
    cityDropdown.html('<option value="">Loading...</option>');

    if (stateId) {
        $.ajax({
            url: '/get_cities_by_state',
            type: 'GET',
            data: { state_id: stateId },
            success: function (response) {
                cityDropdown.empty().append('<option value="">- Select -</option>');
                if (response.cities && response.cities.length > 0) {
                    response.cities.forEach(city => {
                        cityDropdown.append(`<option value="${city.id}">${city.city_name}</option>`);
                    });
                } else {
                    cityDropdown.append('<option value="">No cities found</option>');
                }

                // ✅ Auto-select city if provided
                if (selectedCity) cityDropdown.val(selectedCity);
            },
            error: function () {
                cityDropdown.html('<option value="">Error loading cities</option>');
            }
        });
    } else {
        cityDropdown.html('<option value="">- Select -</option>');
    }
}

function saveBtn(val) {
    var country_id      = $("#country_id").val();
    var state_id        = $("#state_id").val();
    var city_id         = $("#city_id").val();
    var location_name   = $("#location_name").val();

    if (country_id!== "" && state_id!== "" && city_id!== "" && location_name.trim()!== "") {
        $(".country_id").removeClass('errorClass');
        $(".state_id").removeClass('errorClass');
        $(".city_id").removeClass('errorClass');
        $(".location_name").removeClass('errorClass');
        return true;
    } 

    else 
    {
        if (country_id === "") {
            $(".country_id").addClass('errorClass');
        } else {
            $(".country_id").removeClass('errorClass');
        }

        if (state_id === "") {
            $(".state_id").addClass('errorClass');
        } else {
            $(".state_id").removeClass('errorClass');
        }

        if (city_id === "") {
            $(".city_id").addClass('errorClass');
        } else {
            $(".city_id").removeClass('errorClass');
        }

        if (location_name.trim() === "") {
            $(".location_name").addClass('errorClass');
        } else {
            $(".location_name").removeClass('errorClass');
        }

        return false;
    }
}


$(document).ready(() => {
    pageSize = parseInt($('#pageSize').val());
    loadLocations();
});


function loadEditStates(countryId, selectedStateId = '', mode) {
    if (!countryId) {
        $('#state_id').html('<option value="">Select State</option>');
        return;
    }

    $.ajax({
        url: '/api/states/?country_id=' + countryId,
        type: 'GET',
        success: function (response) {
            let stateOptions = '<option value="">Select State</option>';
            response.forEach(state => {
                stateOptions += `<option value="${state.id}">${state.state_name}</option>`;
            });

            $('#state_id').html(stateOptions);

            if (selectedStateId) {
                if(mode=='Edit') 
                {
                    $('#state_id').val(selectedStateId);
                }
                else if(mode=='View')
                {
                    $('#state_id').val(selectedStateId).prop('disabled', true);
                }
            }
        },
        error: function () {
            $('#state_id').html('<option value="">Error loading states</option>');
        }
    });
}


function loadEditCities(country_id, state_id, selectedCityId = '', mode) {
    if (!state_id) {
        $('#city_id').html('<option value="">Select City</option>');
        return;
    }

    $.ajax({
        url: '/api/cities/?country_id=' + country_id + '&state_id=' + state_id,
        type: 'GET',
        success: function (response) {
            let cityOptions = '<option value="">Select City</option>';
            response.forEach(city => {
                cityOptions += `<option value="${city.id}">${city.city_name}</option>`;
            });

            $('#city_id').html(cityOptions);

            if (selectedCityId) {
                if (mode === 'Edit') {
                    $('#city_id').val(selectedCityId);
                } else if (mode === 'View') {
                    $('#city_id').val(selectedCityId).prop('disabled', true);
                }
            }
        },
        error: function () {
            $('#city_id').html('<option value="">Error loading cities</option>');
        }
    });
}
