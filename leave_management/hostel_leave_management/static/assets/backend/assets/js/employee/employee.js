let allEmployees = [];
let filteredEmployees = [];
let currentPage = 1;
let pageSize = 5;

function apiBase(path){ return window.location.origin + path; } // optional helper

function loadEmployees(){
    $.ajax({
        url: '/api/employees/',
        type: 'GET',
        success: function(res){
            allEmployees = res;
            filteredEmployees = [...allEmployees];
            renderEmployeeTable();
        },
        error: function(){
            $('#employee_table tbody').html('<tr><td colspan="7" class="text-center text-danger">Error loading employees.</td></tr>');
        }
    });
}

function renderEmployeeTable(){
    let total = filteredEmployees.length;
    let totalPages = Math.ceil(total / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    let start = (currentPage -1)*pageSize;
    let pageData = filteredEmployees.slice(start, start+pageSize);

    console.log(pageData);
    

    $('#employee_table tbody').empty();
    if(pageData.length===0){
        $('#employee_table tbody').append('<tr><td colspan="7" class="text-center">No records found</td></tr>');
        return;
    }

    pageData.forEach(item=>{
        let statusBadge = item.active_flag === 'Y' ? "<span class='btn btn-outline-success btn-sm'>Active</span>" : "<span class='btn btn-outline-warning btn-sm'>Inactive</span>";

        let row = `
        <tr>
          <td class="text-center">
            <div class='dropdown'>
              <button class='btn btn-outline-info btn-sm dropdown-toggle' data-toggle='dropdown'>Action</button>
              <ul class='dropdown-menu dropdown-menu-right'>
                <li><a href='javascript:void(0)' onclick='editEmployee(${item.id})'><i class='fa fa-pencil'></i> Edit</a></li>
                <li><a href='javascript:void(0)' onclick='viewEmployee(${item.id})'><i class='fa fa-eye'></i> View</a></li>
                <li>${item.active_flag === 'Y' ? `<a href='javascript:void(0)' onclick='toggleStatus(${item.id},"N")'><i class='fa fa-ban'></i> Inactivate</a>` : `<a href='javascript:void(0)' onclick='toggleStatus(${item.id},"Y")'><i class='fa fa-check'></i> Activate</a>`}</li>
              </ul>
            </div>
          </td>
          <td>${(item.first_name||'') + ' ' + (item.last_name||'')}</td>
          <td>${item.mobile_number || ''}</td>
          <td>${item.email || ''}</td>
          <td>${item.department_name || ''}</td>
          <td>${item.designation_name || ''}</td>
          <td>${statusBadge}</td>
        </tr>`;
        $('#employee_table tbody').append(row);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages){
    if (totalPages <= 1){ $('#pagination').empty(); return; }
    let html = `<nav><ul class="pagination pagination-sm justify-content-end">`;
    for(let i=1;i<=totalPages;i++){
        html += `<li class="page-item ${i===currentPage ? 'active' : ''}"><a href="#" class="page-link page-num" data-page="${i}">${i}</a></li>`;
    }
    html += `</ul></nav>`;
    $('#pagination').html(html);
}

$(document).on('click','.page-num',function(e){ e.preventDefault(); currentPage = parseInt($(this).data('page')); renderEmployeeTable(); });
$('#pageSize').on('change', function(){ pageSize = parseInt($(this).val()); renderEmployeeTable(); });

// ---------- Save functions ----------

function getCsrf(){ return $('[name=csrfmiddlewaretoken]').val(); }

function saveBasicInfo() { 
    var employment_type_id = $("#employment_type_id").val();
    var first_name         = $("#first_name").val();
    var mobile_number      = $("#mobile_number").val();
    var email              = $("#email").val();
    var date_of_birth      = $("#date_of_birth").val();
    var gender_id          = $("#gender_id").val();

    var valid = true;

    if (employment_type_id.trim() === "") {
        $(".employment_type_id").addClass('errorClass');
        valid = false;
    } else {
        $(".employment_type_id").removeClass('errorClass');
    }

    if (first_name.trim() === "") {
        $(".first_name").addClass('errorClass');
        valid = false;
    } else {
        $(".first_name").removeClass('errorClass');
    }

    if (mobile_number.trim() === "") {
        $(".mobile_number").addClass('errorClass');
        valid = false;
    } else {
        $(".mobile_number").removeClass('errorClass');
    }

    if (email.trim() === "") {
        $(".email").addClass('errorClass');
        valid = false;
    } else {
        $(".email").removeClass('errorClass');
    }

    if (date_of_birth.trim() === "") {
        $(".date_of_birth").addClass('errorClass');
        valid = false;
    } else {
        $(".date_of_birth").removeClass('errorClass');
    }

    if (gender_id.trim() === "") {
        $(".gender_id").addClass('errorClass');
        valid = false;
    } else {
        $(".gender_id").removeClass('errorClass');
    }

    if (!valid) return false;

    let employeeId = $('#employee_id').val();
    let hasFile = $('#profile_image')[0].files.length > 0;
    
    let url = '/api/employees/';
    let method = 'POST';

    if (employeeId) { 
        url += employeeId + '/'; 
        method = 'PATCH'; 
    }

    if (hasFile){
        
        let formData = new FormData();
        formData.append('first_name', $('#first_name').val());
        formData.append('middle_name', $('#middle_name').val());
        formData.append('last_name', $('#last_name').val());
        formData.append('mobile_number', $('#mobile_number').val());
        formData.append('alt_mobile_number', $('#alt_mobile_number').val());
        formData.append('email', $('#email').val());
        formData.append('alt_email', $('#alt_email').val());
        formData.append('date_of_birth', $('#date_of_birth').val());

        // ForeignKeys send *_id
        formData.append('gender', $('#gender_id').val());
        formData.append('employment_type', $('#employment_type_id').val());
        formData.append('blood_group', $('#blood_group_id').val());

        formData.append('profile_image', $('#profile_image')[0].files[0]);

        $.ajax({
            url         : url, 
            type        : method, 
            data        : formData, 
            processData : false, 
            contentType : false,
            headers     : { 'X-CSRFToken': getCsrf() },
            success: function(res){
                $('#employee_id').val(res.id);
                Swal.fire({ toast:true, position:'top', icon:'success', title:'Basic info saved', showConfirmButton:false, timer:2000 });
                controlTabs('EMPLOYEE-DETAILS');
                tabChange('EMPLOYEE-DETAILS', $('.employee_menu_bar:contains(Employee Details)'));
                loadEmployees();
            },
            error: function(){ 
                Swal.fire({ icon:'error', title:'Error saving basic info' }); 
            }
        });
    } else {

        const payload = {
            first_name          : $('#first_name').val(),
            middle_name         : $('#middle_name').val(),
            last_name           : $('#last_name').val(),
            mobile_number       : $('#mobile_number').val(),
            alt_mobile_number   : $('#alt_mobile_number').val(),
            email               : $('#email').val(),
            alt_email           : $('#alt_email').val(),
            date_of_birth       : $('#date_of_birth').val(),
            // ForeignKeys send *_id
            gender              : $('#gender_id').val(),
            employment_type     : $('#employment_type_id').val(),
            blood_group         : $('#blood_group_id').val()
        };

        $.ajax({
            url: url, 
            type: method,
            headers: { 
                'X-CSRFToken': getCsrf(), 
                'Content-Type': 'application/json' 
            },
            data: JSON.stringify(payload),
            success: function(res){
                $('#employee_id').val(res.id);
                Swal.fire({ toast:true, position:'top', icon:'success', title:'Basic info saved', showConfirmButton:false, timer:2000 });
                controlTabs('EMPLOYEE-DETAILS');
                tabChange('EMPLOYEE-DETAILS', $('.employee_menu_bar:contains(Employee Details)'));
                loadEmployees();
            },
            error: function(){
                Swal.fire({ icon:'error', title:'Error saving basic info' });
            }
        });
    }
}



function saveEmployeeDetails() {
    var employeeId = $('#employee_id').val();

    if (!employeeId) {
        Swal.fire('Info', 'Please save Basic Info first', 'info');
        return;
    }

    var location_id        = $('#location_id').val();
    var designation_id     = $('#designation_id').val();
    var department_id      = $('#department_id').val();
    var joining_date       = $('#joining_date').val();

    if (location_id.trim() === "") {
        $(".location_id").addClass('errorClass');
    } else {
        $(".location_id").removeClass('errorClass');
    }

    if (designation_id.trim() === "") {
        $(".designation_id").addClass('errorClass');
    } else {
        $(".designation_id").removeClass('errorClass');
    }

    if (department_id.trim() === "") {
        $(".department_id").addClass('errorClass');
    } else {
        $(".department_id").removeClass('errorClass');
    }

    if (joining_date.trim() === "") {
        $(".joining_date").addClass('errorClass');
    } else {
        $(".joining_date").removeClass('errorClass');
    }

    if (location_id.trim() === "" || designation_id.trim() === "" || department_id.trim() === "" || joining_date.trim() === "") {
        return false;
    }

    const payload = {
        location            : location_id, 
        designation         : designation_id, 
        department          : department_id,
        date_of_joining     : joining_date, 
        date_of_releaving   : $('#releaving_date').val(),
        previous_experience : $('#experience').val(), 
        rate_per_hour       : $('#rate_per_hour').val(),
        rate_per_day        : $('#rate_per_day').val(), 
        pay_frequency       : $('#pay_frequency_id').val()
    };

    $.ajax({
        url: '/api/employees/' + employeeId + '/', 
        type: 'PATCH',
        headers: { 'X-CSRFToken': getCsrf(), 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
        success: function() {
            Swal.fire({ 
                toast:true, 
                position:'top', 
                icon:'success', 
                title:'Employee details saved', 
                showConfirmButton:false, 
                timer:2000 
            });
            controlTabs('IDENTITY');
            tabChange('IDENTITY', $('.employee_menu_bar:contains(Identity)'));
            loadEmployees();
        },
        error: function() { 
            Swal.fire({ icon:'error', title:'Error saving details' }); 
        }
    });
}


function saveIdentityInfo() {
    var employeeId = $('#employee_id').val();

    if (!employeeId) {
        Swal.fire('Info', 'Please save Basic Info first', 'info');
        return;
    }

    var aadhar_no   = $('#aadhar_no').val();
    var pan_no      = $('#pan_no').val();
    var pf_no       = $('#pf_no').val();

    if (aadhar_no.trim() === "") {
        $(".aadhar_no").addClass('errorClass');
    } else {
        $(".aadhar_no").removeClass('errorClass');
    }

    if (pan_no.trim() === "") {
        $(".pan_no").addClass('errorClass');
    } else {
        $(".pan_no").removeClass('errorClass');
    }

    if (pf_no.trim() === "") {
        $(".pf_no").addClass('errorClass');
    } else {
        $(".pf_no").removeClass('errorClass');
    }

    if (aadhar_no.trim() === "" || pan_no.trim() === "" || pf_no.trim() === "") {
        return false;
    }

    const payload = {
        aadhar_no               : aadhar_no,
        pan_number              : pan_no,
        driving_licence         : $('#driving_licence').val(),
        passport_no             : $('#passport_no').val(),
        passport_issue_date     : $('#passport_issue_date').val(),
        passport_expiry_date    : $('#passport_expiry_date').val(),
        pf_no                   : pf_no,
        esi_no                  : $('#esi_no').val(),
        uan_no                  : $('#uan_no').val()
    };

    $.ajax({
        url: '/api/employees/' + employeeId + '/',
        type: 'PATCH',
        headers: { 'X-CSRFToken': getCsrf(), 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
        success: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Identity saved',
                showConfirmButton: false,
                timer: 2000
            });
            controlTabs('ADDRESS-INFO');
            tabChange('ADDRESS-INFO', $('.employee_menu_bar:contains(Address Info)'));
            loadEmployees();
        },
        error: function() {
            Swal.fire({ icon: 'error', title: 'Error saving identity' });
        }
    });
}


function saveAddressInfo() {
    var employeeId = $('#employee_id').val();

    if (!employeeId) {
        Swal.fire('Info', 'Please save Basic Info first', 'info');
        return;
    }

    var current_address1     = $('#current_address1').val();
    var current_country_id   = $('#current_country_id').val();
    var current_state_id     = $('#current_state_id').val();
    var current_city_id      = $('#current_city_id').val();
    var current_postal_code  = $('#current_postal_code').val();

    if (current_address1.trim() === "") {
        $(".current_address1").addClass('errorClass');
    } else {
        $(".current_address1").removeClass('errorClass');
    }

    if (current_country_id.trim() === "") {
        $(".current_country_id").addClass('errorClass');
    } else {
        $(".current_country_id").removeClass('errorClass');
    }

    if (current_state_id.trim() === "") {
        $(".current_state_id").addClass('errorClass');
    } else {
        $(".current_state_id").removeClass('errorClass');
    }

    if (current_city_id.trim() === "") {
        $(".current_city_id").addClass('errorClass');
    } else {
        $(".current_city_id").removeClass('errorClass');
    }

    if (current_postal_code.trim() === "") {
        $(".current_postal_code").addClass('errorClass');
    } else {
        $(".current_postal_code").removeClass('errorClass');
    }

    if (
        current_address1.trim() === "" ||
        current_country_id.trim() === "" ||
        current_state_id.trim() === "" ||
        current_city_id.trim() === "" ||
        current_postal_code.trim() === ""
    ) {
        return false;
    }

    const payload = {
        current_address1        : current_address1,
        current_address2        : $('#current_address2').val(),
        current_address3        : $('#current_address3').val(),
        current_country         : current_country_id,
        current_state           : current_state_id,
        current_city            : current_city_id,
        current_postal_code     : current_postal_code,
        permanent_address1      : $('#perm_address1').val(),
        permanent_address2      : $('#perm_address2').val(),
        permanent_address3      : $('#perm_address3').val(),
        permanent_country       : $('#perm_country_id').val(),
        permanent_state         : $('#perm_state_id').val(),
        permanent_city          : $('#perm_city_id').val(),
        permanent_postal_code   : $('#perm_postal_code').val()
    };

    $.ajax({
        url: '/api/employees/' + employeeId + '/',
        type: 'PATCH',
        headers: { 'X-CSRFToken': getCsrf(), 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
        success: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Address saved',
                showConfirmButton: false,
                timer: 2000
            });
            controlTabs('BANK-DETAILS');
            tabChange('BANK-DETAILS', $('.employee_menu_bar:contains(Bank Details)'));
            loadEmployees();
        },
        error: function() {
            Swal.fire({ icon: 'error', title: 'Error saving address' });
        }
    });
}

