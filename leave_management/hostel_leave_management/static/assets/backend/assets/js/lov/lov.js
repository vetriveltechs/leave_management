// === DESIGNATION.JS ===

let allLovs = [];
let filteredLovs = [];
let currentPage = 1;
let pageSize = 5;

// === LOAD DESIGNATIONS ===
function loadLovs() {
    $.ajax({
        url: '/api/lov/',
        type: 'GET',
        success: function(response) {
            allLovs = response;
            filteredLovs = [...allLovs];
            filterLovs();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error loading LOV data.</p>');
        }
    });
}

// === FILTER DESIGNATIONS ===
function filterLovs() {
    const searchName = $('#search_list_name').val().toLowerCase();
    const searchStatus = $('#active_flag').val();

    filteredLovs = allLovs.filter(function(item) {
        const matchesName = item.list_name.toLowerCase().includes(searchName);
        const matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
        return matchesName && matchesStatus;
    });

    currentPage = 1;
    renderTable();
}

// === RENDER TABLE ===
function renderTable() {
    const total = filteredLovs.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredLovs.slice(start, end);

    const tbody = $('#line_items tbody');
    tbody.empty();

    if (pageData.length > 0) {
        pageData.forEach(function(item) {
            const newRow = $('<tr class="remove_tr tabRow">');
            let cols = `
                <td class="text-center">
                    <div class="dropdown">
                        <button type="button" class="btn btn-outline-info btn-sm dropdown-toggle" data-toggle="dropdown">
                            Action <i class="fa fa-chevron-down"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right dropdown-menu-new">
                            <li><a href="javascript:void(0);" onclick="editLov(${item.list_type_id})"><i class="fa fa-pencil"></i> Edit</a></li>
                            <li><a href="javascript:void(0);" onclick="viewLov(${item.list_type_id})"><i class="fa fa-eye"></i> View</a></li>
                            <li>
                                ${item.active_flag === 'Y'
                                    ? `<a href="javascript:void(0);" onclick="toggleStatus(${item.list_type_id}, 'N')"><i class="fa fa-ban"></i> Inactive</a>`
                                    : `<a href="javascript:void(0);" onclick="toggleStatus(${item.list_type_id}, 'Y')"><i class="fa fa-check"></i> Active</a>`}
                            </li>
                        </ul>
                    </div>
                </td>
                <td>${item.list_name}</td>
                <td>
                    <a href="/lov/list-type-values-list/${item.list_type_id}/" title="${item.values_count > 0 ? 'Edit List Type Values' : 'Add List Type Values'}">
                        <span class="btn ${item.values_count > 0 ? 'btn-outline-success' : 'btn-outline-warning'}" style="width:60%;">
                            ${item.values_count > 0 ? 'Edit List Type Values' : 'Add List Type Values'} (${item.values_count})
                        </span>
                    </a>
                </td>
                <td class="text-center">
                    ${item.active_flag === 'Y'
                        ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
                        : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>"}
                </td>`;

            newRow.append(cols);
            tbody.append(newRow);
        });
        $('#exportButtons').show();
    } else {
        tbody.append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
        $('#exportButtons').hide();
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
$('#search_list_name, #active_flag').on('input change', function() {
    filterLovs();
});

// === SAVE LOV FORM ===
$('#lovForm').on('submit', function(e) {
    e.preventDefault();

    const id = $('#list_type_id').val();
    let url = '/api/lov/';
    let type = 'POST';
    let successMessage = 'LOV saved successfully.';

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
            list_name: $('#list_name').val(),
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

            $('#lovForm')[0].reset();
            $('#list_type_id').val('');
            $('#page_title').html('<b>Create LOV</b>');
            $('#list_name, #description').prop('disabled', false);
            $('#save_btn').show();

            loadLovs();
        },
        error: function(xhr) {
            let errorMsg = 'Error saving LOV!';
            if (xhr.responseJSON && xhr.responseJSON.list_name) {
                errorMsg = xhr.responseJSON.list_name[0];
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

// === INITIAL LOAD ===


// === EDIT LOV ===
function editLov(id) {
    $('.list_name').removeClass('errorClass');
    $.ajax({
        url: '/api/lov/' + id + '/',
        type: 'GET',
        success: function(data) {
            $('#page_title').html('<b>Edit LOV</b>');
            $('#list_type_id').val(data.list_type_id);
            $('#list_name').val(data.list_name).prop('disabled', false);
            $('#description').val(data.description).prop('disabled', false);
            $('#save_btn').show();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error fetching LOV data.</p>');
        }
    });
}

// === VIEW LOV ===
function viewLov(id) {
    $('.list_name').removeClass('errorClass');
    $.ajax({
        url: '/api/lov/' + id + '/',
        type: 'GET',
        success: function(data) {
            $('#page_title').html('<b>View LOV</b>');
            $('#list_type_id').val(data.list_type_id);
            $('#list_name').val(data.list_name).prop('disabled', true);
            $('#description').val(data.description).prop('disabled', true);
            $('#save_btn').hide();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error fetching LOV data.</p>');
        }
    });
}

// === TOGGLE STATUS ===
function toggleStatus(id, newStatus) {
    $.ajax({
        url: '/api/lov/' + id + '/',
        type: 'PATCH',
        headers: {
            'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function() {
            const lov = allLovs.find(d => d.list_type_id === id);
            if (lov) lov.active_flag = newStatus;
            filterLovs();
        },
        error: function() {
            $('#response').html('<p style="color:red;">Error updating status.</p>');
        }
    });
}


function saveBtn(val) {
    var list_name = $("#list_name").val();

    if (list_name.trim() !== "") {
        $(".list_name").removeClass('errorClass');
        return true;
    } else {
        if (list_name.trim() === "") {
            $(".list_name").addClass('errorClass');
        } 
        else {
            $(".list_name").removeClass('errorClass');
        }

        return false;
    }
}


$(document).ready(function() {
    pageSize = parseInt($('#pageSize').val()) || 5;
    loadLovs();
});

















// // === DESIGNATION.JS ===

// let allLovs = [];
// let filteredLovs = [];
// let currentPage = 1;
// let pageSize = 5;

// // === LOAD DESIGNATIONS ===
// function loadLovs() {
//     $.ajax({
//         url: '/api/lov/',
//         type: 'GET',
//         success: function(response) {
            
//             allLovs = response;
//             filteredLovs = [...allLovs];
//             // renderTable();
//             filterLovs();
//         },
//         error: function() {
//             $('#response').html('<p style="color:red;">Error loading lov.</p>');
//         }
//     });
// }

// // === FILTER DESIGNATIONS ===
// function filterLovs() {
//     const searchName   = $('#search_list_name').val().toLowerCase();
//     const searchStatus = $('#active_flag').val();

//     filteredLovs = allLovs.filter(function(item){
//         let matchesName = item.list_name.toLowerCase().includes(searchName);
//         let matchesStatus = searchStatus === "ALL" || item.active_flag === searchStatus;
//         return matchesName && matchesStatus;
//     });

//     currentPage = 1;
//     renderTable();
// }

// // === RENDER TABLE ===
// function renderTable() {
//     let total = filteredLovs.length;
//     let totalPages = Math.ceil(total / pageSize) || 1;
//     if(currentPage > totalPages) currentPage = totalPages;

//     let start = (currentPage - 1) * pageSize;
//     let end = start + pageSize;
//     let pageData = filteredLovs.slice(start, end);

//     $('#line_items tbody').empty();

//     if(pageData.length > 0){
//         pageData.forEach(function(item, index){
//             let newRow = $('<tr class="remove_tr tabRow">');
//             let cols = "<td>"
//                 + "<div class='dropdown'>"
//                 + "<button type='button' class='btn btn-outline-info dropdown-toggle btn-sm' data-toggle='dropdown'>"
//                 + "Action<i class='fa fa-chevron-down'></i>"
//                 + "</button>"
//                 + "<ul class='dropdown-menu dropdown-menu-right dropdown-menu-new'>"
//                 + "<li><a href='javascript:void(0);' onclick='editLov(" + item.list_type_id + ")'><i class='fa fa-pencil'></i> Edit</a></li>"
//                 + "<li><a href='javascript:void(0);' onclick='viewLov(" + item.list_type_id + ")'><i class='fa fa-eye'></i> View</a></li>"
//                 + "<li>" + (item.active_flag === 'Y'
//                     ? "<a href='javascript:void(0);' onclick='toggleStatus(" + item.list_type_id + ", \"N\")'><i class='fa fa-ban'></i> Inactive</a>"
//                     : "<a href='javascript:void(0);' onclick='toggleStatus(" + item.list_type_id + ", \"Y\")'><i class='fa fa-check'></i> Active</a>") + "</li>"
//                 + "</ul>"
//                 + "</div>"
//                 + "</td>";

//             cols += "<td>" + item.list_name + "</td>";

//             cols += "<td>";
//             let btnClass = item.values_count > 0 ? "btn-outline-success" : "btn-outline-warning";
//             let btnLabel = item.values_count > 0 ? "Edit List Type Values" : "Add List Type Values";

//             cols += "<a href='/lov/list-type-values-list/" + item.list_type_id + "/' title='" + btnLabel + "'>";
//             cols += "<span class='btn " + btnClass + "' style='width:60%;'>" + btnLabel + " (" + item.values_count + ")</span>";
//             cols += "</a>";
//             cols += "</td>";

//             cols += "<td class='text-center'>" + (item.active_flag === 'Y'
//                 ? "<span class='btn btn-outline-success btn-sm'>Active</span>"
//                 : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>") + "</td>";

//             newRow.append(cols);
//             $('#line_items tbody').append(newRow);

//             $('#exportButtons').show();
//         });
//     } else {
//         $('#line_items tbody').append('<tr><td colspan="4" class="text-center">No records found</td></tr>');
//         $('#exportButtons').hide();
//     }

//     renderPagination(totalPages, currentPage, function(page){
//         currentPage = page;
//         renderTable();
//     });
// }


// // === PAGE SIZE CHANGE ===
// $('#pageSize').on('change', function(){
//     pageSize = parseInt($(this).val());
//     currentPage = 1;
//     renderTable();
// });

// // === SEARCH EVENTS ===
// $('#search_list_name, #active_flag').on('input change', function(){
//     filterLovs();
// });

// $('#lovForm').on('submit', function(e){
//     e.preventDefault();
//     let id = $('#list_type_id').val();
//     let url = '/api/lov/';
//     let type = 'POST';
//     let successMessage = 'Lov saved successfully.'; // default

//     if(id){
//         url += id + '/';
//         type = 'PUT';
//         successMessage = 'Lov updated successfully.';
//     }

//     $.ajax({
//         url: url,
//         type: type,
//         headers: { 
//             'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
//             'Content-Type': 'application/json' 
//         },
//         data: JSON.stringify({
//             list_name: $('#list_name').val(),
//             description: $('#description').val()
//         }),
//         success: function() {
//             Swal.fire({
//                 toast: true,
//                 position: 'top',
//                 icon: 'success',
//                 title: successMessage,
//                 showConfirmButton: false,
//                 timer: 3000,
//                 timerProgressBar: true
//             });

//             // Reset form
//             $('#lovForm')[0].reset();
//             $('#list_type_id').val('');
//             $('#lov_name, #description').prop('disabled', false);
//             $('#save_btn').show();

//             // Reload table
//             loadLovs();
//         },
//         error: function(xhr) {
//             let errorMsg = 'Error saving lov!';
//             if (xhr.responseJSON && xhr.responseJSON.list_name) {
//                 errorMsg = xhr.responseJSON.list_name[0]; // from serializer
//             }

//             Swal.fire({
//                 toast: true,
//                 position: 'top',
//                 icon: 'error',
//                 title: errorMsg,
//                 showConfirmButton: false,
//                 timer: 3000,
//                 timerProgressBar: true
//             });
//         }
//     });
// });




// // === INITIAL LOAD ===
// $(document).ready(function(){
//     pageSize = parseInt($('#pageSize').val());
//     loadLovs();
// });


// // === EDIT ===
//     function editLov(id){
//         $.ajax({
//             url: '/api/lov/' + id + '/',
//             type: 'GET',
//             success: function(data){
//                 $('#page_title').html('<b>Edit Lov</b>');
//                 $('#list_type_id').val(data.list_type_id);
//                 $('#list_name').val(data.list_name).prop('disabled', false);
//                 $('#description').val(data.description).prop('disabled', false);
//                 $('#save_btn').show();
//             },
//             error: function(){
//                 $('#response').html('<p style="color:red;">Error fetching designation.</p>');
//             }
//         });
//     }

//     // === VIEW ===
//     function viewLov(id){
//         $.ajax({
//             url: '/api/lov/' + id + '/',
//             type: 'GET',
//             success: function(data){
//                 $('#page_title').html('<b>View Designation</b>');
//                 $('#list_type_id').val(data.list_type_id);
//                 $('#list_name').val(data.list_name).prop('disabled', true);
//                 $('#description').val(data.description).prop('disabled', true);
//                 $('#save_btn').hide();
//             },
//             error: function(){
//                 $('#response').html('<p style="color:red;">Error fetching designation.</p>');
//             }
//         });
//     }

//     // === TOGGLE STATUS ===
//     function toggleStatus(id, newStatus) {
//         $.ajax({
//             url: '/api/lov/' + id + '/',
//             type: 'PATCH',
//             headers: {
//                 'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
//                 'Content-Type': 'application/json'
//             },
//             data: JSON.stringify({ active_flag: newStatus }),
//             success: function(data) {
//                 let lov = allLovs.find(d => d.list_type_id === id);
//                 if(lov) lov.active_flag = newStatus;
//                 filterLovs();
//             },
//             error: function() {
//                 $('#response').html('<p style="color:red;">Error updating status.</p>');
//             }
//         });
//     }