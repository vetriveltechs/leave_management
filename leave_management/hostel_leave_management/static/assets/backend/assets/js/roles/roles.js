// === GLOBAL VARIABLES ===
let allRoles = [];
let filteredRoles = [];
let currentPage = 1;
let pageSize = 5;

// === LOAD ROLES ===
function loadRoles() {
    $.ajax({
        url: '/api/roles/',
        type: 'GET',
        success: function (response) {
            allRoles = response;
            filteredRoles = [...allRoles];
           
            renderTable();
        },
        error: function () {
            $('#response').html('<p style="color:red;">Error loading roles.</p>');
        }
    });
}

// === FILTER ROLES ===
function filterRoles() {
    const searchName = $('#search_role_name').val().toLowerCase();
    const searchStatus = $('#active_flag').val();

    filteredRoles = allRoles.filter(function (item) {
        let matchesName = item.role_name.toLowerCase().includes(searchName);
        let matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchesName && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

// === RENDER TABLE ===
function renderTable() {
    let total = filteredRoles.length;

    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredRoles.slice(start, end);

    $('#roles_table tbody').empty();
    
    if (pageData.length > 0) {
        pageData.forEach(function (item) {
            let newRow = $('<tr class="remove_tr tabRow">');
            let cols = "<td class='text-center'>"
                + "<div class='dropdown'>"
                + "<button type='button' class='btn btn-outline-info dropdown-toggle btn-sm' data-toggle='dropdown'>"
                + "Action<i class='fa fa-chevron-down'></i>"
                + "</button>"
                + "<ul class='dropdown-menu dropdown-menu-right dropdown-menu-new'>"
                + "<li><a href='javascript:void(0);' onclick='editRole(" + item.id + ")'><i class='fa fa-pencil'></i> Edit</a></li>"
                + "<li><a href='javascript:void(0);' onclick='viewRole(" + item.id + ")'><i class='fa fa-eye'></i> View</a></li>"
                + "<li>" + (item.active_flag === 'Y'
                    ? "<a href='javascript:void(0);' onclick='toggleStatus(" + item.id + ", \"N\")'><i class='fa fa-ban'></i> Inactive</a>"
                    : "<a href='javascript:void(0);' onclick='toggleStatus(" + item.id + ", \"Y\")'><i class='fa fa-check'></i> Active</a>") + "</li>"
                + "</ul></div></td>";

            cols += "<td>" + item.role_name + "</td>";
            cols += "<td>" + item.description + "</td>";
            cols += "<td class='text-center'>" + (item.active_flag === 'Y'
                ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
                : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>") + "</td>";

            newRow.append(cols);
            $('#roles_table tbody').append(newRow);
        });
    } else {
        $('#roles_table tbody').append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
    }

    renderPagination(totalPages);
}

// === RENDER PAGINATION ===
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        $('#pagination').empty();
        return;
    }

    let pagHtml = '<nav><ul class="pagination pagination-sm justify-content-end">';
    for (let i = 1; i <= totalPages; i++) {
        pagHtml += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a href="#" class="page-link page-num" data-page="${i}">${i}</a>
                    </li>`;
    }
    pagHtml += '</ul></nav>';
    $('#pagination').html(pagHtml);
}

// === PAGINATION EVENTS ===
$(document).on('click', '.page-num', function (e) {
    e.preventDefault();
    currentPage = parseInt($(this).data('page'));
    renderTable();
});

// === SEARCH INPUT EVENTS ===
$('#search_role_name, #active_flag').on('input change', function () {
    filterRoles();
});

// === FORM SUBMIT ===
$('#rolesForm').on('submit', function (e) {
    e.preventDefault();
    let id = $('#id').val();
    let url = '/api/roles/';
    let type = 'POST';
    let successMessage = 'Role saved successfully.';
    if (id) {
        url += id + '/';
        type = 'PUT';
        let successMessage = 'Role updated successfully.';
    }

    $.ajax({
        url: url,
        type: type,
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            role_name: $('#role_name').val(),
            description: $('#description').val()
        }),
        success: function () {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: successMessage,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            $('#rolesForm')[0].reset();
            $('#id').val('');
             $('#role_name').prop('disabled', false);
            // $('#save_btn').prop('disabled', false).show();
            $('#page_title').html('<b>Create Role</b>');
            loadRoles();
        },
        error: function () {
            let errorMsg = 'Error saving role!';
            if (xhr.responseJSON && xhr.responseJSON.role_name) {
                errorMsg = xhr.responseJSON.role_name[0];
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

// === EDIT ===
function editRole(id) {
    $('.role_name').removeClass('errorClass');
    if(id){
       $.ajax({
            url: '/api/roles/' + id + '/',
            type: 'GET',
            success: function (data) {
                $('#page_title').html('<b>Edit Role</b>');
                $('#id').val(data.id);
                $('#role_name').val(data.role_name);
                $('#description').val(data.description);
            },
            error: function () {
                Swal.fire({
                icon: 'error',
                title: 'Error fetching role!',
                showConfirmButton: false,
                timer: 3000
            });
            }
        });
    }
    else
    {
        Swal.fire({
            icon: 'error',
            title: 'Please select a role to edit.',
            showConfirmButton: false,
            timer: 3000
        });
    }
}

// === VIEW ===
function viewRole(id) {
    $('.role_name').removeClass('errorClass');
    $.ajax({
        url: '/api/roles/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>View Role</b>');
            $('#id').val(data.id);
            $('#role_name').val(data.role_name).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching role!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

// === TOGGLE STATUS ===
function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/roles/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function () {
            let role = allRoles.find(r => r.id === id);
            if (role) role.active_flag = newStatus;
            filterRoles();
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error updating status!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function saveBtn(val) {
    var role_name = $("#role_name").val();

    if (role_name.trim() !== "") {
        $(".role_name").removeClass('errorClass');
        return true;
    } else {
        if (role_name.trim() === "") {
            $(".role_name").addClass('errorClass');
        } else {
            $(".role_name").removeClass('errorClass');
        }

        return false;
    }
}

// === INITIAL LOAD ===
$(document).ready(function () {
    pageSize = parseInt($('#pageSize').val() || 5);
    loadRoles();
});