function saveBankInfo() {
    var employeeId = $('#employee_id').val();

    if (!employeeId) {
        Swal.fire('Info', 'Please save Basic Info first', 'info');
        return;
    }

    var account_no      = $('#account_no').val();
    var account_holder  = $('#account_holder').val();
    var bank_name       = $('#bank_name').val();
    var ifsc_code       = $('#ifsc_code').val();

    if (account_no.trim() === "") {
        $(".account_no").addClass('errorClass');
    } else {
        $(".account_no").removeClass('errorClass');
    }

    if (account_holder.trim() === "") {
        $(".account_holder").addClass('errorClass');
    } else {
        $(".account_holder").removeClass('errorClass');
    }

    if (bank_name.trim() === "") {
        $(".bank_name").addClass('errorClass');
    } else {
        $(".bank_name").removeClass('errorClass');
    }

    if (ifsc_code.trim() === "") {
        $(".ifsc_code").addClass('errorClass');
    } else {
        $(".ifsc_code").removeClass('errorClass');
    }

    if (
        account_no.trim() === "" ||
        account_holder.trim() === "" ||
        bank_name.trim() === "" ||
        ifsc_code.trim() === ""
    ) {
        return false;
    }

    const payload = {
        account_number      : account_no,
        account_holder_name : account_holder,
        bank_name           : bank_name,
        bank_branch         : $('#bank_branch').val(),
        ifsc_code           : ifsc_code,
        micr_code           : $('#micr_code').val(),
        bank_address        : $('#bank_address').val()
    };

    $.ajax({
        url: '/api/employees/' + employeeId + '/',
        type: 'PATCH',
        headers: { 'X-CSRFToken': getCsrf(), 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
        success: function() {
            Swal.fire({
                toast: true,
                position: 'top',
                icon: 'success',
                title: 'Bank details saved',
                showConfirmButton: false,
                timer: 2000
            });
            controlTabs('BANK-DETAILS'); // keep all tabs open
            loadEmployees();
        },
        error: function() {
            Swal.fire({ icon: 'error', title: 'Error saving bank details' });
        }
    });
}


// ---------- Edit / View / Toggle ----------

function editEmployee(id){
    $.ajax({ url: '/api/employees/' + id + '/', type: 'GET',
        success: function(data){
            $('.btn-create-employee').hide(); 
            controlTabs('BANK-DETAILS');
            $('#employee_id').val(data.id);
            // basic
            $('#first_name').val(data.first_name); 
            $('#middle_name').val(data.middle_name); 
            $('#last_name').val(data.last_name);
            $('#mobile_number').val(data.mobile_number); 
            $('#email').val(data.email); 
            $('#date_of_birth').val(data.date_of_birth);
            $('#alt_mobile_number').val(data.alt_mobile_number); 
            $('#alt_email').val(data.alt_email);
            $("#gender_id").val(data.gender);
            $("#employment_type_id").val(data.employment_type);
            $("#blood_group_id").val(data.blood_group);
            // details
            $('#location_id').val(data.location); 
            $('#designation_id').val(data.designation); 
            $('#department_id').val(data.department);
            $('#joining_date').val(data.date_of_joining); 
            $('#releaving_date').val(data.date_of_releaving);
            $('#experience').val(data.previous_experience); 
            $('#rate_per_hour').val(data.rate_per_hour); 
            $('#rate_per_day').val(data.rate_per_day); 
            $('#pay_frequency_id').val(data.pay_frequency);
            // identity
            $('#aadhar_no').val(data.aadhar_no); 
            $('#pan_no').val(data.pan_number); 
            $('#driving_licence').val(data.driving_licence);
            $('#passport_no').val(data.passport_no); 
            $('#passport_issue_date').val(data.passport_issue_date); 
            $('#passport_expiry_date').val(data.passport_expiry_date);
            $('#pf_no').val(data.pf_no); 
            $('#esi_no').val(data.esi_no); 
            $('#uan_no').val(data.uan_no);
            // address current
            $('#current_address1').val(data.current_address1); 
            $('#current_address2').val(data.current_address2); 
            $('#current_address3').val(data.current_address3);
            $('#current_country_id').val(data.current_country); 
            loadStates(data.current_country, $('#current_state_id'), $('#current_city_id'), data.current_state, data.current_city, 'Edit');
            $('#current_postal_code').val(data.current_postal_code);
            // address perm
            $('#perm_address1').val(data.permanent_address1); 
            $('#perm_address2').val(data.permanent_address2); 
            $('#perm_address3').val(data.permanent_address3);
            $('#perm_country_id').val(data.permanent_country); 
            loadStates(data.permanent_country, $('#perm_state_id'), $('#perm_city_id'), data.permanent_state, data.permanent_city, 'Edit');
            $('#perm_postal_code').val(data.permanent_postal_code);
            // bank
            $('#account_no').val(data.account_number); 
            $('#account_holder').val(data.account_holder_name); 
            $('#bank_name').val(data.bank_name);
            $('#bank_branch').val(data.bank_branch); 
            $('#ifsc_code').val(data.ifsc_code); 
            $('#micr_code').val(data.micr_code); 
            $('#bank_address').val(data.bank_address);

            tabChange('BASIC-INFO', $('.employee_menu_bar:contains(Basic Info)'));

            $(".errorClass").removeClass('errorClass');
        },
        error: function(){ Swal.fire({ icon:'error', title:'Error fetching employee' }); }
    });
}

function viewEmployee(id){
    editEmployee(id);
    // after population, disable form fields
    setTimeout(function(){
        $('input, select, textarea').prop('disabled', true);
        $('#tab-basic .btn, #tab-details .btn, #tab-identity .btn, #tab-address .btn, #tab-bank .btn').hide();
    }, 300);
}

function toggleStatus(id, newStatus){
    $.ajax({
        url: '/api/employees/' + id + '/',
        type: 'PATCH',
        headers: { 'X-CSRFToken': getCsrf(), 'Content-Type': 'application/json' },
        data: JSON.stringify({ active_flag: newStatus }),
        success: function(){ let emp = allEmployees.find(e=>e.id===id); if(emp) emp.active_flag = newStatus; renderEmployeeTable(); },
        error: function(){ Swal.fire({ icon:'error', title:'Error updating status' }); }
    });
}

// ---------- cascading helper ----------
function loadStates(countryId, stateDropdown, cityDropdown, selectedState=null, selectedCity=null, mode=null) {
    stateDropdown.html('<option value="">Loading...</option>');
    if (!countryId) { 
        stateDropdown.html('<option value="">- Select -</option>'); 
        return; 
    }

    $.ajax({
        url: '/get_states_by_country',
        type: 'GET',
        data: { country_id: countryId },
        success: function(response) {
            stateDropdown.empty().append('<option value="">- Select -</option>');
            if (response.states && response.states.length) {
                response.states.forEach(s => 
                    stateDropdown.append(`<option value="${s.id}">${s.state_name}</option>`)
                );
            }

            if (selectedState) {
                stateDropdown.val(selectedState);
                loadCityList(selectedState, cityDropdown, selectedCity);
            }
        },
        error: function() { 
            stateDropdown.html('<option value="">Error loading states</option>'); 
        }
    });
}


function loadCityList(stateId, cityDropdown, selectedCity=null){
    cityDropdown.html('<option value="">Loading...</option>');
    if(!stateId){ cityDropdown.html('<option value="">- Select -</option>'); return; }
    $.ajax({
        url: '/get_cities_by_state',
        type: 'GET',
        data: { state_id: stateId },
        success: function(response){
            cityDropdown.empty().append('<option value="">- Select -</option>');
            if(response.cities && response.cities.length){
                response.cities.forEach(c => cityDropdown.append(`<option value="${c.id}">${c.city_name}</option>`));
            }
            if(selectedCity) cityDropdown.val(selectedCity);
        },
        error: function(){ cityDropdown.html('<option value="">Error loading cities</option>'); }
    });
}

$(document).ready(function(){
    pageSize = parseInt($('#pageSize').val()) || 5;
    loadEmployees();

    // cascading handlers
    $('#current_country_id').on('change', function(){ loadStates($(this).val(), $('#current_state_id')); $('#current_city_id').html('<option value="">- Select -</option>'); });
    $('#current_state_id').on('change', function(){ loadCityList($(this).val(), $('#current_city_id')); });

    $('#perm_country_id').on('change', function(){ loadStates($(this).val(), $('#perm_state_id')); $('#perm_city_id').html('<option value="">- Select -</option>'); });
    $('#perm_state_id').on('change', function(){ loadCityList($(this).val(), $('#perm_city_id')); });

    // copy current to permanent
    $('#copy_current_address').on('change', function(){
        if($(this).is(':checked')){
            $('#perm_address1').val($('#current_address1').val());
            $('#perm_address2').val($('#current_address2').val());
            $('#perm_address3').val($('#current_address3').val());
            $('#perm_country_id').val($('#current_country_id').val()).change();
            setTimeout(function(){
                $('#perm_state_id').val($('#current_state_id').val()).change();
                setTimeout(function(){ $('#perm_city_id').val($('#current_city_id').val()); }, 300);
            }, 300);
            $('#perm_postal_code').val($('#current_postal_code').val());
        } else {
            $('#perm_address1,#perm_address2,#perm_address3,#perm_postal_code').val('');
            $('#perm_country_id,#perm_state_id,#perm_city_id').val('');
        }
    });
});

function tabChange(val, el) {
    if ($(el).hasClass('disabled')) return false;

    // remove active from all nav links
    $('.employee_menu_bar').removeClass('active');

    // if 'el' is a nav-link, make it active
    if ($(el).hasClass('employee_menu_bar')) {
        $(el).addClass('active');
    } else {
        // if not (like Create Employee button), activate the proper tab link manually
        $(`.employee_menu_bar[onclick*="${val}"]`).addClass('active');
    }

    // hide all tab contents
    $('.tab-pane').removeClass('show active');

    // show selected tab
    switch(val) {
        case 'EMPLOYEES':
            $('#tab-list').addClass('show active');
            $('.btn-create-employee').show();  // show button only here
            break;

        case 'BASIC-INFO':
            $('#tab-basic').addClass('show active');
            $('.btn-create-employee').hide();
            break;

        case 'EMPLOYEE-DETAILS':
            $('#tab-details').addClass('show active');
            $('.btn-create-employee').hide();
            break;

        case 'IDENTITY':
            $('#tab-identity').addClass('show active');
            $('.btn-create-employee').hide();
            break;

        case 'ADDRESS-INFO':
            $('#tab-address').addClass('show active');
            $('.btn-create-employee').hide();
            break;

        case 'BANK-DETAILS':
            $('#tab-bank').addClass('show active');
            $('.btn-create-employee').hide();
            break;
    }
}



// dynamic tab access control
function controlTabs(currentTab) {
    $('.employee_menu_bar').addClass('disabled');
    $('.employee_menu_bar:contains(Employees)').removeClass('disabled');

    switch (currentTab) {
        case 'BASIC-INFO':
            $('.employee_menu_bar:contains(Basic Info)').removeClass('disabled');
            break;
        case 'EMPLOYEE-DETAILS':
            $('.employee_menu_bar:contains(Basic Info), .employee_menu_bar:contains(Employee Details)').removeClass('disabled');
            break;
        case 'IDENTITY':
            $('.employee_menu_bar:contains(Basic Info), .employee_menu_bar:contains(Employee Details), .employee_menu_bar:contains(Identity)').removeClass('disabled');
            break;
        case 'ADDRESS-INFO':
            $('.employee_menu_bar:contains(Basic Info), .employee_menu_bar:contains(Employee Details), .employee_menu_bar:contains(Identity), .employee_menu_bar:contains(Address Info)').removeClass('disabled');
            break;
        case 'BANK-DETAILS':
            $('.employee_menu_bar').removeClass('disabled'); // all enabled
            break;
        default:
            $('.employee_menu_bar:contains(Basic Info)').removeClass('disabled');
    }
}

$(document).ready(function(){
    controlTabs('BASIC-INFO'); // enable only Employees & Basic Info on load
});