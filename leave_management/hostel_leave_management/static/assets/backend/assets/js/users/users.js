
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
let pageSize = 5;

function loadUsers() {
    $.get('/api/users/', function (response) {
        allUsers = response;
        filteredUsers = [...allUsers];
        filterUsers();
    }).fail(function() {
        console.error("Error loading users from API.");
        $('#user_table tbody').html('<tr><td colspan="4" class="text-center">Error loading data</td></tr>');
    });
}

// FILTER USERS
function filterUsers() {
    const name = $('#search_user_name').val() ? $('#search_user_name').val().toLowerCase() : '';
    const status = $('#active_flag').val() || 'ALL';

    filteredUsers = allUsers.filter(u => {
        const matchName = (u.username || '').toLowerCase().includes(name);
        const matchStatus = status === "ALL" || u.profile.active_flag === status;
        return matchName && matchStatus;
    });

    currentPage = 1;
    renderUsers();
}

// RENDER USERS TABLE
function renderUsers() {
    $('#user_table').next('#pagination').remove(); 
    let total = filteredUsers.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredUsers.slice(start, end);

    let tbody = $('#user_table tbody');
    tbody.empty();

    if (!pageData.length) {
        tbody.append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
    } else {
        pageData.forEach(item => {
            tbody.append(`
                <tr>
                     <td class="text-center">
                        <div class="dropdown">
                            <button class="btn btn-outline-info btn-sm dropdown-toggle" data-toggle="dropdown">
                                Action <i class="fa fa-chevron-down"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-right">
                                <li><a href="javascript:void(0);" onclick="editUser(${item.id})"><i class="fa fa-pencil"></i> Edit</a></li>
                                <li><a href="javascript:void(0);" onclick="viewUser(${item.id})"><i class="fa fa-eye"></i> View</a></li>
                                <li>
                                    ${item.profile.active_flag === 'Y'
                ? `<a href="javascript:void(0);" onclick="toggleUserStatus(${item.id}, 'N')"><i class="fa fa-ban"></i> Inactive</a>`
                : `<a href="javascript:void(0);" onclick="toggleUserStatus(${item.id}, 'Y')"><i class="fa fa-check"></i> Active</a>`}
                                </li>
                            </ul>
                        </div>
                    </td>
                    <td>${item.username}</td>
                    <td>${item.profile.user_type_name || ''}</td> 
                    <td class="text-center">
                        ${item.profile.active_flag === 'Y'
                            ? `<span class="btn btn-outline-success btn-sm">Active</span>`
                            : `<span class="btn btn-outline-warning btn-sm">Inactive</span>`}
                    </td>
                </tr>
            `);
        });
    }

    $('#user_table').after(`<ul id="pagination" class="pagination justify-content-center mt-2"></ul>`);
    renderPagination(totalPages, currentPage);
}

// PAGINATION
function renderPagination(totalPages, current) {
    let pagination = $('#pagination');
    pagination.empty();
    if (totalPages <= 1) return;

    let prevDisabled = current === 1 ? 'disabled' : '';
    let nextDisabled = current === totalPages ? 'disabled' : '';

    pagination.append(`
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="javascript:void(0);" onclick="${prevDisabled ? '' : `changePage(${current - 1})`}">Prev</a>
        </li>
    `);

    for (let i = 1; i <= totalPages; i++) {
        let active = i === current ? 'active' : '';
        pagination.append(`
            <li class="page-item ${active}">
                <a class="page-link" href="javascript:void(0);" onclick="changePage(${i})">${i}</a>
            </li>
        `);
    }

    pagination.append(`
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="javascript:void(0);" onclick="${nextDisabled ? '' : `changePage(${current + 1})`}">Next</a>
        </li>
    `);
}

function changePage(page) {
    currentPage = page;
    renderUsers();
}

function saveUserBtn() {
    let user_type = $("#user_type").val() ? $("#user_type").val().trim() : '';
    let user_name = $("#user_name").val().trim();
    let password = $("#password").val();

    $("#user_type").removeClass("errorClass");
    $("#user_name").removeClass("errorClass");
    $("#password").removeClass("errorClass");

    if (user_type === "") {
        $("#user_type").addClass("errorClass");
        return false;
    }
    if (user_name === "") {
        $("#user_name").addClass("errorClass");
        return false;
    }
    if (!$("#user_id").val() && password.trim() === "") {
        $("#password").addClass("errorClass");
        return false;
    }

    if ($("#role_items tbody tr").length === 0) {
        Swal.fire("Validation Error", "Please add at least one Role", "warning");
        return false;
    }

    let valid = true;
    $("#role_items tbody tr").each(function () {
        let roleVal = $(this).find('.role_select').val();
        if (!roleVal) {
             valid = false;
             $(this).find('.role_select').addClass("errorClass");
        } else {
             $(this).find('.role_select').removeClass("errorClass");
        }
    });

    if (!valid) {
        Swal.fire("Validation Error", "Please select a role for all lines", "warning");
        return false;
    }

    return true;
}

