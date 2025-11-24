let allCountries = [];
let filteredCountries = [];
let currentPage = 1;
let pageSize = 5;

function loadCountries() {
    $.ajax({
        url: '/api/countries/',
        type: 'GET',
        success: function (response) {
            allCountries = response;
            filteredCountries = [...allCountries];
            renderTable();
        },
        error: function () {
            $('.line-items-error').text('Error loading country.').show().delay(2000).fadeOut(1000);
        }
    });
}

function filterCountries() {
    const name = $('#search_country_name').val().toLowerCase();
    const status = $('#active_flag').val();

    filteredCountries = allCountries.filter(c =>
        c.country_name.toLowerCase().includes(name) &&
        (status === 'ALL' || c.active_flag === status)
    );
    currentPage = 1;
    renderTable();
}

function renderTable() {
    const total = filteredCountries.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredCountries.slice(start, end);

    const tbody = $('#country_table tbody');
    tbody.empty();

    if (data.length === 0) {
        tbody.append('<tr><td colspan="6" class="text-center">No records found</td></tr>');
        return;
    }

    data.forEach(item => {
        const flagImg = item.country_flag
            ? `<img src="${item.country_flag}" width="40">`
            : '-';
        const actionMenu = `
            <div class="dropdown">
                <button type="button" class="btn btn-outline-info dropdown-toggle btn-sm" data-toggle="dropdown">
                    Action <i class="fa fa-chevron-down"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-right dropdown-menu-new">
                    <li>
                        <a href="javascript:void(0);" onclick="editCountry(${item.id})">
                            <i class="fa fa-pencil"></i> Edit
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);" onclick="viewCountry(${item.id})">
                            <i class="fa fa-eye"></i> View
                        </a>
                    </li>
                    <li>
                        ${item.active_flag === 'Y'
                            ? `<a href="javascript:void(0);" onclick="toggleStatus(${item.id}, 'N')">
                                <i class="fa fa-ban"></i> Inactive
                            </a>`
                            : `<a href="javascript:void(0);" onclick="toggleStatus(${item.id}, 'Y')">
                                <i class="fa fa-check"></i> Active
                            </a>`}
                    </li>
                </ul>
            </div>`;

        const row = `
            <tr>
                <td class="text-center">${actionMenu}</td>
                <td>${item.country_name}</td>
                <td>${item.country_code || ''}</td>
                <td>${item.currency_symbol || ''} ${item.currency_code || ''}</td>
                <td>${flagImg}</td>
                <td>${item.active_flag === 'Y' ? 'Active' : 'Inactive'}</td>
            </tr>`;

        tbody.append(row);
    });


    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    if (totalPages <= 1) return $('#pagination').empty();

    let html = '<ul class="pagination pagination-sm justify-content-end">';
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a href="#" class="page-link page-num" data-page="${i}">${i}</a>
                 </li>`;
    }
    html += '</ul>';
    $('#pagination').html(html);
}

$(document).on('click', '.page-num', function (e) {
    e.preventDefault();
    currentPage = parseInt($(this).data('page'));
    renderTable();
});

$('#search_country_name, #active_flag').on('input change', filterCountries);

$('#countryForm').on('submit', function (e) {
    e.preventDefault();
    const id = $('#country_id').val();
    const formData = new FormData();
    formData.append('country_name', $('#country_name').val());
    formData.append('country_code', $('#country_code').val());
    formData.append('currency_symbol', $('#currency_symbol').val());
    formData.append('currency_code', $('#currency_code').val());
    if ($('#country_flag')[0].files[0]) {
        formData.append('country_flag', $('#country_flag')[0].files[0]);
    }

    const url = id ? `/api/countries/${id}/` : '/api/countries/';
    const type = id ? 'PUT' : 'POST';

    $.ajax({
        url,
        type,
        headers: { 'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val() },
        processData: false,
        contentType: false,
        data: formData,
        success: function () {
            Swal.fire({ icon: 'success', title: 'Country Saved successfully', toast: true, position: 'top', timer: 2000, showConfirmButton: false });
            $('#countryForm')[0].reset();
            $('#country_id').val('');
            $('#flag_preview').html('');
            $('#country_flag').val('');
            $('#page_title').html('<b>Create Country</b>');
            loadCountries();
        },
        error: function (xhr) {
            const msg = xhr.responseJSON?.country_name?.[0] || 'Error saving country';
            Swal.fire({ icon: 'error', title: msg, toast: true, position: 'top', timer: 2000, showConfirmButton: false });
        }
    });
});

function editCountry(id) {
    $('.country_name').removeClass('errorClass');
    $('.country_code').removeClass('errorClass');
    $('.currency_symbol').removeClass('errorClass');
    $('.currency_code').removeClass('errorClass');
    $.get(`/api/countries/${id}/`, function (data) {
        $('#page_title').html('<b>Edit Country</b>');
        $('#country_id').val(data.id);
        $('#country_name').val(data.country_name);
        $('#country_code').val(data.country_code);
        $('#currency_symbol').val(data.currency_symbol);
        $('#currency_code').val(data.currency_code);
        if (data.country_flag)
            $('#flag_preview').html(`<img src="${data.country_flag}" width="80">`);
    });
}

function viewCountry(id) {
    $('.country_name').removeClass('errorClass');
    $('.country_code').removeClass('errorClass');
    $('.currency_symbol').removeClass('errorClass');
    $('.currency_code').removeClass('errorClass');
    $.get(`/api/countries/${id}/`, function (data) {
        $('#page_title').html('<b>View Country</b>');
        $('#country_id').val(data.id);
        $('#country_name').val(data.country_name).prop('disabled', true);
        $('#country_code').val(data.country_code).prop('disabled', true);
        $('#currency_symbol').val(data.currency_symbol).prop('disabled', true);
        $('#currency_code').val(data.currency_code).prop('disabled', true);
        if (data.country_flag)
            $('#flag_preview').html(`<img src="${data.country_flag}" width="80">`);
        $('#save_btn').hide();
    });
}

function saveBtn(val) {
    var country_name    = $("#country_name").val();
    var country_code    = $("#country_code").val();
    var currency_symbol = $("#currency_symbol").val();
    var currency_code   = $("#currency_code").val();

    if (country_name.trim() !== "" && country_code.trim() !== "" && currency_symbol.trim() !== "" && currency_code.trim() !== "") {
        $(".country_name").removeClass('errorClass');
        $(".country_code").removeClass('errorClass');
        $(".currency_symbol").removeClass('errorClass');
        $(".currency_code").removeClass('errorClass');
        return true;
    } 

    else 
    {
        if (country_name.trim() === "") {
            $(".country_name").addClass('errorClass');
        }
        else
        {
            $(".country_name").removeClass('errorClass');
        }

        if (country_code.trim() === "") {
            $(".country_code").addClass('errorClass');
        }
        else
        {
            $(".country_code").removeClass('errorClass');
        }

        if (currency_symbol.trim() === "") {
            $(".currency_symbol").addClass('errorClass');
        }
        else
        {
            $(".currency_symbol").removeClass('errorClass');
        }

        if (currency_code.trim() === "") {
            $(".currency_code").addClass('errorClass');
        }
        else
        {
            $(".currency_code").removeClass('errorClass');
        }

        return false;
    }
}

$(document).ready(function () {
    pageSize = parseInt($('#pageSize').val()) || 5;
    loadCountries();
});