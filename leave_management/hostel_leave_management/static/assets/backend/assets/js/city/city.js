let allCities = [];
let filteredCities = [];
let currentPage = 1;
let pageSize = 5;

function loadCities() {
    $.ajax({
        url: '/api/cities/',
        type: 'GET',
        success: function (response) {
            allCities = response;
            filteredCities = [...allCities];
            renderTable();
        },
        error: function () {
            $('#city_table tbody').html('<tr><td colspan="8" class="text-center text-danger">Error loading cities.</td></tr>');
        }
    });
}

function filterCities() {
    const searchCountry = $('#search_country_id').val();
    const searchState   = $('#search_state_id').val();
    const searchCity    = $('#search_city_id').val();
    const searchStatus  = $('#active_flag').val();

    filteredCities = allCities.filter(item => {
        const matchCountry = !searchCountry || item.country == searchCountry;
        const matchState = !searchState || item.state == searchState;
        const matchCity = !searchCity || item.id == searchCity;
        const matchStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchCountry && matchState && matchCity && matchStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    let total = filteredCities.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredCities.slice(start, end);

    $('#city_table tbody').empty();

    if (pageData.length === 0) {
        $('#city_table tbody').append('<tr><td colspan="8" class="text-center">No records found</td></tr>');
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
                        <li><a href='javascript:void(0)' onclick='editCity(${item.id})'><i class='fa fa-pencil'></i> Edit</a></li>
                        <li><a href='javascript:void(0)' onclick='viewCity(${item.id})'><i class='fa fa-eye'></i> View</a></li>
                        <li>${item.active_flag === 'Y'
                            ? `<a href='javascript:void(0)' onclick='toggleStatus(${item.id}, "N")'><i class="fa fa-ban"></i> Inactive</a>`
                            : `<a href='javascript:void(0)' onclick='toggleStatus(${item.id}, "Y")'><i class="fa fa-check"></i> Active</a>`}</li>
                    </ul>
                </div>
            </td>
            <td>${item.country_name || ''}</td>
            <td>${item.state_name || ''}</td>
            <td>${item.city_name}</td>
            <td>${item.description || ''}</td>
            <td>${statusBadge}</td>
        </tr>`;
        $('#city_table tbody').append(row);
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

$('#search_country_id, #search_state_id, #search_city_id, #active_flag').on('change', filterCities);

$('#cityForm').on('submit', function (e) {
    e.preventDefault();

    let id = $('#city_id').val();
    let url = '/api/cities/';
    let type = 'POST';
    let successMessage = 'City saved successfully.';

    if (id) {
        url += id + '/';
        type = 'PUT';
        successMessage = 'City updated successfully.';
    }

    const payload = {
        country: $('#country_id').val(),
        state: $('#state_id').val(),
        city_name: $('#city_name').val(),
        city_code: $('#city_code').val(),
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
            $('#cityForm')[0].reset();
            $('#city_id').val('');
            $('#page_title').html('<b>Add City</b>');
            loadCities();
        },
        error: function (xhr) {
            let errorMsg = 'Error saving city!';
            if (xhr.responseJSON && xhr.responseJSON.city_name) {
                errorMsg = xhr.responseJSON.city_name[0];
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

function editCity(id) {
    $.ajax({
        url: '/api/cities/' + id + '/',
        type: 'GET',
        success: function (data) {
            console.log(data);

            $('#page_title').html('<b>Edit City</b>');
            $('#city_id').val(data.id);
            $('#country_id').val(data.country);
            $('#city_name').val(data.city_name);
            $('#city_code').val(data.city_code);
            $('#description').val(data.description);

            // ✅ This will now properly call loadStates
            loadEditStates(data.country, data.state,'Edit');
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching city!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}  // ← must close function properly with a semicolon or nothing


function viewCity(id) {
    $.ajax({
        url: '/api/cities/' + id + '/',
        type: 'GET',
        success: function (data) {
            console.log(data);

            $('#page_title').html('<b>View City</b>');
            $('#city_id').val(data.id);
            $('#country_id').val(data.country).prop('disabled', true);;
            $('#city_name').val(data.city_name).prop('disabled', true);;
            $('#city_code').val(data.city_code).prop('disabled', true);;
            $('#description').val(data.description).prop('disabled', true);;

            // Load states for view
            loadEditStates(data.country, data.state, 'View');
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching city!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

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

function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/cities/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function () {
            let city = allCities.find(d => d.id === id);
            if (city) city.active_flag = newStatus;
            filterCities();
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

// Load states dynamically when country changes
$('#country_id').on('change', function () {
    const countryId     = $(this).val();
    const stateDropdown = $('#state_id');
    loadStates(countryId, stateDropdown);
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
function loadStates(countryId, stateDropdown) {
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
            },
            error: function () {
                stateDropdown.html('<option value="">Error loading states</option>');
            }
        });
    } else {
        stateDropdown.html('<option value="">- Select -</option>');
    }
}

function loadCityList(stateId, cityDropdown) {
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
            },
            error: function () {
                cityDropdown.html('<option value="">Error loading cities</option>');
            }
        });
    } else {
        cityDropdown.html('<option value="">- Select -</option>');
    }
}


$(document).ready(() => {
    pageSize = parseInt($('#pageSize').val());
    loadCities();
});