// ADD ROLE ROW
function addRole(line = {}, isNew = true) {
    $.ajax({
        url: "/api/roles/",
        type: "GET",
        dataType: "json",
        success: function (roles) {
            let activeStatus = isNew ? 'Y' : (line.active_flag || 'Y');
            let isChecked = activeStatus === 'Y' ? 'checked' : '';
            let deleteIcon = isNew || !line.id 
                ? `<a class='deleteRow' href='javascript:void(0);' onclick='removeRole(this)'><i class='fa fa-times-circle-o' style='color:#fb1b1b61;font-size:16px;'></i></a>`
                : `<a class='deleteRow' href='javascript:void(0);' onclick='removeRole(this, ${line.id})'><i class='fa fa-times-circle-o' style='color:#fb1b1b61;font-size:16px;'></i></a>`;

            let roleId = line.role && (line.role.id || line.role) ? (line.role.id || line.role) : '';

            let options = `<option value="">-- Select Role --</option>`;
            roles.forEach(r => {
                let sel = (roleId === r.id) ? 'selected' : '';
                options += `<option value="${r.id}" ${sel}>${r.role_name}</option>`;
            });

            let switchHtml = `
                <label class='switch'>
                    <input type='checkbox' class='role_active_flag' data-line-id="${line.id || ''}" ${isChecked} onchange='toggleRoleStatus(this)'>
                    <div class='slider round'></div>
                </label>
                <input type='hidden' name='role_active_status[]' value='${activeStatus}'>
            `;

            let row = `
                <tr data-line-id="${line.id || ''}">
                    <td class="text-center">${deleteIcon}</td>
                    <td>
                        <select class="form-control role_select" name="role_id[]">
                            ${options}
                        </select>
                    </td>
                    <td class="text-center">${switchHtml}</td>
                </tr>
            `;
            $("#role_items tbody").append(row);
        },
        error: function (xhr) {
            Swal.fire("Error", "Error fetching roles list: " + xhr.statusText, "error");
        }
    });
}

// Toggle role status
function toggleRoleStatus(checkbox) {
    let newStatus = checkbox.checked ? 'Y' : 'N';
    let lineId = $(checkbox).data('line-id');
    $(checkbox).closest('td').find('input[name="role_active_status[]"]').val(newStatus);

    if (!lineId) return;

    $.ajax({
        url: "/users/updateLineStatus/",
        type: "POST",
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val(),
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ id: lineId, active_flag: newStatus }),
        success: function (response) {
            Swal.fire({ icon: 'success', title: response.message, showConfirmButton: false, timer: 1500 });
        },
        error: function (xhr) {
            let errorMessage = 'Unknown error';
            if (xhr.responseJSON && xhr.responseJSON.error) errorMessage = xhr.responseJSON.error;
            Swal.fire({ icon: 'error', title: 'Error updating role status: ' + errorMessage, showConfirmButton: false, timer: 2500 });
            // revert
            checkbox.checked = !checkbox.checked;
            $(checkbox).closest('td').find('input[name="role_active_status[]"]').val(checkbox.checked ? 'Y' : 'N');
        }
    });
}

function removeRole(btn, lineId = null) {
    if (lineId) {
        // you can implement DELETE endpoint if you want to remove from DB immediately
        // $.ajax({ url: `/api/userlines/${lineId}/`, type: 'DELETE', headers:{...}, success: function(){...} });
    }
    $(btn).closest("tr").remove();
}

