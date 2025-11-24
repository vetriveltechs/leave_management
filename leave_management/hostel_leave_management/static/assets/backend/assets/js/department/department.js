let allDepartments = [];
let filteredDepartments = [];
let currentPage = 1;
let pageSize = 5;

function loadDepartments() {
    $.ajax({
        url: '/api/departments/',
        type: 'GET',
        success: function (response) {
            allDepartments = response;
            filteredDepartments = [...allDepartments];
            renderTable();
        },
        error: function () {
            $('#response').html('<p style="color:red;">Error loading departments.</p>');
        }
    });
}

function filterDepartments() {
    const searchName = $('#search_department_name').val().toLowerCase();
    const searchStatus = $('#active_flag').val();

    filteredDepartments = allDepartments.filter(function (item) {
        let matchesName = item.department_name.toLowerCase().includes(searchName);
        let matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchesName && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    let total = filteredDepartments.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredDepartments.slice(start, end);

    $('#department_table tbody').empty();

    if (pageData.length > 0) {
        pageData.forEach(function (item) {
            let newRow = $('<tr class="remove_tr tabRow">');
            let cols = "<td class='text-center'>"
                + "<div class='dropdown'>"
                + "<button type='button' class='btn btn-outline-info dropdown-toggle btn-sm' data-toggle='dropdown'>"
                + "Action<i class='fa fa-chevron-down'></i>"
                + "</button>"
                + "<ul class='dropdown-menu dropdown-menu-right dropdown-menu-new'>"
                + "<li><a href='javascript:void(0);' onclick='editDepartment(" + item.id + ")'><i class='fa fa-pencil'></i> Edit</a></li>"
                + "<li><a href='javascript:void(0);' onclick='viewDepartment(" + item.id + ")'><i class='fa fa-eye'></i> View</a></li>"
                + "<li>" + (item.active_flag === 'Y'
                    ? "<a href='javascript:void(0);' onclick='toggleStatus(" + item.id + ", \"N\")'><i class='fa fa-ban'></i> Inactive</a>"
                    : "<a href='javascript:void(0);' onclick='toggleStatus(" + item.id + ", \"Y\")'><i class='fa fa-check'></i> Active</a>") + "</li>"
                + "</ul></div></td>";

            cols += "<td>" + item.department_name + "</td>";
            cols += "<td>" + (item.description || '') + "</td>";
            cols += "<td class='text-center'>" + (item.active_flag === 'Y'
                ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
                : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>") + "</td>";

            newRow.append(cols);
            $('#department_table tbody').append(newRow);
        });
    } else {
        $('#department_table tbody').append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
    }

    renderPagination(totalPages);
}

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

$(document).on('click', '.page-num', function (e) {
    e.preventDefault();
    currentPage = parseInt($(this).data('page'));
    renderTable();
});

$('#search_department_name, #active_flag').on('input change', function () {
    filterDepartments();
});

$('#departmentForm').on('submit', function (e) {
    e.preventDefault();
    let id = $('#department_id').val();
    let url = '/api/departments/';
    let type = 'POST';
    let successMessage = 'Department saved successfully.';
    if (id) {
        url += id + '/';
        type = 'PUT';
        successMessage = 'Department updated successfully.';
    }

    $.ajax({
        url: url,
        type: type,
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            department_name: $('#department_name').val(),
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
            $('#departmentForm')[0].reset();
            $('#department_id').val('');
            $('#department_name').prop('disabled', false);
            // $('#save_btn').prop('disabled', false).show();
            $('#page_title').html('<b>Create Department</b>');
            loadDepartments();
        },
        error: function () {
            let errorMsg = 'Error saving department!';
            if (xhr.responseJSON && xhr.responseJSON.designation_name) {
                errorMsg = xhr.responseJSON.designation_name[0];
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

function editDepartment(id) {
    $('.department_name').removeClass('errorClass');
    $.ajax({
        url: '/api/departments/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>Edit Department</b>');
            $('#department_id').val(data.id);
            $('#department_name').val(data.department_name);
            $('#description').val(data.description);
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching department!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function viewDepartment(id) {
    $('.department_name').removeClass('errorClass');
    $.ajax({
        url: '/api/departments/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>View Department</b>');
            $('#department_id').val(data.id);
            $('#department_name').val(data.department_name).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching department!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/departments/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function () {
            let dept = allDepartments.find(d => d.id === id);
            if (dept) dept.active_flag = newStatus;
            filterDepartments();
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


    function saveBtn(val) {
        var department_name = $("#department_name").val();

        if (department_name.trim() !== "") {
            $(".department_name").removeClass('errorClass');
            return true;
        } else {
            if (department_name.trim() === "") {
                $(".department_name").addClass('errorClass');
            } else {
                $(".department_name").removeClass('errorClass');
            }

            return false;
        }
    }

$(document).ready(function () {
    pageSize = parseInt($('#pageSize').val());
    loadDepartments();
});
