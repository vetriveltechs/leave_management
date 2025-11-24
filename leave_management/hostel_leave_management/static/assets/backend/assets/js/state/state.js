let allStates = [];
let filteredStates = [];
let currentPage = 1;
let pageSize = 5;

function loadStates() {
    $.ajax({
        url: '/api/states/',
        type: 'GET',
        success: function (response) {
            allStates = response;
            filteredStates = [...allStates];
            renderTable();
        },
        error: function () {
            $('#state_table tbody').html('<tr><td colspan="7" class="text-center text-danger">Error loading states.</td></tr>');
        }
    });
}

function filterStates() {
    const searchCountry = $('#search_country_id').val();
    const searchStateId = $('#search_state_id').val();
    const searchStatus = $('#active_flag').val();

    filteredStates = allStates.filter(item => {
        const matchCountry = !searchCountry || item.country == searchCountry;
        const matchState = !searchStateId || item.id == searchStateId;
        const matchStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchCountry && matchState && matchStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    let total = filteredStates.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredStates.slice(start, end);

    $('#state_table tbody').empty();

    if (pageData.length === 0) {
        $('#state_table tbody').append('<tr><td colspan="7" class="text-center">No records found</td></tr>');
        return;
    }

    pageData.forEach(item => {
        let statusBadge = item.active_flag === 'Y'
            ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
            : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>";

        let row = `
        <tr>
            <td>
                <div class='dropdown'>
                    <button class='btn btn-outline-info btn-sm dropdown-toggle' data-toggle='dropdown'>Action</button>
                    <ul class='dropdown-menu dropdown-menu-right'>
                        <li><a href='javascript:void(0)' onclick='editState(${item.id})'><i class='fa fa-pencil'></i> Edit</a></li>
                        <li><a href='javascript:void(0)' onclick='viewState(${item.id})'><i class='fa fa-eye'></i> View</a></li>
                        <li>${item.active_flag === 'Y'
                            ? `<a href='javascript:void(0)' onclick='toggleStatus(${item.id}, "N")'><i class="fa fa-ban"></i> Inactive</a>`
                            : `<a href='javascript:void(0)' onclick='toggleStatus(${item.id}, "Y")'><i class="fa fa-check"></i> Active</a>`}</li>
                    </ul>
                </div>
            </td>
            <td>${item.country_name || ''}</td>
            <td>${item.state_name}</td>
            <td>${item.state_code || ''}</td>
            <td>${item.state_number || ''}</td>
            <td>${item.description || ''}</td>
            <td>${statusBadge}</td>
        </tr>`;
        $('#state_table tbody').append(row);
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

$('#search_country_id, #search_state_id, #active_flag').on('change', filterStates);

$('#stateForm').on('submit', function (e) {
    e.preventDefault();

    let id = $('#state_id').val();
    let url = '/api/states/';
    let type = 'POST';
    let successMessage = 'State saved successfully.';

    if (id) {
        url += id + '/';
        type = 'PUT';
        successMessage = 'State updated successfully.';
    }

    const payload = {
        country: $('#country_id').val(),
        state_name: $('#state_name').val(),
        state_code: $('#state_code').val(),
        state_number: $('#state_number').val(),
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
            $('#stateForm')[0].reset();
            $('#state_id').val('');
            $('#page_title').html('<b>Create State</b>');
            loadStates();
        },
        error: function (xhr) {
            let errorMsg = 'Error saving state!';
            if (xhr.responseJSON && xhr.responseJSON.state_name) {
                errorMsg = xhr.responseJSON.state_name[0];
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

function editState(id) {
    $('.country_id').removeClass('errorClass');
    $('.state_name').removeClass('errorClass');
    $('.state_code').removeClass('errorClass');
    $('.state_number').removeClass('errorClass');
    $.ajax({
        url: '/api/states/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>Edit State</b>');
            $('#state_id').val(data.id);
            $('#country_id').val(data.country);
            $('#state_name').val(data.state_name);
            $('#state_code').val(data.state_code);
            $('#state_number').val(data.state_number);
            $('#description').val(data.description);
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching state!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function viewState(id) {
    $('.country_id').removeClass('errorClass');
    $('.state_name').removeClass('errorClass');
    $('.state_code').removeClass('errorClass');
    $('.state_number').removeClass('errorClass');
    $.ajax({
        url: '/api/states/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>View State</b>');
            $('#state_id').val(data.id);
            $('#country_id').val(data.country).prop('disabled', true);
            $('#state_name').val(data.state_name).prop('disabled', true);
            $('#state_code').val(data.state_code).prop('disabled', true);
            $('#state_number').val(data.state_number).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching state!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/states/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function () {
            let state = allStates.find(d => d.id === id);
            if (state) state.active_flag = newStatus;
            filterStates();
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

// Load States dynamically when a country is selected
$('#search_country_id').on('change', function () {
    const countryId = $(this).val();
    const stateDropdown = $('#search_state_id');
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
});

function saveBtn(val) {
    var country_id = $("#country_id").val();
    var state_name = $("#state_name").val();
    var state_code = $("#state_code").val();
    var state_number = $("#state_number").val();

    if (country_id!== "" && state_name.trim()!== "" && state_code.trim()!== "" && state_number.trim()!== "") {
        $(".country_id").removeClass('errorClass');
        $(".state_name").removeClass('errorClass');
        $(".state_code").removeClass('errorClass');
        $(".state_number").removeClass('errorClass');
        return true;
    } 

    else 
    {
        if (country_id === "") {
            $(".country_id").addClass('errorClass');
        } else {
            $(".country_id").removeClass('errorClass');
        }

        if (state_name.trim() === "") {
            $(".state_name").addClass('errorClass');
        } else {
            $(".state_name").removeClass('errorClass');
        }

        if (state_code.trim() === "") {
            $(".state_code").addClass('errorClass');
        } else {
            $(".state_code").removeClass('errorClass');
        }

        if (state_number.trim() === "") {
            $(".state_number").addClass('errorClass');
        } else {
            $(".state_number").removeClass('errorClass');
        }

        return false;
    }
}

$(document).ready(() => {
    pageSize = parseInt($('#pageSize').val());
    loadStates();
});
