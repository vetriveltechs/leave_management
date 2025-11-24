// === DESIGNATION.JS ===

let allDesignations = [];
let filteredDesignations = [];
let currentPage = 1;
let pageSize = 5;

// === LOAD DESIGNATIONS ===
function loadDesignations() {
    $.ajax({
        url: '/api/designations/',
        type: 'GET',
        success: function(response) {
            allDesignations = response;
            filteredDesignations = [...allDesignations];
            filterDesignations();
        },
        error: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Error loading designations!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

// === FILTER DESIGNATIONS ===
function filterDesignations() {
    const searchName = $('#search_designation_name').val().toLowerCase();
    const searchStatus = $('#active_flag').val();

    filteredDesignations = allDesignations.filter(function(item) {
        let matchesName = item.designation_name.toLowerCase().includes(searchName);
        let matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchesName && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

// === RENDER TABLE ===
function renderTable() {
    let total = filteredDesignations.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize;
    let pageData = filteredDesignations.slice(start, end);

    const tbody = $('#line_items tbody');
    tbody.empty();

    if (pageData.length > 0) {
        pageData.forEach(function(item) {
            const statusBadge = item.active_flag === 'Y'
                ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
                : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>";

            const actionMenu = `
                <div class="dropdown">
                    <button type="button" class="btn btn-outline-info btn-sm dropdown-toggle" data-toggle="dropdown">
                        Action <i class="fa fa-chevron-down ml-1"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right dropdown-menu-new">
                        <li><a href="javascript:void(0);" onclick="editDesignation(${item.designation_id})"><i class="fa fa-pencil"></i> Edit</a></li>
                        <li><a href="javascript:void(0);" onclick="viewDesignation(${item.designation_id})"><i class="fa fa-eye"></i> View</a></li>
                        <li>${
                            item.active_flag === 'Y'
                                ? `<a href="javascript:void(0);" onclick="toggleStatus(${item.designation_id}, 'N')"><i class="fa fa-ban"></i> Inactive</a>`
                                : `<a href="javascript:void(0);" onclick="toggleStatus(${item.designation_id}, 'Y')"><i class="fa fa-check"></i> Active</a>`
                        }</li>
                    </ul>
                </div>
            `;

            const newRow = `
                <tr class="remove_tr tabRow">
                    <td>${actionMenu}</td>
                    <td>${item.designation_name}</td>
                    <td>${item.description || ''}</td>
                    <td class="text-center">${statusBadge}</td>
                </tr>
            `;

            tbody.append(newRow);
        });

        $('#exportButtons').show();
    } else {
        tbody.append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
        $('#exportButtons').hide();
    }

    if (total > 0) {
        renderPagination(totalPages, currentPage, function(page) {
            currentPage = page;
            renderTable();
        });
    } else {
        $('#pagination').empty();
    }
}

// === EXPORT DATA FOR DESIGNATIONS ===
function getExportData() {
    return filteredDesignations.map((item, index) => ({
        "S.No": index + 1,
        "Designation Name": item.designation_name || "",
        "Description": item.description || "",
        "Status": item.active_flag === 'Y' ? 'Active' : 'Inactive',
        "Created Date": formatDate(item.created_date)
    }));
}

function exportRecords(file_type, title) { exportData(file_type, title, getExportData()); }
function printDesignations(title) { printData(title, getExportData()); }

// === PAGE SIZE CHANGE ===
$('#pageSize').on('change', function() {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    renderTable();
});

// === SEARCH EVENTS ===
$('#search_designation_name, #active_flag').on('input change', function() {
    filterDesignations();
});

// === CLEAR FILTERS ===
function clearFilters() {
    $('#search_designation_name').val('');
    $('#active_flag').val('ALL');
    filterDesignations();
}

// === SUBMIT FORM ===
$('#designationForm').on('submit', function(e) {
    e.preventDefault();
    let id = $('#designation_id').val();
    let url = '/api/designations/';
    let type = 'POST';
    let successMessage = 'Designation saved successfully.';

    if (id) {
        url += id + '/';
        type = 'PUT';
        successMessage = 'Designation updated successfully.';
    }

    $('#save_btn').prop('disabled', true);

    $.ajax({
        url: url,
        type: type,
        headers: { 
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            designation_name: $('#designation_name').val(),
            description: $('#description').val()
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

            $('#designationForm')[0].reset();
            $('#designation_id').val('');
            $('#designation_name, #description').prop('disabled', false);
            $('#save_btn').prop('disabled', false).show();
            $('#page_title').html('<b>Create Designation</b>');

            loadDesignations();
        },
        error: function(xhr) {
            $('#save_btn').prop('disabled', false);
            let errorMsg = 'Error saving designation!';
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

// === IMPORT FORM ===
$('#designationImportForm').on('submit', function(e) {
    e.preventDefault();
    let formData = new FormData(this);

    $.ajax({
        url: '/api/designations/import/',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: { 'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val() },
        success: function(response) {
            let msg = `${response.imported} records processed. ${response.created.length} created, ${response.updated.length} updated.`;

            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: msg,
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true
            });

            if (response.errors && response.errors.length) {
                console.warn("Import errors:", response.errors);
                Swal.fire({
                    icon: 'warning',
                    title: 'Some rows failed to import',
                    text: 'Check console for details',
                    timer: 4000,
                    showConfirmButton: false
                });
            }

            loadDesignations();
        },
        error: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Error importing designations!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    });
});

// === EDIT ===
function editDesignation(id) {
    $('.designation_name').removeClass('errorClass');
    $.ajax({
        url: '/api/designations/' + id + '/',
        type: 'GET',
        success: function(data) {
            $('#page_title').html('<b>Edit Designation</b>');
            $('#designation_id').val(data.designation_id);
            $('#designation_name').val(data.designation_name).prop('disabled', false);
            $('#description').val(data.description).prop('disabled', false);
            $('#save_btn').show();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching designation!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

// === VIEW ===
function viewDesignation(id) {
    $('.designation_name').removeClass('errorClass');
    $.ajax({
        url: '/api/designations/' + id + '/',
        type: 'GET',
        success: function(data) {
            $('#page_title').html('<b>View Designation</b>');
            $('#designation_id').val(data.designation_id);
            $('#designation_name').val(data.designation_name).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error fetching designation!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

// === TOGGLE STATUS ===
function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/designations/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function() {
            let designation = allDesignations.find(d => d.designation_id === id);
            if (designation) designation.active_flag = newStatus;

            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Status updated successfully!',
                showConfirmButton: false,
                timer: 2000
            });

            filterDesignations();
        },
        error: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'error',
                title: 'Error updating status!',
                showConfirmButton: false,
                timer: 3000
            });
        }
    });
}

// === INITIAL LOAD ===
$(document).ready(function() {
    pageSize = parseInt($('#pageSize').val());
    loadDesignations();
});
