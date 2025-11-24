// === LIST-TYPE-VALUES.JS ===

let allListTypeValues = [];
let filteredListTypeValues = [];
let currentPage = 1;
let pageSize = 5;

// === LOAD LIST TYPE VALUES ===
function loadListTypeValues(lov_id) {
    $.ajax({
        url: '/lov/list-type-values-list/' + lov_id + '/',
        type: 'GET',
        success: function(response) {
            allListTypeValues = response;
            filteredListTypeValues = [...allListTypeValues];
            filterListTypeValues();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error loading List Type Values.</p>');
        }
    });
}

// === FILTER LIST TYPE VALUES ===
function filterListTypeValues() {
    const searchCode = $('#search_list_code').val().toLowerCase();
    const searchStatus = $('#active_flag').val();

    filteredListTypeValues = allListTypeValues.filter(function(item) {
        const matchesCode = item.list_code.toLowerCase().includes(searchCode);
        const matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchesCode && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

// === RENDER TABLE ===
function renderTable() {
    const total = filteredListTypeValues.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredListTypeValues.slice(start, end);

    const tbody = $('#line_items tbody');
    tbody.empty();

    if (pageData.length > 0) {
        pageData.forEach(function(item) {
            const newRow = $('<tr class="remove_tr tabRow">');
            const cols = `
                <td class="text-center">
                    <div class="dropdown">
                        <button type="button" class="btn btn-outline-info btn-sm dropdown-toggle" data-toggle="dropdown">
                            Action <i class="fa fa-chevron-down"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right dropdown-menu-new">
                            <li><a href="javascript:void(0);" onclick="editListTypeValue(${item.list_type_value_id})"><i class="fa fa-pencil"></i> Edit</a></li>
                            <li><a href="javascript:void(0);" onclick="viewListTypeValue(${item.list_type_value_id})"><i class="fa fa-eye"></i> View</a></li>
                            <li>
                                ${item.active_flag === 'Y'
                                    ? `<a href="javascript:void(0);" onclick="toggleStatus(${item.list_type_value_id}, 'N')"><i class="fa fa-ban"></i> Inactive</a>`
                                    : `<a href="javascript:void(0);" onclick="toggleStatus(${item.list_type_value_id}, 'Y')"><i class="fa fa-check"></i> Active</a>`}
                            </li>
                        </ul>
                    </div>
                </td>
                <td>${item.list_code}</td>
                <td>${item.list_value}</td>
                <td>${item.order_sequence}</td>
                <td class="text-center">
                    ${item.active_flag === 'Y'
                        ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
                        : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>"}
                </td>
            `;
            newRow.append(cols);
            tbody.append(newRow);
        });
    } else {
        tbody.append('<tr><td colspan="5" class="text-center">No records found</td></tr>');
    }

    renderPagination(totalPages, currentPage, function(page) {
        currentPage = page;
        renderTable();
    });
}

// === PAGE SIZE CHANGE ===
$('#pageSize').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderTable();
});

// === SEARCH EVENTS ===
$('#search_list_code, #active_flag').on('input change', function() {
    filterListTypeValues();
});

// === CREATE / UPDATE LIST TYPE VALUE ===
$('#listTypeValuesForm').on('submit', function(e) {
    e.preventDefault();

    const list_type_id = $('#list_type_id').val();
    const list_type_value_id = $('#list_type_value_id').val();
    let url = '/api/list-type-values/';
    let type = 'POST';
    let successMessage = 'List Type Value created successfully.';

    if (list_type_value_id) {
        url += list_type_value_id + '/';
        type = 'PUT';
        // successMessage = 'List Type Value updated successfully.';
    }

    $.ajax({
        url: url,
        type: type,
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            list_type_id: list_type_id,
            list_code: $('#list_code').val(),
            list_value: $('#list_value').val(),
            order_sequence: $('#order_sequence').val(),
            short_description: $('#short_description').val(),
            active_flag: 'Y'
        }),
        success: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: successMessage,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });

            $('#listTypeValuesForm')[0].reset();
            $('#list_type_value_id').val('');
            $('#page_title').html('<b>Create List Type Value</b>');
            loadListTypeValues(list_type_id);
        },
        error: function(xhr) {
            let errorMsg = 'Error saving List Type Value!';
            if (xhr.responseJSON && xhr.responseJSON.list_code) {
                errorMsg = xhr.responseJSON.list_code[0];
            }
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: errorMsg,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    });
});

// === EDIT LIST TYPE VALUE ===
function editListTypeValue(id) {
    $('.list_code').removeClass('errorClass');
    $('.list_value').removeClass('errorClass');
    $.ajax({
        url: '/api/list-type-values/' + id + '/',
        type: 'GET',
        success: function(data) {
            $('#page_title').html('<b>Edit List Type Value</b>');
            $('#list_type_value_id').val(data.list_type_value_id);
            $('#list_type_id').val(data.list_type_id);
            $('#list_code').val(data.list_code);
            $('#list_value').val(data.list_value);
            $('#order_sequence').val(data.order_sequence);
            $('#short_description').val(data.short_description);
            $('#save_btn').show();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error fetching List Type Value.</p>');
        }
    });
}

// === VIEW LIST TYPE VALUE ===
function viewListTypeValue(id) {
    $('.list_code').removeClass('errorClass');
    $('.list_value').removeClass('errorClass');
    $.ajax({
        url: '/api/list-type-values/' + id + '/',
        type: 'GET',
        success: function(data) {
            $('#page_title').html('<b>View List Type Value</b>');
            $('#list_type_value_id').val(data.list_type_value_id);
            $('#list_type_id').val(data.list_type_id);
            $('#list_code').val(data.list_code).prop('disabled', true);
            $('#list_value').val(data.list_value).prop('disabled', true);
            $('#order_sequence').val(data.order_sequence).prop('disabled', true);
            $('#short_description').val(data.short_description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error fetching List Type Value.</p>');
        }
    });
}

// === TOGGLE STATUS ===
function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/list-type-values/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function() {
            const listValue = allListTypeValues.find(d => d.list_type_value_id === id);
            if (listValue) listValue.active_flag = newStatus;
            filterListTypeValues();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error updating status.</p>');
        }
    });
}

function saveBtn(val) {
    var list_code       = $("#list_code").val();
    var list_value      = $("#list_value").val();

    if (list_code.trim() !== "" && list_value.trim() !== "") 
    {
        $(".list_code").removeClass('errorClass');
        $(".list_value").removeClass('errorClass');
        return true;
    } else {
        if (list_code.trim() === "") {
            $(".list_code").addClass('errorClass');
        } else {
            $(".list_code").removeClass('errorClass');
        }

        if (list_value.trim() === "") {
            $(".list_value").addClass('errorClass');
        } else {
            $(".list_value").removeClass('errorClass');
        }

        return false;
    }
}

// === INITIAL LOAD ===
$(document).ready(function() {
    const lov_id = $('#list_type_id').val();
    pageSize = parseInt($('#pageSize').val()) || 5;
    loadListTypeValues(lov_id);
});