// SUBMIT FORM
$('#userForm').on('submit', function (e) {
    e.preventDefault();
    if (!saveUserBtn()) return;

    let roles = [];
    $("#role_items tbody tr").each(function () {
        roles.push({
            role: parseInt($(this).find(".role_select").val()),
            active_flag: $(this).find('.role_active_flag').is(':checked') ? 'Y' : 'N'
        });
    });

    let userId = $("#user_id").val();
    let method = userId ? "PUT" : "POST";
    let url = "/api/users/" + (userId ? userId + "/" : "");

    // Map HTML id fields to serializer field names
    let payload = {
        username    : $("#user_name").val(),
        email       : $("#email").val(),
        profile: {
            user_type: $("#user_type").val() || null,
            employee: $("#employee_id").val() ? parseInt($("#employee_id").val()) : null,
            from_date: $("#from_date").val() || null,
            to_date: $("#to_date").val() || null,
            description: $("#description").val() || null,
            active_flag: "Y"
        },
        lines: roles
    };

    // password handling
    let pwd = $("#password").val();
    if (pwd && pwd.trim() !== "") payload.password = pwd;

    $.ajax({
        url: url,
        type: method,
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val(),
            "Content-Type": "application/json"
        },
        data: JSON.stringify(payload),
        success: function () {
            Swal.fire({ icon: "success", title: "User saved successfully!", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
            $("#userForm")[0].reset();
            $("#role_items tbody").empty();
            $('#employee_div').hide();
            addRole();
            loadUsers();
            showForm('LISTTAB');
            $("#page_title").html("<b>Create User</b>");
        },
        error: function (xhr) {
            console.error("Save Error:", xhr.responseText);
            let errorMessage = "Error saving user. Check console for details.";
            if (xhr.responseJSON) {
                errorMessage = JSON.stringify(xhr.responseJSON);
            }
            Swal.fire("Error!", errorMessage, "error");
        }
    });
});

// EDIT
function editUser(id) {
    $.get(`/api/users/${id}/`, function (data) {
        console.log(data);
        
        $('#page_title').html('<b>Edit User</b>');
        $('#user_id').val(data.id);
        $('#user_type').val((data.profile && data.profile.user_type) ? data.profile.user_type : '');
        if ((data.profile && data.profile.user_type) && data.profile.user_type == '12') {
             getEmployee(data.profile.user_type);
             setTimeout(function() {
                 $('#employee_id').val((data.profile && data.profile.employee) ? data.profile.employee : '');
             }, 300);
        } else {
             $('#employee_div').hide();
             $('#employee_id').val('');
        }
        $('#user_name').val(data.username || '');
        $('#email').val(data.email || '');
        $('#password').val(data.password || '');
        $('#from_date').val((data.profile && data.profile.from_date) ? data.profile.from_date : '');
        $('#to_date').val((data.profile && data.profile.to_date) ? data.profile.to_date : '');
        $('#description').val((data.profile && data.profile.description) ? data.profile.description : '');
        $('#role_items tbody').empty();
        if (data.lines && data.lines.length) {
            data.lines.forEach(r => addRole(r, false));
        }
        showForm('CREATETAB');
    }).fail(function(){
        Swal.fire("Error!", "Error fetching user data.", "error");
    });
}

// TOGGLE USER STATUS
function toggleUserStatus(id, newStatus) {
    let isActiveBool = newStatus === 'Y';

    $.ajax({
        url: `/api/users/${id}/`,
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            is_active: isActiveBool,
            profile: {
                active_flag: newStatus    // "Y" or "N"
            }
        }),
        success: function () {
            Swal.fire({
                icon: 'success',
                title: 'User status updated',
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500
            });

            let user = allUsers.find(d => d.id === id);
            if (user) {
                user.is_active = isActiveBool;
                if (user.profile) user.profile.active_flag = newStatus;
            }

            filterUsers();
        },
        error: function () {
            Swal.fire("Error!", "Error updating user status.", "error");
        }
    });
}


// PAGE SIZE change
$('#pageSize').on('change', function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderUsers();
});

// INITIALIZE
$(document).ready(function () {
    pageSize = parseInt($('#pageSize').val()) || 5;
    loadUsers();
    if (!$("#user_id").val()) {
        addRole();
    }

    $('#search_user_name, #active_flag').on('input change', filterUsers);
});

// getEmployee (legacy path)
function getEmployee(val) {
    if (String(val) === '12') {
        $('#employee_div').show();
        $.ajax({
            url: '/get_employee',
            type: 'GET',
            success: function(response) {
                $('#employee_id').empty().append('<option value="">- Select -</option>');
                if (response.employees && response.employees.length > 0) {
                    response.employees.forEach(emp => {
                        $('#employee_id').append(`<option value="${emp.id}">${emp.first_name} ${emp.last_name || ''}</option>`);
                    });
                }
            },
            error: function() {
                Swal.fire("Error", "Unable to load employees", "error");
            }
        });
    } else {
        $('#employee_div').hide();
        $('#employee_id').val('');
    }
}

function getEmployeeDetails(employee_id) 
{
    if (employee_id) 
    {
        $.ajax({
            url: `/api/employees/${employee_id}/`,
            type: 'GET',
            success: function(response) {
                $('#email').val(response.email);
            },
            error: function() {
                Swal.fire("Error", "Unable to load employee details", "error");
            }
        });
    }
    
}