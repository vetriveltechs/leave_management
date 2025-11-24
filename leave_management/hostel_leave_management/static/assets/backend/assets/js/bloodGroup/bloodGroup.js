let allBloodGroups = [];
let filteredBloodGroups = [];
let currentPage = 1;
let pageSize = 5;

function loadBloodGroups() {
    $.ajax({
        url: '/api/bloodGroups/',
        type: 'GET',
        success: function (response) {
            allBloodGroups = response;
            filteredBloodGroups = [...allBloodGroups];
            renderTable();
        },
        error: function () {
            $('.line-items-error').text('Error loading blood groups.').show().delay(2000).fadeOut(1000);
        }
    });
}

function filterBloodGroups() {
    const searchName = $('#search_blood_group_name').val().toLowerCase();
    const searchStatus = $('#active_flag').val();

    filteredBloodGroups = allBloodGroups.filter(function (item) {
        let matchesName = item.blood_group_name.toLowerCase().includes(searchName);
        let matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchesName && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

function renderTable() {
    let total = filteredBloodGroups.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredBloodGroups.slice(start, end);

    $('#blood_group_table tbody').empty();

    if (pageData.length > 0) {
        pageData.forEach(function (item) {
            let newRow = $('<tr class="remove_tr tabRow">');
            let cols = "<td class='text-center'>"
                + "<div class='dropdown'>"
                + "<button type='button' class='btn btn-outline-info dropdown-toggle btn-sm' data-toggle='dropdown'>"
                + "Action<i class='fa fa-chevron-down'></i>"
                + "</button>"
                + "<ul class='dropdown-menu dropdown-menu-right dropdown-menu-new'>"
                + "<li><a href='javascript:void(0);' onclick='editBloodGroup(" + item.id + ")'><i class='fa fa-pencil'></i> Edit</a></li>"
                + "<li><a href='javascript:void(0);' onclick='viewBloodGroup(" + item.id + ")'><i class='fa fa-eye'></i> View</a></li>"
                + "<li>" + (item.active_flag === 'Y'
                    ? "<a href='javascript:void(0);' onclick='toggleStatus(" + item.id + ", \"N\")'><i class='fa fa-ban'></i> Inactive</a>"
                    : "<a href='javascript:void(0);' onclick='toggleStatus(" + item.id + ", \"Y\")'><i class='fa fa-check'></i> Active</a>") + "</li>"
                + "</ul></div></td>";

            cols += "<td>" + item.blood_group_name + "</td>";
            cols += "<td>" + (item.description || '') + "</td>";
            cols += "<td class='text-center'>" + (item.active_flag === 'Y'
                ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
                : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>") + "</td>";

            newRow.append(cols);
            $('#blood_group_table tbody').append(newRow);
        });
    } 
    else 
    {
        $('#blood_group_table tbody').append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
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

$('#search_blood_group_name, #active_flag').on('input change', function () {
    filterBloodGroups();
});

$('#bloodGroupForm').on('submit', function (e) {
    e.preventDefault();
    let id = $('#blood_group_id').val();
    let url = '/api/bloodGroups/';
    let type = 'POST';
    let successMessage = 'Blood Group saved successfully.';
    if (id) {
        url += id + '/';
        type = 'PUT';
    }

    $.ajax({
        url: url,
        type: type,
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            blood_group_name: $('#blood_group_name').val(),
            description: $('#description').val()
        }),
        success: function () {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: successMessage,
                showConfirmButton: false,
                timer: 3000
            });
            $('#bloodGroupForm')[0].reset();
            $('#blood_group_id').val('');
            $('#blood_group_name').prop('disabled', false);
            $('#page_title').html('<b>Create Blood Group</b>');
            loadBloodGroups();
        },
        error: function (xhr) {
            let errorMsg = 'Error saving Blood Group!';
            if (xhr.responseJSON && xhr.responseJSON.blood_group_name) {
                errorMsg = xhr.responseJSON.blood_group_name[0];
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

function editBloodGroup(id) {
    $('.blood_group_name').removeClass('errorClass');
    $.ajax({
        url: '/api/bloodGroups/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>Edit Blood Group</b>');
            $('#blood_group_id').val(data.id);
            $('#blood_group_name').val(data.blood_group_name);
            $('#description').val(data.description);
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching blood group!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function viewBloodGroup(id) {
    $('.blood_group_name').removeClass('errorClass');
    $.ajax({
        url: '/api/bloodGroups/' + id + '/',
        type: 'GET',
        success: function (data) {
            $('#page_title').html('<b>View Blood Group</b>');
            $('#blood_group_id').val(data.id);
            $('#blood_group_name').val(data.blood_group_name).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching blood group!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/bloodGroups/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function () {
            let bg = allBloodGroups.find(b => b.id === id);
            if (bg) bg.active_flag = newStatus;
            filterBloodGroups();
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

function saveBtn() {
    var blood_group_name = $("#blood_group_name").val();

    if (blood_group_name.trim() !== "") {
        $(".blood_group_name").removeClass('errorClass');
        return true;
    } else {
        $(".blood_group_name").addClass('errorClass');
        return false;
    }
}

$(document).ready(function () {
    pageSize = parseInt($('#pageSize').val());
    loadBloodGroups();
});
