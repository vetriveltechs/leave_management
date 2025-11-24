let allProjects = [];
let filteredProjects = [];
let currentPage = 1;
let pageSize = 5;

// === LOAD PROJECTS ===
function loadProjects() {
    $.get('/api/projects/', function (response) {
        allProjects = response;
        filteredProjects = [...allProjects];
        filterProjects();
    });
}

// === FILTER PROJECTS ===
function filterProjects() {
    const name = $('#search_project_name').val().toLowerCase();
    const status = $('#active_flag').val();

    filteredProjects = allProjects.filter(p => {
        const matchName = p.project_name.toLowerCase().includes(name);
        const matchStatus = status === "ALL" || p.active_flag === status;
        return matchName && matchStatus;
    });

    currentPage = 1;
    renderProjects();
}

// === RENDER PROJECTS ===
function renderProjects() {
    let total = filteredProjects.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredProjects.slice(start, end);

    let tbody = $('#project_table tbody');
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
                                <li><a href="javascript:void(0);" onclick="editProject(${item.id})"><i class="fa fa-pencil"></i> Edit</a></li>
                                <li><a href="javascript:void(0);" onclick="viewProject(${item.id})"><i class="fa fa-eye"></i> View</a></li>
                                <li>
                                    ${item.active_flag === 'Y'
                ? `<a href="javascript:void(0);" onclick="toggleProjectStatus(${item.id}, 'N')"><i class="fa fa-ban"></i> Inactive</a>`
                : `<a href="javascript:void(0);" onclick="toggleProjectStatus(${item.id}, 'Y')"><i class="fa fa-check"></i> Active</a>`}
                                </li>
                            </ul>
                        </div>
                    </td>
                    <td>${item.project_name}</td>
                    <td>${item.project_description || ''}</td>
                    <td class="text-center">
                        ${item.active_flag === 'Y'
                ? `<span class="btn btn-outline-success btn-sm">Active</span>`
                : `<span class="btn btn-outline-warning btn-sm">Inactive</span>`}
                    </td>
                </tr>
            `);
        });
    }

    renderPagination(totalPages, currentPage);
}

// === RENDER PAGINATION ===
function renderPagination(totalPages, currentPage) {
    let pagination = $('#pagination');
    pagination.empty();

    if (totalPages <= 1) return;

    let prevDisabled = currentPage === 1 ? 'disabled' : '';
    let nextDisabled = currentPage === totalPages ? 'disabled' : '';

    pagination.append(`
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="javascript:void(0);" onclick="${prevDisabled ? '' : `changePage(${currentPage - 1})`}">Prev</a>
        </li>
    `);

    for (let i = 1; i <= totalPages; i++) {
        let active = i === currentPage ? 'active' : '';
        pagination.append(`
            <li class="page-item ${active}">
                <a class="page-link" href="javascript:void(0);" onclick="changePage(${i})">${i}</a>
            </li>
        `);
    }

    pagination.append(`
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="javascript:void(0);" onclick="${nextDisabled ? '' : `changePage(${currentPage + 1})`}">Next</a>
        </li>
    `);
}

function changePage(page) {
    currentPage = page;
    renderProjects();
}

// === VALIDATION: SAVE ===
function saveBtn() {
    let project_name = $("#project_name").val().trim();
    $(".project_name").removeClass("errorClass");

    if (project_name === "") {
        $(".project_name").addClass("errorClass");
        return false;
    }

    if ($("#line_items tbody tr").length === 0) {
        Swal.fire("Validation Error", "Please add at least one Line item", "warning");
        return false;
    }

    let valid = true;
    $("#line_items tbody tr").each(function () {
        let line_title = $(this).find('.line_title').val();
        if (line_title.trim() === "") valid = false;
    });

    if (!valid) {
        $('.line-items-error').text('Please fill all required fields.').show().delay(2000).fadeOut(1000);

        return false;
    }

    return true;
}

// === ADD LINE (fetch active flag like PHP) ===
function addLineCheck() {
    let project_name = $("#project_name").val().trim();
    if (project_name === "") {
        $(".project_name").addClass("errorClass");
        return false;
    } else {
        $(".project_name").removeClass("errorClass");
    }

    let incomplete = false;
    $("#line_items tbody tr").each(function () {
        let line_title = $(this).find('.line_title').val();
        if (line_title.trim() === "") incomplete = true;
    });

    if (incomplete) {
        $('.line-items-error').text('Please fill all required fields.').show().delay(2000).fadeOut(1000);
        return false;
    }

    addLine();
    return true;
}

// === ADD LINE (AJAX like PHP) ===
function addLine(line = {}, isNew = true) {
    $('.line-items-error').text('');

    $.ajax({
        url: "/common/getLineActiveStatus",
        type: "GET",
        dataType: "json",
        success: function (response) {
            let activeStatus = isNew 
                ? 'Y' // new line is always checked
                : (line.active_flag || response.activeStatus || 'Y'); // edit line takes DB value

            let isChecked = activeStatus === 'Y' ? 'checked' : '';
            let disabledAttr = isNew ? 'disabled' : ''; // disable in add mode

            let deleteIcon = isNew
                ? `<a class='deleteRow' href='javascript:void(0);' onclick='removeLine(this)'>
                        <i class='fa fa-times-circle-o' style='color:#fb1b1b61;font-size:16px;'></i>
                   </a>`
                : "";

            let switchHtml = `
                <label class='switch'>
                    <input type='checkbox' class='active_flag' ${isChecked} ${disabledAttr}
                        onchange='toggleLineStatus(this, "${line.id || ''}")'>
                    <div class='slider round'></div>
                </label>
                <input type='hidden' name='active_status[]' value='${activeStatus}'>
            `;

            let row = `
                <tr>
                    <td class="text-center">${deleteIcon}</td>
                    <td><input type="text" class="form-control line_title" name="line_title[]" placeholder="Title" value="${line.line_title || ''}"></td>
                    <td><input type="text" class="form-control line_description" name="line_description[]" placeholder="Description" value="${line.line_description || ''}"></td>
                    <td class="text-center">${switchHtml}</td>
                </tr>
            `;

            $("#line_items tbody").append(row);
        },
        error: function () {
            $('.line-items-error')
                .text('Error fetching active status.')
                .show()
                .delay(2000)
                .fadeOut(1000);
        }
    });
}


function toggleLineStatus(checkbox, lineId) {
    let newStatus = checkbox.checked ? 'Y' : 'N';

    // Update hidden input value
    $(checkbox).closest('td').find('input[name="active_status[]"]').val(newStatus);

    // Only trigger AJAX if editing existing record
    if (!lineId) return;

    $.ajax({
        url: "/projects/updateLineStatus/",
        type: "POST",
        data: { id: lineId, active_flag: newStatus },
        success: function () {
            if (newStatus === 'Y') {
                Swal.fire({
                    icon: 'success',
                    title: 'Line title activated successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Line title inactivated successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error updating line status!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}




// === REMOVE LINE ===
function removeLine(btn) {
    $(btn).closest("tr").remove();
}

// === FORM SUBMIT ===
$('#projectForm').on('submit', function (e) {
    e.preventDefault();
    if (!saveBtn()) return;

    let lines = [];
    $("#line_items tbody tr").each(function () {
        lines.push({
            line_title: $(this).find(".line_title").val(),
            line_description: $(this).find(".line_description").val(),
            active_flag: $(this).find('.active_flag').is(':checked') ? 'Y' : 'N'
        });
    });

    let projectId = $("#project_id").val();
    let method = projectId ? "PUT" : "POST";
    let url = "/api/projects/" + (projectId ? projectId + "/" : "");

    $.ajax({
        url: url,
        type: method,
        headers: {
            "X-CSRFToken": $('[name=csrfmiddlewaretoken]').val(),
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            project_name: $("#project_name").val(),
            project_description: $("#project_description").val(),
            active_flag: "Y",
            lines: lines
        }),
        success: function () {

            Swal.fire({ icon: "success", title: "Project saved successfully!", toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
            $("#projectForm")[0].reset();
            $("#line_items tbody").empty();
            addLine();
            loadProjects();
            $("#createTab").removeClass("show active");
            $("#listTab").addClass("show active");
            $("#page_title").html("<b>Create Project</b>");
        },
        error: function (xhr) {
            console.error(xhr.responseText);
            Swal.fire("Error!", "Error saving project", "error");
        }
    });
});

// === INITIAL LOAD ===



// === EDIT ===
function editProject(id) {
    $.get(`/api/projects/${id}/`, function(data) {
        $('#page_title').html('<b>Edit Project</b>');
        $('#project_id').val(data.id);
        $('#project_name').val(data.project_name);
        $('#project_description').val(data.project_description);
        $('#line_items tbody').empty();

        // Existing lines → no delete icon
        data.lines.forEach(line => addLine(line, false));

        // Optionally, allow adding new lines (these will have delete icons)
        $('#listTab').removeClass('show active');
        $('#createTab').addClass('show active');
    });
}


// === VIEW ===
function viewProject(id) {
    $.get(`/api/projects/${id}/`, function(data) {
        $('#page_title').html('<b>View Project</b>');
        $('#project_id').val(data.id);
        $('#project_name').val(data.project_name).prop('disabled', true);
        $('#project_description').val(data.project_description).prop('disabled', true);
        $('#line_items tbody').empty();
        data.lines.forEach(line => addLine(line));
        $('#line_items input').prop('disabled', true);
        $('.delete-btn').hide();
        $('#save_btn').hide();
        $('#listTab').removeClass('show active');
        $('#createTab').addClass('show active');
    });
}

// === TOGGLE STATUS ===
function toggleProjectStatus(id, newStatus) {
    $.ajax({
        url: `/api/projects/${id}/`,
        type: 'PATCH',
        headers: { 
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(), 
            'Content-Type': 'application/json' 
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function() { 
            let project = allProjects.find(d => d.id === id);
            if (project) project.active_flag = newStatus;
            filterProjects();
        }
    });
}

// === PAGE SIZE CHANGE ===
$('#pageSize').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderProjects();
});


// === INITIAL LOAD ===
$(document).ready(function() {
    pageSize = parseInt($('#pageSize').val()) || 5;
    loadProjects();
    // addLine();
    $('#search_project_name, #active_flag').on('input change', filterProjects);
});
